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
    // filters: [
    //          {
    //             key: 'line',
    //             title: 'Line',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'policyNo',
    //             title: 'Policy No.',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'typeCession',
    //             title: 'Type of Cession',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'cedingCompany',
    //             title: 'Ceding Company',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'insured',
    //             title: 'Insured',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'risk',
    //             title: 'Risk',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'object',
    //             title: 'Object',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'site',
    //             title: 'Site',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'currency',
    //             title: 'Currency',
    //             dataType: 'date'
    //         },
    //         {
    //             key: 'sumInsured',
    //             title: 'Sum Insured',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'premium',
    //             title: 'Premium',
    //             dataType: 'text'
    //         },
    //         {
    //             key: 'issueDate',
    //             title: 'Issue Date',
    //             dataType: 'date'
    //         },
    //         {
    //             key: 'inceptionDate',
    //             title: 'Inception Date',
    //             dataType: 'date'
    //         },
    //         {
    //             key: 'expiryDate',
    //             title: 'Expiry Date',
    //             dataType: 'date'
    //         },
    //            {
    //             key: 'accountingDate',
    //             title: 'Accounting Date',
    //             dataType: 'date'
    //         },
    //         {
    //             key: 'status',
    //             title: 'Status',
    //             dataType: 'text'
    //         },
    //     ],
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

  constructor(private underwritingService: UnderwritingService, private titleService: Title, private router : Router) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Inquiry");
    // this.passData.tableData = this.underwritingService.getPolicyInquiry();
    this.underwritingService.getPolicyInquiry().subscribe((data:any)=>{
      console.log(data)
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

  gotoInfo(data) {
      console.log(data);
       this.router.navigate(['/policy-information', {policyId:data.policyId}], { skipLocationChange: true });
  }

  onRowClick(data){
    if(Object.keys(data).length !== 0)
      this.policyInfo = data;
    else
      this.policyInfo = this.defaultPolicyInfo;
  }

}
