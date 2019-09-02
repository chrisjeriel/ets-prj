import { Component, OnInit, ViewChild } from '@angular/core';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { SecurityService, NotesService } from '@app/_services';
import { ModuleInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-security-modules',
  templateUrl: './security-modules.component.html',
  styleUrls: ['./security-modules.component.css']
})
export class SecurityModulesComponent implements OnInit {

  @ViewChild("modulesList") modulesList: CustEditableNonDatatableComponent;

  passDataModules: any = {
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
            updateDate: 1546304400000,
        },
      pageID: 'modules',
      keys: ['moduleId','moduleDesc','moduleGrp','remarks'],
      addFlag: true,
      genericBtn: 'Delete',
      disableGeneric: true,
      pageLength:10,
      /*magnifyingGlass:['userGroup'],*/
      searchFlag: true,
      opts: [{
          selector: 'moduleGrp',
          vals: ['A', 'B'],
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

    modulesData : any = {
      createDate: '',
      createUser: null,
      updateDate: '',
      updateUser: null
    }

    edited: any =[];
    deleted: any = [];

    constructor(private securityServices: SecurityService,public modalService: NgbModal, private ns: NotesService) { }

    ngOnInit() {
      this.getMtnModules();
    }

    getMtnModules() {
      this.passDataModules.tableData = [];
      this.securityServices.getMtnModules(null, null).subscribe((data: any) => {
        for(var i =0; i < data.modules.length;i++){
          this.passDataModules.tableData.push(data.modules[i]);
          this.passDataModules.tableData[i].uneditable = ['moduleId'];
        }

        this.modulesList.refreshTable();
      });
    }

    onRowClick(data){
      console.log(data)
      if(data != null){
        this.passDataModules.disableGeneric = false;
        this.modulesData = data;
        this.modulesData.createDate = this.ns.toDateTimeString(data.createDate);
        this.modulesData.updateDate = this.ns.toDateTimeString(data.updateDate);
      }else{
        this.passDataModules.disableGeneric = true;
      }
    }

    deleteModule(){
    /*if(this.modulesData.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'You are not allowed to delete a Currency Code that is already used in Quotation Processing.';
      this.successDialog.open();
    }else{
      this.modulesData.indvSelect.deleted = true;
      this.modulesData.selected  = [this.modulesData.indvSelect]
      this.modulesData.confirmDelete();
    }*/
      this.modulesList.indvSelect.deleted = true;
      this.modulesList.selected  = [this.modulesList.indvSelect]
      this.modulesList.confirmDelete();
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
