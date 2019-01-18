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
  policyList: UnderwritingPolicyInquiryInfo = new UnderwritingPolicyInquiryInfo(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
  allData: any[] = [];
  cedNum = "";
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
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    widths: [],
    pagination: true,
    pageStatus: true,
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
    this.allData = this.underwritingService.getPolicyInquiry();

/*    this.tHeader.push("Policy No");
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
*/
    this.passData.tableData = this.underwritingService.getPolicyInquiry();
  }

  onRowClick(event) {
        this.policyList  = new UnderwritingPolicyInquiryInfo(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
        this.cedNum =  '';
        for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.underwritingService.rowData[i] = event.target.parentElement.children[i].innerText;
        }
        if(!Number.isNaN(event.path[2].rowIndex - 1)){
            this.policyList = this.allData[event.path[2].rowIndex - 1];
            console.log(this.policyList);
             if (this.policyList == undefined){
              this.policyList  = new UnderwritingPolicyInquiryInfo(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)
            } else {
              var ced = this.policyList.policyNo;
              var arr = ced.split("-");
              this.cedNum = arr[3];
            }
        }
     } 

}
