import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clm-claim-processing',
  templateUrl: './clm-claim-processing.component.html',
  styleUrls: ['./clm-claim-processing.component.css']
})
export class ClmClaimProcessingComponent implements OnInit {
  tableData: any[] = [
    ["CAR-2018-00013", "In Progress", "CAR-2018-00001-099-0001-000", "ASIA INSURANCE (PHILIPPINES) CORP", "Cornerdot Contructions / Solid Builders Corp", "C-National Steel/Iligan City", "03/09/2018", "Damaged electricl cables and supply line on 2nd", "PHP", "1,000,000.00", "330,000.00", "TLP Adj./ ACD Co Inc.", "CLETC"],

  ];
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  tHeader: any[] = [];
  dataTypes: any[] = [];
  addFlag;
  editFlag;
  paginateFlag;
  infoFlag;
  searchFlag;
  polLine;
  slctd: string = "";
  slctdArr: any[] = [];

  checkboxFlag;
  columnId;
  pageLength = 10;

  passData: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    addFlag: true,
    editFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    widths: []
  };


  constructor(private titleService: Title, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim Processing");

    this.passData.tHeader.push("Claim No", "Status", "Policy No", "Ceding Company", "Insured",
      "Risk", "Loss Date", "Loss Details", "Currency", "Total Reserve", "Total Payment", "Adjusters",
      "Processed By");
    this.passData.widths.push("auto", "auto", "auto", "auto", "auto",
      "auto", "auto", "auto", "auto", "auto",
      "auto", "auto", "auto");
    this.passData.tableData = this.tableData;
  }
  navigateToGenInfo() {
    var pLine = this.polLine.toUpperCase();

    if (pLine === 'CAR' ||
      pLine === 'EAR' ||
      pLine === 'EEI' ||
      pLine === 'CEC' ||
      pLine === 'MBI' ||
      pLine === 'BPV' ||
      pLine === 'MLP' ||
      pLine === 'DOS') {
      this.modalService.dismissAll();
      this.router.navigate(['/claims-claim', { line: pLine }], { skipLocationChange: true });
    }

  }

  onRowDblClick(event) {
    this.slctd = event.target.closest("tr").children[2].children[0].children[0].value;
    this.slctdArr = this.slctd.split("-");
    for (var i = 0; i < this.slctdArr.length; i++) {
      this.polLine = this.slctdArr[0];
    }
    this.router.navigate(['/claims-claim', { line: this.polLine }], { skipLocationChange: true });
  }

  onClickAdd(event) {
    $('#addClaim > #modalBtn').trigger('click');
  }
}
