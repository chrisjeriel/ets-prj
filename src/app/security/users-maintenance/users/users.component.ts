import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService, UserService, QuotationService, NotesService } from '@app/_services';
import { UsersInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild("usersList") usersList: CustEditableNonDatatableComponent;
  @ViewChild("userTransactions") userTransactions: CustEditableNonDatatableComponent;
  @ViewChild("userGroupTransactions") userGroupTransactions: CustEditableNonDatatableComponent;
  @ViewChild("userModules") userModules: CustEditableNonDatatableComponent;
  @ViewChild("userGroupModules") userGroupModules: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('confirm') confirm: ConfirmSaveComponent;
  @ViewChild('userAcess') userConfirm: ConfirmSaveComponent;
  @ViewChild('warningConfirmation') warningConfirmation: ModalComponent;
  @ViewChild('lovComponent') lovComponent: LovComponent;
  @ViewChild('userGrp') userGrp: LovComponent;
  
  passDataUsers: any = {
    tableData: [],
    tHeader: ['User ID', 'User Name', 'User Group', 'Description','Active', 'Email','Remarks'],
    dataTypes: ['text', 'text', 'lovInput','text', 'checkbox', 'text','text'],
    nData: {
      showMG: 1,
      userId: null,
      userGrp: null,
      userGrpDesc: null,
      userName: null,
      activeTag: null,
      password: null,
      emailAddress: null,
      remarks: null,
      lastLogin: '',
      passwordResetDate: '',
      salt: null,
      invalidLoginTries: null,
      createUser: null,
      createDate: '',
      updateUser: null,
      updateDate: '',
      userTran: [],
    },
    magnifyingGlass: ['userGrp'],
    keys:['userId','userName','userGrp','userGrpDesc','activeTag','emailAddress','remarks'],
    addFlag: true,
    pageLength: 10,
    //genericBtn: 'Delete', //Does not delete, but changes status to inactive.
    pageID: 'secUsers',
    disableGeneric : true,
    searchFlag: true,
    widths:[60,200,50,300,50,'auto','auto'],
    paginateFlag: true,
  }

  PassDataModuleTrans: any = {
    tableData: [],
    magnifyingGlass: ['tranCd'],
    nData: {
      showMG: 1,
      tranCd: null,
      tranDesc: null,
    },
    tHeader: ['Tran Code', 'Description'],
    keys: ['tranCd', 'tranDesc'],
    dataTypes: ['text', 'text'],
    pageID: 1,
    addFlag: true,
    genericBtn :'Delete',
    disableGeneric : true,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    //widths: [100,400],
    uneditable: [true,true],
  }

  PassDataModule: any = {
      tableData:[],
      tHeader: ['Module Id', 'Description'],
      dataTypes: ['text', 'text'],
      nData: {
        showMG: 1,
        moduleId: null,
        moduleDesc: null
      },
      magnifyingGlass: ['moduleId'],
      keys: ['moduleId', 'moduleDesc'],
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      infoFlag: true,
      paginateFlag: true,
      searchFlag: true,
      pageID: 2,

    };

  PassDataModuleTransUserGroup: any = {
    tableData: [],
    tHeader: ['Tran Code', 'Description'],
    keys: ['tranCd', 'tranDesc'],
    dataTypes: ['text', 'text'],
    pageID: 3,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [100,400],
  }

  PassDataModuleUserGroup: any = {
    tableData: [],
    tHeader: ['Module Id', 'Description'],
    dataTypes: ['text', 'text'],
    keys: ['moduleId', 'moduleDesc'],
    pageID: 5,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [100,400],
  }

  userData:any = {
    createDate: '',
    createUser: null,
    updateDate: '',
    updateUser: null
  };
  transData: any = {};

  dialogIcon: string = "";
  dialogMessage: string = "";
  cancelFlag: boolean = false;

  btnDisabled:boolean = true;
  passLOVData: any = {
      selector:'',
      data:{}
  }
  selRecordRow:number;
  saveUsersList:any = [];
  saveMtnUserParams:any = {};
  fromLOV:string = "";
  saveTranList:any = [];
  delTranList:any = [];
  saveModuleList:any = [];
  delModuleList: any = [];
  confirmMethod:any;
  confirmationMessage:string = "";
  changePass:any = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  constructor(private securityService: SecurityService, private ns: NotesService, public modalService: NgbModal, private userService: UserService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Sec | Security Users");
    this.getMtnUsers();
  }

  getMtnUsers() {
      this.passDataUsers.tableData = [];
      this.userService.retMtnUsers(null).subscribe((data: any) => {
        for(var i = 0; i < data.usersList.length;i++){
          this.passDataUsers.tableData.push(data.usersList[i]);
          this.passDataUsers.tableData[i].showMG = 1;
          this.passDataUsers.tableData[i].uneditable = ['userId', 'userGrpDesc'];
        }

        this.usersList.refreshTable();
      });
  }

  onRowClickUsers(data){
    if(data != null){
      this.passDataUsers.disableGeneric = false;
      this.btnDisabled = false;
      this.userData = data;
      this.userData.createDate = this.ns.toDateTimeString(data.createDate);
      this.userData.updateDate = this.ns.toDateTimeString(data.updateDate);
    }else{
      this.btnDisabled = true;
      this.passDataUsers.disableGeneric = true;
      this.userData = {
        createDate: '',
        createUser: null,
        updateDate: '',
        updateUser: null
      };
    }
  }

  onRowClickTrans(data, accessLevel) {
    if(data != null){
      this.transData = data;
      this.PassDataModuleTrans.disableGeneric = data == null ? true : false;
      if (data.tranCd != null) {
        this.getModules(accessLevel);
      }
      this.PassDataModule.disableAdd = false;
      this.PassDataModule.btnDisabled = false;
    }else{
      this.transData = {};
      this.PassDataModule.tableData = [];
      this.PassDataModuleUserGroup.tableData = [];
      this.PassDataModule.disableAdd = true;
      this.PassDataModule.btnDisabled = true;
      this.userModules.refreshTable();
      this.userGroupModules.refreshTable();
    }
  }

  onClickTransDelete() {
    this.userTransactions.indvSelect.deleted = true;
    this.userTransactions.selected  = [this.userTransactions.indvSelect];
    this.userTransactions.confirmDelete();
  }

  onClickModuleDelete(){
    this.userModules.indvSelect.deleted = true;
    this.userModules.selected  = [this.userModules.indvSelect];
    this.userModules.confirmDelete();
  }

  getModules(accessLevel) {
    this.PassDataModule.tableData = [];
    this.PassDataModuleUserGroup.tableData = [];

    if (accessLevel == 'USER') {
      this.userModules.overlayLoader = true;
      this.securityService.getModules(accessLevel, this.userData.userId, null, this.transData.tranCd, null).subscribe((data: any) => {
        this.PassDataModule.tableData = [];
        for(var i =0; i < data.modules.length;i++){
          this.PassDataModule.tableData.push(data.modules[i]);
          this.PassDataModule.tableData[i].showMG = 0;
          this.PassDataModule.tableData[i].uneditable = ['moduleId', 'moduleDesc'];
        }
        this.userModules.onRowClick(null,this.PassDataModule.tableData[0]);
        this.userModules.refreshTable();
      });
    } else if (accessLevel == 'USER_GROUP') {
      this.userGroupModules.overlayLoader = true;

      this.securityService.getModules(accessLevel, null, this.userData.userGrp, this.transData.tranCd, null).subscribe((data: any) => {
        for(var i =0; i < data.modules.length;i++){
          this.PassDataModuleUserGroup.tableData.push(data.modules[i]);
          this.PassDataModuleUserGroup.tableData[i].showMG = 0;
          this.PassDataModuleUserGroup.tableData[i].uneditable = ['moduleId', 'moduleDesc'];
        }
        this.userGroupModules.onRowClick(null,this.PassDataModuleUserGroup.tableData[0]);
        this.userGroupModules.refreshTable();
      });
    }
  }

  clearPopupData() {
      this.PassDataModule.tableData = [];
      this.PassDataModuleUserGroup.tableData = [];
      this.PassDataModuleTrans.tableData = [];
      this.PassDataModuleTransUserGroup.tableData = [];
      this.userModules.refreshTable();
      this.userGroupModules.refreshTable();
      this.userTransactions.refreshTable();
      this.userGroupTransactions.refreshTable();
  }

  getTransactions(accessLevel) {
      this.PassDataModuleTrans.tableData = [];
      this.PassDataModuleTransUserGroup.tableData = [];


      if (accessLevel == 'USER') {
        this.userTransactions.overlayLoader = true;
        this.PassDataModuleTrans.tableData = [];
        this.securityService.getTransactions(accessLevel, this.userData.userId, null, null).subscribe((data: any) => {
          for(var i =0; i < data.transactions.length;i++){
            this.PassDataModuleTrans.tableData.push(data.transactions[i]);
            this.PassDataModuleTrans.tableData[i].showMG = 0;
            this.PassDataModuleTrans.tableData[i].deleted = false;
            this.PassDataModuleTrans.tableData[i].uneditable = ['tranDesc'];
          }

          this.userTransactions.refreshTable();
          this.userTransactions.onRowClick(null,this.PassDataModuleTrans.tableData[0]);
        });
      } else if (accessLevel == 'USER_GROUP') {
        this.userGroupTransactions.overlayLoader = true;

        this.securityService.getTransactions(accessLevel, null, this.userData.userGrp, null).subscribe((data: any) => {
          for(var i =0; i < data.transactions.length;i++){
            this.PassDataModuleTransUserGroup.tableData.push(data.transactions[i]);
            this.PassDataModuleTransUserGroup.tableData[i].showMG = 0;
            this.PassDataModuleTransUserGroup.tableData[i].uneditable = ['tranCd', 'tranDesc'];
          }

          this.userGroupTransactions.refreshTable();
          this.userGroupTransactions.onRowClick(null,this.PassDataModuleTransUserGroup.tableData[0]);
        });
      }

  }

  deleteUser(){
    if(this.usersList.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'Message of already used userid in some modules.';
      this.successDialog.open();
    }else{
      this.usersList.indvSelect.deleted = true;
      this.usersList.selected  = [this.usersList.indvSelect]
      this.usersList.confirmDelete();
    }
  }

  clickLOV(data,from){
    this.passLOVData = {
        selector:'',
        data:{}
    }

    if (from == 'userGrp') {
      this.passLOVData.from = from;
      this.passLOVData.selector = 'userGrp';
      setTimeout(() => {
        this.userGrp.openLOV();
      });

      this.selRecordRow = data.index;
    } else if (from == 'transactions') {
      this.passLOVData.from = from;
      this.passLOVData.selector = 'mtnTransactions';
      this.userTransactions.tableData.filter((a)=>{return !a.deleted}).map(a=>a.tranCd);
      this.passLOVData.hide = this.PassDataModuleTrans.tableData.filter((a)=>{return a.tranCd !== null && !a.deleted}).map(a=>{return a.tranCd.toString()});
      setTimeout(() => {
        this.lovComponent.openLOV();
      });

      this.selRecordRow = data.index;
    } else if (from == 'modules') {
      this.passLOVData.from = from;
      this.passLOVData.selector = 'mtnModules';
      this.passLOVData.tranCd = this.transData.tranCd;
      this.userModules.tableData.filter((a)=>{return !a.deleted}).map(a=>a.moduleId);
      this.passLOVData.hide = this.PassDataModule.tableData.filter((a)=>{return a.moduleId !== null && !a.deleted}).map(a=>{return a.moduleId.toString()});
      setTimeout(() => {
        this.lovComponent.openLOV();
      });

      this.selRecordRow = data.index;
    }
    
    this.fromLOV = from;
  }

  setSelected(data) {
    console.log(data)
    if (this.fromLOV == 'transactions') {
      this.PassDataModuleTrans.tableData = this.PassDataModuleTrans.tableData.filter(a=>a.showMG!=1);
      for(var i = 0 ; i < data.data.length; i++){
        this.PassDataModuleTrans.tableData.push(JSON.parse(JSON.stringify(this.PassDataModuleTrans.nData)));
        this.PassDataModuleTrans.tableData[this.PassDataModuleTrans.tableData.length - 1].edited = true;
        this.PassDataModuleTrans.tableData[this.PassDataModuleTrans.tableData.length - 1].tranCd = data.data[i].tranCd;
        this.PassDataModuleTrans.tableData[this.PassDataModuleTrans.tableData.length - 1].tranDesc = data.data[i].tranDesc;
        this.PassDataModuleTrans.tableData[this.PassDataModuleTrans.tableData.length - 1].showMG = 0;
      }
      this.userTransactions.markAsDirty();
      this.userTransactions.refreshTable();
    } else if (this.fromLOV == 'modules') {
      this.PassDataModule.tableData = this.PassDataModule.tableData.filter(a=>a.showMG!=1);
      for(var i = 0 ; i < data.data.length; i++){
        this.PassDataModule.tableData.push(JSON.parse(JSON.stringify(this.PassDataModule.nData)));
        this.PassDataModule.tableData[this.PassDataModule.tableData.length - 1].edited = true;
        this.PassDataModule.tableData[this.PassDataModule.tableData.length - 1].tranCd = this.transData.tranCd;
        this.PassDataModule.tableData[this.PassDataModule.tableData.length - 1].moduleId = data.data[i].moduleId;
        this.PassDataModule.tableData[this.PassDataModule.tableData.length - 1].moduleDesc = data.data[i].moduleDesc;
        this.PassDataModule.tableData[this.PassDataModule.tableData.length - 1].showMG = 0;
      }
      this.userModules.markAsDirty();
      this.userModules.refreshTable();
    }
  }

  setSelectedUser(data){
      this.passDataUsers.tableData[this.selRecordRow].edited = true;
      this.passDataUsers.tableData[this.selRecordRow].userGrp = data.data.userGrp;
      this.passDataUsers.tableData[this.selRecordRow].userGrpDesc = data.data.userGrpDesc;
      this.usersList.markAsDirty();
      this.usersList.refreshTable();
      this.ns.lovLoader(data.ev, 0);
  }

  updateUsers(data) { 
    var ev;
    if(data.hasOwnProperty('lovInput')) {
      this.passLOVData.selector = 'userGrp';
      this.usersList.tableData.filter((a)=>{return !a.deleted}).map(a=>a.userGrp);
      this.passLOVData.userGrp = data.ev.target.value;
      ev = data.ev;
      setTimeout(() => {
        this.userGrp.checkCode('userGrp',null,null,null,null,null, ev);
      });

      this.selRecordRow = data.index;
    }
  }

  saveUserAccess(){
    try {
      this.prepareUserTrans();
      this.prepareUserModules();

      

      if (this.saveTranList.length > 0 || this.saveModuleList.length > 0 ||
          this.delTranList.length > 0 || this.delModuleList.length > 0) {
          if (this.saveTranList.length > 0 || this.delTranList.length > 0) {
            let saveUserTransactions:any = {
              accessLevel : 'USER',
              transactionList : [],
              delTranList: []
            }

            for (let rec of this.saveTranList) {
              var tran = {
                userId: rec.userId,
                tranCd: rec.tranCd,
                remarks: rec.remarks,    
                createUser: rec.createUser,
                updateUser: rec.updateUser
              };
              saveUserTransactions.transactionList.push(tran);
            }

            for (let rec of this.delTranList) {
              var moduleTran = {
                userId: rec.userId,
                tranCd: rec.tranCd
              };
              saveUserTransactions.delTranList.push(moduleTran);
            }
            this.securityService.saveTransactions(saveUserTransactions).subscribe((data:any)=>{
                if(data['returnCode'] == 0) {
                  this.dialogIcon = "error";
                  this.successDialog.open();
                } else{
                  if(this.saveModuleList.length > 0 || this.delModuleList.length > 0){
                    this.getTransactions('USER');
                  }else{
                    this.dialogIcon = "";
                    this.successDialog.open();
                    this.getTransactions('USER');
                  }
                  this.userTransactions.markAsPristine();
                }
            },
            (err) => {
              alert("Exception when calling services [Transaction Saving].");
            });
          }

          if (this.saveModuleList.length > 0 || this.delModuleList.length > 0) {
            let saveUserModules:any = {
              accessLevel : 'USER',
              moduleList : [],
              delModuleList : []
            }

            for (let rec of this.saveModuleList) {
              var mod = {
                userId: rec.userId,
                tranCd: rec.tranCd,
                moduleId: rec.moduleId,
                remarks: rec.remarks,    
                createUser: rec.createUser,
                updateUser: rec.updateUser
              };
              saveUserModules.moduleList.push(mod);
            }
            
            for (let rec of this.delModuleList) {
              var del = {
                userId: rec.userId,
                tranCd: rec.tranCd,
                moduleId: rec.moduleId
              };
              saveUserModules.delModuleList.push(del);
            }
            console.log(saveUserModules.delModuleList);
            this.securityService.saveModules(saveUserModules).subscribe((data:any)=>{
                if(data['returnCode'] == 0) {
                  this.dialogIcon = "error";
                  this.successDialog.open();
                } else{
                  this.dialogIcon = "";
                  this.successDialog.open();
                  this.getModules('USER');
                  this.userModules.markAsPristine();
                }
            },
            (err) => {
              alert("Exception when calling services [Module Saving].");
            });
          }
      } else {
        alert("Nothing to save.");
      }

    } catch (e) {
      alert("Error in e : " + e);
      /*throw new Error("Error in e : " + e);*/
    }
  }

  onClickSaveTranModules() {
    this.userConfirm.confirmModal();
  }

  prepareUserTrans() {
    this.saveTranList = [];
    this.delTranList = [];
    for (var i = 0; i < this.PassDataModuleTrans.tableData.length; i++) {
      if(this.PassDataModuleTrans.tableData[i].deleted){
        this.PassDataModuleTrans.tableData[i].userId = this.userData.userId;
        this.delTranList.push(this.PassDataModuleTrans.tableData[i]);
      }

      if (this.PassDataModuleTrans.tableData[i].edited) {
        this.PassDataModuleTrans.tableData[i].userId = this.userData.userId;
        this.PassDataModuleTrans.tableData[i].remarks = 'TestData';
        this.PassDataModuleTrans.tableData[i].createUser = this.ns.getCurrentUser();
        this.PassDataModuleTrans.tableData[i].updateUser = this.ns.getCurrentUser();
        this.saveTranList.push(this.PassDataModuleTrans.tableData[i]);
      }
    }
  }

  prepareUserModules() {
    this.saveModuleList = [];
    this.delModuleList = [];

    for (var i = 0; i < this.PassDataModule.tableData.length; i++) {
      if (this.PassDataModule.tableData[i].edited && !this.PassDataModule.tableData[i].deleted) {
        this.PassDataModule.tableData[i].userId = this.userData.userId;
        this.PassDataModule.tableData[i].remarks = 'TestData Modules';
        this.PassDataModule.tableData[i].createUser = this.ns.getCurrentUser();
        this.PassDataModule.tableData[i].updateUser = this.ns.getCurrentUser();

        this.saveModuleList.push(this.PassDataModule.tableData[i]);
      }

      if(this.PassDataModule.tableData[i].deleted){
        this.PassDataModule.tableData[i].userId = this.userData.userId;
        this.PassDataModule.tableData[i].tranCd = this.userTransactions.indvSelect.tranCd;
        this.delModuleList.push(this.PassDataModule.tableData[i]);
      }
    }
  }

  onClickConfirmation(method) {
    console.log("onClickConfirmation : " + method);
    this.confirmMethod = method;
    if (method == 'resetPassword') {
      this.confirmationMessage = "Are you sure you want to reset password for selected user?";
      this.warningConfirmation.openNoClose();
    } else if (method == 'changePassword') {
      this.confirmationMessage = "Are you sure you want to change password for selected user?";
      this.warningConfirmation.openNoClose();
    }
  }

  onClickSaveConfirmation() {
    this.confirm.confirmModal();
  }

  onClickSaveMain(cancel?) {
    this.cancelFlag = cancel !== undefined;
    try {
      this.prepareData();

      this.saveMtnUserParams = {
        usersList : this.saveUsersList
      }

      if (this.saveMtnUserParams.usersList.length > 0) {
        this.userService.saveMtnUser(this.saveMtnUserParams).subscribe((data:any)=>{
            if(data['returnCode'] == 0) {
              this.dialogIcon = "error";
              this.successDialog.open();
            } else{
              this.dialogIcon = "";
              this.successDialog.open();
              this.getMtnUsers();
              this.btnDisabled = true;
            }
        },
        (err) => {
          alert("Exception when calling services.");
        });
      }      
    } catch (e) {
      alert("Error in e : " + e);
      /*throw new Error("Error in e : " + e);*/
    }
    
  }

  prepareData() {
    this.saveUsersList = [];
    for (var i = 0; i < this.passDataUsers.tableData.length; i++) {
      if (this.passDataUsers.tableData[i].edited == true) {
        this.passDataUsers.tableData[i].passwordResetDate = '';
        this.passDataUsers.tableData[i].lastLogin = '';
        this.passDataUsers.tableData[i].userTran = null;
        this.passDataUsers.tableData[i].createUser = this.ns.getCurrentUser();
        this.passDataUsers.tableData[i].updateUser = this.ns.getCurrentUser();
        if (this.passDataUsers.tableData[i].password == null) {
          this.passDataUsers.tableData[i].password = this.passDataUsers.tableData[i].userId;
        }

        this.saveUsersList.push(this.passDataUsers.tableData[i]);
      }
    }
  }

  confirmResetPassword() {
    this.usersList.indvSelect.edited = true;
    this.usersList.indvSelect.password = this.usersList.indvSelect.userId;

    this.saveUsersList = [];
    this.saveUsersList.push(this.usersList.indvSelect);
    this.saveMtnUserParams = {
        usersList : this.saveUsersList
    }

    if (this.saveMtnUserParams.usersList.length > 0) {
      this.userService.saveMtnUser(this.saveMtnUserParams).subscribe((data:any)=>{
          if(data['returnCode'] == 0) {
            this.dialogIcon = "error";
            this.successDialog.open();
          } else{
            this.dialogIcon = "success-message";
            this.dialogMessage = 'Password reset successfully!';
            this.successDialog.open();
            this.getMtnUsers();
          }
      },
      (err) => {
        alert("Exception when calling services.");
      });
    }
  }

  confirmChangePassword() {
    if (this.changePass.oldPassword == '' || this.changePass.newPassword == '' || this.changePass.confirmPassword == '') {
      this.dialogIcon = "error";
      this.successDialog.open();
    } else {

      this.securityService.secEncryption(this.changePass.oldPassword).subscribe((data:any)=>{
          if (data.password != this.usersList.indvSelect.password) {
            this.dialogIcon = "error-message";
            this.dialogMessage = 'Old password mismatched.';
            this.successDialog.open();
            return;
          }

          if (this.changePass.newPassword != this.changePass.confirmPassword) {
            this.dialogIcon = "error-message";
            this.dialogMessage = 'Confirm password mismatched.';
            this.successDialog.open();
            return;
          }

          this.usersList.indvSelect.edited = true;
          this.usersList.indvSelect.password = this.changePass.newPassword;

          this.saveUsersList = [];
          this.saveUsersList.push(this.usersList.indvSelect);
          this.saveMtnUserParams = {
              usersList : this.saveUsersList
          }

          if (this.saveMtnUserParams.usersList.length > 0) {
            this.userService.saveMtnUser(this.saveMtnUserParams).subscribe((data:any)=>{
                if (data["errorList"].length > 0) {
                  this.dialogIcon = "error";
                  this.dialogMessage = data["errorList"][0].errorMessage;
                  this.successDialog.open();
                } else {
                  this.changePass.oldPassword = "";
                  this.changePass.newPassword = "";
                  this.changePass.confirmPassword = "";
                  this.modalService.dismissAll();

                  this.dialogIcon = "success-message";
                  this.dialogMessage = 'Password changed successfully!';
                  this.successDialog.open();
                  this.getMtnUsers();
                }
            },
            (err) => {
              alert("Exception when calling services.");
            });
          }
      },
      (err) => {
          console.log(err);
          alert("Exception when calling services.");
      });

    }

  }

  changePassword(){
    $('#changePassword #modalBtn').trigger('click');
  }

  userAccess(){
    this.getTransactions('USER');
    $('#userAccess #modalBtn').trigger('click');
  }

  userGroupAccess(){
    this.getTransactions('USER_GROUP');
    $('#userGroupAccess #modalBtn').trigger('click');
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  rowClick(data){
    if(data !== null){
      this.PassDataModule.disableGeneric = false;
    }else{
      this.PassDataModule.disableGeneric = true;
    }
  }

  tranDelete(){
    var row;
    for (var i = 0; i < this.PassDataModuleTrans.tableData.length; i++) {
      if(!this.PassDataModuleTrans.tableData[i].deleted){
        row = i;
        break;
      }
    }
    this.userTransactions.onRowClick(null,this.PassDataModuleTrans.tableData[row]);
  }
}
