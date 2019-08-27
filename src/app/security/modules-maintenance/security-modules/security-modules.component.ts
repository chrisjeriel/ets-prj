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
      tableData: [],
      tHeader: ['Module ID', 'Description', 'Module Group','Remarks'],
      dataTypes: ['text', 'text', 'select','text'],
      nData: {
            moduleId: '',
            moduleDesc: '',
            moduleGrp: '',
            description: '',
            remarks: '',
            createUser: '',
            createDate: 1546304400000,
            updateUser: '',
            updateDate: 1546304400000
        },
      pageID: 4,
      keys: ['moduleId','moduleDesc','moduleGrp','remarks'],
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
      paginateFlag: true,
    }

    PassDataModuleTrans: any = {
      tableData: [],
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
      this.securityServices.getMtnModules(null, null).subscribe((data: any) => {
        this.PassData.tableData = data['modules'];
      });
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
