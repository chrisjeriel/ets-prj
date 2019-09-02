import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService, MaintenanceService, NotesService, UserService } from '@app/_services';
import { UserGroups } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-user-groups-maintenance',
  templateUrl: './user-groups-maintenance.component.html',
  styleUrls: ['./user-groups-maintenance.component.css']
})
export class UserGroupsMaintenanceComponent implements OnInit {


  @ViewChild("userGroups") userGroups: CustEditableNonDatatableComponent;
  @ViewChild("userListing") userListing: CustEditableNonDatatableComponent;
  
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
    tableData: [['001','Secutiry'],['002','Quotation Processing'],['003','Quotation Inquiry']],
    tHeader: ['Tran Code', 'Description'],
    dataTypes: ['text', 'text'],
    pageID: 3,
    pageLength:5,
    searchFlag: true,
    addFlag: true,
    deleteFlag: true,
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
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [77,223],
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

  constructor(private securityServices: SecurityService, public modalService: NgbModal, 
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
    $('#userGroupAccess #modalBtn').trigger('click');
  }

  userListingModal(){
    $('#userListingModal #modalBtn').trigger('click');

    this.passDataUserListing.tableData = [];
    this.userService.retMtnUsers(null, this.userGroupData.userGrp).subscribe((data: any) => {
        console.log(data);
        for(var i =0; i < data.usersList.length;i++){
          this.passDataUserListing.tableData.push(data.usersList[i]);
          this.passDataUserListing.tableData[i].uneditable = ['userId', 'userName', 'activeTag'];
        }

        this.userListing.refreshTable();
    });

  }

}
