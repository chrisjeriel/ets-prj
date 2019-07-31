import { Component, OnInit, ViewChild } from '@angular/core';
//import { UnderwritingPolicyInquiryInfo } from '@app/_models';
import { ClaimsService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
	selector: 'app-clm-claims-inquiry',
	templateUrl: './clm-claims-inquiry.component.html',
	styleUrls: ['./clm-claims-inquiry.component.css']
})
export class ClmClaimsInquiryComponent implements OnInit {
	@ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
	passData: any = {
	    tHeader: ["Claim No", "Status", "Policy No", "Co Claim No", "Type of Cession", "Line Class", "Ceding Company", "Insured",
	    		  "Co Ref No", "Adjuster", "Adjuster Ref No", "Risk", "Loss Date", "Report Date", "Reported By", "Creation Date", 
	    		  "Processed By", "Loss Cause", "Loss Period", "Event Type", "Event", "Loss Details", "Remarks", "Section I",
	    		  "Section II", "Section III", 'Currency', 'Total Reserved', 'Total Payment'],

		dataTypes: ["text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "date", 
					"date", "text", "date", "text", "text", "text", "text", "text", "text", "text", "checkbox", "checkbox", "checkbox", 
					"text", "currency", "currency"],

	    keys: ['claimNo','clmStatus','policyNo', 'coClaimNo', 'cessionDesc', 'lineClassDesc', 'cedingName','insuredDesc',
	    	   'coRefNo', 'adjName', 'adjRefNo', 'riskName', 'lossDate', 'reportDate', 'reportedBy', 'createDate', 'processedBy', 
	    	   'lossAbbr', 'lossPdAbbr', 'eventTypeDesc', 'eventDesc', 'lossDtl', 'remarks', 'secISiTag', 'secIISiTag', 'secIIISiTag', 
	    	   'currencyCd', 'totalLossExpRes', 'totalLossExpPd'],
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
	             keys: {
	                  from: 'totalResFrom',
	                  to: 'totalResTo'
	              },
	              title: 'Total Reserve',
	              dataType: 'textspan'
	        },
	        {
	             keys: {
	                  from: 'totalPaytFrom',
	                  to: 'totalPaytTo'
	              },
	              title: 'Total Payment',
	              dataType: 'textspan'
	        },
	        {
	            key: 'adjName',
	            title:'Adjuster',
	            dataType: 'text'
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
  		lossDate: '',
  		reportDate: '',
  		reportedBy: '',
  		createDate: '',
  		processedBy: '',
  		lossDesc: '',
  		lossPeriod: '',
  		eventTypeDesc: '',
  		eventDesc: '',
  		lossDtl: '',
  		currencyCd: '',
  		totalLossExpRes: '',
  		totalLossExpPd: '',
  		remarks: '',
  		secISiTag: '',
  		secIISiTag: '',
  		secIIISiTag: ''
  	};

  	loading: boolean = false;

  	claimId: string = '';
  	claimNo: string = '';
  	policyNo: string = '';

  	report: any = {
  		date: null,
  		time: null
  	}

  	create: any = {
  		date: null,
  		time: null
  	}

  	lossDate: string = null;

