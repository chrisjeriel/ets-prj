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
    cedingName: any = '';
    cedingId: any = '';
    gnrtCedingName: any = '';
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
		tHeader: ["Company","Currency", "Month","Year","INCOME","OUTGO"],
		dataTypes:["text","text","text","text","currency","currency"],
		total: [null,null,null,'TOTAL','income','outgo'],
		keys: ['company', 'currCd', 'month', 'year', 'income', 'outgo'],
		pageLength: 15,
		uneditable: [true,true,true,true,true,true],
		widths:['auto',1,100,100,150,150],
	    paginateFlag: true,
  		infoFlag: true,
  	    genericBtn: 'View Details',
    	disableGeneric: true,
    	searchFlag: true,
      pageID: 'profitCommMainTab'
	}

	passDataProfitComm:any = {
		tableData: [],
		tHeader: ["Particulars","Actual","Nat Cat","INCOME","OUTGO"],
		dataTypes:["text","currency","currency","currency","currency"],
		total: [null,null,null,'income','outgo'],
		keys: ['particulars', 'actualAmt', 'natcatAmt', 'income', 'outgo'],
		pageLength: 12,
		uneditable: [true,true,true,true,true],
		widths:['auto','auto','auto',120,120],
		disableSort : true
	}

	income1:any;		  /* TRBT#PROD_GRADE */
	outgo1:any;			  /* TRBT#PROD_GRADE */
	income2:any;		  /* TRBT#PROD_GRADE */
	outgo2:any;			  /* TRBT#PROD_GRADE */

	gnrtCedingId: string = '';
	gnrtDate: string = '';
	yearParam: number = 0;

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
  	  this.cedingName = data.cedingName;
  	  this.cedingId = data.cedingId;
  	  this.ns.lovLoader(data.ev, 0);
  	}

  	checkCode(event){
  	  this.ns.lovLoader(event, 1);
      this.cedingCoLOV.checkCode(this.cedingName, event);
  	}

  	showCedCompModal(){
  	  this.cedingCoModal.modal.openNoClose();
  	}

  	setSelectedCedCompModal(data){
  	  this.gnrtCedingId = data.cedingId;
  	  this.gnrtCedingName = data.cedingName;
  	  this.ns.lovLoader(data.ev, 0);
  	}

  	checkCodeModal(event){
  	  this.ns.lovLoader(event,1);
  	  this.cedingCoModal.checkCode(this.gnrtCedingName,event);
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

  onRowDblClick(event) {
  	//removed due to known bug

  	/*if(!event.target.classList.contains('filler')) {
  		this.onClickShowDetails(event);	
  	}*/
  }

  clearProfitComm(){
  	this.passDataProfitComm.tableData = [];
  	this.profitCommtable.refreshTable(); 
  }

  	getProfCommList(search?){
  		this.as.getProfitCommSumm(search).subscribe(data => {
      		var records = data['acitProfCommSummList'];

      		this.passData.tableData = [];
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
 											updateDate  : this.ns.toDateTimeString(rec.updateDate),
 											currCd		: rec.currCd
											});
		    }                        
      			this.table.refreshTable();
  		});
  	}
	
	getEndDate(iMonth, iYear) {
    	var day = new Date(iYear, iMonth, 0).getDate();
    	return day;
	}

	profitCurrYear: any = '';
	profitLastYear: any = '0';
	carriedForward: any = '0';
	profitCommission: any = '0';

  	getProfCommDtl(){
  		//this.clearProfitComm();
  		this.profDate		= this.selectedData.month + '/' + this.getEndDate(this.selectedData.month,this.selectedData.year) + '/' + this.selectedData.year;
	  	this.profDateLastYr	= this.selectedData.month + '/' + this.getEndDate(this.selectedData.month,(this.selectedData.year-1)) + '/' + (this.selectedData.year-1);
	  	this.cedingAbbr		= this.selectedData.cedingAbbr;

  		this.profitCommtable.overlayLoader = true;
  		this.as.getProfitCommDtl(this.selectedData.profCommId).subscribe(data => {
  			var records = data['acitProfCommDtl'];
  			this.passDataProfitComm.tableData = records;

  			if(data['acitProfCommDtl'].length > 0) {
  				this.yearParam = this.selectedData.year;
  				this.profitCurrYear = this.selectedData.profitLossAmt;
  				this.carriedForward = this.selectedData.profitLossTotal; //parseFloat(this.profitCurrYear) + parseFloat(this.profitLastYear);
  				this.profitCommission = this.selectedData.profitLossComm; //parseFloat(this.carriedForward) * 0.2;
  			}

  			/*for (let i = 0; i < records.length; i++) {
			  	if (records[i].itemNo === '1'){
			  		this.passDataProfitComm.tableData[0].actual = records[i].actualAmt;
			  		this.passDataProfitComm.tableData[0].natcat = records[i].natcedcatAmt;
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
			}*/
			this.profitCommtable.refreshTable(); 		
  		});
  	}

  	searchProfitComm(){
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
	    this.getProfCommList(this.searchParams);
  }

  onClickView() {
  	this.cedingId = this.gnrtCedingId;
  	this.cedingName = this.gnrtCedingId == '' ? '' : this.gnrtCedingName;
  	this.dateFrom = this.gnrtDate;
  	this.dateTo = this.gnrtDate;

  	this.gnrtCedingId = '';
  	this.gnrtCedingName = '';
  	this.gnrtDate = '';

  	this.searchProfitComm();
  }

  onClickGenerate() {
  	var a = {
  		cedingId: this.gnrtCedingId,
  		gnrtDate: this.gnrtDate,
  		createUser: this.ns.getCurrentUser(),
  		createDate: this.ns.toDateTimeString(0),
  		updateUser: this.ns.getCurrentUser(),
  		updateDate: this.ns.toDateTimeString(0)
  	}

  	this.as.saveAcitProfComm(a).subscribe(data => {
  		console.log(data);

  		if(data['returnCode'] == -1) {
  			this.dialogIcon = 'success-message';
  			this.dialogMessage = 'Profit Commision successfully generated';
  			this.getProfCommList(this.searchParams);
  		} else {
  			this.dialogIcon = 'error-message';
  			this.dialogMessage = 'Profit Commision failed';
  		}

  		this.successDialog.open();
  	});
   }

	valChanged(fromVal, toVal) {
        if(toVal !== undefined && toVal !== '' && fromVal !== undefined && fromVal !== '') {
            return new Date(fromVal) > new Date(toVal) ? '' : toVal;
        } else {
            return fromVal === undefined || fromVal === '' ? toVal : '';
        }
    }
}
