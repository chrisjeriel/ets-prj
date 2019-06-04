import { Component, OnInit, ViewChild } from '@angular/core';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnApproverComponent } from '@app/maintenance/mtn-approver/mtn-approver.component';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';

@Component({
  selector: 'app-mtn-approval-function',
  templateUrl: './mtn-approval-function.component.html',
  styleUrls: ['./mtn-approval-function.component.css']
})
export class MtnApprovalFunctionComponent implements OnInit {

  @ViewChild('userModal') modal: ModalComponent;
  @ViewChild('approval') table: CustEditableNonDatatableComponent;
  @ViewChild('user') usertable: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('userSuccess') userSuccess: SucessDialogComponent;
  @ViewChild('mtnUser') mtnUser: MtnApproverComponent;
  //@ViewChild('mtnUser') mtnUser: MtnUsersComponent;
  
  passData: any = {
    tHeader: [ "Approval Fn Code","Description","Remarks"],
    tableData:[],
    dataTypes: ['text','text','text'],
    nData: {
      approvalFn:null,
       description: null,
      remarks: null,
      createDate: '',
      createUser: this.ns.getCurrentUser(),
      updateDate: '',
      updateUser: this.ns.getCurrentUser()
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
    dataTypes: ['lovInput','text'],
    nData: {
      showMG: 1,
      userId: null,
      userName: null,
      createDate: '',
      createUser: this.ns.getCurrentUser(),
      updateDate: '',
      updateUser: this.ns.getCurrentUser()
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
    magnifyingGlass: ['userId'],
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
  userRow:any;
  hideUserArray: any;

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
    this.getUserModal();
    $('#usersModal #modalBtn').trigger('click');
  }

  getUserModal(){
    this.usertable.loadingFlag = true;
    this.maintenanceService.getMtnApprovalFunction(this.approvalCd).subscribe((data:any) => {
      this.passDataUser.tableData = [];
      var datas = data.approverFn;
      for(var i = 0 ; i < datas.length;i++){
        this.passDataUser.tableData.push(datas[i]);
        this.passDataUser.tableData[this.passDataUser.tableData.length - 1].uneditable = ['userId'];
      }
      this.usertable.refreshTable();
      this.usertable.loadingFlag = false;
    });
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

    if(this.userDetails.saveMtnApprovalFn.length === 0 && this.userDetails.deleteMtnApprovalFn.length === 0){
       setTimeout(()=> {
        this.dialogMessage = "Nothing to Save.";
        this.dialogIcon = "info";
        this.userSuccess.open();
        this.disabledFlag = true;                                                                                                                                                       
        },0);
    }else {
       this.maintenanceService.saveMtnApprovalFunction(this.userDetails).subscribe((data:any) => {
         if(data['returnCode'] == 0){
           this.dialogMessage = data['errorList'][0].errorMessage;
           this.dialogIcon = "error";
           this.userSuccess.open();
         }else{
           this.dialogMessage = "";
           this.dialogIcon = "success";
           this.userSuccess.open();
           this.getUserModal();
           this.getApprovalFunction();
           this.usertable.markAsPristine();
         }
       });
    }
  }

  deleteCurr(){
    if(this.table.indvSelect.okDelete == 'N'){
      this.dialogMessage = "Unable to delete record. Approval has existing user";
      this.dialogIcon = "error-message";
      this.successDiag.open();
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
    if(this.edited.length === 0 && this.deleted.length === 0){
      setTimeout(()=> {
      this.dialogMessage = "Nothing to Save.";
      this.dialogIcon = "info";
      this.successDiag.open();
      },0);
    }else{
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
      });
    }
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onClickSave(){
    $('#approvalConfirm #confirm-save #modalBtn2').trigger('click');
  }

  onClickSaveUser(){
    $('#userConfirm #confirm-save #modalBtn2').trigger('click');
  }

  showUsersLOV(data) {
    //$('#usersLOV #modalBtn').trigger('click');
    console.log(data)
    this.mtnUser.modal.openNoClose();
    this.hideUserArray = this.passDataUser.tableData.map(a=> a.userId);
    this.userRow = data.index;
  }

  setUser(data) {
    console.log(data)
    if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
      this.userRow = data.ev.index;
      this.ns.lovLoader(data.ev, 0);
    }

    this.passDataUser.tableData[this.userRow].userId = data.userId; 
    this.passDataUser.tableData[this.userRow].userName = data.userName;
    if(this.passDataUser.tableData[this.userRow].userName!==''){
      this.passDataUser.tableData[this.userRow].showMG = 0;
      this.passDataUser.tableData[this.userRow].uneditable = ['userId'];
    }
    
    this.ns.lovLoader(data.ev, 0);
    this.usertable.refreshTable();
    this.usertable.markAsDirty();
  }

  updateUser(data){
    
     if(data.hasOwnProperty('lovInput')) {
      //this.hideUserArray = this.passDataUser.tableData.map(a=> a.userId);
      this.hideUserArray = this.passDataUser.tableData.filter(a => {return a.userId !==  undefined && !a.deleted})/*.map(a=> {return a.userId.toString()})*/;
      console.log(this.hideUserArray)
      data.ev['index'] = data.index;
      data.ev['filter'] = this.hideUserArray;
      this.mtnUser.checkCode(data.ev.target.value, data.ev);
     }    
  }

}
