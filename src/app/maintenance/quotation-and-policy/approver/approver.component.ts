import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-approver',
  templateUrl: './approver.component.html',
  styleUrls: ['./approver.component.css']
})
export class ApproverComponent implements OnInit {
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
  	widths:[150,'auto',1,1,'auto','auto'],
  	tHeader:['User ID','User Name','User Group','Description','Email','Remarks'],
  	uneditable:[false,true,true,true,true,false],
  	dataTypes:['text','text','sequence-3','text','text','text'],
  	keys:['userId','userName','userGrp','userGrpDesc','emailAddress','remarks'],
  	addFlag: true,
  	deleteFlag:true,
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 10,
  	nData:{
  	  userId:'',
  	  userName:'',
      userGrp: "",
      userGrpDesc: '',
      emailAddress:'',
      remarks:'',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	}
  }
  cancelFlag:boolean;

  constructor(private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
  	this.getApprover();
  }

  getApprover(){
  	this.ms.getMtnApprover().subscribe(a=>{
  		this.passTable.tableData = a['approverList'];
  		this.passTable.tableData.forEach(a=>{
  			a.createDate = this.ns.toDateTimeString(a.createDate);
  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
  		})
  		this.table.refreshTable();
  	})
  }

  save(can?){
  	this.cancelFlag = can !== undefined;
  	let params: any = {
  		saveList:[],
  		delList:[]
  	}
  	params.saveList = this.passTable.tableData.filter(a=>a.edited && !a.deleted);
  	params.saveList.forEach(a=>a.updateUser = this.ns.getCurrentUser());
  	params.delList = this.passTable.tableData.filter(a=>a.deleted);
  	this.ms.saveMtnApprover(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.getApprover();
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


}
