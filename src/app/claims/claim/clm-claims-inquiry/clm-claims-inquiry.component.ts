import { Component, OnInit, ViewChild } from '@angular/core';
//import { UnderwritingPolicyInquiryInfo } from '@app/_models';
import { ClaimsService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
	selector: 'app-clm-claims-inquiry',
	templateUrl: './clm-claims-inquiry.component.html',
	styleUrls: ['./clm-claims-inquiry.component.css']
})
export class ClmClaimsInquiryComponent implements OnInit {
	@ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
	passData: any = {
	    tHeader: ["Claim No", "Status", "Policy No", "Ceding Company", "Insured", 
	    		  "Risk", "Loss Date", "Loss Details","Event Type", "Event", 
	    		  "Currency", "Total Reserve", "Total Payment", "Adjusters", "Processed By"],
		dataTypes: ["text", "text", "text", "text", "text", 
					"text", "date", "text","text","text", 
					"text", "currency", "currency", "text", "text"],
	    keys: ['claimNo','clmStatus','policyNo','cedingName','insuredDesc',
	    	   'riskName', 'lossDate', 'lossDtl', 'eventTypeDesc', 'eventDesc',
	    	   'currencyCd', 'totalLossExpRes', 'totalLossExpPd', 'riskId', 'processedBy'],
	    infoFlag: true,
	    searchFlag: true,
	    pageLength: 10,
	    tableData: [],
	    pagination: true,
	    pageStatus: true,
	    // printBtn: true,
	    filters: [
	       {
	            key: 'claimNo',
	            title:'Claim No.',
	            dataType: 'text'
	        },
	        {
	            key: 'cedingName',
	            title:'Ceding Name',
	            dataType: 'text'
	        },
	        {
	            key: 'clmStatus',
	            title:'Status',
	            dataType: 'text'
	        },
	        {
	            key: 'policyNo',
	            title:'Policy No.',
	            dataType: 'text'
	        },
	        {
	            key: 'insuredDesc',
	            title:'Insured',
	            dataType: 'text'
	        },
	        {
	            key: 'riskName',
	            title:'Risk',
	            dataType: 'text'
	        },
	        {
	             keys: {
	                  from: 'lossDateFrom',
	                  to: 'lossDateTo'
	              },
	              title: 'Loss Date',
	              dataType: 'datespan'
	        },
	        {
	            key: 'currencyCd',
	            title:'Currency',
	            dataType: 'text'
	        },
	        {
	            key: 'processedBy',
	            title:'Processed By',
	            dataType: 'text'
	        },
	    ],
	    exportFlag: true
	 };

  	searchParams: any[] = [];
  	selected: any = {
  		claimNo: '',
  		clmStatus: '',
  		policyNo: '',
  		coClaimNo: '',
  		cessionDesc: '',
  		lineClassDesc: '',
  		cedingName:'',
  		adjusters:'',
  		adjRefNo:'',
  		riskName: '',
  		lossDate: null,
  		reportDate: null,
  		reportedBy: '',
  		createDate: null,
  		processedBy: '',
  		lossDesc: '',
  		lossPeriod: '',
  		eventTypeDesc: '',
  		eventDesc: '',
  		lossDtl: '',
  		currencyCd: '',
  		totalLossExpRes: '',
  		totalLossExpPd: '',
  	};

	constructor(private claimsService: ClaimsService, private titleService: Title) { }

  	ngOnInit() {
    	this.titleService.setTitle("Clm | Claim Inquiry");

    	this.retrieveClaimlist();
	}


	retrieveClaimlist() {
		this.passData.tableData = [];
		this.claimsService.getClaimsListing(this.searchParams).subscribe((data:any)=>{
         /*	this.passData.tableData = data.policyList.filter(a=>{
           
             a.lineCd = a.policyNo.substring(0,3);
             a.totalSi = a.project.coverage.totalSi;
             a.riskName = a.project.riskName;
             a.objectDesc = a.project.objectDesc;
             a.site = a.project.site;
             a.totalPrem = a.project.coverage.totalPrem;
             return true;
         	}
         	
         );*/
		 console.log(data.claimsList);
       	 if (data != null) {
       	 	for (var rec of data.claimsList) {
       	 		this.passData.tableData.push(rec);
       	 	}
       	 }
         this.table.refreshTable();
       });
	}
}
