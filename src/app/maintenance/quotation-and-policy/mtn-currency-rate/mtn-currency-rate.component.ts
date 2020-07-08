import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MaintenanceService, NotesService} from '@app/_services'
import { MtnCurrencyCodeComponent } from '@app/maintenance/mtn-currency-code/mtn-currency-code.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { Title } from '@angular/platform-browser';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mtn-currency-rate',
  templateUrl: './mtn-currency-rate.component.html',
  styleUrls: ['./mtn-currency-rate.component.css']
})
export class MtnCurrencyRateComponent implements OnInit, AfterViewInit {

  @ViewChild(MtnCurrencyCodeComponent) currencyLov: MtnCurrencyCodeComponent;
  @ViewChild('currency') table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) cs : ConfirmSaveComponent;
  @ViewChild('myForm') form:any;

  passData: any = {
    tHeader: [ "Hist No","Currency Rate","Eff Date From", "Active","Remarks"],
    tableData:[],
    dataTypes: ['sequence-3','currencyRate','date',"checkbox", "text"],
    nData: {
      histNo: null,
      currencyRt: null,
      effDateFrom: null,
      activeTag: 'Y',
      remarks: null,
      createDate: '',
      createUser: JSON.parse(window.localStorage.currentUser).username,
      description: null,
      updateDate: '',
      updateUser: JSON.parse(window.localStorage.currentUser).username
    },
    pageID: 'currencyRt',
    //checkFlag: true,
    disableGeneric : true,
    disableAdd:true,
    addFlag: true,
    genericBtn:'Delete',
    searchFlag: true,
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    uneditable:[true,false,false,false,,false],
    widths:[100,'auto','auto',70,400],
    keys:['histNo','currencyRt','effDateFrom','activeTag','remarks'],
    //keys:['section','bulletNo','coverCdAbbr','sumInsured','addSi']
  };

  currencyData: any = {
    createUser:'',
    createDate:null,
    updateUser:'',
    updateDate:null,
  }

  saveData : any ={
    saveCurrencyRt: []
  }

  currencyCd: any = '';
  description:any = '';
  editedData:any = [];
  deletedData:any = [];
  cancelFlag:boolean;
  dialogMessage : string = '';
  dialogIcon: any;
  errorFlag: boolean = false;
  firstLoading: boolean;
  changeCurr: boolean;
  tempCurr: string = '';
  prevEvent:any;
  exit: boolean ;

  formGroup: FormGroup = new FormGroup({});

  ngAfterViewInit() {
      this.table.loadingFlag = false;
      this.table.form.forEach((f,i)=>{
        this.formGroup.addControl('table'+i, f.control); 
      })
  }


  constructor(private maintenanceService: MaintenanceService, private ns: NotesService,private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
    this.titleService.setTitle("Mtn | Currency Rate");
    this.firstLoading = true;
    this.getCurrencyRate();
  }

  getCurrencyRate(){
    this.passData.disableGeneric = true
    if(this.currencyCd == '' || this.currencyCd == null){
      this.emptyTbl();
    }else{
      this.maintenanceService.getMtnCurrencyRt(this.currencyCd).subscribe((data:any) => {
        var currData = data.currencyCd;
        this.passData.tableData = [];
        for(var i = 0;i < currData.length;i++){
          this.passData.tableData.push(currData[i]);
          this.passData.tableData[i].uneditable = ['histNo']
        }
         this.table.refreshTable();
      });
    }
  }

  // clickRow(data){
  //   this.currencyData = data;
  //   if(data !== null && data.okDelete !== 'N'){
  //     this.passData.disableGeneric = false
  //     this.currencyData.createDate = this.ns.toDateTimeString(data.createDate);
  //     this.currencyData.updateDate = this.ns.toDateTimeString(data.updateDate);
  //   }else{
  //     /*this.currencyData.createUser = null;
  //     this.currencyData.createDate = null;
  //     this.currencyData.updateDate = null;
  //     this.currencyData.updateUser = null;*/
  //     this.passData.disableGeneric = true
  //   }
  // }

  clickRow(event){
    console.log(event);
    if(event !== null){
      this.currencyData.updateDate  = this.ns.toDateTimeString(event.updateDate);
      this.currencyData.updateUser  = event.updateUser;
      this.currencyData.createDate  = this.ns.toDateTimeString(event.createDate);
      this.currencyData.createUser  = event.createUser;
      this.passData.disableGeneric =  (event.okDelete == 'N')?true:false;
    }else{
      this.currencyData.updateDate  = '';
      this.currencyData.updateUser  = '';
      this.currencyData.createDate  = '';
      this.currencyData.createUser  = '';
      this.passData.disableGeneric = true;
    }
  }

  showCurrencyModal(){
    $('#currencyModal #modalBtn').trigger('click');
    $('#currencyModal #modalBtn').addClass('ng-dirty')
  }

  checkCode(ev){
    this.ns.lovLoader(ev, 1);
    this.currencyLov.checkCode(this.currencyCd.toUpperCase(), ev);
    // if(this.currencyCd === null || this.currencyCd === ''){
    //   this.description = null;
    //   this.passData.tableData = [];
    //   this.passData.disableAdd = true;
    //   this.currencyData = null;
    //   this.table.refreshTable();
    // }

    // if(this.firstLoading){
    //  this.ns.lovLoader(ev, 1);
    //  this.currencyLov.checkCode(this.currencyCd.toUpperCase(), ev);
    //  $('.ng-dirty').removeClass('ng-dirty'); 
    // }else{
    //   if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
    //     this.changeCurr = true;
    //     this.cancelBtn.clickCancel(); 
    //   }else{
    //     this.changeCurr = false;
    //     this.ns.lovLoader(ev, 1);
    //     this.currencyLov.checkCode(this.currencyCd.toUpperCase(), ev);
    //   }
    // }
  }

  checkCancel(){
      if(this.cancelFlag){
        if(this.changeCurr){
            this.changeCurr = false;
            if(this.exit){
                this.cancelBtn.url = '/maintenance-qu-pol';
                this.cancelBtn.onNo(); 
            }else{
                this.modalService.dismissAll();
                return;
            }
        }else{
            this.cancelBtn.onNo();
        }
      }
  }

  onClickNo(){
      if(this.exit){
          this.changeCurr = false;
          this.cancelBtn.url = '/maintenance-qu-pol';
          this.cancelBtn.onNo(); 
      }else{
          this.currencyLoading();
          this.getCurrencyRate();
      }
  }

  onCancel(){
      this.currencyCd = this.tempCurr;
      this.modalService.dismissAll();
  }

  setCurrency(data){
    console.log(data)
    this.passData.disableAdd = false;
    //this.passData.disableGeneric = true;
    this.firstLoading = false;
    this.currencyCd = data.currencyCd;
    this.description = data.description;
    this.ns.lovLoader(data.ev, 0);
    this.getCurrencyRate();
  }

  emptyTbl(){
    this.passData.disableAdd = true;
    this.passData.tableData = [];
  }

  prepareData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    //this.prepareData();
    this.editedData = [];
    this.deletedData = [];

    for(var i = 0; i< this.passData.tableData.length; i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.editedData.push(this.passData.tableData[i]);
        this.editedData[this.editedData.length - 1].currencyCd = this.currencyCd;
        this.editedData[this.editedData.length - 1].currencyRt = parseFloat(this.editedData[this.editedData.length - 1].currencyRt).toFixed(6);
        this.editedData[this.editedData.length - 1].effDateFrom = this.ns.toDateTimeString(this.passData.tableData[i].effDateFrom);
        this.editedData[this.editedData.length - 1].effDateTo = this.ns.toDateTimeString(this.passData.tableData[i].effDateTo);
        this.editedData[this.editedData.length - 1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        this.editedData[this.editedData.length - 1].createDate = this.ns.toDateTimeString(0);
        this.editedData[this.editedData.length - 1].updateDate = this.ns.toDateTimeString(0);
      }else if(this.passData.tableData[i].deleted){
        this.deletedData.push(this.passData.tableData[i]);
        this.deletedData[this.deletedData.length - 1].currencyCd = this.currencyCd;
      }
    }

    this.saveData.saveCurrencyRt = this.editedData;
    this.saveData.delCurrencyRt = this.deletedData;

    if(this.editedData.length === 0 && this.deletedData.length === 0){
      setTimeout(()=> {
      this.dialogMessage = "Nothing to Save.";
      this.dialogIcon = "info";
      this.successDiag.open();
      },0);
    }else {
      if(this.changeCurr){
        this.currencyLoading();
        this.currencyCd = this.tempCurr;
      }
      if(cancelFlag){
        this.cs.showLoading(true);
        setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},0);
      }else{
        this.cs.confirmModal();
      }
    }
  }

  onClickSave(){
    /*this.errorFlag = false;
    let currEffDateTo:Date;
    let currEffDateFrom:Date;
    let nextEffDateTo:Date;
    let nextEffDateFrom:Date;
    var active = this.passData.tableData.filter(a => a.activeTag == 'Y')
    for(var i = 0 ;i < active.length;i++){
      for(var j = 0 ; j < active.length;j++){
        if( i == j){
          continue;
        }
        // effDateFrom: null,
        // effDateTo: null,
        currEffDateTo = new Date(active[i].effDateTo);
        currEffDateFrom = new Date(active[i].effDateFrom);
        nextEffDateTo = new Date(active[j].effDateTo);
        nextEffDateFrom = new Date(active[j].effDateFrom);
        if(currEffDateFrom >= nextEffDateFrom &&  currEffDateFrom <= nextEffDateTo){
          this.dialogMessage = 'Unable to save the record. The Value of Eff. Date From ('+(currEffDateFrom.getMonth()+1)+'/'+currEffDateFrom.getDate()+'/'+currEffDateFrom.getFullYear() +') is within the effectivity of Hist. No. '+active[j].histNo;
          this.dialogIcon = "error-message";
          this.successDiag.open(); 
          return;
        }else if(currEffDateTo >= nextEffDateFrom &&  currEffDateTo <= nextEffDateTo){
          this.dialogMessage = 'Unable to save the record. The Value of Eff. Date To ('+(currEffDateTo.getMonth()+1)+'/'+currEffDateTo.getDate()+'/'+currEffDateTo.getFullYear() +') is within the effectivity of Hist. No. '+active[j].histNo;
          this.dialogIcon = "error-message";
          this.successDiag.open(); 
          return;
        }

      }
    }*/
    
     $('#confirm-save #modalBtn2').trigger('click');
  }

  saveCurrRt(){
    this.maintenanceService.saveMtnCurrencyRt(this.saveData).subscribe((data:any) => {
     if(data['returnCode'] == 0) {
       this.dialogMessage = data['errorList'][0].errorMessage;
       this.dialogIcon = "error";
       this.successDiag.open();
     } else{
       this.dialogIcon = "success";
       this.successDiag.open();
       this.getCurrencyRate();
       this.table.markAsPristine();
       this.passData.disableGeneric = false;
     }
    });
  }

  deleteCurr(){
      this.table.selected  = [this.table.indvSelect];
      this.table.confirmDelete();
  }

  cancel(){
    this.exit = true;
    this.cancelBtn.clickCancel();
  }

  currencyLoading(){
    this.ns.lovLoader(this.prevEvent, 1);
    this.currencyLov.checkCode(this.currencyCd.toUpperCase(), this.prevEvent);
  }
}
