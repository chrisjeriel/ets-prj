import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { NotesService, AccountingService} from '@app/_services';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';



@Component({
  selector: 'app-profit-commission',
  templateUrl: './profit-commission.component.html',
  styleUrls: ['./profit-commission.component.css']
})
export class ProfitCommissionComponent implements OnInit {
	@ViewChild("cedingComp") cedingCoLOV: CedingCompanyComponent;
	@ViewChild("cedingCompModal") cedingCoModal: CedingCompanyComponent;
	@ViewChild('queryMdl') queryModal : ModalComponent;
    @ViewChild('profitCommMdl') profitCommMdl : ModalComponent;
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    @ViewChild('profitComm') profitCommtable: CustEditableNonDatatableComponent;
    @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;


	dateFrom : any = '';
	dateTo: any = '';   
    yearCdLov: any;
    monthCdLov: any;
    cedingDesc: any = '';
    cedingId: any = '';
    cedingDescLov: any = '';
	disableBtn: boolean = true;
	cedingCompDesc: any;
	month: any;
	year:any;
	selectedData  : any;
	profDate : any;
	profDateLastYr : any;
  	cedingAbbr : any = '';
  	quotaIncome : any;
  	dataAll :any;
  	diff: any;
  	income: any;
  	searchParams: any[] = [];
    profCommDateTo: any = '';
    profCommDateFrom: any = '';
    dialogIcon: string = '';
    dialogMessage: string = '';

	passData:any = {
		tableData: [],
		tHeader: ["Company","Month","Year","INCOME","OUTGO"],
		dataTypes:["text","text","text","currency","currency"],
		total: [null,null,'TOTAL','income','outgo'],
		keys: ['company', 'month', 'year', 'income', 'outgo'],
		pageLength: 15,
		uneditable: [true,true,true,true,true],
		widths:['auto',100,100,150,150],
	    paginateFlag: true,
  		infoFlag: true,
  	    genericBtn: 'View Details',
    	disableGeneric: true,
    	searchFlag: true
	}

	passDataProfitComm:any = {
		tableData: [{ 	particulars : "NET PREMIUM WRITTEN-QUOTA***",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "OUTSTANDING CLAIMS-" +this.cedingAbbr+"-"+ this.profDateLastYr,
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "40% OF UNEXPIRED RISKS FROM PREVIOUS YEAR-RELEASED ",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "UNEARNED AT ",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "LOSSES PAID-" + this.cedingAbbr+"-"+this.profDate,
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "OUTSTANDING CLAIMS-" + this.cedingAbbr+"-"+this.profDate,
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "ORIGINAL EXPENSES :",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "-"+" POOL EXP - QUOTA (W/RMC)",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "-"+" AGENCY & GEN. EXPENSES - QUOTA",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "-"+" Vat on Commission***",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "MANAGEMENT EXPENSES :",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null },
				  	{ 	particulars : "-"+" 15 % of ",
				  	 	actual		: null,
				  		natcat      : null,
				  		income		: null,
				  		outgo		: null }
				   ],
		tHeader: ["Particulars","Actual","Nat Cat","INCOME","OUTGO"],
		dataTypes:["text","currency","currency","currency","currency"],
		total: [null,null,null,'income','outgo'],
		keys: ['particulars', 'actual', 'natcat', 'income', 'outgo'],
		pageLength: 12,
		uneditable: [true,true,true,true,true],
		widths:['auto','auto','auto',120,120],
		disableSort : true
	}
    
  constructor(private route: Router, private titleService: Title, private ns: NotesService, private as: AccountingService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Profit Commission Statement");
  	this.queryModal.mdlOptions = { centered: true, backdrop: 'static', windowClass: "modal-size" };
  	/*this.queryModal.openNoClose();*/
  	this.getProfCommList(this.searchParams);
  	this.dataAll = this.passData.tableData;
  }

	onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.route.navigateByUrl('');
      } 
  	}


  	showCedCompLOV(){
  	  this.cedingCoLOV.modal.openNoClose();
  	}

  	setSelectedCedComp(data){
  	  this.cedingDesc = data.cedingName;
  	  this.cedingId = data.cedingId;
  	  this.ns.lovLoader(data.ev, 0);
  	}

  	checkCode(event){
  	  this.ns.lovLoader(event, 1);
      this.cedingCoLOV.checkCode(this.cedingDesc, event);
  	}

  	showCedCompModal(){
  	  this.cedingCoModal.modal.openNoClose();
  	}

  	setSelectedCedCompModal(data){
  	  this.cedingDescLov = data.cedingName;
  	  this.ns.lovLoader(data.ev, 0);
  	}

  	checkCodeModal(event){
  	  this.ns.lovLoader(event,1);
  	  this.cedingCoModal.checkCode(this.cedingDescLov,event);
  	}

  	onClickShowDetails(event){
  	  this.profitCommMdl.openNoClose();
  	  this.getProfCommDtl();
  	}

  	onRowClick(event){
  		console.log(event);
	  	if(event !== null){
	  		this.selectedData 	= event;
	  		this.cedingCompDesc = event.company;
	  		this.month 			= event.month;
	  		this.year 			= event.year;
	  	    this.passData.disableGeneric = false;
	  	    this.diff = event.income - event.outgo;
	  	    this.income = event.income;
	  	    this.disableBtn = false;
	  	} else {
	  	    this.passData.disableGeneric = true;
	  	    this.disableBtn = true;
	  	}
  }

  onRowDblClick(event){
  	 this.onClickShowDetails(event);
  }

  clearProfitComm(){
  	this.passDataProfitComm.tableData = [];
  	this.profitCommtable.refreshTable(); 
  }

  	getProfCommList(search?){
  		this.as.getProfitCommSumm(search).subscribe(data => {
      		var records = data['acitProfCommSummList'];
			for(let rec of records){
				this.passData.tableData.push({
											profCommId	: rec.profCommId,
											cedingId	: rec.cedingId,
											cedingAbbr  : rec.cedingAbbr,
											company 	: rec.cedingName,
	                                        month 		: rec.month,
	                                        year		: rec.year,
	                                        income     	: rec.totIncome,
	                                        outgo		: rec.totOutgo,
 											createUser  : rec.createUser,
 											createDate  : this.ns.toDateTimeString(rec.createDate),
 											updateUser  : rec.updateUser,
 											updateDate  : this.ns.toDateTimeString(rec.updateDate)
											});
		    }                        
      			this.table.refreshTable();
  		});
  	}
	
	getEndDate(iMonth, iYear) {
    	var day = new Date(iYear, iMonth, 0).getDate();
    	return day;
	}

  	getProfCommDtl(){
  		//this.clearProfitComm();
  		this.profDate		= this.selectedData.month + '/' + this.getEndDate(this.selectedData.month,this.selectedData.year) + '/' + this.selectedData.year;
	  	this.profDateLastYr	= this.selectedData.month + '/' + this.getEndDate(this.selectedData.month,(this.selectedData.year-1)) + '/' + (this.selectedData.year-1);
	  	this.cedingAbbr		= this.selectedData.cedingAbbr;

  		this.profitCommtable.overlayLoader = true;
  		this.as.getProfitCommDtl(this.selectedData.profCommId).subscribe(data => {
  			var records = data['acitProfCommDtl']; 
  			for (let i = 0; i < records.length; i++) {
			  	if (records[i].itemNo === '1'){
			  		this.passDataProfitComm.tableData[0].actual = records[i].actualAmt;
			  		this.passDataProfitComm.tableData[0].natcat = records[i].natcatAmt;
			  		this.passDataProfitComm.tableData[0].income = records[i].income;
			  		this.quotaIncome = records[i].income;
			  	}else if (records[i].itemNo === '2'){
			  		this.passDataProfitComm.tableData[3].particulars = "UNEARNED AT " + this.profDate +"-HELD";
			  		this.passDataProfitComm.tableData[3].actual = records[i].actualAmt;
			  		this.passDataProfitComm.tableData[3].natcat = records[i].natcatAmt;
			  		this.passDataProfitComm.tableData[3].outgo = records[i].outgo;
			  	}else if (records[i].itemNo === '3'){
			  		this.passDataProfitComm.tableData[11].particulars = "-"+" 15 % of " + this.quotaIncome.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
			  		this.passDataProfitComm.tableData[11].outgo  = records[i].outgo;
			  	}else if (records[i].itemNo === '4'){
			  		this.passDataProfitComm.tableData[8].actual = records[i].actualAmt;
			  		this.passDataProfitComm.tableData[8].natcat = records[i].natcatAmt;
			  		this.passDataProfitComm.tableData[8].outgo  = records[i].outgo;
			  	}else if (records[i].itemNo === '5'){
			  		this.passDataProfitComm.tableData[9].actual = records[i].actualAmt;
			  		this.passDataProfitComm.tableData[9].natcat = records[i].natcatAmt;
			  		this.passDataProfitComm.tableData[9].outgo  = records[i].outgo;
			  	}
			}			
			this.profitCommtable.refreshTable(); 		
  		});
  	}

  	searchProfitComm(){
       if(this.dateTo < this.dateFrom){
        this.dialogMessage="To Date must be greater than From Date";
        this.dialogIcon = "error-message";
        this.successDialog.open();
     }else {
        this.cedingId === null   || this.cedingId === undefined ?'':this.cedingId;
        this.dateFrom === null || this.dateFrom === undefined ?'':this.dateFrom;
        this.dateTo === null || this.dateTo === undefined ?'':this.dateTo;
        this.passData.tableData = [];
        this.table.overlayLoader = true;

        this.searchParams = [{key: "cedingId", search: this.cedingId },
                             {key: "dateTo", search: this.dateTo },
                             {key: "dateFrom", search: this.dateFrom },
                             ]; 
        console.log(this.searchParams);
        this.getProfCommList(this.searchParams)
                    
  	}

  }
}
