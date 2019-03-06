import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/_services';
import { UserGroups } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-groups-maintenance',
  templateUrl: './user-groups-maintenance.component.html',
  styleUrls: ['./user-groups-maintenance.component.css']
})
export class UserGroupsMaintenanceComponent implements OnInit {
  
  PassData: any = {
    tableData: this.securityServices.getUsersGroup(),
    tHeader: ['User Group', 'Description','Remarks'],
    dataTypes: ['text', 'text', 'text'],
    nData: new UserGroups(null,null,null),
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
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

  PassDatAUserListing: any = {
    tableData: [['LCUARESMA','Lope Cuaresma','Y']],
    tHeader: ['User Id', 'User Name', 'Active'],
    dataTypes: ['text', 'text','checkbox'],
    pageID: 7,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [110,225,30],
  }

  constructor(private securityServices: SecurityService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  userAccess(){
    $('#userAccess #modalBtn').trigger('click');
  }

  userGroupAccess(){
    $('#userGroupAccess #modalBtn').trigger('click');
  }

}
