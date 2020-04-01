import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UnderwritingPolicyInquiryInfo } from '@app/_models';
import { UnderwritingService, NotesService, ClaimsService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { Router } from '@angular/router';
import * as alasql from 'alasql';

@Component({
  selector: 'app-policy-inquiry',
  templateUrl: './policy-inquiry.component.html',
  styleUrls: ['./policy-inquiry.component.css']
})
export class PolicyInquiryComponent implements OnInit, AfterViewInit {
  @ViewChild('listTable') listTable: LoadingTableComponent;
  passData: any = {
    tHeader: [
        "Line","Policy No", "Type Cession","Ceding Company", "Insured", "Risk", "Object", "Site", "Currency", "Sum Insured", "Premium" , "Issue Date", "Inception Date", "Expiry Date","Booking Date","Status","Created By"
    ],
    sortKeys : ['POLICY_NO','POLICY_NO','CESSION_DESC','CEDING_NAME','INSURED_DESC','RISK_NAME','OBJECT_DESC','SITE','CURRENCY_CD','TOTAL_SI','TOTAL_PREM','ISSUE_DATE','INCEPT_DATE','EXPIRY_DATE','ACCT_DATE','STATUS_DESC','CREATE_USER'],
    dataTypes: [
            "text","text", "text", "text", "text", "text", "text", "text",
            "text", "currency", "currency", "date", "date", "date", "date", "text", "text"
    ],
    keys: ['lineCd','policyNo','cessionDesc','cedingName','insuredDesc','riskName','objectDesc','site','currencyCd','totalSi','totalPrem','issueDate','inceptDate','expiryDate','acctDate','statusDesc','createUser'],
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
                key: 'cessionDesc',
                title: 'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'cedingName',
                title: 'Ceding Company',
                dataType: 'text'
            },
            {
                key: 'insuredDesc',
                title: 'Insured',
                dataType: 'text'
            },
            {
                key: 'riskName',
                title: 'Risk',
                dataType: 'text'
            },
            {
                key: 'objectDesc',
                title: 'Object',
                dataType: 'text'
            },
            {
                key: 'site',
                title: 'Site',
                dataType: 'text'
            },
            {
                key: 'currencyCd',
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
                title: 'Booking Date',
                dataType: 'datespan'
            },
            {
                key: 'statusDesc',
                title: 'Status',
                dataType: 'text'
            },
            {
                key: 'createUser',
                title: 'Created By',
                dataType: 'text'
            },
        ],
    exportFlag: true
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

  searchParams: any = {
        'paginationRequest.count':10,
        'paginationRequest.position':1,
        'altNo':0,
        mode:'inquiry'
    };

    infoLoading:Boolean = false;

  constructor(private underwritingService: UnderwritingService, private titleService: Title, private router : Router, private ns: NotesService, private cs: ClaimsService) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Inquiry");
    // this.passData.tableData = this.underwritingService.getPolicyInquiry();
    if(this.ns.listParams != null){
        this.searchParams = this.ns.listParams;
    }
    this.retrievePolListing();
  }

  ngAfterViewInit(){
    if(this.ns.listParams != null){
        this.listTable.setPreviousParams(this.ns.listParams);
      }
  }

  gotoInfo(data) {
       this.router.navigate(['/policy-information', {policyId:data.policyId, policyNo:data.policyNo}], { skipLocationChange: true });
  }

  onRowClick(data){
    this.infoLoading = false;
    if(data!==null && Object.keys(data).length !== 0){
      if(data.withClaim){
        this.policyInfo = data;
      }else{
        this.infoLoading = true;
        this.cs.checkExistingClaim(data.policyId).subscribe(a => {
          data.withClaim = a;
          this.policyInfo = data;
          this.infoLoading = false;
        });
      }
    }
    else{
      this.policyInfo = this.defaultPolicyInfo;
    }
  }

  searchQuery(searchParams){
        for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }
        this.retrievePolListing();

   }

   retrievePolListing(){
       this.ns.setListParams(this.searchParams);
       if(this.searchParams.recount != 'N'){
         this.underwritingService.getPolicyListingLength(this.searchParams).subscribe(data=>{
           this.passData.count = data;
           console.log(data)
           this.listTable.setLength(1);
         })
         this.searchParams.recount = 'N';
       }

       this.underwritingService.newGetParListing(this.searchParams).subscribe((data:any)=>{
         this.listTable.placeData(data.policyList.filter(a=>{
             a.lineCd = a.policyNo.substring(0,3);
             a.totalSi = a.project.coverage.totalSi;
             a.riskName = a.project.riskName;
             a.objectDesc = a.project.objectDesc;
             a.site = a.project.site;
             a.totalPrem = a.project.coverage.totalPrem;
             return true;
         }),1);
       })
   }

  export(){
        //do something

    let paramsCpy = JSON.parse(JSON.stringify(this.searchParams));
    
    delete paramsCpy['paginationRequest.count'];
    delete paramsCpy['paginationRequest.position'];
        
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'PolicyInquiry_'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

       alasql.fn.currency = function(currency) {
            var parts = parseFloat(currency).toFixed(2).split(".");
            var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
                (parts[1] ? "." + parts[1] : "");
            num = num == 'NaN' ?'' : num;
            return num
      };


      this.underwritingService.newGetParListing(paramsCpy).subscribe((data:any)=>{
         let recs = data.policyList.filter(a=>{
           
             a.lineCd = a.policyNo.substring(0,3);
             a.totalSi = a.project.coverage.totalSi;
             a.riskName = a.project.riskName;
             a.objectDesc = a.project.objectDesc;
             a.site = a.project.site;
             a.totalPrem = a.project.coverage.totalPrem;
             return true;
         });


         alasql('SELECT lineCd AS Line, policyNo AS PolicyNo, cessionDesc AS TypeCession, cedingName AS CedingCompany, insuredDesc AS Insured, riskName AS Risk, objectDesc AS Object, site AS Site, currencyCd AS Currency, currency(totalSi) AS TotalSi, currency(totalPrem) AS TotalPremium, datetime(issueDate) AS IssueDate, datetime(inceptDate) AS InceptDate, datetime(expiryDate) AS ExpiryDate, datetime(acctDate) AS AcctingDate, statusDesc AS Status, createUser AS CreatedBy  INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,recs]);
       })

     
  }



}
