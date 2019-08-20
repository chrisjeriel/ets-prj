import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/_services';
import { UsersInfo } from '@app/_models';
import { QuotationService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  PassData: any = {
    tableData: this.securityServices.getUsersInfo(),
    tHeader: ['User ID', 'User Name', 'User Group', 'Description','Active', 'Email','Remarks'],
    dataTypes: ['text', 'text', 'text','text', 'text', 'text','text'],
    nData: new UsersInfo(null,null,null,null,null,null,null),
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:10,
    magnifyingGlass:['userGroup'],
    searchFlag: true,
    widths: [],
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

  constructor(private securityServices: SecurityService, public modalService: NgbModal) { }

  ngOnInit() {
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
