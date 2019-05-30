import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-approver',
  templateUrl: './approver.component.html',
  styleUrls: ['./approver.component.css']
})
export class ApproverComponent implements OnInit {
  @ViewChild('table') table: CustEditableNonDatatableComponent;
  @ViewChild('apprFn') apprFnTable: CustEditableNonDatatableComponent;
  @ViewChild('conSave') conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild(MtnUsersComponent) usersLov:MtnUsersComponent;
  @ViewChild(LovComponent) lov:LovComponent;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any = null;
  passTable:any={
  	tableData:[],
  	widths:[150,'auto',1,1,'auto','auto'],
  	tHeader:['User ID','User Name','User Group','Description','Email','Remarks'],
  	uneditable:[false,true,true,true,true,false],
  	dataTypes:['lovInput','text','sequence-3','text','text','text'],
  	keys:['userId','userName','userGrp','userGrpDesc','emailAddress','remarks'],
  	addFlag: true,
  	genericBtn:'Delete',
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
      showMG: 1
  	},
  	pageID: '1',
  	magnifyingGlass:['userId'],
  }

  passTablFn:any={
  	tableData:[],
  	widths:[1,300],
  	tHeader:['Approval Fn Code','Description'],
  	uneditable:[false,true],
  	dataTypes:['lovInput','text',],
  	keys:['approvalCd','description'],
  	addFlag: true,
  	deleteFlag: true,
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 5,
  	nData:{
  	  approvalCd: '',
  	  description: '',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      showMG: 1
  	},
  	pageID: '2',
  	magnifyingGlass:['approvalCd'],
  	checkFlag: true
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
  			a.uneditable = ['userId']
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
            this.table.markAsPristine();
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

  delete(){
  	this.table.selected = [this.table.indvSelect];
  	this.table.confirmDelete();
  }

  openUsersModal(data){
  	this.hideUser = this.passTable.tableData.map(a=>a.userId);
  	this.usersLov.modal.openNoClose();
  }

  setUser(users){
  	if(users.userId == ''){
  		this.ns.lovLoader(users.ev,0);
  		this.passTable.tableData.forEach(a=>a.userId = a.showMG == 1 ? '':a.userId);
  		return;
  	}
  	users = Array.isArray(users) ? users : [users];
  	this.passTable.tableData = this.passTable.tableData.filter(a=>a.showMG != 1);
  	for(let user of users){
  		this.passTable.tableData.push({
  		  userId: user.userId,
	  	  userName: user.userName,
	      userGrp: user.userGrp,
	      userGrpDesc: user.userGrpDesc,
	      emailAddress: user.emailAddress,
	      remarks:'',
	      createUser: this.ns.getCurrentUser(),
	      createDate: this.ns.toDateTimeString(0),
	      updateUser: this.ns.getCurrentUser(),
	      updateDate: this.ns.toDateTimeString(0),
	      edited: true,
	      add: true,
	      uneditable: ['userId']
  		});
  	}
  	this.table.markAsDirty();
  	this.table.refreshTable();
  }
  hideUser: string[] = [];
  checkUserCode(data){
  	if(data.hasOwnProperty('lovInput')) {
      this.hideUser = this.passTable.tableData.map(a=> {
      	if(a.showMG != 1)
	      	return a.userId
	  });
      data.ev['index'] = data.index;
      this.usersLov.checkCode(data.ev.target.value, data.ev);
    }
  }

// approval function
  passLOV:any = {
  	selector:'approvalFn',

  }
  @ViewChild('conSaveFn') conSaveFn: ConfirmSaveComponent;
  openApprovalFn(){
  	this.apprFnTable.loadingFlag = true;
  	this.ms.getMtnApproverFn(this.table.indvSelect.userId).subscribe(a=>{
  		this.passTablFn.tableData = a['approverFnList']
  		this.passTablFn.tableData.forEach(a=>a.uneditable=['approvalCd'])
  		this.apprFnTable.refreshTable();
  	})
  	this.modal.openNoClose();
  }

  openApprovalModal($event){
  	this.passLOV.hide = this.passTablFn.tableData.map(a=>a.approvalCd)
  	this.lov.openLOV();
  }

  setApprovalCd(data){
  	console.log(data);
  	if(data.data == null){
  		this.ns.lovLoader(data.ev,0);
  		this.passTablFn.tableData.forEach(a=>a.approvalCd = a.showMG == 1 ? '':a.approvalCd);
  		return;
  	}
  	data.data = Array.isArray(data.data) ? data.data : [data.data];
  	this.passTablFn.tableData = this.passTablFn.tableData.filter(a=>a.showMG != 1);
  	for(let d of data.data){
  		this.passTablFn.tableData.push({
  		  approvalCd: d.approvalCd,
  		  description: d.description,
	      createUser: this.ns.getCurrentUser(),
	      createDate: this.ns.toDateTimeString(0),
	      updateUser: this.ns.getCurrentUser(),
	      updateDate: this.ns.toDateTimeString(0),
	      edited: true,
	      add: true,
	      uneditable: ['approvalCd']
  		});
  	}
  	this.apprFnTable.markAsDirty();
  	this.apprFnTable.refreshTable();
  }

  saveFn(){
  	let params: any = {
  		userId: this.table.indvSelect.userId,
  		saveList:[],
  		delList:[]
  	}
  	params.saveList = this.passTablFn.tableData.filter(a=>a.edited && !a.deleted);
  	params.saveList.forEach(a=>a.updateUser = this.ns.getCurrentUser());
  	params.delList = this.passTablFn.tableData.filter(a=>a.deleted);
  	this.ms.saveMtnApproverFn(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.apprFnTable.markAsPristine();
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	});
  }

  onClickSaveFn(){
  	this.conSaveFn.confirmModal();
  }

  checkApprovalCode(data){
  	if(data.hasOwnProperty('lovInput')) {
      this.passLOV.hide = this.passTablFn.tableData.map(a=> {
      	if(a.showMG != 1)
	      	return a.approvalCd
	  });
	  this.passLOV.approvalCd = data.ev.target.value;
      //data.ev['index'] = data.index;
      this.lov.checkCode('approvalCd',null, null, null, null, null, data.ev);
    }
  }

}
