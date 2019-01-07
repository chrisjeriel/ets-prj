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
    ["0001", "Claimed", "CAR-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
    ["0002", "Claimed", "EAR-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
    ["0003", "Claimed", "DOS-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
    ["0004", "Claimed", "CEC-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
    ["0005", "Claimed", "EEI-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
    ["0006", "Claimed", "BPV-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
    ["0007", "Claimed", "MBI-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],

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

    this.passData.tHeader.push("Claim No", "Status", "Policy No", "Ceding Company", "Insured", "Risk", "Loss Date", "In House Adj");
    this.passData.widths.push("1", "auto", "auto", "1", "auto", "auto", "auto", "1");
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

}
