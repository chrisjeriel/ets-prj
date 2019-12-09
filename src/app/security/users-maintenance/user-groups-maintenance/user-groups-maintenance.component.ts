import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService, MaintenanceService, NotesService, UserService } from '@app/_services';
import { UserGroups } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-user-groups-maintenance',
  templateUrl: './user-groups-maintenance.component.html',
  styleUrls: ['./user-groups-maintenance.component.css']
})
export class UserGroupsMaintenanceComponent implements OnInit {


  @ViewChild("userGroups") userGroups: CustEditableNonDatatableComponent;
  @ViewChild("userListing") userListing: CustEditableNonDatatableComponent;
  @ViewChild("userGroupTransactions") userGroupTransactions: CustEditableNonDatatableComponent;
  @ViewChild("userGroupModules") userGroupModules: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('confirm') confirm: ConfirmSaveComponent;
  @ViewChild('groupConfirm') groupConfirm: ConfirmSaveComponent;
  @ViewChild('lovComponent') lovComponent: LovComponent;
  
  passDataUserGroup: any = {
    tableData: [],
    tHeader: ['User Group', 'Description','Remarks'],
    dataTypes: ['text', 'text', 'text'],
    keys:['userGrp','userGrpDesc','remarks'],
    nData: {
      createDate: '',
      createUser: null,
      remarks: '',
      updateDate: '',
      updateUser: null,
      userGrp: 0,
      userGrpDesc: '',
      userGrpTran: []
    },
    pageID: 'userGroup',
    addFlag: true,
    pageLength:10,
    magnifyingGlass:['userGroup'],
    searchFlag: true,
    widths: [],
    paginateFlag: true,
    genericBtn: 'Delete',
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
    genericBtn :'Delete',
    pageID: 3,
    addFlag: true,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    //widths: [300,350],
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
    genericBtn :'Delete',
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
   // widths: [300,350],
  }

  passDataUserListing: any = {
    tableData: [],
    tHeader: ['User Id', 'User Name', 'Active'],
    dataTypes: ['text', 'text','checkbox'],
    keys:['userId','userName','activeTag'],
    pageID: 7,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [110,225,30],
  }

  constructor(private securityService: SecurityService, public modalService: NgbModal, 
              private maintenanceService: MaintenanceService, private ns: NotesService,
              private userService: UserService) { }

  userGroupData:any = {
    createDate: '',
    createUser: null,
    remarks: '',
    updateDate: '',
    updateUser: null,
    userGrp: 0,
    userGrpDesc: '',
    userGrpTran: []
  }
  btnDisabled:boolean = true;
  selRecordRow:number;
  passLOVData: any = {
      selector:'',
      data:{}
  }
  transData: any = {};
  fromLOV:string = "";
  saveUserGrpList:any = [];
  delUserGrpList:any = [];
  saveTranList:any = [];
  delTranList:any = [];
  saveModuleList:any = [];
  delModuleList:any =  [];
  dialogIcon: string = "";
  dialogMessage: string = "";
  cancelFlag: boolean = false;
  saveMtnUserGrpParams:any = [];

  ngOnInit() {
    this.getMtnUserGrp();
  }

  getMtnUserGrp() {
      this.passDataUserGroup.tableData = [];

      this.userGroups.overlayLoader = true;

      this.maintenanceService.getMtnUserGrp(null).subscribe((data: any) => {  

        for(var i =0; i < data.userGroups.length;i++){
          this.passDataUserGroup.tableData.push(data.userGroups[i]);
          this.passDataUserGroup.tableData[i].uneditable = ['userGrp'];
        }

        this.userGroups.refreshTable();
      });
  }

