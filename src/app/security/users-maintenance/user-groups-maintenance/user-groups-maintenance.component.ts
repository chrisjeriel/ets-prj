import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService, MaintenanceService, NotesService, UserService } from '@app/_services';
import { UserGroups } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';


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
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  
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
    disableGeneric: true,
    genericBtn: 'Delete',
    pageID: 'userGroup',
    addFlag: true,
    pageLength:10,
    magnifyingGlass:['userGroup'],
    searchFlag: true,
    widths: [],
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
    pageID: 3,
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
  saveTranList:any = [];
  saveModuleList:any = [];
  dialogIcon: string = "";
  dialogMessage: string = "";
  cancelFlag: boolean = false;

  ngOnInit() {
    this.getMtnUserGrp();
  }

  getMtnUserGrp() {
      this.passDataUserGroup.tableData = [];
      this.maintenanceService.getMtnUserGrp(null).subscribe((data: any) => {
        console.log(data);
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
    this.clearTranModuleTables();
    this.getTransactions();
    $('#userGroupAccess #modalBtn').trigger('click');
  }

  clearTranModuleTables() {
    this.PassDataModuleTrans.tableData = [];
    this.PassDataModule.tableData = [];
  }

  getTransactions() {
      this.PassDataModuleTrans.tableData = [];

      this.securityService.getTransactions('USER_GROUP', null, this.userGroupData.userGrp, null).subscribe((data: any) => {
        for(var i =0; i < data.transactions.length;i++){
          this.PassDataModuleTrans.tableData.push(data.transactions[i]);
          this.PassDataModuleTrans.tableData[i].showMG = 0;
          this.PassDataModuleTrans.tableData[i].uneditable = ['tranCd', 'tranDesc'];
        }

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
      
      setTimeout(() => {
        $('#lov #modalBtn2').trigger('click');
      });

      this.selRecordRow = data.index;
    } else if (from == 'modules') {
      this.passLOVData.from = from;
      this.passLOVData.selector = 'mtnModules';
      this.passLOVData.tranCd = this.transData.tranCd;
      this.userGroupModules.tableData.filter((a)=>{return !a.deleted}).map(a=>a.moduleId);
      
      setTimeout(() => {
        $('#lov #modalBtn2').trigger('click');
      });

      this.selRecordRow = data.index;
    }

    this.fromLOV = from;
  }

  setSelected(data) {
    if (this.fromLOV == 'transactions') {
      this.PassDataModuleTrans.tableData[this.selRecordRow].edited = true;
      this.PassDataModuleTrans.tableData[this.selRecordRow].tranCd = data.data.tranCd;
      this.PassDataModuleTrans.tableData[this.selRecordRow].tranDesc = data.data.tranDesc;
      this.PassDataModuleTrans.tableData[this.selRecordRow].showMG = 1;
      $('#cust-table-container').addClass('ng-dirty');
      this.userGroupTransactions.refreshTable();
    } else if (this.fromLOV == 'modules') {
      this.PassDataModule.tableData[this.selRecordRow].edited = true;
      this.PassDataModule.tableData[this.selRecordRow].tranCd = this.transData.tranCd;
      this.PassDataModule.tableData[this.selRecordRow].moduleId = data.data.moduleId;
      this.PassDataModule.tableData[this.selRecordRow].moduleDesc = data.data.moduleDesc;
      this.PassDataModule.tableData[this.selRecordRow].showMG = 1;
      $('#cust-table-container').addClass('ng-dirty');
      this.userGroupModules.refreshTable();
    }
    
  }

  userListingModal(){
    this.passDataUserListing.tableData = [];
    this.userService.retMtnUsers(null, this.userGroupData.userGrp).subscribe((data: any) => {
        console.log(data);
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

      this.getModules();
    }else{
      this.transData = {};
    }
  }

  getModules() {
    this.PassDataModule.tableData = [];
    
    this.securityService.getModules('USER_GROUP', null, this.userGroupData.userGrp, this.transData.tranCd).subscribe((data: any) => {
      for(var i =0; i < data.modules.length;i++){
        this.PassDataModule.tableData.push(data.modules[i]);
        this.PassDataModule.tableData[i].showMG = 1;
        this.PassDataModule.tableData[i].uneditable = ['moduleId', 'moduleDesc'];
      }

      this.userGroupModules.refreshTable();
    });

  }

  onClickSaveTranModules() {
    try {
      this.prepareUserGroupTrans();
      this.prepareUserGroupModules();

      

      if (this.saveTranList.length > 0 || this.saveModuleList.length > 0) {
          if (this.saveTranList.length > 0) {
            let saveUserTransactions:any = {
              accessLevel : 'USER_GROUP',
              transactionList : []
            }

            for (let rec of this.saveTranList) {
              var tran = {
                userGrp: rec.userGrp,
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
                  this.getTransactions();
                }
            },
            (err) => {
              alert("Exception when calling services [Transaction Saving].");
            });
          }

          if (this.saveModuleList.length > 0) {
            let saveUserModules:any = {
              accessLevel : 'USER_GROUP',
              moduleList : []
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

  prepareUserGroupTrans() {
    this.saveTranList = [];
    for (var i = 0; i < this.PassDataModuleTrans.tableData.length; i++) {
      if (this.PassDataModuleTrans.tableData[i].edited == true) {
        this.PassDataModuleTrans.tableData[i].userGrp = this.userGroupData.userGrp;
        this.PassDataModuleTrans.tableData[i].remarks = 'TestData';
        this.PassDataModuleTrans.tableData[i].createUser = JSON.parse(window.localStorage.currentUser).username;
        this.PassDataModuleTrans.tableData[i].updateUser = JSON.parse(window.localStorage.currentUser).username;
        

        this.saveTranList.push(this.PassDataModuleTrans.tableData[i]);
      }
    }
    
    console.log("this.saveTranList");
    console.log(this.saveTranList);

  }

  prepareUserGroupModules() {
    this.saveModuleList = [];

    for (var i = 0; i < this.PassDataModule.tableData.length; i++) {
      if (this.PassDataModule.tableData[i].edited == true) {
        this.PassDataModule.tableData[i].userGrp = this.userGroupData.userGrp;
        this.PassDataModule.tableData[i].remarks = 'TestData Modules';
        this.PassDataModule.tableData[i].createUser = JSON.parse(window.localStorage.currentUser).username;
        this.PassDataModule.tableData[i].updateUser = JSON.parse(window.localStorage.currentUser).username;

        this.saveModuleList.push(this.PassDataModule.tableData[i]);
      }
    }
    
    console.log("this.saveModuleList");
    console.log(this.saveModuleList);
  }

}
