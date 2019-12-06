import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { AccCVPayReqList } from '@app/_models';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal,NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cancel-ar-cv-jv',
  templateUrl: './cancel-ar-cv-jv.component.html',
  styleUrls: ['./cancel-ar-cv-jv.component.css']
})
export class CancelArCvJvComponent implements OnInit {
	@ViewChild('cancelTranTbl') cancelTranTbl : CustNonDatatableComponent;
	@ViewChild('can') can                 : CancelButtonComponent;
	@ViewChild('con') con                 : ConfirmSaveComponent;
	@ViewChild('suc') suc                 : SucessDialogComponent;
	@ViewChild('mdl') mdl         	      : ModalComponent;

	@Input() tranClass : string = '';
	passDataCancelTrans: any = {
		// tableData    : [],
		// tHeader      : [],
		// dataTypes    : [],
		// keys         : [],
		// colSize      : [],
		// filters      : [],
		pageLength   : 10,
		pageStatus   : true,
		pagination   : true,
		pageID       : 'ctTbl'
	};
  
	otherData: any = {
		createUser : '',
		createDate : '',
		updateUser : '',
		updateDate : '',
	};

	params : any = { 
    	updateAcitStatusList : []
    };

	dialogIcon 		: string = '';
    dialogMessage 	: string = '';
    reason			: string = '';
    msg				: string = '';
    mdlType			: any;

    searchParams: any[] = [];

    

	constructor( private acctService: AccountingService, private ns : NotesService, private titleService : Title ,private router: Router) { }

	ngOnInit() {
		this.titleService.setTitle('Acct-IT | Cancel Transactions');
		this.getAcitList();
	}

	getAcitList(){
		this.getTblOtherInfo();
		if(this.tranClass == 'ar'){
			this.acctService.getArList(this.searchParams)
			.subscribe(data => {
			  console.log(data);
			  this.passDataCancelTrans.tableData = data['ar'].filter(e => e.arStatus != 'X').map(e => { 
			  	e.createDate = this.ns.toDateTimeString(e.createDate);
			  	e.updateDate = this.ns.toDateTimeString(e.updateDate);
			  	return e;
			  });
			  this.cancelTranTbl.refreshTable();
			}); 
		}else if(this.tranClass == 'cv'){
			this.acctService.getAcitCvList(this.searchParams)
			.subscribe(data => {
				console.log(data);
				this.passDataCancelTrans.tableData = data['acitCvList'].filter(e => e.cvStatus != 'X').map(e => { 
				  	e.createDate = this.ns.toDateTimeString(e.createDate);
				  	e.updateDate = this.ns.toDateTimeString(e.updateDate);
				  	return e;
			  	});
				this.cancelTranTbl.refreshTable();
			});
		}else if(this.tranClass == 'jv'){
			this.acctService.getJVListing('')
			.subscribe(data => {
				console.log(data);
				this.passDataCancelTrans.tableData = data['transactions'].filter(e => e.jvListings.jvStatus != 'X').map(e => {
					e.jvListings.createDate = this.ns.toDateTimeString(e.createDate);
				  	e.jvListings.updateDate = this.ns.toDateTimeString(e.updateDate);
				  	return e.jvListings;
				});
				this.cancelTranTbl.refreshTable();
			});
		}
	}

