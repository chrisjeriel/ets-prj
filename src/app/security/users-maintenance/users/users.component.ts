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
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild('warningConfirmation') warningConfirmation: ModalComponent;
  @ViewChild('lovComponent') lovComponent: LovComponent;
  
  passDataUsers: any = {
    tableData: [],
    tHeader: ['User ID', 'User Name', 'User Group', 'Description','Active', 'Email','Remarks'],
    dataTypes: ['text', 'text', 'text','text', 'checkbox', 'text','text'],
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
      userTran: []
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
      tranDesc: null
    },
    tHeader: ['Tran Code', 'Description'],
    keys: ['tranCd', 'tranDesc'],
    dataTypes: ['text', 'text'],
    pageID: 1,
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [100,400],
    uneditable: [true,true],
  }

  PassDataModule: any = {
    tableData: [],
    tHeader: ['Module Id', 'Description'],
    dataTypes: ['text', 'text'],
    keys: ['moduleId', 'moduleDesc'],
    magnifyingGlass: ['moduleId'],
    nData: {
      showMG: 1,
      moduleId: null,
      moduleDesc: null
    },
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [100,400],
    uneditable: [true,true],
  }

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
  saveModuleList:any = [];
  confirmMethod:any;
  confirmationMessage:string = "";
  changePass:any = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  constructor(private securityService: SecurityService, private ns: NotesService, public modalService: NgbModal, private userService: UserService) { }

  ngOnInit() {
    this.getMtnUsers();
  }

  getMtnUsers() {
      this.passDataUsers.tableData = [];
      this.userService.retMtnUsers(null).subscribe((data: any) => {
        for(var i =0; i < data.usersList.length;i++){
          this.passDataUsers.tableData.push(data.usersList[i]);
          this.passDataUsers.tableData[i].showMG = 1;
          this.passDataUsers.tableData[i].uneditable = ['userId', 'userGrp', 'userGrpDesc'];
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
    // transData
    if(data != null){
      this.transData = data;
      if (data.tranCd != null) {
        this.getModules(accessLevel);
      }
    }else{
      this.transData = {};
    }
  }

  getModules(accessLevel) {
    this.PassDataModule.tableData = [];
    this.PassDataModuleUserGroup.tableData = [];

    if (accessLevel == 'USER') {
      this.userModules.overlayLoader = true;

      this.securityService.getModules(accessLevel, this.userData.userId, null, this.transData.tranCd, null).subscribe((data: any) => {
        for(var i =0; i < data.modules.length;i++){
          this.PassDataModule.tableData.push(data.modules[i]);
          this.PassDataModule.tableData[i].showMG = 1;
          this.PassDataModule.tableData[i].uneditable = ['moduleId', 'moduleDesc'];
        }

        this.userModules.refreshTable();
      });
    } else if (accessLevel == 'USER_GROUP') {
      this.userGroupModules.overlayLoader = true;

      this.securityService.getModules(accessLevel, null, this.userData.userGrp, this.transData.tranCd, null).subscribe((data: any) => {
        for(var i =0; i < data.modules.length;i++){
          this.PassDataModuleUserGroup.tableData.push(data.modules[i]);
          this.PassDataModuleUserGroup.tableData[i].showMG = 1;
          this.PassDataModuleUserGroup.tableData[i].uneditable = ['moduleId', 'moduleDesc'];
        }

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

        this.securityService.getTransactions(accessLevel, this.userData.userId, null, null).subscribe((data: any) => {
          for(var i =0; i < data.transactions.length;i++){
            this.PassDataModuleTrans.tableData.push(data.transactions[i]);
            this.PassDataModuleTrans.tableData[i].showMG = 0;
            this.PassDataModuleTrans.tableData[i].uneditable = ['tranDesc'];
          }

          this.userTransactions.refreshTable();
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
      this.usersList.tableData.filter((a)=>{return !a.deleted}).map(a=>a.userGrp);
      
      setTimeout(() => {
        this.lovComponent.openLOV();
      });

      this.selRecordRow = data.index;
    } else if (from == 'transactions') {
      this.passLOVData.from = from;
      this.passLOVData.selector = 'mtnTransactions';
      this.userTransactions.tableData.filter((a)=>{return !a.deleted}).map(a=>a.tranCd);
      
      setTimeout(() => {
        this.lovComponent.openLOV();
      });

      this.selRecordRow = data.index;
    } else if (from == 'modules') {
      this.passLOVData.from = from;
      this.passLOVData.selector = 'mtnModules';
      this.passLOVData.tranCd = this.transData.tranCd;
      this.userModules.tableData.filter((a)=>{return !a.deleted}).map(a=>a.moduleId);
      
      setTimeout(() => {
        this.lovComponent.openLOV();
      });

      this.selRecordRow = data.index;
    }
    
    this.fromLOV = from;
  }

  setSelected(data) {
    if (this.fromLOV == 'userGrp') {
      this.passDataUsers.tableData[this.selRecordRow].edited = true;
      this.passDataUsers.tableData[this.selRecordRow].userGrp = data.data.userGrp;
      this.passDataUsers.tableData[this.selRecordRow].userGrpDesc = data.data.userGrpDesc;
      $('#cust-table-container').addClass('ng-dirty');
      this.usersList.refreshTable();
    } else if (this.fromLOV == 'transactions') {
      this.PassDataModuleTrans.tableData[this.selRecordRow].edited = true;
      this.PassDataModuleTrans.tableData[this.selRecordRow].tranCd = data.data.tranCd;
      this.PassDataModuleTrans.tableData[this.selRecordRow].tranDesc = data.data.tranDesc;
      this.PassDataModuleTrans.tableData[this.selRecordRow].showMG = 0;
      $('#cust-table-container').addClass('ng-dirty');
      this.userTransactions.refreshTable();
    } else if (this.fromLOV == 'modules') {
      this.PassDataModule.tableData[this.selRecordRow].edited = true;
      this.PassDataModule.tableData[this.selRecordRow].tranCd = this.transData.tranCd;
      this.PassDataModule.tableData[this.selRecordRow].moduleId = data.data.moduleId;
      this.PassDataModule.tableData[this.selRecordRow].moduleDesc = data.data.moduleDesc;
      this.PassDataModule.tableData[this.selRecordRow].showMG = 1;
      $('#cust-table-container').addClass('ng-dirty');
      this.userModules.refreshTable();
    }
    
  }

  updateUsers(data) {
    console.log("updateUsers");
  }

  onClickSaveTranModules() {
    try {
      this.prepareUserTrans();
      this.prepareUserModules();

      

      if (this.saveTranList.length > 0 || this.saveModuleList.length > 0) {
          if (this.saveTranList.length > 0) {
            let saveUserTransactions:any = {
              accessLevel : 'USER',
              transactionList : []
            }

            for (let rec of this.saveTranList) {
              var tran = {
                userId: rec.userId,
                tranCd: rec.tranCd,
                remarks: rec.remarks,    
                createUser: rec.createUser,
                updateUser: rec.updateUser
              };
              console.log(tran);
              saveUserTransactions.transactionList.push(tran);
            }


            console.log("saveUserTransactions");
            console.log(saveUserTransactions);

            this.securityService.saveTransactions(saveUserTransactions).subscribe((data:any)=>{
                console.log("saveTransactions return data");
                console.log(data);
                if(data['returnCode'] == 0) {
                  this.dialogIcon = "error";
                  this.successDialog.open();
                } else{
                  this.dialogIcon = "";
                  this.successDialog.open();
                  this.getTransactions('USER');
                }
            },
            (err) => {
              alert("Exception when calling services [Transaction Saving].");
            });
          }

          if (this.saveModuleList.length > 0) {
            let saveUserModules:any = {
              accessLevel : 'USER',
              moduleList : []
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
              console.log(mod);
              saveUserModules.moduleList.push(mod);
            }


            console.log("saveUserModules");
            console.log(saveUserModules);

            this.securityService.saveModules(saveUserModules).subscribe((data:any)=>{
                console.log("saveModules return data");
                console.log(data);
                if(data['returnCode'] == 0) {
                  this.dialogIcon = "error";
                  this.successDialog.open();
                } else{
                  this.dialogIcon = "";
                  this.successDialog.open();
                  this.getModules('USER');
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

  prepareUserTrans() {
    this.saveTranList = [];
    for (var i = 0; i < this.PassDataModuleTrans.tableData.length; i++) {
      if (this.PassDataModuleTrans.tableData[i].edited == true) {
        this.PassDataModuleTrans.tableData[i].userId = this.userData.userId;
        this.PassDataModuleTrans.tableData[i].remarks = 'TestData';
        this.PassDataModuleTrans.tableData[i].createUser = JSON.parse(window.localStorage.currentUser).username;
        this.PassDataModuleTrans.tableData[i].updateUser = JSON.parse(window.localStorage.currentUser).username;
        

        this.saveTranList.push(this.PassDataModuleTrans.tableData[i]);
      }
    }
    
    console.log("this.saveTranList");
    console.log(this.saveTranList);

  }

  prepareUserModules() {
    this.saveModuleList = [];

    for (var i = 0; i < this.PassDataModule.tableData.length; i++) {
      if (this.PassDataModule.tableData[i].edited == true) {
        this.PassDataModule.tableData[i].userId = this.userData.userId;
        this.PassDataModule.tableData[i].remarks = 'TestData Modules';
        this.PassDataModule.tableData[i].createUser = JSON.parse(window.localStorage.currentUser).username;
        this.PassDataModule.tableData[i].updateUser = JSON.parse(window.localStorage.currentUser).username;

        this.saveModuleList.push(this.PassDataModule.tableData[i]);
      }
    }
    
    console.log("this.saveModuleList");
    console.log(this.saveModuleList);
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
    $('#confirm-save #modalBtn2').trigger('click');
  }

  onClickSaveMain() {
    try {
      console.log("Data to save:");
      this.prepareData();

      this.saveMtnUserParams = {
        usersList : this.saveUsersList
      }

      if (this.saveMtnUserParams.usersList.length > 0) {
        this.userService.saveMtnUser(this.saveMtnUserParams).subscribe((data:any)=>{
            console.log("saveMtnUser return data");
            console.log(data);
            if(data['returnCode'] == 0) {
              this.dialogIcon = "error";
              this.successDialog.open();
            } else{
              this.dialogIcon = "";
              this.successDialog.open();
              this.getMtnUsers();
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
        this.saveUsersList.push(this.passDataUsers.tableData[i]);
      }
    }

    console.log("saveUsersList : ");
    console.log(this.saveUsersList);
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
          console.log("saveMtnUser return data");
          console.log(data);
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

    console.log("this.changePass.oldPassword : " + this.changePass.oldPassword);
    console.log("this.usersList.indvSelect.password : " + this.usersList.indvSelect.password);
    console.log("this.changePass.newPassword : " + this.changePass.newPassword);
    console.log("this.changePass.confirmPassword : " + this.changePass.confirmPassword);

    if (this.changePass.oldPassword == '' || this.changePass.newPassword == '' || this.changePass.confirmPassword == '') {
      this.dialogIcon = "error";
      this.successDialog.open();
    } else {

      this.securityService.secEncryption(this.changePass.oldPassword).subscribe((data:any)=>{
          console.log("secEncryption");
          console.log(data);

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
                console.log("saveMtnUser return data");
                console.log(data);
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
}
