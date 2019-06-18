import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-clm-change-claim-status',
  templateUrl: './clm-change-claim-status.component.html',
  styleUrls: ['./clm-change-claim-status.component.css']
})
export class ClmChangeClaimStatusComponent implements OnInit {
  tableData: any[] = [
    ["CAR-2018-00013", "In Progress", "CAR-2018-00001-099-0001-000", "ASIA INSURANCE (PHILIPPINES) CORP", "Cornerdot Contructions / Solid Builders Corp"],
    ["EAR-2018-00044", "In Progress", "EAR-2018-00555-067-0003-000", "BANKERS ASSURANCE CORP.", "Solid Square Buildings Corp/ DP Cornerstone Build & Traiding Corp"],
    ["EEI-2018-00043", "In Progress", "EEI-2018-00066-078-0008-000", "CHARTER PING AN INSURANCE CORP.", "A.B Industries, Inc."],
    ["MBI-2018-00087", "In Progress", "MBI-2018-00075-008-0004-000", "Dela Merced Adjustment Corp.", "A.C.G Construction"],
    ["BPV-2018-00055", "In Progress", "BPV-2018-00134-006-0009-000", "DOMESTIC INC. CO. OF THE PHIL.", "A.D. Reality and Contruction Corporation"],
    ["MLP-2018-00043", "In Progress", "MLP-2018-00077-009-0033-000", "EASTERN ASSURANCE AND SURETY CORP.", "A.G.S. Engineering and Management Resources, Inc."],
    ["DOS-2018-00009", "In Progress", "DOS-2018-00001-001-0001-000", "GENERAL ACCIDENT INSURANCE ASIAL LTD", "Aguilar Consolidated Construction Industries, Corp."],
    ["CEC-2018-00014", "In Progress", "CEC-2018-00117-032-0001-000", "J.G. Bernas Adjusters and Surveyors, Inc.", "Chinmaya Mission Philippines, Inc."],
    ["EAR-2018-00001", "In Progress", "EAR-2018-00111-034-0010-000", "LIBERTY INSURANCE CORP.", "DP Cornerstone Build & Trading Corp./ Cornerdot Construction"],
    ["CAR-2018-00115", "In Progress", "CAR-2018-00001-082-0023-000", "MAA GENERAL INSURANCE PHILS., INC.", "Brostek Furniture / Barillo Construction & Enterprises"],
  ];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  addFlag;
  editFlag;
  checkFlag;
  pagination;
  pageStatus;
  resizable;

  passData: any = {
    tableData: [],
    tHeader: ["Claim No", "Status", "Policy No", "Ceding Company", "Insured"],
    dataTypes: ["text","text", "text", "text", "text"],
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    uneditable:[true,true,true,true,true,true],
    keys:['claimNo','status','policyNo','cedingCom','Insured'],
    widths: ['auto','auto','auto','auto','auto'],
    pageID: 1
  };

  constructor(private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.getClaimStatus();
  }

  search(event) {
    $('#modalSearch > #modalBtn').trigger('click');
  }

  getClaimStatus(){

  }
}