	getTblOtherInfo(){
		//this.cancelTranTbl.overlayLoader = true;
		if(this.tranClass == 'ar'){
			this.passDataCancelTrans.tHeader    = ['AR No','Payor','AR Date','Status','Payment Type','Particulars','Amount'];
			this.passDataCancelTrans.dataTypes  = ['sequence-6','text','date','text','text','text','currency'];
			this.passDataCancelTrans.keys       = ['arNo', 'payor', 'arDate', 'arStatDesc','tranTypeName', 'particulars', 'arAmt'];
			this.passDataCancelTrans.colSize    = ['30px', '200px', '40px', '60px', '150px', '200px', '125px'];
			this.passDataCancelTrans.checkFlag  = true;
			this.passDataCancelTrans.filters    = [
				{key   : 'arNo',title: 'AR No',dataType: 'text'},
				{key   : 'payor',title: 'Payor',dataType: 'text'},
				{keys  : {from: 'arDateFrom',to: 'arDateTo'},title: 'AR Date',dataType: 'datespan'},
				{key   : 'arStatus',title: 'Status',dataType: 'text'},
				{key   : 'tranTypeName',title: 'Payment Type',dataType: 'text'},
				{key   : 'particulars',title: 'Particulars',dataType: 'text'},
				{keys  : {from: 'arAmtFrom',to: 'arAmtTo'},title: 'Amount',dataType: 'textspan'}
			];
		}else if(this.tranClass == 'cv'){
			this.passDataCancelTrans.tHeader    = ['CV No', 'Payee', 'CV Date', 'Status','Particulars','Amount'];
			this.passDataCancelTrans.dataTypes  = ['text','text','date','text','text','currency'];
			this.passDataCancelTrans.keys       = ['cvGenNo','payee','cvDate','cvStatusDesc','particulars','cvAmt'];
			this.passDataCancelTrans.colSize    = ['50px', '160px', '40px', '100px', '200px', '125px'];
			this.passDataCancelTrans.checkFlag  = true;
			this.passDataCancelTrans.filters    = [
				{key   : 'cvGenNo',title: 'CV No',dataType: 'text'},
				{key   : 'payee',title: 'Payee',dataType: 'text'},
				{keys  : {from: 'cvDateFrom',to: 'cvDateTo'},title: 'CV Date',dataType: 'datespan'},
				{key   : 'cvStatusDesc',title: 'Status',dataType: 'text'},
				{key   : 'particulars',title: 'Particulars',dataType: 'text'},
				{keys  : {from: 'cvAmtFrom',to: 'cvAmtTo'},title: 'Amount',dataType: 'textspan'}
			];
		}else if(this.tranClass == 'jv'){
			this.passDataCancelTrans.tHeader      = ['JV No', 'JV Date','Status','Particulars','JV Type', 'JV Ref. No.', 'Prepared By','Amount'];
			this.passDataCancelTrans.dataTypes    = ['text','date','text','text','text','text','text','currency'];
			this.passDataCancelTrans.keys         = ['jvNo','jvDate','jvStatusName','particulars','tranTypeName','refNo','preparedName','jvAmt'];
			this.passDataCancelTrans.colSize      = ['120px','98px','100px','200px','160px','110px','118px','115px'];
			this.passDataCancelTrans.checkFlag    = true;
			this.passDataCancelTrans.filters      = [
				{key  : 'jvNo',title: 'J.V. No.',dataType: 'text'},
				{keys : {from: 'jvDateFrom',to: 'jvDateTo'},title: 'AR Date',dataType: 'datespan'},
				{key  : 'jvStatusName',title: 'Status',dataType: 'text'},
				{key  : 'particulars',title: 'Particulars',dataType: 'text'},
				{key  : 'jvType',title: 'J.V Type',dataType: 'text'},
				{key  : 'jvRefNo',title: 'J.V Ref No',dataType: 'text'},
				{key  : 'preparedBy',title: 'Prepared By',dataType: 'text'},
				{keys  : {from: 'jvAmtFrom',to: 'jvAmtTo'},title: 'Amount',dataType: 'textspan'}
			];
		}
	}

	onClickCancel(){
		this.dialogIcon 	= '';
    	this.dialogMessage  = '';
    	this.params.updateAcitStatusList = [];

    	this.passDataCancelTrans.tableData.forEach(e => {
    		if(e.checked){
    			this.params.updateAcitStatusList.push({
    				status		 : 'X',
			        tranClass	 : this.tranClass,
			        tranId		 : e.tranId,
			      	updateUser	 : this.ns.getCurrentUser(),
			      	cancelReason : this.reason
    			});
    		}
    	});

    	console.log(this.passDataCancelTrans.tableData);
    	console.log(this.params.updateAcitStatusList);
    	if(this.params.updateAcitStatusList.length == 0){
    		this.mdlType = 1;
    		this.msg = 'Please select transaction/s to cancel';
    	}else if(this.reason.trim() == '' || this.reason == null){
    		this.mdlType = 1;
    		this.msg = 'Unable to cancel the selected transaction/s.\n Please provide Reason for Cancellation.';
    	}else{
    		this.mdlType = 2;
    		this.msg = 'Are you sure you want to cancel the selected transaction/s ?';
    	}
    	this.mdl.openNoClose();
	}

	onClickYes(){
		this.loadingFunc(true);
		this.acctService.updateAcitStatus(this.params)
		.subscribe(data => {
			console.log(data);
			this.loadingFunc(false);
			if(data['returnCode'] == -1){
				this.suc.open();
				this.params.updateAcitStatusList = [];
				this.reason = '';
				this.otherData = {
					createUser : '',
					createDate : '',
					updateUser : '',
					updateDate : ''
				};
				this.getAcitList();
			}else{
				this.mdlType = 1;
				this.msg = '';
				this.msg = 'Cancellation process failed. Transactions below might already have accounting entry dates.\n' +
				            data['invalidTranNos'].filter(e => e!=null).map((e,i) => {
				            	i+=1;
				            	return (i%4 == 0)?e+'\n':(data['invalidTranNos'].filter(e => e != null).length == i)?e:e + ',  ';
				            }).join('');
				this.mdl.openNoClose();
			}
		});
	}

	onRowClick(event){
		console.log(event);
		this.otherData = event[event.length-1];
	}

	loadingFunc(bool){
		var str = bool?'block':'none';
	    $('.globalLoading').css('display',str);
	}

	searchQuery(searchParams){
		if(this.tranClass == 'ar'){
			if(searchParams.some(e => e.key == 'arStatus' && e.search == 'NEW')){
				searchParams.filter(el => el.key == 'arStatus').map(el => { el.search = 'OPEN';return el;});
			}else if(searchParams.some(e => e.key == 'arStatus' && e.search == 'PRINTED')){
				searchParams.filter(el => el.key == 'arStatus').map(el => { el.search = 'CLOSED';return el;});
			}
		}
	    this.searchParams = searchParams;
	    this.passDataCancelTrans.tableData = [];
	    console.log(this.searchParams);
	    this.getAcitList();
  	}
}
