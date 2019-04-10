import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingPolicyInquiryInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy-inquiry',
  templateUrl: './policy-inquiry.component.html',
  styleUrls: ['./policy-inquiry.component.css']
})
export class PolicyInquiryComponent implements OnInit {
  @ViewChild('listTable') listTable: CustNonDatatableComponent;
  passData: any = {
    tHeader: [
        "Line","Policy No", "Type Cession","Ceding Company", "Insured", "Risk", "Object", "Site", "Currency", "Sum Insured", "Premium" , "Issue Date", "Inception Date", "Expiry Date","Accounting Date","Status"
    ],
    dataTypes: [
            "text","text", "text", "text", "text", "text", "text", "text",
            "text", "currency", "currency", "date", "date", "date", "date", "text"
    ],
    keys: ['lineCd','policyNo','cessionDesc','cedingName','insuredDesc','riskName','objectDesc','site','currencyCd','totalSi','totalPrem','issueDate','inceptDate','expiryDate','acctDate','statusDesc'],
    // checkFlag: false,
    // selectFlag: false,
    // addFlag: false,
    // editFlag: false,
    // deleteFlag: false,
    infoFlag: true,
    searchFlag: true,
    pageLength: 10,
    tableData: [],
    pagination: true,
    pageStatus: true,
    // printBtn: true,
    filters: [
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
                dataType: 'text'
            },
            {
               keys: {
                    from: 'totalSiLess',
                    to: 'totalSiGrt'
                },
                title: 'Sum Insured',
                dataType: 'textspan'
            },
            {
                keys: {
                    from: 'totalPremLess',
                    to: 'totalPremGrt'
                },
                title: 'Premium',
                dataType: 'textspan'
            },
            {
                 keys: {
                    from: 'issueDateFrom',
                    to: 'issueDateTo'
                },
                title: 'Issue Date',
                dataType: 'datespan'
            },
            {

                 keys: {
                    from: 'inceptDateFrom',
                    to: 'inceptDateTo'
                },
                title: 'Inception Date',
                dataType: 'datespan'
            },
            {
                keys: {
                    from: 'expiryDateFrom',
                    to: 'expiryDateTo'
                },
                title: 'Expiry Date',
                dataType: 'datespan'
            },
            {
                keys: {
                    from: 'acctDateFrom',
                    to: 'acctDateTo'
                },
                title: 'Accounting Date',
                dataType: 'datespan'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
        ],
  };

  policyInfo:any = {
    policyNo: null,
    cessionDesc: null,
    statusDesc: null,
    cedingId: null,
    cedingName: null,
    inceptDate: null,
    expiryDate: null,
    issueDate: null,
    acctDate: null,
    insuredDesc: null,
    riskName: null,
    site: null,
    objectDesc: null,
    currencyCd: null,
    totalSi: null,
    totalPrem: null,
  }

  defaultPolicyInfo:any = {
    policyNo: null,
    cessionDesc: null,
    statusDesc: null,
    cedingId: null,
    cedingName: null,
    inceptDate: null,
    expiryDate: null,
    issueDate: null,
    acctDate: null,
    insuredDesc: null,
    riskName: null,
    site: null,
    objectDesc: null,
    currencyCd: null,
    totalSi: null,
    totalPrem: null,
  }

  searchParams: any[] = [];

  constructor(private underwritingService: UnderwritingService, private titleService: Title, private router : Router) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Inquiry");
    // this.passData.tableData = this.underwritingService.getPolicyInquiry();
    this.retrievePolListing();
  }

  gotoInfo(data) {
       this.router.navigate(['/policy-information', {policyId:data.policyId}], { skipLocationChange: true });
  }

  onRowClick(data){
    if(data!==null && Object.keys(data).length !== 0)
      this.policyInfo = data;
    else
      this.policyInfo = this.defaultPolicyInfo;
  }

  searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.passData.btnDisabled = true;

        this.retrievePolListing();

   }

   retrievePolListing(){
       this.underwritingService.getParListing(this.searchParams).subscribe((data:any)=>{
         this.passData.tableData = data.policyList.filter(a=>{
           
             a.lineCd = a.policyNo.substring(0,3);
             a.totalSi = a.project.coverage.totalSi;
             a.riskName = a.project.riskName;
             a.objectDesc = a.project.objectDesc;
             a.site = a.project.site;
             a.totalPrem = a.project.coverage.totalPrem;
             return true;
         });
         this.listTable.refreshTable();
       })
   }


}
