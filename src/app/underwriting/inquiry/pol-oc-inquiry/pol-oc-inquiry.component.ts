import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingPolicyInquiryInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pol-oc-inquiry',
  templateUrl: './pol-oc-inquiry.component.html',
  styleUrls: ['./pol-oc-inquiry.component.css']
})
export class PolOcInquiryComponent implements OnInit {
@ViewChild('listTable') listTable: CustNonDatatableComponent;
  passData: any = {
    tHeader: [
        "Open Cover Policy No", "Type Cession","Ceding Company", "Insured", "Risk", "Object", "Site", "Currency", "Max Si", "Issue Date", "Inception Date", "Expiry Date","Accounting Date","Status"
    ],
    dataTypes: [
             "text", "text", "text", "text", "text", "text",
            "text", , "currency", "date", "date", "date", "date", "text"
    ],
    keys: ['openPolicyNo','cessionDesc','cedingName','insuredDesc','riskName','objectDesc','site','currencyCd','totalSi','issueDate','inceptDate','expiryDate','acctDate','statusDesc'],
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
                  title: 'Max Si',
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
      exportFlag: true          
  };

  policyInfo:any = {
    openPolicyNo: null,
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
    openPolicyNo: null,
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
    this.retrievePolListing();
  }

  gotoInfo(data) {
  	   this.router.navigate(['/create-open-cover-letter',{ line: data.openPolicyNo.split('-')[1],
                                policyIdOc:data.policyIdOc,
                                insured: data.insuredDesc,
                                riskName: data.riskName,
                                policyNo: data.openPolicyNo,
                                inqFlag: true,
                                fromInq:true,
                                exitLink: '/pol-oc-inquiry' }], { skipLocationChange: true });
       //this.router.navigate(['/policy-information', {policyId:data.policyId}], { skipLocationChange: true });
  }

  onRowClick(data){
    if(data!== null && Object.keys(data).length !== 0)
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
       this.underwritingService.getPolListingOc(this.searchParams).subscribe((data:any)=>{
         this.passData.tableData = data.policyList.filter(a=>{
           a.totalSi = a.project.coverageOc.totalSi;
           a.riskName = a.project.riskName;
           a.objectDesc = a.project.objectDesc;
           a.site = a.project.site;
           return a.openPolicyNo.split('-')[6] == "000";
         });
         this.listTable.refreshTable();
       })
   }

   export(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'PolPoolDist_'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };
      //tHeader: ['Treaty', 'Treaty Company', '1st Ret Line', '1st Ret SI Amt', '1st Ret Prem Amt', '2nd Ret Line', '2nd Ret SI Amt', '2nd Ret Prem Amt', 'Comm Rate (%)', 'Comm Amount', 'VAT on R/I Comm', 'Net Due'],
      //keys: ['treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
     alasql('SELECT openPolicyNo AS OpenCoverPolicyNo, cessionDesc AS TypeCession, cedingName AS CedingCompany, insuredDesc AS Insured, riskName AS Risk, objectDesc AS Object, site AS Site, currencyCd AS Currency, totalSi AS MaxSi, issueDate AS IssueDate, inceptDate AS InceptionDate, expiryDate AS ExpiryDate, acctDate AS AccountingDate, statusDesc AS Status ' +
            'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
  }


}
