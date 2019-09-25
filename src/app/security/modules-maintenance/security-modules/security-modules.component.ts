import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ModuleInfo } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-security-modules',
  templateUrl: './security-modules.component.html',
  styleUrls: ['./security-modules.component.css']
})
export class SecurityModulesComponent implements OnInit {

  @ViewChild("modulesList") modulesList: CustEditableNonDatatableComponent;
  @ViewChild("userListing") userListing: CustEditableNonDatatableComponent;
  @ViewChild("userGroupListing") userGroupListing: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;


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
          prev: [],
          vals: []
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
      uneditable: [true, true],
    }
    
    PassDataUserListing: any = {
      tableData: [],
      tHeader: ['User Id', 'User Name', 'Active'],
      keys:['userId','userName','activeTag'],
      dataTypes: ['text', 'text','checkbox'],
      uneditable: [true, true, true],
      pageID: 7,
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
      pageID: 7,
      pageLength:5,
      searchFlag: true,
      paginateFlag: true,
      infoFlag: true,
      widths: [110,225],
    }

    modulesData : any = {
      createDate: '',
      createUser: null,
      updateDate: '',
      updateUser: null
    }

    edited: any =[];
    deleted: any = [];
    mtnModuleList:any = [];
    delMtnModuleList:any = [];
    dialogIcon: string = "";
    dialogMessage: string = "";
    cancelFlag: boolean = false;

    constructor(private securityService: SecurityService,public modalService: NgbModal, private ns: NotesService, private maintenanceService: MaintenanceService) { }

    ngOnInit() {
      this.getMtnModules();
      this.getModuleGroup();
    }

    getMtnModules() {
      this.passDataModules.tableData = [];
      this.securityService.getMtnModules('', '').subscribe((data: any) => {
        for(var i =0; i < data.modules.length;i++){
          this.passDataModules.tableData.push(data.modules[i]);
          this.passDataModules.tableData[i].uneditable = ['moduleId'];
        }

        this.modulesList.refreshTable();
      });
    }

    getModuleGroup() {
      if(this.passDataModules.opts[0].vals.length === 0 && this.passDataModules.opts[0].prev.length === 0){
        this.maintenanceService.getRefCode('MODULE_GRP').subscribe((data: any) =>{
            for(var ref of data.refCodeList){
              this.passDataModules.opts[0].vals.push(ref.code);
              this.passDataModules.opts[0].prev.push(ref.description);
            }
            this.modulesList.refreshTable();
        });
      }
    }

    getModules(accessLevel) {
      this.PassDataUserListing.tableData = [];
      this.PassDataUserGroupListing.tableData = [];

      if (accessLevel == 'USER') {
        this.securityService.getModules(accessLevel, null, null, null, this.modulesData.moduleId).subscribe((data: any) => {
          for(var i =0; i < data.modules.length;i++){
            this.PassDataUserListing.tableData.push(data.modules[i]);
          }

          this.userListing.refreshTable();
        });
      } else if (accessLevel == 'USER_GROUP') {
        this.securityService.getModules(accessLevel, null, null, null, this.modulesData.moduleId).subscribe((data: any) => {
          for(var i =0; i < data.modules.length;i++){
            this.PassDataUserGroupListing.tableData.push(data.modules[i]);
          }

          this.userGroupListing.refreshTable();
        });
      }
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
        this.modulesData = {
          createDate: '',
          createUser: null,
          updateDate: '',
          updateUser: null
        };
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
      this.getModules('USER');
      $('#users #modalBtn').trigger('click');
    }

    userGroups(){
      this.getModules('USER_GROUP');
      $('#userGroup #modalBtn').trigger('click');
    }

    onConfirmSave() {
      $('#confirm-save #modalBtn2').trigger('click');
    }

   /* saveModules(params) {
        let header: any = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        return this.http.post(environment.prodApiUrl + '/security-service/saveModules',params,header);
    }*/

    onClickSaveMain() {
      console.log("onClickSaveMain");
      this.prepareData();

      let saveMtnModules:any = {
        accessLevel : 'MTN',
        mtnModuleList : this.mtnModuleList,
        delMtnModuleList : this.delMtnModuleList
      }

      this.securityService.saveModules(saveMtnModules).subscribe((data:any)=>{
          console.log("saveModules return data");
          console.log(data);
          if(data['returnCode'] == 0) {
            this.dialogIcon = "error";
            this.successDialog.open();
          } else{
            this.dialogIcon = "";
            this.successDialog.open();
            this.getMtnModules();
          }
      },
      (err) => {
        alert("Exception when calling services [Module Saving].");
      });
    }

    prepareData() {
      this.mtnModuleList = [];
      this.delMtnModuleList = [];

      for (var i = 0; i < this.passDataModules.tableData.length; i++) {
        if (this.passDataModules.tableData[i].deleted == true) {
          this.delMtnModuleList.push(this.passDataModules.tableData[i]);
        } else if (this.passDataModules.tableData[i].edited == true) {
          this.passDataModules.tableData[i].createUser = JSON.parse(window.localStorage.currentUser).username;
          this.passDataModules.tableData[i].updateUser = JSON.parse(window.localStorage.currentUser).username;

          this.mtnModuleList.push(this.passDataModules.tableData[i]);
        }
      }
    }
}
