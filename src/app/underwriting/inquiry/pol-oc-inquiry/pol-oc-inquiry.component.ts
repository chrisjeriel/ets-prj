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


}
