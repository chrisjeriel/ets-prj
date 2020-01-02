import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService, NotesService } from '@app/_services';
import { ModuleTransaction } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-module-transactions',
  templateUrl: './module-transactions.component.html',
  styleUrls: ['./module-transactions.component.css']
})
export class ModuleTransactionsComponent implements OnInit {

 @ViewChild("modulesList") modulesList: CustEditableNonDatatableComponent;
 @ViewChild("usersWithAccess") usersWithAccess: CustEditableNonDatatableComponent;
 @ViewChild("table") table: CustEditableNonDatatableComponent;
 @ViewChild("userGroupWithAccess") userGroupWithAccess: CustEditableNonDatatableComponent;
 @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
 @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
 @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;

 PassDataTransactions: any = {
    tableData: [],
    tHeader: ['Tran Code', 'Description','Remarks'],
    dataTypes: ['text', 'text', 'text'],
    keys: ['tranCd','tranDesc','remarks'],
    nData: {
        tranCd: '',
        tranDesc: '',
        remarks: '',
        createUser: '',
        createDate: 1546304400000,
        updateUser: '',
        updateDate: 1546304400000
    },
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:10,
    searchFlag: true,
    paginateFlag: true,
    widths: [],
  }

  PassDataModules: any = {
    tableData: [],
    tHeader: ['Module Id', 'Description'],
    dataTypes: ['text', 'text'],
    keys: ['moduleId','moduleDesc'],
    pageID: 1,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [110,225],
  }

  PassDataUserListing: any = {
    tableData: [],
    tHeader: ['User Id', 'User Name', 'Active'],
    keys:['userId','userName','activeTag'],
    dataTypes: ['text', 'text','checkbox'],
    uneditable: [true, true, true],
    pageID: 2,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [110,225,30],
  }

  PassDataUserGroupListing: any = {
    tableData: [],
    tHeader: ['User Group', 'Descripition'],
    keys:['userGrp','userGrpDesc'],
    dataTypes: ['text', 'text'],
    uneditable: [true, true],
    pageID: 3,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [110,225],
  }

  params:any ={
    accessLevel : '',
    transactionList : [],
    delTranList : []
  }

  transactionData:any = {};
  btnDisabled:boolean = true;
  cancelFlag: boolean = false;
  dialogIcon: string = "";
  dialogMessage: string = "";

  constructor(private securityService: SecurityService,public modalService: NgbModal, private ns: NotesService) { }

  ngOnInit() {
      this.getMtnTransactions();
  }

  getMtnTransactions() {
    setTimeout(() => {this.table.loadingFlag = true});
    this.securityService.getMtnTransactions(null, null).subscribe((data: any) => {
      this.PassDataTransactions.tableData = data['transactions'];
      this.table.loadingFlag = false;
    });
  }

  onRowClickTransactions(data){
    if(data != null){
      this.btnDisabled = false;
      this.transactionData = data;
      this.transactionData.createDate = this.ns.toDateTimeString(data.createDate);
      this.transactionData.updateDate = this.ns.toDateTimeString(data.updateDate);
    }else{
      this.btnDisabled = true;
      this.transactionData = {};
    }
  }

  getMtnModules() {
      this.PassDataModules.tableData = [];
      this.modulesList.loadingFlag = true;
      this.securityService.getMtnModules(null, this.transactionData.tranCd).subscribe((data: any) => {
        for(var i =0; i < data.modules.length;i++){
          this.PassDataModules.tableData.push(data.modules[i]);
          this.PassDataModules.tableData[i].uneditable = ['moduleId', 'moduleDesc'];
        }
        this.modulesList.loadingFlag = false;
        this.modulesList.refreshTable();
      });
  }

  modules(){
    this.getMtnModules();
    $('#modules #modalBtn').trigger('click');
  }

  onClickUsersWithAccess(){
      this.getTransactions('USER');
      $('#users #modalBtn').trigger('click');
  }

  onClickUserGroupWithAccess(){
      this.getTransactions('USER_GROUP');
      $('#userGroup #modalBtn').trigger('click');
  }

  getTransactions(accessLevel) {
      this.PassDataUserListing.tableData = [];
      this.PassDataUserGroupListing.tableData = [];

      if (accessLevel == 'USER') {
        this.usersWithAccess.loadingFlag = true;
        this.securityService.getTransactions(accessLevel, null, null, this.transactionData.tranCd).subscribe((data: any) => {
          for(var i =0; i < data.transactions.length;i++){
            this.PassDataUserListing.tableData.push(data.transactions[i]);
          }
          this.usersWithAccess.loadingFlag = false;
          this.usersWithAccess.refreshTable();
        });
      } else if (accessLevel == 'USER_GROUP') {
        this.userGroupWithAccess.loadingFlag = true;
        this.securityService.getTransactions(accessLevel, null, null, this.transactionData.tranCd).subscribe((data: any) => {
          for(var i =0; i < data.transactions.length;i++){
            this.PassDataUserGroupListing.tableData.push(data.transactions[i]);
          }
          this.userGroupWithAccess.loadingFlag = false;
          this.userGroupWithAccess.refreshTable();
        });
      }
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  prepareData(){
    this.params.transactionList = [];
    this.params.delTranList = [];
    for (var i = 0; i < this.PassDataTransactions.tableData.length; i++) {
      if(this.PassDataTransactions.tableData[i].edited && !this.PassDataTransactions.tableData[i].deleted){

        this.PassDataTransactions.tableData[i].createUser = this.ns.getCurrentUser();
        this.PassDataTransactions.tableData[i].updateUser = this.ns.getCurrentUser();

        this.params.transactionList.push(this.PassDataTransactions.tableData[i]);
      }

      if(this.PassDataTransactions.tableData[i].deleted){
        this.params.delTranList.push(this.PassDataTransactions.tableData[i]);
      }
    }
  }

  saveData(cancel?){
    this.cancelFlag = cancel !== undefined;
    this.prepareData();
    this.params.accessLevel = 'MTN';
    this.securityService.saveTransactions(this.params).subscribe((data:any) => {
      if(data['returnCode'] == 0) {
        this.dialogIcon = "error";
        this.successDialog.open();
      } else{
        this.dialogIcon = "";
        this.successDialog.open();
        this.getMtnTransactions();
      }
    });
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }
}
