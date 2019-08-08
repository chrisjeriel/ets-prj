import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { NotesService, AccountingService} from '@app/_services';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-allocate-investment-income',
  templateUrl: './allocate-investment-income.component.html',
  styleUrls: ['./allocate-investment-income.component.css']
})
export class AllocateInvestmentIncomeComponent implements OnInit {
  
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('queryMdl') queryModal : ModalComponent;
  @ViewChild('invtTable') tableInvt : CustEditableNonDatatableComponent;
  
  byDate: any = '';
  radioVal: any = '';
  fromDate: string = "";
  toDate: string = "";

  monthList: any[] = [ {key: 1, value: 'January'},
    					 {key: 2, value: 'February'},
    					 {key: 3, value: 'March'},
    					 {key: 4, value: 'April'},
    					 {key: 5, value: 'May'},
    					 {key: 6, value: 'June'},
    					 {key: 7, value: 'July'},
    					 {key: 8, value: 'August'},
    					 {key: 9, value: 'September'},
    					 {key: 10,value: 'October'},
    					 {key: 11, value: 'November'},
    					 {key: 12, value: 'December'},]
  fromYear: any = "";
  fromMonth: any = "";
  yearList: any[] = [];
  asOfYear: any = "";

   passData: any = {
        tableData: [],
        tHeader: ['Tran Class', 'Tran No.', 'Tran Date', 'Status', 'Particulars', 'Bank Charges', 'Withholding Taxes', 'Investment Income'],
        dataTypes: ['text', 'text', 'date', 'text', 'text', 'currency', 'currency', 'currency'],
        pageLength: 10,
        expireFilter: false, 
        checkFlag: true, 
        tableOnly: false, 
        fixedCol: false, 
        printBtn: false, 
        pageStatus: true,
        pagination: true,
        pageID: 1, 
        searchFlag: true,
        infoFlag: true,
	    paginateFlag: true,
        keys: ['tranClass','tranNo','tranDate','statusDesc',
        	   'particulars','bankCharge','whtaxAmt','incomeAmt'],
        widths: [1,130,150,150,180,150,150,150],
    }

    searchParams: any[] = [];
    searchParamsInvt: any[] = [];
    boolView: boolean = true;
    boolAllocate: boolean = true;
    selectedData : any;
    dialogIcon: string = '';
    dialogMessage: string = '';
    invtId: any[] =[];
    tranNo: any;
    tranDate: any;
    status: any;
    payor: any;

     passDataInvt: any = {
   	 tableData: [],
   	 tHeader: ["Investment Code","Certificate No.","Investment Type","Security","Maturity Period","Duration Unit","Interest Rate","Date Purchased","Maturity Date","Curr","Curr Rate","Investment","Investment Income","Bank Charges","Withholding Tax","Maturity Value"],
   	 resizable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
   	 dataTypes: ['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
   	 addFlag: false,
     disableAdd : false,
     searchFlag: false,
     infoFlag: true,
     paginateFlag: true,
     pageStatus: true,
     pagination: true,
     pageLength: 10,
     widths: [1,1,1,1,1,1,1,1,100,85,90,80,100,120,100,120,130],
     keys: ['invtCd','certNo','invtType',
            'invtSecCd','matPeriod','durUnit','intRt','purDate',
            'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
            'whtaxAmt','matVal'],
     uneditable : ['invtCd','certNo','invtType',
            'invtSecCd','matPeriod','durUnit','intRt','purDate',
            'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
            'whtaxAmt','matVal'],
     total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','matVal'],
   };

   dataAll:any[] = [];

  constructor(private route: Router, private titleService: Title, private ns: NotesService, private as: AccountingService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Profit Commission Statement");
  	this.getYearList();
  	this.retrieveAllInvtIncome(this.searchParams);
  }

  clearDates() {
    this.fromDate = "";
    this.toDate = "";  
  }

  getYearList(){
  		for (let i = 0; i<100; i++){
  			this.yearList.push(2000 + i);
  		}
  }

  retrieveAllInvtIncome(search?){
  	this.as.getAcitAllInvtIncome(search).subscribe( data => {
  		  var td = data['allInvtIncomeList'].map(a => { 
                                      a.tranDate = this.ns.toDateTimeString(a.tranDate);
                                      a.uneditable = ['tranClass','tranNo','tranDate','statusDesc',
                                                        'particulars','bankCharge','whtaxAmt','incomeAmt'];
                                   	  return a; });
  		  console.log(td);
  		  this.passData.tableData = td;

  		  this.table.refreshTable();
  	});
  }

  onClickSearch(){
  	if(this.isEmptyObject(this.radioVal)){
    }else {

    	if(this.toDate < this.fromDate){
        	this.dialogMessage="To Date must be greater than From Date";
        	this.dialogIcon = "error-message";
        	this.successDialog.open();
    	}
    	if(this.radioVal === 'bydate'){
    		this.fromMonth = '';
    		this.fromYear = '';
    		this.asOfYear = '';
    	}else if (this.radioVal === 'bymoyo'){
    		this.fromDate = '';
    		this.toDate = '';
    		this.asOfYear = '';
    	}else if (this.radioVal === 'byYear'){
    		this.fromDate = '';
    		this.toDate = '';
    		this.fromMonth = '';
    		this.fromYear = '';
    	}

    	this.fromDate === null   || this.fromDate === undefined ?'':this.fromDate;
        this.toDate === null || this.toDate === undefined?'':this.toDate;
        this.fromMonth === null || this.fromMonth === undefined ?'':this.fromMonth;
        this.fromYear === null || this.fromYear === undefined ?'':this.fromYear;
        this.asOfYear === null || this.asOfYear === undefined ?'':this.asOfYear;
        this.passData.tableData = [];
        this.table.overlayLoader = true;

        this.searchParams = [ {key: "tranDateFrom", search: this.fromDate },
                             {key: "tranDateTo", search: this.toDate },
                             {key: "tranMonth", search: this.fromMonth},
                             {key: "tranYear", search: this.fromYear },
                             {key: "tranDate", search: this.asOfYear },
                             ]; 
       console.log(this.searchParams);
       this.retrieveAllInvtIncome(this.searchParams);
    }
 }

  isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
  }

