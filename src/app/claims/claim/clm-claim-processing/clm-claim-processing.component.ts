import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clm-claim-processing',
  templateUrl: './clm-claim-processing.component.html',
  styleUrls: ['./clm-claim-processing.component.css']
})
export class ClmClaimProcessingComponent implements OnInit {
  tableData: any[] = [
    ["0001", "Claimed", "CAR-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
    ["0002", "Claimed", "CAR-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
    ["0003", "Claimed", "CAR-2018-000002-021-0192-000", "CPI", "5K Builders & ABE international", "ABC Building", "01/01/2019", "data"],
  ];
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  tHeader: any[] = [];
  dataTypes: any[] = [];
  addFlag;
  editFlag;
  paginateFlag;
  infoFlag;
  searchFlag;

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
  constructor(private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim Processing");

    this.passData.tHeader.push("Claim No", "Status", "Policy No", "Ceding Company", "Insured", "Risk", "Loss Date", "In House Adj");
    this.passData.widths.push("1", "auto", "auto", "1", "auto", "auto", "auto", "1");
    this.passData.tableData = this.tableData;
  }

}
