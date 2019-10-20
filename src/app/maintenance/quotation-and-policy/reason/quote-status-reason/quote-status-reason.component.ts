import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-quote-status-reason',
  templateUrl: './quote-status-reason.component.html',
  styleUrls: ['./quote-status-reason.component.css']
})
export class QuoteStatusReasonComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any = {
  	createUser : '',
  	createDate : '',
  	updateUser : '',
  	updateDate : '',
  }
  passTable:any={
  	tableData:[],
  	widths:[1,'auto',1,'auto'],
  	tHeader:['Reason Code','Description','Active','Remarks'],
  	dataTypes:['text','text','checkbox','text'],
  	keys:['reasonCd','description','activeTag','remarks'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 10,
  	nData:{
  	  reasonCd:'',
  	  description:'',
      activeTag: "Y",
      remarks: '',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	}
  }
  cancelFlag:boolean;

  constructor(private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
  	this.getQuoteStatusReasons();
  }

  getQuoteStatusReasons(){
  	this.ms.getMtnQuoteReason({}).subscribe(a=>{
  		this.passTable.tableData = a['reasonList'];
  		this.passTable.tableData.forEach(a=>{
  			a.uneditable=['reasonCd'];
  			a.createDate = this.ns.toDateTimeString(a.createDate);
  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
  		})
  		this.table.refreshTable();
  	})
  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'You are not allowed to delete a Reason Code that is already used in Change Quote Status Screen.';
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
  		saveQuReason:[],
  		delQuReason:[]
  	}
  	params.saveQuReason = this.passTable.tableData.filter(a=>a.edited && !a.deleted);
  	params.saveQuReason.forEach(a=>a.updateUser = this.ns.getCurrentUser());
  	params.delQuReason = this.passTable.tableData.filter(a=>a.deleted);
  	this.ms.saveMtnQuoteReason(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.table.markAsPristine();
            this.getQuoteStatusReasons();
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	});
  }

  onClickSave(){
  	let reasonCds:string[] = this.passTable.tableData.map(a=>a.reasonCd);
  	if(reasonCds.some((a,i)=>reasonCds.indexOf(a)!=i)){
  		this.dialogMessage = 'Unable to save the record. Reason Code must be unique.';
  		this.dialogIcon = 'error-message';
  		this.successDialog.open();
  		return;
  	}
  	this.conSave.confirmModal();
  }

  onClickCancel(){
  	this.cnclBtn.clickCancel();
  }


}