  onRowClickUserGroup(data) {
    console.log(data)
    if(data != null){
      this.passDataUserGroup.disableGeneric = false;
      this.btnDisabled = false;
      this.userGroupData = data;
      this.userGroupData.createDate = this.ns.toDateTimeString(data.createDate);
      this.userGroupData.updateDate = this.ns.toDateTimeString(data.updateDate);
    }else{
      this.btnDisabled = true;
      this.passDataUserGroup.disableGeneric = true;
      this.userGroupData = {
        createDate: '',
        createUser: null,
        updateDate: '',
        updateUser: null
      };
    }
  }

  userGroupAccess(){
    this.getTransactions();
    $('#userGroupAccess #modalBtn').trigger('click');
  }

  clearPopupData() {
      this.PassDataModuleTrans.tableData = [];
      this.PassDataModule.tableData = [];

      this.userGroupTransactions.refreshTable();
      this.userGroupModules.refreshTable();
  }

  getTransactions() {
      this.PassDataModuleTrans.tableData = [];

      this.userGroupTransactions.overlayLoader = true;

      this.securityService.getTransactions('USER_GROUP', null, this.userGroupData.userGrp, null).subscribe((data: any) => {
        for(var i =0; i < data.transactions.length;i++){
          this.PassDataModuleTrans.tableData.push(data.transactions[i]);
          this.PassDataModuleTrans.tableData[i].showMG = 0;
          this.PassDataModuleTrans.tableData[i].uneditable = ['tranCd', 'tranDesc'];
        }
        this.userGroupTransactions.onRowClick(null,this.PassDataModuleTrans.tableData[0]);
        this.userGroupTransactions.refreshTable();
      });
  }

  clickLOV(data,from){
    this.passLOVData = {
        selector:'',
        data:{}
    }

    if (from == 'transactions') {
      this.passLOVData.from = from;
      this.passLOVData.selector = 'mtnTransactions';
      this.userGroupTransactions.tableData.filter((a)=>{return !a.deleted}).map(a=>a.tranCd);
      this.passLOVData.hide = this.PassDataModuleTrans.tableData.filter((a)=>{return a.tranCd !== null && !a.deleted}).map(a=>{return a.tranCd.toString()});
      setTimeout(() => {
        this.lovComponent.openLOV();
      });

      this.selRecordRow = data.index;
    } else if (from == 'modules') {
      this.passLOVData.from = from;
      this.passLOVData.selector = 'mtnModules';
      this.passLOVData.tranCd = this.transData.tranCd;
      this.userGroupModules.tableData.filter((a)=>{return !a.deleted}).map(a=>a.moduleId);
      this.passLOVData.hide = this.PassDataModule.tableData.filter((a)=>{return a.moduleId !== null && !a.deleted}).map(a=>{return a.moduleId.toString()});
      setTimeout(() => {
        this.lovComponent.openLOV();
      });

      this.selRecordRow = data.index;
    }

    this.fromLOV = from;
  }

  onClickTransDelete(){
    this.userGroupTransactions.indvSelect.deleted = true;
    this.userGroupTransactions.selected  = [this.userGroupTransactions.indvSelect];
    this.userGroupTransactions.confirmDelete();
  }

  onClickModuleDelete(){
    this.userGroupModules.indvSelect.deleted = true;
    this.userGroupModules.selected  = [this.userGroupModules.indvSelect];
    this.userGroupModules.confirmDelete();
  }


