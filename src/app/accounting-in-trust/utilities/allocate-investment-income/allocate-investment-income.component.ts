import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { NotesService, AccountingService, MaintenanceService, UserService } from '@app/_services';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { finalize, map } from 'rxjs/operators';
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';
import { forkJoin } from 'rxjs'

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
  @ViewChild('successMdl') successMdl : ModalComponent;
  @ViewChild('jvTable') jvTable : CustEditableNonDatatableComponent;
  @ViewChild('currencyModal') currLov: MtnCurrencyCodeComponent;
  
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
        // tHeader: ['Tran Class', 'Tran No.', 'Tran Date', 'Status', 'Particulars', 'Bank Charges', 'Withholding Taxes', 'Investment Income'],
        tHeader: ['Tran No.', 'Tran Date', 'Tran Type', 'SL Name', 'Credit Amount', 'Debit Amount', 'Net Investment Income', 'Withholding Taxes', 'Bank Charges'],
        dataTypes: ['text', 'date', 'text', 'text', 'currency', 'currency', 'currency', 'currency', 'currency'],
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
        deleteFlag: true,
	      paginateFlag: true,
        keys: ['tranNo','tranDate','tranTypeName', 'slName', 'creditAmt', 'debitAmt', 'incomeAmt', 'whtaxAmt', 'bankCharge'],
        widths: [130,1,150,150,140,140,140,140,140],
        total:[null,null,null,'Total','creditAmt', 'debitAmt', 'incomeAmt', 'whtaxAmt', 'bankCharge'],
        uneditable: [true,true,true,true,true,true,true,false,false]
    }

    searchParams: any[] = [];
    searchParamsInvt: any[] = [];
    boolView: boolean = false;
    boolAllocate: boolean = false;
    selectedData : any;
    dialogIcon: string = '';
    dialogMessage: string = '';
    invtId: any[] =[];
    tranNo: any;
    tranDate: any;
    status: any;
    payor: any;
    sumBankCharge: number = 0;
    sumWhtax: number = 0;
    sumInvtIncome: number = 0;


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
     keys: ['invtCd','certNo','invtTypeDesc',
            'invtSecDesc','matPeriod','durUnit','intRt','purDate',
            'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
            'whtaxAmt','matVal'],
     uneditable : ['invtCd','certNo','invtTypeDesc',
            'invtSecDesc','matPeriod','durUnit','intRt','purDate',
            'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
            'whtaxAmt','matVal'],
     total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','matVal'],
   };

   dataAll:any[] = [];
   selectedTranId: any[] = [];

   jvDatas: any = {
    closeDate : null, 
    createDate : this.ns.toDateTimeString(0), 
    createUser : this.ns.getCurrentUser(), 
    deleteDate : null,   
    postDate : null, 
    tranClass : 'JV', 
    tranTypeCd: null,
    tranClassNo : null, 
    tranDate :  this.ns.toDateTimeString(0), 
    tranId : null, 
    tranStat : 'O', 
    tranYear : null, 
    updateDate : this.ns.toDateTimeString(0), 
    updateUser : this.ns.getCurrentUser(), 
  }

  	jvDatasList : any = {
  				"saveAcitAllocInvtIncome" : [],
  				"saveAcitJvEntryList" : []
  	}
  	acitAllocInvtIncReq  : any = { 
                "saveAcitAllocInvtIncome"  : []}
    refnoTranId: any;
    currCode: any;
    currRt: any = 0;
    selectedTranTypeCd: any[] = [];
    resultJV: any = [];
    tranTypeCdInvtInc : any;
    tranTypeCdWhtax : any;
    tranTypeCdBankCharge: any;

    passDataJv: any = {
   	 tableData: [],
   	 tHeader: ["JV No.","Type","JV Date","Amount"],
   	 resizable: [true,true,true,true],
   	 dataTypes: ['text','text','date','currency'],
   	 addFlag: false,
     disableAdd : false,
     searchFlag: false,
     infoFlag: false,
     paginateFlag: false,
     pageStatus: false,
     pagination: false,
     pageLength: 3,
     widths: [1,1,1,1],
     keys: ['jvNo','type','jvDate',
            'amount'],
     uneditable : ['jvNo','type','jvDate',
            'amount']
   };

   tranIdOut: any;
   result : boolean;
   loading: boolean = false;

   currCd: any = '';
   currency: any = '';
   allocTranDate: string = '';
   tranIdUtil: any = '';


  constructor(private route: Router, private titleService: Title, private ns: NotesService, private as: AccountingService, private ms: MaintenanceService, private userService: UserService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Allocate Investment Income");
    this.userService.emitModuleId("ACIT054");

  	this.getYearList();
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
  		  							  var totn_string = a.tranNo;
  		  							  a.tranNo = totn_string.padStart(6, '0');
                                      a.tranDate = this.ns.toDateTimeString(a.tranDate);
                                      // a.uneditable = ['tranClass','tranNo','tranDate','statusDesc',
                                      //                   'particulars','bankCharge','whtaxAmt','incomeAmt'];
                                   	  return a; });
  		  this.passData.tableData = td;
        // $('.ng-dirty').removeClass('ng-dirty');
  		  this.table.refreshTable();
        this.table.markAsPristine();
  	});
  }

  onClickSearch(){
    if(this.toDate < this.fromDate){
        this.dialogMessage="To Date must be greater than From Date";
        this.dialogIcon = "error-message";
        this.successDialog.open();
        this.passData.tableData = [];
      this.table.refreshTable();
    } else if ((this.isEmptyObject(this.fromDate) && this.isEmptyObject(this.toDate)) || this.isEmptyObject(this.currCd)) {
      if(this.isEmptyObject(this.fromDate) && this.isEmptyObject(this.toDate)) {
        this.dialogMessage="To Date and From Date must have a value";
      } else {
        this.dialogMessage="Currency required";
      }

      this.dialogIcon = "error-message";
      this.successDialog.open();
      this.passData.tableData = [];
      this.table.refreshTable();
    } else {
      this.searchTransactions();        
    }

  	/*if(this.isEmptyObject(this.radioVal)){
    }else {

    	if(this.radioVal === 'bydate'){
    		this.fromMonth = '';
    		this.fromYear = '';
    		this.asOfYear = '';
    		
    		if(this.toDate < this.fromDate){
	        	this.dialogMessage="To Date must be greater than From Date";
	        	this.dialogIcon = "error-message";
	        	this.successDialog.open();
	        	this.passData.tableData = [];
    			this.table.refreshTable();
    		} else if ( this.isEmptyObject(this.fromDate) && this.isEmptyObject(this.toDate) ){
    			this.dialogMessage="To Date and From Date must have a value";
	        	this.dialogIcon = "error-message";
	        	this.successDialog.open();
	        	this.passData.tableData = [];
    			this.table.refreshTable();
    		} else {
    			this.searchTransactions();    		
    		}

    	}else if (this.radioVal === 'bymoyo'){
    		this.fromDate = '';
    		this.toDate = '';
    		this.asOfYear = '';
			
			if ( this.isEmptyObject(this.fromMonth) && this.isEmptyObject(this.fromYear) ){
    			this.dialogMessage="From Month and From Year must have a value";
	        	this.dialogIcon = "error-message";
	        	this.successDialog.open();
	        	this.passData.tableData = [];
    			this.table.refreshTable();
    		} else {
    			this.searchTransactions();    		
    		}

    	}else if (this.radioVal === 'byyear'){

    		this.fromDate = '';
    		this.toDate = '';
    		this.fromMonth = '';
    		this.fromYear = '';
    		
    		if ( this.isEmptyObject(this.asOfYear) ){
    			this.dialogMessage="Date must have a value";
	        	this.dialogIcon = "error-message";
	        	this.successDialog.open();
	        	this.passData.tableData = [];
    			this.table.refreshTable();
    		} else {
    			this.searchTransactions();    		
    		}	
    	}*/
    // }
 }

 searchTransactions(){
 			this.fromDate === null   || this.fromDate === undefined ?'':this.fromDate;
	        this.toDate === null || this.toDate === undefined?'':this.toDate;
	        this.fromMonth === null || this.fromMonth === undefined ?'':this.fromMonth;
	        this.fromYear === null || this.fromYear === undefined ?'':this.fromYear;
	        this.asOfYear === null || this.asOfYear === undefined ?'':this.asOfYear;
          this.currCd === null || this.currCd === undefined ?'':this.currCd;
	        this.passData.tableData = [];
	        this.table.overlayLoader = true;
	        this.boolAllocate = false;

	        this.searchParams = [ {key: "tranDateFrom", search: this.fromDate },
	                             {key: "tranDateTo", search: this.toDate },
	                             {key: "tranMonth", search: this.fromMonth},
	                             {key: "tranYear", search: this.fromYear },
	                             {key: "tranDate", search: this.asOfYear },
                               {key: "currCd", search: this.currCd },
	                             ]; 
         console.log(this.searchParams);
	       this.retrieveAllInvtIncome(this.searchParams);
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
    console.log(data);
     this.invtId = [];
  	  if(data !== null){
	      this.selectedData = data;
        this.invtId.push(data.slCd);
        this.tranNo = data.tranNo;
        this.tranDate = data.tranDate;
        this.status = data.statusDesc;
        this.payor = data.payor;
        this.tranIdUtil = data.tranId;
	    } else {
	     this.boolView = true;
	    }
      console.log(this.invtId);
  }

  /* retrieveAllInvtIncomeInvtId(tranId?){
  	this.as.getAcitAllInvtIncomeInvtId(tranId).pipe(
           finalize(() => this.showModalViewDetails(this.invtId) )
           ).subscribe( data => {
  		  data['allInvtIncomeList'].map(a => {
	                                   	this.invtId.push(a.invtId) 
	                                   	return a; });
  	});
  }*/

  onClickView(){
  	this.dataAll = [];
  	this.selectedTranId = [];
   
	 /* for(var i= 0; i< this.passData.tableData.length; i++){
	  		if(this.passData.tableData[i].checked){
	  			this.selectedTranId.push(this.passData.tableData[i].tranId);
	  			this.tranNo = this.passData.tableData[i].tranNo;
			    this.tranDate = this.passData.tableData[i].tranDate;
			    this.status = this.passData.tableData[i].statusDesc;
			    this.payor = this.passData.tableData[i].payor;
	  		}
	  }*/
   	if (this.isEmptyObject(this.invtId)) {
       this.dialogMessage="Please choose one transaction to view";
       this.dialogIcon = "error-message";
       this.successDialog.open();
	  } else {
      this.loading = true;
      this.showModalViewDetails(this.invtId);
   	  } 
  	
  }

  showModalViewDetails(obj){
    console.log(obj);
  	obj.map(a => {
  		this.searchParamsInvt = [ {key: "invtId", search: a == null ? 0 : a}];
    });

      var subRes = forkJoin(this.as.getAcitInvestmentsIncArtUtil(this.tranIdUtil),
                            this.as.getAccInvestments(this.searchParamsInvt))
                 .pipe(map(([arInvt,jvInvt]) => { return { arInvt, jvInvt }; }));

  		// this.as.getAccInvestments(this.searchParamsInvt).pipe(
  		// 	finalize(() => this.showModDetailsFinal(this.dataAll,obj.length) )
  		// 	)

      subRes.subscribe( data => {
        for(let rec of data['arInvt']['invtList']){
            this.dataAll.push( {
                              invtCd: rec.invtCd,
                                      certNo: rec.certNo,
                                      invtTypeDesc: rec.invtTypeDesc,
                                invtSecDesc: rec.invtSecDesc,
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

	      for(let rec of data['jvInvt']['invtList']){
		  	 		this.dataAll.push( {
		  	 										  invtCd: rec.invtCd,
								                      certNo: rec.certNo,
								                      invtTypeDesc: rec.invtTypeDesc,
								       				  invtSecDesc: rec.invtSecDesc,
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

        this.loading = false;
        this.showModDetailsFinal(this.dataAll,obj.length)
  	 	});
  	  
  }

  showModDetailsFinal(obj, counter){
  	// if (counter === obj.length ){
  		this.passDataInvt.tableData = [];
  		for(let rec of obj){
		  	 		this.passDataInvt.tableData.push( {
		  	 										  invtCd: rec.invtCd,
								                      certNo: rec.certNo,
								                      invtTypeDesc: rec.invtTypeDesc,
								                      invtSecDesc: rec.invtSecDesc,
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
  	// }  	 
  }

  onRowDblClick(){
  }

 update(data){
 	console.log(data);
 }

 onClickAllocate(){
  if(this.allocTranDate == '') {
    this.dialogMessage="Transaction date required";
    this.dialogIcon = "error-message";
    this.successDialog.open();
    return;
  }
  
 	 this.selectedTranId = [];
 	 this.sumBankCharge = 0;
 	 this.sumWhtax = 0;
 	 this.sumInvtIncome = 0;
 	 var currCd = null;
 	 var counter = 0;
   this.selectedTranId = this.passData.tableData.filter(a => !a.deleted).map(a => {
    this.currCode = a.currCd;
    this.currRt = a.currRate;
    this.sumBankCharge += a.bankCharge;
    this.sumWhtax += a.whtaxAmt;
    this.sumInvtIncome += a.incomeAmt;
    return {
      tranId: a.tranId,
      currCd: a.currCd,
      refTranId: a.tranId,
      refInvtId: a.slCd,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0)
    }
   });
	  // for(var i= 0; i< this.passData.tableData.length; i++){
	  // 		if(this.passData.tableData[i].checked){
	  // 			this.selectedTranId.push({ tranId : this.passData.tableData[i].tranId, currCd : this.passData.tableData[i].currCd , 
	  // 									   refTranId :  this.passData.tableData[i].tranId, 
   //                       refInvtId :  this.passData.tableData[i].invtId,
	  // 									   createDate : this.ns.toDateTimeString(0), 
   //  									   createUser : this.ns.getCurrentUser(),
   //  									   updateDate : this.ns.toDateTimeString(0), 
   //  									   updateUser : this.ns.getCurrentUser()    });
	  // 			this.currCode = this.passData.tableData[i].currCd;
	  // 			this.currRt = this.passData.tableData[i].currRate;		
	  // 			this.sumBankCharge = this.sumBankCharge + this.passData.tableData[i].bankCharge;
	  // 			this.sumWhtax = this.sumWhtax + this.passData.tableData[i].whtaxAmt;
	  // 			this.sumInvtIncome = this.sumInvtIncome + this.passData.tableData[i].incomeAmt;
	  // 		}
	  // }

    this.allocateTransaction(1,1,true);

	  // if(this.isEmptyObject(this.selectedTranId)){
	  // 	this.dialogMessage="Please choose transactions to allocate";
   //      this.dialogIcon = "error-message";
   //      this.successDialog.open();
	  // } else {
   //    console.log(this.selectedTranId);
	  // 	currCd = this.selectedTranId[0].currCd;
   //    counter = 0;
	 	// this.selectedTranId.forEach( a => {
	 	// 							if (a.currCd != currCd){
	 	// 								this.dialogMessage="You cannot allocate transactions with different currency.";
			// 					        this.dialogIcon = "error-message";
			// 					        this.successDialog.open();
			// 					        this.allocateTransaction(null,null,false);
	 	// 							} else {
	 	// 								counter = counter + 1;
		 // 								this.allocateTransaction(counter,this.selectedTranId.length,true);
   //                  this.loading = true;
		 // 						    }
	 	// 							});
	  // }
 }

 allocateTransaction(iteration?, limit?, success?){
 	if (success){
 		if (iteration === limit){
 			
		  	this.acitAllocInvtIncReq.delAcitAllocInvtIncome = [];
		    this.acitAllocInvtIncReq.saveAcitAllocInvtIncome = [];
		    this.acitAllocInvtIncReq.saveAcitAllocInvtIncome = this.selectedTranId;
		    this.table.overlayLoader = true;
		    this.boolAllocate = true;
		    var result : boolean;
		    this.createJV();
 		}	
 	} 
 }

/* allocateTransactionFinal(obj?){
 		this.selectedTranTypeCd = [];
	    this.ms.getAcitTranType('JV','','','','','Y').pipe(finalize(() => this.createJV())
	    	).subscribe((data:any) => {	
	    	  for(let rec of data['tranTypeList']){
		  	 		if(rec.tranTypeCd === 54 ||
		  	 		   rec.tranTypeCd === 55 ||
		  	 		   rec.tranTypeCd === 56	){
		  	 			this.selectedTranTypeCd.push({ tranTypeCd : rec.tranTypeCd,
		  	 										   tranTypeName : rec.tranTypeName

		  	 			});
		  	 		}
	  	 	   }
	    });
 }*/

 createJV(){
 	console.log(this.sumInvtIncome + ' ' + this.sumWhtax + ' ' + this.sumBankCharge );
 	this.jvDatasList.saveAcitAllocInvtIncome = this.acitAllocInvtIncReq.saveAcitAllocInvtIncome;
 	this.jvDatasList.saveAcitJvEntryList = [];

   setTimeout(()=>{
        this.prepareData(54,this.refnoTranId,this.currCode,this.currRt,this.sumInvtIncome);
        this.jvDatasList.saveAcitJvEntryList.push(this.jvDatas);
   },500);

   setTimeout(()=>{
        this.prepareData(55,this.refnoTranId,this.currCode,this.currRt,this.sumWhtax);
        this.jvDatasList.saveAcitJvEntryList.push(this.jvDatas);
   },500);

   setTimeout(()=>{
        this.prepareData(56,this.refnoTranId,this.currCode,this.currRt,this.sumBankCharge);
        this.jvDatasList.saveAcitJvEntryList.push(this.jvDatas);
   },500);

 	 this.saveJV(this.jvDatasList);

 }

   saveJV(obj){
    var x;
    setTimeout(()=>{
       this.as.saveAccJVEntryList(obj).pipe(finalize(() => this.resultJVAllocation(this.tranIdOut,this.result, x))
          ).subscribe((data:any) => {
          this.tranIdOut = data['tranIdOut'];
          x = data['tranIdStr'];
        
          if(data['returnCode'] != -1) {
             this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error-message";
            this.dialogMessage = "Unable to allocate transaction. An error occured."
            this.successDialog.open();
            this.result= false;
          }else{
            this.result= true;
          }
      });
   },1000);

  }


  prepareData(jvTranTypeCd?,refnoTranId?,currCd?,currRate?,jvAmt?){
    this.jvDatas = {
    	closeDate : null, 
	    createDate : this.ns.toDateTimeString(0), 
	    createUser : this.ns.getCurrentUser(), 
	    deleteDate : null,  
	    postDate : null,
	    tranClass : 'JV', 
	    tranTypeCd: null,
	    tranClassNo : null,   
	    tranDate :  this.ns.toDateTimeString(this.allocTranDate).split('T')[0], 
	    tranId : null, 
	    tranStat : 'O', 
	    tranYear : null, 
	    updateDate :this.ns.toDateTimeString(0), 
	    updateUser : this.ns.getCurrentUser(), 
	    tranIdJv : null,
	    jvYear : null,
	    jvNo : null,
	    jvDate : this.ns.toDateTimeString(this.allocTranDate).split('T')[0],
	    jvStatus : 'N',
	    jvTranTypeCd : jvTranTypeCd,
	    tranTypeName : null,
	    autoTag : 'Y',
	    refnoTranId : null,
	    refnoDate : null,
	    particulars :'Investment Allocation',
	    currCd : currCd,
	    currRate : currRate,
	    jvAmt : jvAmt.toFixed(2),
	    localAmt : jvAmt * currRate,
	    allocTag : 'Y',
	    allocTranId : null,
      adjEntryTag: 'N',
	    preparedBy : this.ns.getCurrentUser(),
	    preparedDate : this.ns.toDateTimeString(0),
	    approvedBy : null,
	    approvedDate : null,
	    createUserJv : this.ns.getCurrentUser(),
	    createDateJv : this.ns.toDateTimeString(0),
	    updateUserJv : this.ns.getCurrentUser(),
	    updateDateJv : this.ns.toDateTimeString(0),
      remarks: ''
    } 
   
  }

  resultJVAllocation(tranIdout,res,tranIdStr?){

  	if (res){
  		// this.as.getJVAllocInvtIncListing(tranIdout).pipe(finalize(() => this.successMdl.openNoClose()))
  		// 	.subscribe(( data:any) => {
  		// 	this.passDataJv.tableData = [];
		  // 		for(let rec of data.allInvtIncomeList){
				//   	 		this.passDataJv.tableData.push( {
				//   	 										  jvNo: rec.jvYear + '-' + rec.jvNo.padStart(6, '0'),
				// 						                      type: rec.tranTypeName,
				// 						                      jvDate: this.ns.toDateTimeString(rec.jvDate).split('T')[0],
				// 						                      amount: rec.jvAmt
				//   	 										});
			 //  	}
			 //  	this.jvTable.refreshTable();
			 //  	this.boolAllocate = false;
			 //  	this.onClickSearch();
  		// });
      var obs = tranIdStr.split(',').filter(a => a !== "").map(a => {return this.as.getJVEntry(a); });

      var $sub = forkJoin(obs);
                 // .pipe(map(([arInvt,jvInvt]) => { return { arInvt, jvInvt }; }));
      $sub.subscribe(data => {
        this.passDataJv.tableData = [];
        data.forEach(jv => {
          var rec = jv['transactions']['jvListings'];
          this.passDataJv.tableData.push({
            jvNo: rec.jvYear + '-' + rec.jvNo,
            type: rec.tranTypeName,
            jvDate: this.ns.toDateTimeString(rec.jvDate).split('T')[0],
            amount: rec.jvAmt
          });
        });

        this.jvTable.refreshTable();
        this.boolAllocate = false;
        this.successMdl.openNoClose();
      });
  	}else {
  		this.boolAllocate = false;
  	}
  	this.loading = false;
    // $('.ng-dirty').removeClass('ng-dirty');
    this.table.markAsPristine();
  }

  showCurrencyModal(){
    this.currLov.modal.openNoClose();
  }

  setCurrency(data){
    this.currCd = data.currencyCd;
    this.currency = data.description;
    this.ns.lovLoader(data.ev, 0);
  }

  checkCode(ev) {
    this.ns.lovLoader(ev, 1);
    this.currLov.checkCode(this.currCd, ev);
  }

}
