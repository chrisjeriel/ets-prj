import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services'
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mtn-cat-peril',
  templateUrl: './mtn-cat-peril.component.html',
  styleUrls: ['./mtn-cat-peril.component.css']
})
export class MtnCATPerilComponent implements OnInit, AfterViewInit {
  
  formGroup: FormGroup = new FormGroup({});
  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild('catPeril') table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  passData: any = {
    tHeader: [ "CAT Peril No","Name","Abbreviation","Percent Share on Premium (%)", "Active","Remarks"],
    tableData:[],
    dataTypes: ['sequence-3','text','text','percent',"checkbox", "text"],
    nData: {
      objectId:'000',
      catPerilNo: null,
      name: null,
      abbreviation: null,
      pctShare: null,
      activeTag: 'Y',
      remarks: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      description: null,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'catPeril',
    //checkFlag: true,
    disableGeneric : true,
    addFlag: true,
    genericBtn:'Delete',
    disableAdd: true,
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[true,false,false,false,false,false],
    widths:[100,'auto','auto','auto',70,400],
    keys:['catPerilId','catPerilName','catPerilAbbr','pctSharePrem','activeTag','remarks']
  };

  line: any = '';
  description: any = '';
  cancelFlag:boolean;
  edited: any = [];
  deleted: any = [];
  dialogMessage : string = '';
  dialogIcon: any;

  perilData : any = {
  	createUser: null,
  	createDate: '',
  	updateUser: null,
  	updateDate: ''
  }

  saveData:any ={
    delCatPeril :[],
    saveCatPeril: []
  }

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngAfterViewInit() {
      this.table.loadingFlag = false;
      this.table.form.forEach((f,i)=>{
        this.formGroup.addControl('table'+i, f.control); 
      })
  }

  ngOnInit() {
    this.getCatPeril();
  }

  getCatPeril(){
    if(this.line == '' || this.line == null){
      this.passData.disableAdd = true;
      this.passData.disableGeneric = true;
      this.passData.tableData = [];
      this.table.refreshTable();
    }else{
        this.passData.tableData = [];
        this.passData.disableAdd = false;
        this.maintenanceService.getMtnCatPeril(this.line,'000').subscribe((data:any) => {
          console.log(data)
          for(var i = 0; i< data.catPerilList.length; i++){
              this.passData.tableData.push(data.catPerilList[i]);
          }
          this.table.refreshTable();
        })

    }
  }

  checkCode(ev){
    this.ns.lovLoader(ev, 1);
    this.lineLov.checkCode(this.line.toUpperCase(), ev);
  }

  showLineLOV(){
    $('#lineLOV #modalBtn').trigger('click');
  }

  setLine(data){
    this.line = data.lineCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.getCatPeril();
  }

  // clickRow(data){
  //    if(data !== null){
  //     this.passData.disableGeneric = false
  //     this.perilData = data;
  //     this.perilData.createDate = this.ns.toDateTimeString(data.createDate);
  //     this.perilData.updateDate = this.ns.toDateTimeString(data.updateDate);
  //   }else{
  //     this.passData.disableGeneric = true
  //   }
  // }

  // clickRow(data){
  //   console.log(data)
  //   if(data != null){
  //     this.passData.disableGeneric = false;
  //     this.perilData = data;
  //     this.perilData.updateDate = this.ns.toDateTimeString(data.updateDate);
  //     this.perilData.createDate = this.ns.toDateTimeString(data.createDate);
  //   }else{
  //     this.passData.disableGeneric = true;
  //     this.perilData.createUser = '';
  //     this.perilData.updateUser = '';
  //     this.perilData.updateDate = '';
  //     this.perilData.createDate = '';
  //   }  
  // }

  clickRow(event){
    console.log(event);
    if(event !== null){
      this.perilData.updateDate  = this.ns.toDateTimeString(event.updateDate);
      this.perilData.updateUser  = event.updateUser;
      this.perilData.createDate  = this.ns.toDateTimeString(event.createDate);
      this.perilData.createUser  = event.createUser;
      this.passData.disableGeneric = false;
    }else{
      this.perilData.updateDate  = '';
      this.perilData.updateUser  = '';
      this.perilData.createDate  = '';
      this.perilData.createUser  = '';
      this.passData.disableGeneric = true;
    }
  }

  deleteCurr(){
      this.table.indvSelect.deleted = true;
      this.table.selected  = [this.table.indvSelect]
      this.table.confirmDelete();
  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }

  prepareData(){
    this.edited = [];
    this.deleted = [];
    for(var i = 0; i < this.passData.tableData.length; i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.edited.push(this.passData.tableData[i])
        this.edited[this.edited.length - 1 ].lineCd = this.line;
        this.edited[this.edited.length - 1 ].updateUser = JSON.parse(window.localStorage.currentUser).username;
        this.edited[this.edited.length - 1 ].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[i].deleted){
        this.deleted.push(this.passData.tableData[i])
          this.deleted[this.deleted.length - 1].lineCd = this.line;
      }
    }
    this.saveData.delCatPeril = this.deleted; 
    this.saveData.saveCatPeril  = this.edited;
  }

  saveCat(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();

     this.maintenanceService.saveMtnCatPeril(this.saveData).subscribe((data) => {
       console.log(data)
       if(data['returnCode'] == 0) {
           this.dialogMessage = data['errorList'][0].errorMessage;
           this.dialogIcon = "error";
           this.cancelFlag = false;
           this.successDiag.open();
         } else{
           this.dialogIcon = "success";
           this.successDiag.open();
           this.formGroup.markAsPristine();
           this.getCatPeril();
         }
     });
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

}
