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

  passDataOpenCoverInquiry: any = {
    tableData: [
      ["OC-CAR-2018-00088-0099", "Direct", "CAR Wet Risks", "Concluded", "Malayan", "5K Builders", "ABE International Corp", "5K Builders and ABE International Corp", "Direct", "CAR Wet Risks", "Region IV, Laguna, Calamba", "CAR-2018-00001-099-0001-000", "PHP"],
      ["OC-CAR-2018-00089-0078", "Retrocession", "CAR Wet Risks", "Concluded", "FLT Prime", "5K Builders", "ABE International Corp", "5K Builders and ABE International Corp", "Retrocession", "CAR Wet Risks", "Region IV, Laguna, Calamba", "CAR-2018-00001-099-0001-000", "PHP"]
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
    this.selectedArr = (event.target.closest('tr').children[0].innerText).split("-");

    // for (var i = 0; i < this.selectedArr.length; i++) {
    //   console.log(this.selectedArr[i]);
    // }
    this.line = this.selectedArr[1];
    //this.checkLine(this.line);
    this.router.navigate(['/open-cover', { line: this.line }], { skipLocationChange: true });
  }

  // checkLine(cline: string) {
  //   if (cline === 'CAR' ||
  //     cline === 'EAR' ||
  //     cline === 'EEI' ||
  //     cline === 'CEC' ||
  //     cline === 'MBI' ||
  //     cline === 'BPV' ||
  //     cline === 'MLP' ||
  //     cline === 'DOS') {
  //     this.router.navigate(['/quotation', { line: cline }], { skipLocationChange: false });
  //     console.log(cline);
  //   }
  // }

}
