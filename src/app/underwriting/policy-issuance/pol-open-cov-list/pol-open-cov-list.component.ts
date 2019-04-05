import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pol-open-cov-list',
  templateUrl: './pol-open-cov-list.component.html',
  styleUrls: ['./pol-open-cov-list.component.css']
})
export class PolOpenCovListComponent implements OnInit {
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
	  addFlag: false,
	  editFlag: false,
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
	@ViewChild('listTable') listTable: any;
	searchParams: any[] = [];
  constructor(private underwritingService: UnderwritingService, private titleService: Title, private router : Router) { }

  ngOnInit() {


  }

  retrievePolListing(){
       this.underwritingService.getPolListingOc(this.searchParams).subscribe((data:any)=>{
         this.passData.tableData = data.policyList.filter(a=>{
           a.totalSi = a.project.coverageOc.totalSi;
           a.riskName = a.project.riskName;
           a.objectDesc = a.project.objectDesc;
           a.site = a.project.site;
           return true;
         });
         this.listTable.refreshTable();
       })
   }

}