  onRowClick(data){
  	  if(data !== null){
  	      console.log(data)
	      this.selectedData = data;
	      this.boolView = false;
	      this.tranDate = data.tranDate;
	      this.status = data.statusDesc;
	      this.payor = data.payor;
	    } else {
	     this.boolView = true;
	    }

  }

   retrieveAllInvtIncomeInvtId(tranId?){
  	this.as.getAcitAllInvtIncomeInvtId(tranId).pipe(
           finalize(() => this.showModalViewDetails(this.invtId) )
           ).subscribe( data => {
  		  data['allInvtIncomeList'].map(a => {
	                                   	this.invtId.push(a.invtId) 
	                                   	return a; });
  	});
  }

  onClickView(){
  	  this.passDataInvt.tableData = [];
  	  this.retrieveAllInvtIncomeInvtId(this.selectedData.tranId);
  }

  showModalViewDetails(obj){
 
  	obj.map(a => {
  		this.searchParamsInvt = [ {key: "invtId", search: a},
                             ]; 
  		this.as.getAccInvestments(this.searchParamsInvt).pipe(
  			finalize(() => this.showModDetailsFinal(this.dataAll,obj.length) )
  			).subscribe( data => {
  				console.log(data['invtList']);
	            for(let rec of data['invtList']){
		  	 		this.dataAll.push( {
		  	 										  invtCd: rec.invtCd,
								                      certNo: rec.certNo,
								                      invtType: rec.invtType,
								       				  invtSecCd: rec.invtSecCd,
								                      matPeriod: rec.matPeriod,
								                      durUnit: rec.durUnit,
								                      intRt: rec.intRt,
								                      purDate: this.ns.toDateTimeString(rec.purDate),
								                      matDate: this.ns.toDateTimeString(rec.matDate),
								                      currCd: rec.currCd,
								                      currRate: rec.currRate,
								                      invtAmt: rec.invtAmt,
								                      incomeAmt: rec.incomeAmt,
								                      bankCharge: rec.bankCharge,
								                      whtaxAmt:  rec.whtaxAmt,
								                      matVal: rec.matVal
		  	 										});
	  	 	   }

  	 	});
  	});
  	  
  }

  showModDetailsFinal(obj, counter){
  	if (counter === obj.length ){
  		for(let rec of obj){
		  	 		this.passDataInvt.tableData.push( {
		  	 										  invtCd: rec.invtCd,
								                      certNo: rec.certNo,
								                      invtType: rec.invtType,
								                      invtSecCd: rec.invtSecCd,
								                      matPeriod: rec.matPeriod,
								                      durUnit: rec.durUnit,
								                      intRt: rec.intRt,
								                      purDate: this.ns.toDateTimeString(rec.purDate),
								                      matDate: this.ns.toDateTimeString(rec.matDate),
								                      currCd: rec.currCd,
								                      currRate: rec.currRate,
								                      invtAmt: rec.invtAmt,
								                      incomeAmt: rec.incomeAmt,
								                      bankCharge: rec.bankCharge,
								                      whtaxAmt:  rec.whtaxAmt,
								                      matVal: rec.matVal
		  	 										});
	  	}
	  	this.tableInvt.refreshTable();
  		this.queryModal.openNoClose();	
  	}  	 
  }



}
