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
  tableData: any[] = [];
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
    tHeader: [
        "Line","Policy No", "Type Cession","Ceding Company", "Insured", "Risk", "Object", "Site", "Currency", "Sum Insured", "Premium" , "Issue Date", "Inception Date", "Expiry Date","Accounting Date","Status"
    ],
    resizable: [
            false,false, false, true, true, true, true, true, false, true, true, false,
            false, false, false, false
    ],
    dataTypes: [
            "text","text", "text", "text", "text", "text", "text", "text",
            "text", "currency", "currency", "date", "date", "date", "date", "text"
    ],
    magnifyingGlass: [],
    options: [],
    opts: [],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    pagination: true,
    pageStatus: true,
    searchFlag: true,
    pageLength: 10,
    printBtn: true,
    filters: [
             {
                key: 'line',
                title: 'Line',
                dataType: 'text'
            },
            {
                key: 'policyNo',
                title: 'Policy No.',
                dataType: 'text'
            },
            {
                key: 'typeCession',
                title: 'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title: 'Ceding Company',
                dataType: 'text'
            },
            {
                key: 'insured',
                title: 'Insured',
                dataType: 'text'
            },
            {
                key: 'risk',
                title: 'Risk',
                dataType: 'text'
            },
            {
                key: 'object',
                title: 'Object',
                dataType: 'text'
            },
            {
                key: 'site',
                title: 'Site',
                dataType: 'text'
            },
            {
                key: 'currency',
                title: 'Currency',
                dataType: 'date'
            },
            {
                key: 'sumInsured',
                title: 'Sum Insured',
                dataType: 'text'
            },
            {
                key: 'premium',
                title: 'Premium',
                dataType: 'text'
            },
            {
                key: 'issueDate',
                title: 'Issue Date',
                dataType: 'date'
            },
            {
                key: 'inceptionDate',
                title: 'Inception Date',
                dataType: 'date'
            },
            {
                key: 'expiryDate',
                title: 'Expiry Date',
                dataType: 'date'
            },
               {
                key: 'accountingDate',
                title: 'Accounting Date',
                dataType: 'date'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
        ],
  };

  constructor(private underwritingService: UnderwritingService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Inquiry");
    this.passData.tableData = this.underwritingService.getPolicyInquiry();

  }

}
