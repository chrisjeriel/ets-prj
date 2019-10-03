import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnBankComponent } from '@app/maintenance/mtn-bank/mtn-bank.component'

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})

export class BankAccountComponent implements OnInit {
@ViewChild('bankaccttable') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(MtnBankComponent) bankLov: MtnBankComponent;
  @ViewChild('myForm') form:any;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;
  passTable:any={
  	tableData:[],
  	widths:[1,130,220,80,70,220,130,1,1,1,1,1],
  	tHeader:['Code','Account No.','Account Name','Status','Curr','Bank Branch','Account Type','Opening Date','Closing Date','GL Dep No (In trust)','GL Dep No (Service)','DCB Tag'],
  	dataTypes:['number','text','text-editor','select','select','text-editor','select','date','date','number','number','checkbox'],
  	tooltip:[],
  	uneditable:[true,false,false,false,false,false,false,false,false,false,false,false],
  	keys:['bankAcctCd','accountNo','accountName','acctStatus','currCd','bankBranch','accountType','openDate','closeDate','acItGlDepNo','acSeGlDepNo','dcbTag'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 10,
  	nData:{
      bankAcctCd: null,
      accountNo : null,
      accountName : null,
      acctStatus : null,
      currCd : null,
      bankBranch : null,
      accountType : null,
      openDate : null,
      closeDate : null,
      acItGlDepNo : null,
      acSeGlDepNo : null,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true,
    disableAdd:true,
    opts: [{
	            selector: 'acctStatus',
	            prev: [],
	            vals: [],
        	},
        	{
        		selector: 'accountType',
	            prev: [],
	            vals: [],
        	},
          {
            selector: 'currCd',
              prev: [],
              vals: [],
          }],

  }
  cancelFlag:boolean;
  glItDepNoPHP = [];
  glItDepNoUSD = [];
  glSrvDepNoPHP = [];
  glSrvDepNoUSD = [];

  bank:any = {};

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle('Mtn | Bank');
    setTimeout(a=>this.table.refreshTable(),0);
    this.ms.getRefCode('MTN_BANK_ACCT.ACCT_STATUS').subscribe(a=>{
    	this.passTable.opts[0].prev = a['refCodeList'].map(a=>a.description);
    	this.passTable.opts[0].vals = a['refCodeList'].map(a=>a.code);
    })

    this.ms.getRefCode('MTN_BANK_ACCT.ACCOUNT_TYPE').subscribe(a=>{
    	this.passTable.opts[1].prev = a['refCodeList'].map(a=>a.description);
    	this.passTable.opts[1].vals = a['refCodeList'].map(a=>a.code);
    })

    this.ms.getMtnCurrency('','Y').subscribe(a=>{
      this.passTable.opts[2].prev = a['currency'].map(a=>a.currencyCd);
      this.passTable.opts[2].vals = a['currency'].map(a=>a.currencyCd);
    })
  }

  getBankAcct(){
    this.passTable.disableGeneric = true;
    if(this.bank.bankCd==''){
    	this.passTable.distableGeneric = true;
    	this.passTable.disableAdd = true;
    }else{
	  	this.ms.getMtnBankAcct(this.bank.bankCd).subscribe(a=>{
	  		this.passTable.tableData = a['bankAcctList'];
	  		this.passTable.tableData.forEach(a=>{
	  			a.createDate = this.ns.toDateTimeString(a.createDate);
	  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
	  			a.openDate = this.ns.toDateTimeString(a.openDate);
	  			a.closeDate = this.ns.toDateTimeString(a.closeDate);

          if (a.okDelete === 'N'){
            a.uneditable = ['accountNo','accountName','currCd'];
          }

	  		})
	  		this.table.refreshTable();
        this.table.overlayLoader = false;
	  		this.passTable.distableGeneric = false;
    		this.passTable.disableAdd = false;
	  	})
	  }
  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'Deleting this record is not allowed. This was already used in some accounting records.';
  		this.successDialog.open();
  	}else{
  		this.table.indvSelect.deleted = true;
  		this.table.selected  = [this.table.indvSelect]
  		this.table.confirmDelete();
  	}
  }

