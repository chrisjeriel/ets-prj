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
   	this.router.navigate(['/create-open-cover'], { skipLocationChange: false });
   }

   gotoInfo(){
   	this.router.navigate(['/create-open-cover-letter',{ line: this.selected.openPolicyNo.split('-')[1],
   														 policyIdOc:this.selected.policyIdOc,
   														 insured: this.selected.insuredDesc,
   														 riskName: this.selected.riskName,
   														 policyNo: this.selected.openPolicyNo ,
   														 inqFlag: false,
   														 exitLink: '/open-cover-list'}], { skipLocationChange: true });
   }

   searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        //this.passData.btnDisabled = true;
        this.retrievePolListing();

   }

   export(){
        //do something
     var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'PolicyList_'+currDate+'.xlsx'
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
            return num
      };
      alasql('SELECT openPolicyNo AS PolicyNo, cessionDesc AS TypeCession, cedingName AS CedingCompany, insuredDesc AS Insured, riskName AS Risk, objectDesc AS Object, site AS Site, currencyCd AS Currency, currency(totalSi) AS MaxSi , datetime(issueDate) AS IssueDate, datetime(inceptDate) AS InceptDate, datetime(expiryDate) AS ExpiryDate, datetime(acctDate) AS AcctingDate, statusDesc AS Status  INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
  }

}
