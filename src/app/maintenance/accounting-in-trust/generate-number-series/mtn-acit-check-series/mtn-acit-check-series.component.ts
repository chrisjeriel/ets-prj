import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { NgForm } from '@angular/forms';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-acit-check-series',
  templateUrl: './mtn-acit-check-series.component.html',
  styleUrls: ['./mtn-acit-check-series.component.css']
})
export class MtnAcitCheckSeriesComponent implements OnInit {
	@ViewChild('checkNoTbl') checkNoTbl			: CustEditableNonDatatableComponent;
	@ViewChild('lov') lov       				: LovComponent;
  	@ViewChild('myForm') form                   : NgForm;
  	@ViewChild(SucessDialogComponent) success   : SucessDialogComponent;
 	@ViewChild(ConfirmSaveComponent) cs         : ConfirmSaveComponent;
  	@ViewChild('warnMdl') warnMdl               : ModalComponent;

	passDataCheckNoList: any = {
	    tableData       : [],
	    tHeader         : ['Check No','Tran ID','Used Tag','Status','Created By','Date Created','Last Update By','Last Update'],
	    dataTypes       : ['number','number','checkbox','text','text','date','text','date'],
	    nData : {
	    	checkNo 	: '',
	    	tranId 		: '',
	    	usedTag 	: '',
	    	checkStatus : '',
	    	createUser  : '',
	    	createDate  : '',
	    	updateUser  : '',
	    	updateDate  : ''
	    },
	    uneditable    : [true,true,true,true,true,true,true,true],
	    infoFlag      : true,
	    paginateFlag  : true,
	    searchFlag	  : true,
	    pageLength    : 15,
	    widths        : [1,80,1,100,1,1,1,1],
	    pageID        : 'passDataCheckNoList',
	    keys          : ['checkNo','tranId','usedTag','checkStatusDesc','createUser','createDate','updateUser','updateDate']
  	};

  	passDataLov  : any = {
	    selector     : '',
	    payeeClassCd : ''
	};

	otherData : any = {
		bank  			: '',
		bankDesc		: '',
		bankAcct 		: '',
		bankAcctDesc 	: '',
		from			: '',
		to				: ''
	};

	dialogMessage        : string = '';
    dialogIcon           : string = '';
    warnMsg              : string = '';


	constructor(private titleService: Title,private mtnService : MaintenanceService, private ns : NotesService) {}
	
	ngOnInit() {
		this.titleService.setTitle('Mtn | Check Number');
  	}

  	getMtnAcitCheckSeries(bank?,bankAcct?,from?,to?){
  		from 	 = from == ''?undefined:from;
  		to 		 = to == ''?undefined:to;
  		bank 	 = this.otherData.bankDesc == '' ? '': bank;
  		bankAcct = this.otherData.bankAcctDesc == ''?'':bankAcct;

  		this.checkNoTbl.overlayLoader = true;
  		this.mtnService.getMtnAcitCheckSeries(bank,bankAcct)
  		.subscribe(data => {
  			console.log(data);
  			var rec = data['checkSeriesList'];
  			this.passDataCheckNoList.tableData = rec.sort((a,b) => a.checkNo - b.checkNo).slice(from-1,to);
  			this.checkNoTbl.refreshTable();
  		});
  	}

  	onClickSearch(){
  		$('.warn').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
  		this.getMtnAcitCheckSeries(this.otherData.bank,this.otherData.bankAcct,this.otherData.from,this.otherData.to);
  	}

  	onClickGenerate(){
  		if(this.otherData.bank == '' || this.otherData.bank == null || this.otherData.bankAcct == '' || this.otherData.bankAcct == null ||
  			this.otherData.from == '' || this.otherData.from == null || this.otherData.to == '' || this.otherData.to == null){
  			this.dialogIcon = 'error';
	        this.success.open();	
	        $('.warn').focus().blur();
  		}else{
  			if(this.otherData.from > this.otherData.to){
  				this.warnMsg = 'Check Number From should not be greater than Check Number to';
  				this.warnMdl.openNoClose();
  			}else{
  				this.cs.confirmModal();
  			}
	    }
  	}

  	onSave(){
  		var save = {
		 	bank			: this.otherData.bank,
			bankAcct		: this.otherData.bankAcct,
			checkNoFrom		: this.otherData.from,
			checkNoTo		: this.otherData.to,
			user			: this.ns.getCurrentUser()
		};

  		this.mtnService.generateMtnAcitCheckSeries(JSON.stringify(save))
  		.subscribe(data => {
  			console.log(data);
  			if(data['returnCode'] == -1){
  				this.dialogIcon = '';
	            this.dialogMessage = '';
	          	this.success.open();
	          	this.getMtnAcitCheckSeries(this.otherData.bank,this.otherData.bankAcct);
	          	this.otherData.from = '';
	          	this.otherData.to = '';
	          	this.checkNoTbl.markAsPristine();
	          	this.form.control.markAsPristine();
  			}else if(data['returnCode'] == 0){
  				this.warnMsg = 'Existing number series was already created for\nthe specified transaction numbers '+ this.otherData.from + ' to ' + this.otherData.to + '.\nPlease adjust your From-To range values.';
  				this.warnMdl.openNoClose();
  			}
  		})
  	}

  	showLov(fromUser){
	  	if(fromUser.toLowerCase() == 'bank'){
	      this.passDataLov.selector = 'bankLov';
	      this.passDataLov.glDepFor = 'acit';
	    }else if(fromUser.toLowerCase() == 'bank-acct'){
	      this.passDataLov.selector = 'bankAcct';
	      this.passDataLov.bankCd = this.otherData.bank;
	      this.passDataLov.from = 'acit';
	    }
	    this.lov.openLOV();
  	}

  	setData(data){
	  	setTimeout(() => {
	      //this.removeRedBackShad(from);
	      this.ns.lovLoader(data.ev, 0);
	      this.form.control.markAsDirty();
	    },0);

	    if(data.selector == 'bankLov'){
	    	this.otherData.bankDesc   = data.data.officialName;
	        this.otherData.bank = data.data.bankCd;
	        this.otherData.bankAcctDesc = '';
	        this.otherData.bankAcct = '';
	    }else if(data.selector == 'bankAcct'){
	    	this.otherData.bankAcctDesc   = data.data.accountNo;
      		this.otherData.bankAcct = data.data.bankAcctCd;
	    }
  	}

  	reset(){
  		(this.otherData.bankAcctDesc == '')?(this.otherData.from='',this.otherData.to=''):'';
  	}

}