  onRowClickModule(data, accessLevel){
    if(data != null){
      this.PassDataModule.disableGeneric = false;
    }else{
      this.PassDataModule.disableGeneric = true;
    }
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
      this.userGroupTransactions.markAsDirty();
      this.userGroupTransactions.refreshTable();
      this.userGroupTransactions.onRowClick(null,this.PassDataModuleTrans.tableData[this.PassDataModuleTrans.tableData.length - 1]);
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
      this.userGroupModules.markAsDirty();
      this.userGroupModules.refreshTable();
    }
    
  }

  userListingModal(){
    this.passDataUserListing.tableData = [];

    this.userListing.overlayLoader = true;

    this.userService.retMtnUsers(null, this.userGroupData.userGrp).subscribe((data: any) => {

        for(var i =0; i < data.usersList.length;i++){
          this.passDataUserListing.tableData.push(data.usersList[i]);
          this.passDataUserListing.tableData[i].uneditable = ['userId', 'userName', 'activeTag'];
        }

        this.userListing.refreshTable();
    });

    $('#userListingModal #modalBtn').trigger('click');
  }

  onRowClickTrans(data, accessLevel) {
    // transData
    if(data != null){
      this.transData = data;
      this.PassDataModuleTrans.disableGeneric = false;
      this.getModules();
    }else{
      this.PassDataModuleTrans.disableGeneric = true;
      this.transData = {};
    }
  }

  getModules() {
    this.userGroupModules.overlayLoader = true;

    this.securityService.getModules('USER_GROUP', null, this.userGroupData.userGrp, this.transData.tranCd).subscribe((data: any) => {
      this.PassDataModule.tableData = [];
      for(var i =0; i < data.modules.length;i++){
        this.PassDataModule.tableData.push(data.modules[i]);
        this.PassDataModule.tableData[i].showMG = 1;
        this.PassDataModule.tableData[i].uneditable = ['moduleId', 'moduleDesc'];
      }

      this.userGroupModules.refreshTable();
    });

  }

  saveTranModule(){
    try {
      this.prepareUserGroupTrans();
      this.prepareUserGroupModules();
      console.log(this.saveModuleList.length)
      if (this.saveTranList.length > 0 || this.saveModuleList.length > 0 || 
          this.delTranList.length > 0 || this.delModuleList.length > 0) {

          if (this.saveTranList.length > 0 || this.delTranList.length > 0) {
            let saveUserTransactions:any = {
              accessLevel : 'USER_GROUP',
              transactionList : [],
              delTranList: []
            }

            for (let rec of this.saveTranList) {
              var tran = {
                userGrp: rec.userGrp,
                tranCd: rec.tranCd,
                remarks: rec.remarks,    
                createUser: rec.createUser,
                updateUser: rec.updateUser
              };
              saveUserTransactions.transactionList.push(tran);
            }
            console.log(this.delTranList)
            for (let rec of this.delTranList) {
              var moduleTran = {
                userGrp: rec.userGrp,
                tranCd: rec.tranCd
              };
              saveUserTransactions.delTranList.push(moduleTran);
            }

            console.log(saveUserTransactions);
            this.securityService.saveTransactions(saveUserTransactions).subscribe((data:any)=>{
                if(data['returnCode'] == 0) {
                  this.dialogIcon = "error";
                  this.successDialog.open();
                } else{
                  if(this.saveModuleList.length > 0 || this.delModuleList.length > 0){
                    this.getTransactions();
                  }else{
                    this.dialogIcon = "";
                    this.successDialog.open();
                    this.getTransactions();
                  }
                }
            },
            (err) => {
              alert("Exception when calling services [Transaction Saving].");
            });
          }

          if (this.saveModuleList.length > 0 || this.delModuleList.length > 0) {
            let saveUserModules:any = {
              accessLevel : 'USER_GROUP',
              moduleList : [],
              delModuleList: []
            }

            for (let rec of this.saveModuleList) {
              var mod = {
                userGrp: rec.userGrp,
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
                userGrp: rec.userGrp,
                tranCd: rec.tranCd,
                moduleId: rec.moduleId
              };
              saveUserModules.delModuleList.push(del);
            }

            this.securityService.saveModules(saveUserModules).subscribe((data:any)=>{
                if(data['returnCode'] == 0) {
                  this.dialogIcon = "error";
                  this.successDialog.open();
                } else{
                  this.dialogIcon = "";
                  this.successDialog.open();
                  this.getModules();
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
    this.groupConfirm.confirmModal();
  }

  prepareUserGroupTrans() {
    this.saveTranList = [];
    this.delTranList = [];
    for (var i = 0; i < this.PassDataModuleTrans.tableData.length; i++) {
      if(this.PassDataModuleTrans.tableData[i].deleted){
        console.log(this.PassDataModuleTrans.tableData[i])
        this.PassDataModuleTrans.tableData[i].userGrp = this.userGroupData.userGrp;
        this.delTranList.push(this.PassDataModuleTrans.tableData[i]);
      }

      if (this.PassDataModuleTrans.tableData[i].edited == true && !this.PassDataModuleTrans.tableData[i].deleted) {
        this.PassDataModuleTrans.tableData[i].userGrp = this.userGroupData.userGrp;
        this.PassDataModuleTrans.tableData[i].remarks = 'TestData';
        this.PassDataModuleTrans.tableData[i].createUser = this.ns.getCurrentUser();
        this.PassDataModuleTrans.tableData[i].updateUser = this.ns.getCurrentUser();
        this.saveTranList.push(this.PassDataModuleTrans.tableData[i]);
      }
    }
  }

  prepareUserGroupModules() {
    this.saveModuleList = [];
    this.delModuleList = [];

    for (var i = 0; i < this.PassDataModule.tableData.length; i++) {
      if (this.PassDataModule.tableData[i].edited == true && !this.PassDataModule.tableData[i].deleted) {
        this.PassDataModule.tableData[i].userGrp = this.userGroupData.userGrp;
        this.PassDataModule.tableData[i].remarks = 'TestData Modules';
        this.PassDataModule.tableData[i].createUser = this.ns.getCurrentUser();
        this.PassDataModule.tableData[i].updateUser = this.ns.getCurrentUser();

        this.saveModuleList.push(this.PassDataModule.tableData[i]);
      }

      if(this.PassDataModule.tableData[i].deleted){
        this.PassDataModule.tableData[i].userGrp = this.userGroupData.userGrp;
        this.PassDataModule.tableData[i].tranCd = this.userGroupTransactions.indvSelect.tranCd;
        this.delModuleList.push(this.PassDataModule.tableData[i]);
      }
    }
  }

  onClickSaveMain() {
    try {
      this.prepareData();

      this.saveMtnUserGrpParams = {
        userGrpList : this.saveUserGrpList,
        delUserGrpList : this.delUserGrpList
      }

      this.userService.saveMtnUserGrp(this.saveMtnUserGrpParams).subscribe((data:any)=>{
          if(data['returnCode'] == 0) {
            this.dialogIcon = "error";
            this.successDialog.open();
          } else{
            this.dialogIcon = "";
            this.successDialog.open();
            this.getMtnUserGrp();
          }
      },
      (err) => {
        alert("Exception when calling services.");
      });

    } catch (e) {
      alert("Error in e : " + e);
      /*throw new Error("Error in e : " + e);*/
    }
    
  }

  prepareData() {
    this.saveUserGrpList = [];
    this.delUserGrpList = [];
    for (var i = 0; i < this.passDataUserGroup.tableData.length; i++) {

      if (this.passDataUserGroup.tableData[i].deleted == true) {
        this.delUserGrpList.push(this.passDataUserGroup.tableData[i]);
      } else if (this.passDataUserGroup.tableData[i].edited == true) {
        this.passDataUserGroup.tableData[i].createDate = this.ns.toDateTimeString(0);
        this.passDataUserGroup.tableData[i].createUser = this.ns.getCurrentUser();
        this.passDataUserGroup.tableData[i].updateDate = this.ns.toDateTimeString(0);
        this.passDataUserGroup.tableData[i].updateUser = this.ns.getCurrentUser();
        
        this.saveUserGrpList.push(this.passDataUserGroup.tableData[i]);
      }
    }
  }

  deleteUserGrp(){
    this.userGroups.selected  = [this.userGroups.indvSelect];
    this.userGroups.confirmDelete();
  }

  onClickSaveConfirmation() {
    $('#confirm-save #modalBtn2').trigger('click');
  }

}
