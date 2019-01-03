import { Component, OnInit } from '@angular/core';
import { UnderwritingPolicyInquiryInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-policy-inquiry',
  templateUrl: './policy-inquiry.component.html',
  styleUrls: ['./policy-inquiry.component.css']
})
export class PolicyInquiryComponent implements OnInit {
  // tableData: any[] = [];
  // tHeader: any[] = [];
  // dataTypes: any[] = [];


  tableData: any[] = [];
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  tHeader: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  options: any[] = [];
  dataTypes: any[] = [];
  opts: any[] = [];
  checkFlag;
  selectFlag;
  addFlag;
  editFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  searchFlag;

  checkboxFlag;
  columnId;
  pageLength = 10;

  editedData: any[] = [];
  // editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // rowClick: EventEmitter<any> = new EventEmitter();
  // rowDblClick: EventEmitter<any> = new EventEmitter();

  passData: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

  constructor(private underwritingService: UnderwritingService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Inquiry");
    this.tHeader.push("Policy No");
    this.tHeader.push("Branch");
    this.tHeader.push("Ceding Company");
    this.tHeader.push("Principal");
    this.tHeader.push("Contractor");
    this.tHeader.push("Intermediary");
    this.tHeader.push("Insured");
    this.tHeader.push("Status");
    this.tHeader.push("Section I SI");
    this.tHeader.push("Section II SI");
    this.tHeader.push("Section III SI");
    this.tHeader.push("Object");

    this.tableData = this.underwritingService.getPolicyInquiry();

    this.passData.tHeader.push("Policy No");
    this.passData.tHeader.push("Branch");
    this.passData.tHeader.push("Ceding Company");
    this.passData.tHeader.push("Principal");
    this.passData.tHeader.push("Contractor");
    this.passData.tHeader.push("Intermediary");
    this.passData.tHeader.push("Insured");
    this.passData.tHeader.push("Status");
    this.passData.tHeader.push("Section I SI");
    this.passData.tHeader.push("Section II SI");
    this.passData.tHeader.push("Section III SI");
    this.passData.tHeader.push("Object");

    this.passData.tableData = this.underwritingService.getPolicyInquiry();

  }

}
