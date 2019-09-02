import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService, UserService, QuotationService, NotesService } from '@app/_services';
import { UsersInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild("usersList") usersList: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  
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
    genericBtn: 'Delete',
    pageID: 'secUsers',
    disableGeneric : true,
    searchFlag: true,
    widths:[60,200,50,300,50,'auto','auto'],
    paginateFlag: true,
  }

  PassDataModuleTrans: any = {
    tableData: [['001','Secutiry'],['002','Quotation Processing'],['003','Quotation Inquiry']],
    tHeader: ['Tran Code', 'Description'],
    dataTypes: ['text', 'text'],
    pageID: 1,
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [77,223],
  }

  PassDataModule: any = {
    tableData: [['QUOTE018','Change Quote Status']],
    tHeader: ['Module Id', 'Description'],
    dataTypes: ['text', 'text'],
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [77,223],
  }

  PassDataModuleTransUser: any = {
    tableData: [['001','Secutiry'],['002','Quotation Processing'],['003','Quotation Inquiry']],
    tHeader: ['Tran Code', 'Description'],
    dataTypes: ['text', 'text'],
    pageID: 3,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [77,223],
  }

  PassDataModuleUser: any = {
    tableData: [['QUOTE001','Quotation Processing'],['QUOTE002','General Info (Quotation)'],['QUOTE003','Coverage (Quotation)'],['QUOTE004','Quote Option (Quotation)'],['QUOTE005','Endorsement (Quotation)']],
    tHeader: ['Module Id', 'Description'],
    dataTypes: ['text', 'text'],
    pageID: 5,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [77,223],
  }

  userData:any = {
    createDate: '',
    createUser: null,
    updateDate: '',
    updateUser: null
  };

  dialogMessage : string = '';
  dialogIcon: any;
  btnDisabled:boolean = true;
  passLOVData: any = {
      selector:'',
      data:{}
  }

  constructor(private securityServices: SecurityService, private ns: NotesService, public modalService: NgbModal, private userService: UserService) { }

  ngOnInit() {
    this.getMtnUsers();
  }

  getMtnUsers() {
      this.passDataUsers.tableData = [];
      this.userService.retMtnUsers(null).subscribe((data: any) => {
        for(var i =0; i < data.usersList.length;i++){
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

  clickUserGroupLOV(data,from){
    this.passLOVData.from = from;
    this.passLOVData.selector = 'userGrp';
    this.usersList.tableData.filter((a)=>{return !a.deleted}).map(a=>a.userGrp);
    
    setTimeout(() => {
      $('#lov #modalBtn2').trigger('click');
    });
  }

  setSelected(data) {
    this.passDataUsers.tableData = this.passDataUsers.tableData.filter(a => a.showMG != 1);
    for(let i of data) {
      this.passDataUsers.tableData.push(JSON.parse(JSON.stringify(this.passDataUsers.nData)));
      this.passDataUsers.tableData[this.passDataUsers.tableData.length - 1].showMG = 0;
      this.passDataUsers.tableData[this.passDataUsers.tableData.length - 1].userGrp = i.userGrp;
      this.passDataUsers.tableData[this.passDataUsers.tableData.length - 1].userGrpDesc = i.userGrpDesc;
      this.passDataUsers.tableData[this.passDataUsers.tableData.length - 1].edited = true;
    }
    $('#cust-table-container').addClass('ng-dirty');
    this.usersList.refreshTable();
  }

  updateUsers(data) {
    console.log("updateUsers");
  }

  resetPassword(){
    $('#resetPassword #modalBtn').trigger('click');
  }

  changePassword(){
    $('#changePassword #modalBtn').trigger('click');
  }

  userAccess(){
    $('#userAccess #modalBtn').trigger('click');
  }

  userGroupAccess(){
    $('#userGroupAccess #modalBtn').trigger('click');
  }
}
