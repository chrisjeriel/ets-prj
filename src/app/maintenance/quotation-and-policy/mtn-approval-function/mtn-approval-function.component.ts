import { Component, OnInit, ViewChild } from '@angular/core';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
@Component({
  selector: 'app-mtn-approval-function',
  templateUrl: './mtn-approval-function.component.html',
  styleUrls: ['./mtn-approval-function.component.css']
})
export class MtnApprovalFunctionComponent implements OnInit {

  @ViewChild('approval') table: CustEditableNonDatatableComponent;
  @ViewChild('user') usertable: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('userSuccess') userSuccess: SucessDialogComponent;
  passData: any = {
    tHeader: [ "Approval Fn Code","Description","Remarks"],
    tableData:[],
    dataTypes: ['text','text','text'],
    nData: {
      approvalFn:null,
   	  description: null,
      remarks: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'approval',
    //checkFlag: true,
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false,false],
    widths:[100,'auto','auto'],
    keys:['approvalCd','description','remarks']
  };

  passDataUser: any = {
    tHeader: [ "User ID","User Name"],
    tableData:[],
    dataTypes: ['text','text'],
    nData: {
      userId: null,
      userName: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'users',
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[false,false],
    widths:[100,'auto'],
    keys:['userId','userName']
  };

  approvalCd: null;
  disabledFlag : boolean = true;

  approvalDetails : any = {
  	createDate: '',
  	createUser: null,
  	updateUser: null,
  	updateDate: ''
  }

  edited: any = [];
  deleted: any = [];
  cancelFlag:boolean;
  dialogMessage:string;
  dialogIcon:string;

  saveDetails: any = {
  	deleteMtnApproval: [],
  	saveMtnApproval: []
  }

  userDetails: any = {
  	deleteMtnApprovalFn: [],
  	saveMtnApprovalFn: []
  }

  constructor( private modalService: NgbModal, private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  	this.getApprovalFunction()
  }

  getApprovalFunction(){
  	this.maintenanceService.getMtnApproval().subscribe((data:any) => {
  		console.log(data)
  		var datas = data.approvalFunction;
  		this.passData.tableData = [];
  		for (var i = 0; i < datas.length;i++ ){
  			this.passData.tableData.push(datas[i]);
  		}
  		this.table.refreshTable();
  		this.table.loadingFlag = false;
  	})
  }

  onRowClick(data){
  	console.log(data)
  	if(data == null){
  		this.passData.disableGeneric = true;
  		this.disabledFlag = true;
  		this.approvalCd = null
  		this.approvalDetails.createUser = '';
  		this.approvalDetails.updateUser = '';
  		this.approvalDetails.updateDate = '';
  		this.approvalDetails.createDate = '';
  	}else{
  		this.passData.disableGeneric = false;
  		this.disabledFlag = false;
  		this.approvalCd = data.approvalCd
  		this.approvalDetails = data;
  		this.approvalDetails.updateDate = this.ns.toDateTimeString(data.updateDate);
  		this.approvalDetails.createDate = this.ns.toDateTimeString(data.createDate);
  	}	
  }

  usersModal(){
  	$('#usersModal #modalBtn').trigger('click');
  	this.maintenanceService.getMtnApprovalFunction(this.approvalCd).subscribe((data:any) => {
  		console.log(data)
  		this.usertable.loadingFlag = false;
  		this.passDataUser.tableData = [];
  		var datas = data.approverFn;
  		for(var i = 0 ; i < datas.length;i++){
  			this.passDataUser.tableData.push(datas[i]);
  		}
  		this.usertable.refreshTable()

  	})
  }

  saveUserModal(){
  	for(var i = 0 ; i < this.passDataUser.tableData.length; i++){
  		if(this.passDataUser.tableData[i].edited && !this.passDataUser.tableData[i].deleted){
  			this.userDetails.saveMtnApprovalFn.push(this.passDataUser.tableData[i])
  			this.userDetails.saveMtnApprovalFn[this.userDetails.saveMtnApprovalFn.length - 1].approvalCd = this.approvalCd;
  		}

  		if(this.passDataUser.tableData[i].deleted){
  			this.userDetails.deleteMtnApprovalFn.push(this.passDataUser.tableData[i])
  			this.userDetails.deleteMtnApprovalFn[this.userDetails.deleteMtnApprovalFn.length - 1].approvalCd = this.approvalCd;
  		}
  	}

  	this.maintenanceService.saveMtnApprovalFunction(this.userDetails).subscribe((data:any) => {
  		if(data['returnCode'] == 0){
  			this.dialogMessage = data['errorList'][0].errorMessage;
  			this.dialogIcon = "error";
  			this.userSuccess.open();
  			console.log('failed')
  		}else{
  			this.dialogMessage = "";
  			this.dialogIcon = "success";
  			this.userSuccess.open();
  			console.log('success')
  			this.usersModal();
  		}
  	})
  }

  deleteCurr(){
  	if(this.table.indvSelect.okDelete == 'N'){

  	}else{
      this.table.indvSelect.deleted = true;
      this.table.selected  = [this.table.indvSelect]
      this.table.confirmDelete();
    }
  }

  prepareData(){
  	for(var i = 0; i < this.passData.tableData.length;i++){
  		if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  			this.edited.push(this.passData.tableData[i]);
  		}
  		if(this.passData.tableData[i].deleted){
  			this.deleted.push(this.passData.tableData[i]);
  		}
  	}
  	this.saveDetails.deleteMtnApproval = this.deleted;
  	this.saveDetails.saveMtnApproval = this.edited;
  }

  saveData(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.prepareData();
  	this.maintenanceService.saveMtnApproval(this.saveDetails).subscribe((data:any) => {
  		if(data['returnCode'] == 0){
  			this.dialogMessage = data['errorList'][0].errorMessage;
  			this.dialogIcon = "error";
  			this.successDiag.open();
  			console.log('failed')
  		}else{
  			this.dialogMessage = "";
  			this.dialogIcon = "success";
  			this.successDiag.open();
  			console.log('success')
  			this.getApprovalFunction();
  		}
  	})
  }

  cancel(){
  	this.cancelBtn.clickCancel();
  }

  onClickSave(){
  	$('#confirm-save #modalBtn2').trigger('click');
  }

  onClickSaveUser(){
  	$('#userConfirm #confirm-save #modalBtn2').trigger('click');
  }
}
