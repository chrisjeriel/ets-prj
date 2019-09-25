import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService } from '@app/_services'; 
import { DecimalPipe } from '@angular/common';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-jv-entry-service',
  templateUrl: './jv-entry-service.component.html',
  styleUrls: ['./jv-entry-service.component.css']
})
export class JvEntryServiceComponent implements OnInit {
   
  @Input() data: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(LovComponent)lov: LovComponent;
  @ViewChild(MtnCurrencyComponent) currLov: MtnCurrencyComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  entryData:any = {
    jvYear:'',
    jvNo: '',
    status: '',
    autoTag:'',
    refNo:'',
    refNoDate:'',
    jvType: '',
    particulars: '',
    currencyCd:'',
    jvAmt:'',
    localAmt:'',
    preparedBy:'',
    preparedDate:'',
    approvedBy:'',
    approvedDate:''
  }

  jvDatas: any = {
    closeDate : '', 
    createDate : '', 
    createUser : '', 
    deleteDate : '',   
    postDate : '', 
    tranClass : '', 
    tranClassNo : '', 
    tranDate : '', 
    tranId : '', 
    tranStat : '', 
    tranYear : '', 
    updateDate : '', 
    updateUser : '', 
  }

  passLov:any = {
    selector:'',
    params:{}
  };

  approvedStat: boolean = false;
  tranId: any;
  dialogIcon : any;
  dialogMessage : any;

  constructor(private titleService: Title, private ns: NotesService, private decimal : DecimalPipe, private accountingService: AccountingService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle("Acc-Service | Journal Voucher");
    this.route.params.subscribe(params => {
      console.log(params)
      if(params.from === 'add'){
        this.newJV();
      }else{
        this.tranId = params.tranId;
      }
    });
    this.retrieveJVEntry();
  }

  tabController(event) {
  	this.onChange.emit(this.data);
  }

  retrieveJVEntry(){
    this.accountingService.getACSEJvEntry(this.tranId).subscribe((data:any) => {
      console.log(data);
      if(data.jvEntry.length !== 0){
        this.entryData = data.jvEntry; 
        this.entryData.jvDate       = this.entryData.jvDate == null ? '':this.ns.toDateTimeString(this.entryData.jvDate);
        this.entryData.refnoDate    = this.entryData.refnoDate == '' ? '' : this.ns.toDateTimeString(this.entryData.refnoDate);
        this.entryData.preparedDate = this.entryData.preparedDate == null ? '':this.ns.toDateTimeString(this.entryData.preparedDate);
        this.entryData.approvedDate = this.entryData.approvedDate == null ? '':this.ns.toDateTimeString(this.entryData.approvedDate);

        this.entryData.jvAmt        = this.decimal.transform(this.entryData.jvAmt,'1.2-2');
        this.entryData.localAmt     = this.decimal.transform(this.entryData.localAmt,'1.2-2');
        this.entryData.currRate     = this.decimal.transform(this.entryData.currRate,'1.6-6');
      }
    });
  }

  newJV(){
    this.getDefName();
    setTimeout(() => {
        this.jvDatas.closeDate = null; 
        this.jvDatas.createDate = this.ns.toDateTimeString(0)
        this.jvDatas.createUser =  this.ns.getCurrentUser();
        this.jvDatas.deleteDate = null;
        this.jvDatas.postDate = null;
        this.jvDatas.tranClass = 'JV'; 
        this.jvDatas.tranTypeCd = null; 
        this.jvDatas.tranClassNo = null; 
        this.jvDatas.tranDate = this.ns.toDateTimeString(0), 
        this.jvDatas.tranId = null; 
        this.jvDatas.tranStat = 'O'; 
        this.jvDatas.tranYear = null;
        this.jvDatas.updateDate = this.ns.toDateTimeString(0), 
        this.jvDatas.updateUser = this.ns.getCurrentUser();

        this.entryData.jvYear = '';
        this.entryData.jvNo =  '';
        this.entryData.jvStatus =  'N';
        this.entryData.jvStatusName =  'New';
        this.entryData.tranTypeName = '';
        this.entryData.jvDate = this.ns.toDateTimeString(0);
        this.entryData.autoTag = 'N';
        this.entryData.refNo = '';
        this.entryData.refnoTranId = '';
        this.entryData.refNoDate = '';
        this.entryData.jvType =  '';
        this.entryData.particulars =  '';
        this.entryData.currCd = 'PHP';
        this.entryData.currRate = 1;
        this.entryData.jvAmt = 0;
        this.entryData.localAmt = 0;
        this.entryData.preparedBy = this.ns.getCurrentUser();
        this.entryData.preparedDate = this.ns.toDateTimeString(0);
        this.entryData.approvedBy = '';
        this.entryData.approvedName ='';
        this.entryData.approvedPosition = '';
        this.entryData.approvedDate = '';
        this.entryData.createUser = '';
        this.entryData.createDate = '';
        this.entryData.updateUser = '';
        this.entryData.updateDate = '';
           
        this.entryData.currRate = this.decimal.transform(this.entryData.currRate,'1.6-6');
        this.entryData.jvAmt = this.decimal.transform(this.entryData.jvAmt,'1.2-2');
        this.entryData.localAmt = this.decimal.transform(this.entryData.localAmt,'1.2-2');
    },0);
  }
  
