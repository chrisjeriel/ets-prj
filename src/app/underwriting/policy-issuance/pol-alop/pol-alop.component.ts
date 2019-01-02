import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { ALOPItemInformation, ALOPInfo } from '../../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pol-alop',
  templateUrl: './pol-alop.component.html',
  styleUrls: ['./pol-alop.component.css']
})
export class PolAlopComponent implements OnInit {
  aLOPInfo: ALOPInfo = new ALOPInfo();
  tableData: any[] = [["1", "Description 1", "Information 1"],
  ["2", "Description 2", "Information 2"],
  ["3", "Description 3", "Information 3"],
  ["4", "Description 4", "Information 4"],
  ["5", "Description 5", "Information 5"],
  ];

  tableData2: any[] = [
    ["1", "5", "Description 1", "Information", "Information"],
    ["2", "5", "Description 2", "Information", "Information"],
    ["3", "5", "Description 3", "Information", "Information"],
    ["4", "5", "Description 4", "Information", "Information"],
    ["5", "5", "Description 5", "Information", "Information"],
  ]

  tHeader: string[] = [];
  tHeader2: string[] = [];
  policyRecordInfo: any = {};
  dataTypes: string[] = [];
  dataTypes2: string[] = [];
  addFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  pageLength = 10;

  passData: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    nData: {},
    selectFlag: false,
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    widths: []
  };
  passData2: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    nData: {},
    selectFlag: false,
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    widths: []
  };
  nData: ALOPItemInformation = new ALOPItemInformation(null, null, null, null, null);
  line: string;
  sub: any;

  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal, private route: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
  	/*this.policyRecordInfo.policyNo = "CAR-2018-5081-077-0177";
  	this.tHeader = ["Item No","Quantity","Description","Relative Importance","Possible Loss Min"];
    this.dataTypes = ["number","number","text","text","text"];
    
    if(this.policyRecordInfo.policyNo.substr(0,3) =="CAR"){
  	  this.tHeader = ["Item No","Quantity","Description","Possible Loss Min"];
      this.dataTypes = ["number","number","text","text"];
    }

  	this.tableData = this.underwritingService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0,3));*/
    this.titleService.setTitle("Pol | ALOP");

    this.passData.tHeader.push("Item No", "Description", "Possible Loss Minimization");
    this.passData.widths.push("1", "auto", "auto");
    this.passData.tableData = this.tableData;


    this.passData2.tHeader.push("Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Minimization");
    this.passData2.dataTypes.push("text", "text", "text", "text", "text");
    this.passData2.widths.push("1", "1", "auto", "auto", "auto");

    this.passData2.tableData = this.tableData2;




    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
    });
  }

  save() {
    console.log(this.aLOPInfo);
  }

}
