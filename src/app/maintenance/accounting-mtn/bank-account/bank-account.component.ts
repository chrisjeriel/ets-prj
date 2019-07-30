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
@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(MtnBankComponent) bankLov: MtnBankComponent;
  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;
  passTable:any={
  	tableData:[],
  	widths:[1,200,'auto','auto',1],
  	tHeader:['Code','Account No.','Account Name','Status','Curr','Bank Branch','Account Type','Opening Date','Closing Date','Dep Level (In-Trust)','Dep Level (Service)'],
  	dataTypes:['number','text','text-editor','select','text','text-editor','select','date','date','number','number'],
  	tooltip:[],
  	uneditable:[true,false,false,false,false],
  	keys:['bankAcctCd','accountNo','accountName','acctStatus','currCd','bankBranch','acctType','openDate','closeDate','acItGlDepNo','acSeGlDepNo'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 10,
  	nData:{
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
        		selector: 'acctType',
	            prev: [],
	            vals: [],
        	}],
  }
  cancelFlag:boolean;

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
	  		})
	  		this.table.refreshTable();
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
  	});
  	params.delList = this.passTable.tableData.filter(a=>a.deleted);
  	this.ms.saveMtnBankAcct(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.getBankAcct();
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	});
  }

  onClickSave(){
  	this.conSave.confirmModal();
  }

  onClickCancel(){
  	this.cnclBtn.clickCancel();
  }

  onTableClick(data){
    this.info = data;
    this.passTable.disableGeneric = data == null;
  }

  setSelectedBank(data){
  	this.bank = data;
    this.ns.lovLoader(data.ev, 0);
    this.getBankAcct();
  }

  checkCode(ev){
        this.ns.lovLoader(ev, 1);
        this.bankLov.checkCode(this.bank.bankCd,ev);
  }


}