  getDefName(){
    this.accountingService.getAcctDefName(this.ns.getCurrentUser()).subscribe((data:any) => {
      this.entryData.preparedName = data.employee.employeeName;
      this.entryData.preparedPosition = data.employee.designation;
    });
  }

  openLov(selector){
    if(selector == 'refNo'){
    this.passLov.params.arTag = 'Y';
    this.passLov.params.cvTag = 'Y';
    this.passLov.params.jvTag = 'Y';
      this.passLov.selector = 'refNo';
    }

    this.lov.openLOV();
  }

  openJVType(){

  }

  setCurrency(data){
    this.entryData.currCd = data.currencyCd;
    this.entryData.currRate = data.currencyRt;
    this.entryData.localAmt = isNaN(this.entryData.jvAmt) ? 0:this.decimal.transform(this.entryData.jvAmt * data.currencyRt,'1.2-2');
    this.entryData.currRate = this.decimal.transform(this.entryData.currRate,'1.6-6');
    this.ns.lovLoader(data.ev, 0);
    this.form.control.markAsDirty();
    this.validateCurr();
  }

  validateCurr(){
    this.entryData.jvAmt = (parseFloat(this.entryData.jvAmt.toString().split(',').join('')));
    this.entryData.currRate = (parseFloat(this.entryData.currRate.toString().split(',').join('')));
    if(this.entryData.jvAmt !== '' && this.entryData.currRate !== ''){
      this.entryData.localAmt = this.entryData.jvAmt * this.entryData.currRate;
      this.entryData.localAmt = this.decimal.transform(this.entryData.localAmt,'1.2-2');
      this.entryData.currRate = this.decimal.transform(this.entryData.currRate,'1.6-6');
    }else{
      this.entryData.localAmt = null;
    }
    
  }

  onClickPrintable(){
    $('#printableNames #modalBtn').trigger('click');
  }

  dc(ev, data, type) {
    return this.ns.dateConstructor(ev, data, type);
  }

  setPrintable(data){
    this.entryData.preparedBy = data.userId;
    this.entryData.preparedName = data.printableName
    this.entryData.preparedPosition = data.designation;
    this.form.control.markAsDirty();
    setTimeout(()=>{
      $('.preparedName').focus().blur();
    }, 0);
  }

  onClickSave(){
    if(this.checkEntryFields()){
      this.dialogIcon = "error";
      this.successDiag.open();
      $('.required').focus().blur();
    }else{ 
     $('#JVEntry #confirm-save #modalBtn2').trigger('click');
    }
  }

  checkEntryFields(){
    if(this.entryData.tranTypeName.length === 0 || 
       this.entryData.particulars.length === 0 ||
       this.entryData.currCd.length === 0 || 
       this.entryData.jvAmt.length === 0 || 
       this.entryData.currRate.length === 0 || 
       this.entryData.jvDate.length === 0  ||
       this.entryData.preparedName.length === 0 ||
       this.entryData.preparedPosition.length === 0
       ){
      return true;
    }else{
      return false;
    }
  }
}