  save(can?){
  	this.cancelFlag = can !== undefined;
  	let params: any = {
  		saveList:[],
  		delList:[]
  	}
  	params.saveList = this.passTable.tableData.filter(a=>a.edited && !a.deleted);
  	params.saveList.forEach(a=>{
  		a.updateUser = this.ns.getCurrentUser();
  		a.updateDate = this.ns.toDateTimeString(0)
      a.bankCd = this.bank.bankCd;
      a.acitGlDepNo = a.acItGlDepNo;
      a.acseGlDepNo = a.acSeGlDepNo;
  	});
  	params.delList = this.passTable.tableData.  filter(a=>a.deleted);
    console.log(params);
  	this.ms.saveMtnBankAcct(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.form.control.markAsPristine();
            this.dialogIcon = "success";
            this.successDialog.open();
            this.getBankAcct();
            $('.ng-dirty').removeClass('ng-dirty');
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	});
  }

  onClickSave(){
   if(this.checkFields()){
     if(this.glItDepNoPHP.slice().sort().some((item,index,ar)=>(item === ar[index+1]))  ||
        this.glItDepNoUSD.slice().sort().some((item,index,ar)=>(item === ar[index+1]))  ||
        this.glSrvDepNoPHP.slice().sort().some((item,index,ar)=>(item === ar[index+1])) ||
        this.glSrvDepNoUSD.slice().sort().some((item,index,ar)=>(item === ar[index+1]))){
        this.dialogMessage = 'Unable to save the record. GL Dep No must be unique in every currency code.';
        this.dialogIcon = 'error-message';
        this.successDialog.open();
     } else {
       this.conSave.confirmModal();
     }
   }else{
        this.dialogMessage="Please check field values.";
        this.dialogIcon = "error";
        this.successDialog.open();
        this.tblHighlightReq('#mtn-bankaccttable',this.passTable.dataTypes,[1,2,4,6]);
   }
  	
  }

  onClickCancel(){
  	this.cnclBtn.clickCancel();
  }

  onTableClick(data){
    console.log(data);
    this.info = data;
    this.passTable.disableGeneric = data == null;
  }

  setSelectedBank(data){
  	this.bank = data;
    this.ns.lovLoader(data.ev, 0);
    this.getBankAcct();
    this.table.overlayLoader = false;
  }

  checkCode(ev){
    $('.ng-dirty').removeClass('ng-dirty');
    this.passTable.tableData = [];
    this.table.refreshTable();
    this.ns.lovLoader(ev, 1);
    this.table.overlayLoader = true;
    this.bankLov.checkCode(this.bank.bankCd,ev);
  }

   checkFields(){
      this.glItDepNoPHP = [];
      this.glItDepNoUSD = [];
      this.glSrvDepNoPHP = [];
      this.glSrvDepNoUSD = [];
      for(let check of this.passTable.tableData){
         if( check.accountNo === null || check.accountNo === '' ||
             this.isEmptyObject(check.accountName) ||
             check.acctStatus === null || check.acctStatus === '' ||
             check.currCd === null || check.currCd === '' ||
             check.accountType === null || check.accountType === ''
          ) {   
            return false;
          }

          if (check.currCd === 'PHP'){
            if (check.acItGlDepNo != null){
              this.glItDepNoPHP.push(parseInt(check.acItGlDepNo));
            }
            if (check.acSeGlDepNo != null){
              this.glSrvDepNoPHP.push(parseInt(check.acSeGlDepNo));
            }
          } else if ( check.currCd === 'USD'){
            if (check.acItGlDepNo != null){
              this.glItDepNoUSD.push(parseInt(check.acItGlDepNo));
            } 
            if (check.acSeGlDepNo != null){
              this.glSrvDepNoUSD.push(parseInt(check.acSeGlDepNo));
            }
           
          } 

      }
       return true;
   }

    isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

  tblHighlightReq(el, dataTypes, reqInd) {
    setTimeout(() => {
      $(el).find('tbody').children().each(function() {
        $(this).children().each(function(i) {
          if(reqInd.includes(i)) {
            var val;
            if(dataTypes[i] == 'text' || dataTypes[i] == 'date' || dataTypes[i] == 'time') {
              val = $(this).find('input').val();
              highlight($(this), val);
            } else if(dataTypes[i] == 'select') {
              val = $(this).find('select').val();    
              highlight($(this), val);
            }else if(dataTypes[i] == 'text-editor') {
              console.log($(this));
              //console.log($(this).find('.align-middle.ng-star-inserted').length);
             if($(this).find('.align-middle.ng-star-inserted').length === 1){
              val = $(this).find('text-editor').text();
              highlight($(this), val);
             }
            } else if(dataTypes[i] == 'number' || dataTypes[i] == 'currency') {
              val = isNaN(Number($(this).find('input').val())) ? null : $(this).find('input').val();
            }
          }
        });
      });

      function highlight(td, val) {
        td.css('background', typeof val == 'undefined' ? 'transparent' : val == '' || val == null ? '#fffacd85' : 'transparent');
      }
    }, 0);
  }



}
