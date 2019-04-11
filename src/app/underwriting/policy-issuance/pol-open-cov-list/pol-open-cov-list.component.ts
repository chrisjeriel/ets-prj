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
	selected:any;
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
	  addFlag: true,
	  editFlag: true,
	  // deleteFlag: false,
	  infoFlag: true,
	  searchFlag: true,
	  pageLength: 20,
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
	      exportFlag: true
	};
	@ViewChild('listTable') listTable: any;
	searchParams: any[] = [];
  constructor(private underwritingService: UnderwritingService, private titleService: Title, private router : Router) { }

  ngOnInit() {
  	this.retrievePolListing();
  }

  retrievePolListing(){
       this.underwritingService.getPolListingOc(this.searchParams).subscribe((data:any)=>{
       	console.log(data);
         this.passData.tableData = data.policyList.filter(a=>{
           a.totalSi = a.project.coverageOc.totalSi;
           a.riskName = a.project.riskName;
           a.objectDesc = a.project.objectDesc;
           a.site = a.project.site;
           return a.openPolicyNo.split('-')[6] == "000" &&  ['Pending Approval','Approved','Rejected','In Progress','In Force'].indexOf(a.statusDesc)!= -1;
         });
         this.listTable.refreshTable();
       })
   }
   
   gotoAdd(){
   	this.router.navigate(['/create-policy'], { skipLocationChange: false });
   }

   gotoInfo(){
   	this.router.navigate(['/create-open-cover-letter',{ line: this.selected.openPolicyNo.split('-')[1],
   														 policyIdOc:this.selected.policyIdOc,
   														 insured: this.selected.insuredDesc,
   														 riskName: this.selected.riskName,
   														 policyNo: this.selected.openPolicyNo ,
   														 inqFlag: false}], { skipLocationChange: true });
   }

   searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.passData.btnDisabled = true;
        this.retrievePolListing();

   }

}
