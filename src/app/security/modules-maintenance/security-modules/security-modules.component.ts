import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/_services';
import { ModuleInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-security-modules',
  templateUrl: './security-modules.component.html',
  styleUrls: ['./security-modules.component.css']
})
export class SecurityModulesComponent implements OnInit {

  PassData: any = {
      tableData: this.securityServices.getModuleInfo(),
      tHeader: ['Module ID', 'Description', 'Module Group','Remarks'],
      dataTypes: ['text', 'text', 'select','text'],
      nData: new ModuleInfo(null,null,null,null),
      pageID: 4,
      addFlag: true,
      deleteFlag: true,
      pageLength:10,
      magnifyingGlass:['userGroup'],
      searchFlag: true,
      opts: [{
          selector: 'moduleGroup',
          vals: ['Quotation', 'Testing'],
      }],
      widths: [],
    }

    PassDataModuleTrans: any = {
      tableData: [['001','Security'],['002','Quotation Processing'],['003','Quotation Inquiry']],
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

    PassDataUserGroups: any = {
      tableData: [['001','Admin'],['002','Engineering']],
      tHeader: ['User Group', 'Description'],
      dataTypes: ['text', 'text'],
      pageID: 6,
      pageLength:10,
      searchFlag: true,
      widths: [],
    }

    constructor(private securityServices: SecurityService,public modalService: NgbModal) { }

    ngOnInit() {
    }

    transactions(){
      $('#transactions #modalBtn').trigger('click');
    }

    user(){
      $('#users #modalBtn').trigger('click');
    }

    userGroups(){
      $('#userGroup #modalBtn').trigger('click');
    }

}
