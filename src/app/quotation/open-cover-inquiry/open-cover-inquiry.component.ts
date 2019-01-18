import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-open-cover-inquiry',
  templateUrl: './open-cover-inquiry.component.html',
  styleUrls: ['./open-cover-inquiry.component.css']
})
export class OpenCoverInquiryComponent implements OnInit {
  line: string = "";
  selectedArr: any = [];
  ocLine: string = "";
  ocTypeOfCession = "";

  passDataOpenCoverInquiry: any = {
    tableData: [
      ["OC-CAR-2018-00088-0099", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders and ABE International Corp", "Direct", "CAR Wet Risks", "Region IV, Laguna, Calamba", "CAR-2018-00001-099-0001-000", "PHP"],
      ["OC-CAR-2018-00089-0078", "Retrocession", "CAR Wet Risks", "Concluded", "FLT Prime", "5K Builders", "ABE International Corp", "5K Builders and ABE International Corp", "Retrocession", "CAR Wet Risks", "Region IV, Laguna, Calamba", "CAR-2018-00001-099-0001-000", "PHP"],
      ["OC-EAR-2018-00089-0078", "Retrocession", "CAR Wet Risks", "Concluded", "FLT Prime", "5K Builders", "ABE International Corp", "5K Builders and ABE International Corp", "Retrocession", "CAR Wet Risks", "Region IV, Laguna, Calamba", "CAR-2018-00001-099-0001-000", "PHP"],
      ["OC-EAR-2018-00089-0078", "Retrocession", "CAR Wet Risks", "Concluded", "FLT Prime", "5K Builders", "ABE International Corp", "5K Builders and ABE International Corp", "Retrocession", "CAR Wet Risks", "Region IV, Laguna, Calamba", "CAR-2018-00001-099-0001-000", "PHP"],
    ],
    tHeader: ["Open Cover Quoation No", "Type of Cession", "Line Class", "Status", "Ceding Company", "Principal", "Contractor", "Insured", "Risk", "Object", "Site", "Policy No", "Currency"],
    dataTypes: ["text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text"],
    colSize: ['100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%'],
    pageLength: 10,
    pageStatus: true,
    pagination: true,
    printBtn: true,
  };

  constructor(private titleService: Title, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Quo | Open Cover Inquiry");
  }

  onRowDblClick(event) {
    //line
    this.selectedArr = (event.target.closest('tr').children[0].innerText).split("-");
    this.ocLine = this.selectedArr[1];
    //end line

    //type of cession
    this.ocTypeOfCession = event.target.closest('tr').children[1].innerText;
    //end type of cession

    setTimeout(() => {
      this.checkLine(this.ocLine);
    }, 100);

  }

  checkLine(cline: string) {
    if (cline === 'CAR' ||
      cline === 'EAR') {
      this.router.navigate(['/open-cover', { line: cline, typeOfCession: this.ocTypeOfCession }], { skipLocationChange: true });
    }
  }

}