	constructor(private claimsService: ClaimsService, private titleService: Title, private ns : NotesService, private router: Router) { }

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
       	 if(data != null){
	         for(var i of data.claimsList){
	           for(var j of i.clmAdjusterList){
	             if(i.adjName === null){
	               i.adjName = j.adjName;
	               j.adjRefNo !== null ? i.adjRefNo = j.adjRefNo : null;
	             }else{
	               i.adjName = i.adjName + '/' + j.adjName;
	               j.adjRefNo !== null ? i.adjRefNo = i.adjRefNo + '/' + j.adjRefNo : null;
	             }
	           }
	           this.passData.tableData.push(i);
	         }
	         this.table.refreshTable();
	       }
       });
	}

	searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        //this.passData.btnDisabled = true;
        this.passData.btnDisabled = true;
        this.retrieveClaimlist();

   }

	onRowClick(data){
		let rowData = data;
		this.loading = true;
		if(data === null || (data !== null && Object.keys(data).length === 0)){
			this.selected = {
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
				lossDate: '',
				reportDate: '',
				reportedBy: '',
				createDate: '',
				processedBy: '',
				lossDesc: '',
				lossPeriod: '',
				eventTypeDesc: '',
				eventDesc: '',
				lossDtl: '',
				currencyCd: '',
				totalLossExpRes: '',
				totalLossExpPd: '',
				remarks: '',
		  		secISiTag: 'N',
		  		secIISiTag: 'N',
		  		secIIISiTag: 'N',
		  		sectionIPrem: '',
		  		sectionIIPrem: '',
		  		sectionIIIPrem: '',
		  		allowMaxSi: ''
			};
			this.create = {
				date: null,
				time: null
			}
			this.report = {
				date: null,
				time: null
			}
			this.loading = false;
		}else{
			console.log(data);
			this.claimId = data.claimId;
			this.claimNo = data.claimNo;
			this.policyNo = data.policyNo;
			this.selected = data;
			this.selected.lossDate = this.ns.toDateTimeString(this.selected.lossDate);
			this.create.date = this.ns.toDateTimeString(this.selected.createDate).split('T')[0];
			this.create.time = this.ns.toDateTimeString(this.selected.createDate).split('T')[1];
			this.report.date = this.ns.toDateTimeString(this.selected.reportDate).split('T')[0];
			this.report.time = this.ns.toDateTimeString(this.selected.reportDate).split('T')[1];
			/*this.claimId = data.claimId;
			this.claimNo = data.claimNo;
			this.policyNo = data.policyNo;
			this.claimsService.getClmGenInfo(rowData.claimId, rowData.claimNo).subscribe(
				(genData: any)=>{
					this.selected = genData.claim === null ? {} : genData.claim;
					this.selected.totalLossExpRes = rowData.totalLossExpRes;
					this.selected.totalLossExpPd = rowData.totalLossExpPd;
					this.selected.lossDate = this.ns.toDateTimeString(this.selected.lossDate);
					this.create.date = this.ns.toDateTimeString(this.selected.createDate).split('T')[0];
					this.create.time = this.ns.toDateTimeString(this.selected.createDate).split('T')[1];
					this.report.date = this.ns.toDateTimeString(this.selected.reportDate).split('T')[0];
					this.report.time = this.ns.toDateTimeString(this.selected.reportDate).split('T')[1];
					if(genData.claim !== null){
						this.selected.adjusters = '';
						console.log(genData.claim.clmAdjusterList);
						for(var i = 0; i < genData.claim.clmAdjusterList.length; i++){
							if(i+1 === genData.claim.clmAdjusterList.length){
								this.selected.adjusters += genData.claim.clmAdjusterList[i].adjName === null ? '' : genData.claim.clmAdjusterList[i].adjName;
							}else{
								this.selected.adjusters += genData.claim.clmAdjusterList[i].adjName === null ? '' : genData.claim.clmAdjusterList[i].adjName + ' / ';
							}
						}
					}
					this.loading = false;
				},
				(error: any)=>{
					this.loading = false;
				}
			);*/
		}
	}

	navigateToGenInfo() {  
	    let line = this.policyNo.split('-')[0];
	    this.router.navigate(
	                    ['/claims-claim', {
	                        from: 'edit',
	                        readonly: true,
	                        claimId: this.claimId,
	                        claimNo: this.claimNo,
	                        line: line,
	                        exitLink: 'claims-inquiry'
	                    }],
	                    { skipLocationChange: true }
	      );
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
    var filename = 'ClaimsList_'+currDate+'.xlsx'
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

      var toAlaSQLData: any[] = [];
      for(var i  of this.passData.tableData){
      	i.totalLossExpRes = i.totalLossExpRes === null || i.totalLossExpRes === undefined || (i.totalLossExpRes !== null && i.totalLossExpRes !== undefined && i.totalLossExpRes.length === 0) ? 0 : i.totalLossExpRes;
      	i.totalLossExpPd = i.totalLossExpPd === null || i.totalLossExpPd === undefined || (i.totalLossExpPd !== null && i.totalLossExpPd !== undefined && i.totalLossExpPd.length === 0) ? 0 : i.totalLossExpPd;
      	i.coClaimNo = i.coClaimNo === null || i.coClaimNo === undefined || (i.coClaimNo !== null && i.coClaimNo !== undefined && i.coClaimNo.length === 0) ? '' : i.coClaimNo;
      	i.coRefNo = i.coRefNo === null || i.coRefNo === undefined || (i.coRefNo !== null && i.coRefNo !== undefined && i.coRefNo.length === 0) ? '' : i.coRefNo;
      	i.reportedBy = i.reportedBy === null || i.reportedBy === undefined || (i.reportedBy !== null && i.reportedBy !== undefined && i.reportedBy.length === 0) ? '' : i.reportedBy;
      	i.eventTypeDesc = i.eventTypeDesc === null || i.eventTypeDesc === undefined || (i.eventTypeDesc !== null && i.eventTypeDesc !== undefined && i.eventTypeDesc.length === 0) ? '' : i.eventTypeDesc;
      	i.eventDesc = i.eventDesc === null || i.eventDesc === undefined || (i.eventDesc !== null && i.eventDesc !== undefined && i.eventDesc.length === 0) ? '' : i.eventDesc;
      	i.secISiTag = i.secISiTag === null || i.secISiTag === undefined || (i.secISiTag !== null && i.secISiTag !== undefined && i.secISiTag.length === 0) ? 'N' : i.secISiTag;
      	i.secIISiTag = i.secIISiTag === null || i.secIISiTag === undefined || (i.secIISiTag !== null && i.secIISiTag !== undefined && i.secIISiTag.length === 0) ? 'N' : i.secIISiTag;
      	i.secIIISiTag = i.secIIISiTag === null || i.secIIISiTag === undefined || (i.secIIISiTag !== null && i.secIIISiTag !== undefined && i.secIIISiTag.length === 0) ? 'N' : i.secIIISiTag;
      	i.remarks = i.remarks === null || i.remarks === undefined || (i.remarks !== null && i.remarks !== undefined && i.remarks.length === 0) ? '' : i.remarks;
      	toAlaSQLData.push(i);
      }
      alasql('SELECT claimNo AS ClaimNo,clmStatus AS Status, policyNo AS PolicyNo, coClaimNo AS CoClaimNo, cessionDesc AS TypeOfCession, lineClassDesc AS LineClass, cedingName AS CedingCompany, insuredDesc AS Insured,'+
			        'coRefNo AS CoRefNo, adjName AS Adjuster, adjRefNo AS AdjusterRefNo, riskName AS Risk, datetime(lossDate) AS LossDate, datetime(reportDate) AS ReportDate, reportedBy AS ReportedBy, datetime(createDate) AS CreationDate, processedBy AS ProcessedBy,'+ 
					'lossAbbr AS LossCause, lossPeriod AS LossPeriod, eventTypeDesc AS EventType, eventDesc AS Event, lossDtl AS LossDetails, remarks AS Remarks, secISiTag AS SectionI, secIISiTag AS SectionII, secIIISiTag AS SectionIII,'+
					'currencyCd AS Currency, currency(totalLossExpRes) AS TotalReserve, currency(totalLossExpPd) AS TotalPayment'+
      	     ' INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,toAlaSQLData]);
  }
}