import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService } from '@app/_services'; 
import { DecimalPipe } from '@angular/common';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-jv-entry-service',
  templateUrl: './jv-entry-service.component.html',
  styleUrls: ['./jv-entry-service.component.css']
})
export class JvEntryServiceComponent implements OnInit {
   
  @Input() data: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() emitData = new EventEmitter<any>();
  @Output() disableTab : EventEmitter<any> = new EventEmitter();  
  @ViewChild('ApproveJV') approveJV: ModalComponent;
  @ViewChild(LovComponent)lov: LovComponent;
  @ViewChild(MtnCurrencyComponent) currLov: MtnCurrencyComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild('CancelEntries') cancelEntries: ModalComponent;

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
  };

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
  };

  passLov:any = {
    selector:'',
    params:{}
  };

  sendData:any = {
    tranId:null,
    jvNo: null,
    jvYear: null,
    updateUser: null,
    updateDate: null
  };

  approvedStat: boolean = false;
  tranId: any;
  dialogIcon : any;
  dialogMessage : any;
  from: any = '';
  saveJVBut: boolean = false;
  disableBut: boolean = false;
  cancelJVBut: boolean = false;
  approveBut: boolean = false;
  printBut: boolean = false;
  UploadBut: boolean = false;
  allocBut: boolean = false;
  dcBut: boolean = false;

  constructor(private titleService: Title, private ns: NotesService, private decimal : DecimalPipe, private accountingService: AccountingService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle("Acc-Service | Journal Voucher");
    this.route.params.subscribe(params => {
      console.log(params)
      if(params.from === 'add'){
        this.from = 'add';
        this.newJV();
      }else{
        this.tranId = params.tranId;
        this.from = 'jvList';
      }
    });
    this.cancelJVBut = true;
    this.approveBut  = true;
    this.printBut    = true;
    this.UploadBut   = true;
    this.allocBut    = true;
    this.dcBut       = true;
    this.retrieveJVEntry();
  }

  tabController(event) {
  	this.onChange.emit(this.data);
  }

  retrieveJVEntry(){
    this.accountingService.getACSEJvEntry(this.tranId).subscribe((data:any) => {
      console.log(data);
      if(data.jvEntry !== null){
        this.entryData = data.jvEntry; 
        this.entryData.jvDate       = this.entryData.jvDate == null ? '':this.ns.toDateTimeString(this.entryData.jvDate);
        this.entryData.createDate   = this.ns.toDateTimeString(this.entryData.createDate);
        this.entryData.updateDate   = this.ns.toDateTimeString(this.entryData.updateDate);
        this.entryData.refnoDate    = this.entryData.refnoDate == '' ? '' : this.ns.toDateTimeString(this.entryData.refnoDate);
        this.entryData.preparedDate = this.entryData.preparedDate == null ? '':this.ns.toDateTimeString(this.entryData.preparedDate);
        this.entryData.approvedDate = this.entryData.approvedDate == null ? '':this.ns.toDateTimeString(this.entryData.approvedDate);

        this.entryData.jvAmt        = this.decimal.transform(this.entryData.jvAmt,'1.2-2');
        this.entryData.localAmt     = this.decimal.transform(this.entryData.localAmt,'1.2-2');
        this.entryData.currRate     = this.decimal.transform(this.entryData.currRate,'1.6-6');

        if(this.from !== 'add'){
          this.jvDatas.closeDate      = this.entryData.closeDate === "" ? null:this.ns.toDateTimeString(this.entryData.closeDate);
          this.jvDatas.createDate     = this.ns.toDateTimeString(this.entryData.createDateTran);
          this.jvDatas.createUser     = this.entryData.createUserTran;
          this.jvDatas.deleteDate     = this.ns.toDateTimeString(this.entryData.deleteDate);
          this.jvDatas.postDate       = this.ns.toDateTimeString(this.entryData.postDate); 
          this.jvDatas.tranClass      = this.entryData.tranClass;
          this.jvDatas.tranClassNo    = this.entryData.tranClassNo;
          this.jvDatas.tranDate       = this.ns.toDateTimeString(this.entryData.tranDate);
          this.jvDatas.tranId         = this.entryData.tranIdTran;
          this.jvDatas.tranStat       = this.entryData.tranStat;
          this.jvDatas.tranYear       = this.entryData.tranYear;
          this.jvDatas.updateDate     = this.ns.toDateTimeString(this.entryData.updateDateTran);
          this.jvDatas.updateUser     = this.entryData.updateUserTran;
          this.jvDatas.tranTypeCd     = this.entryData.tranTypeCd;
        }

        this.cancelJVBut = false;
        this.UploadBut   = false;
        this.allocBut    = false;
        this.dcBut       = false;

        if(this.entryData.jvStatus == 'A'){
          this.cancelJVBut  = true;
          this.approvedStat = true;
          this.disableBut   = true;
          this.printBut     = false;
        }

        if(this.entryData.jvStatus == 'F'){
          this.approvedStat = true;
          this.disableBut   = true;
          this.approveBut   = false;
          this.printBut     = false;
        }
        
        if(this.entryData.jvStatus == 'A' || this.entryData.jvStatus == 'X' || this.entryData.jvStatus == 'P'){
          this.approvedStat = true;
          this.disableBut   = true;
          this.approveBut   = true;
        }
        this.check(this.entryData)
        this.disableTab.emit(false);
      }
    });
  }

  check(ev){
    this.emitData.emit({ jvTranId: ev.tranId,
                         jvNo: ev.jvNo, 
                         jvYear: ev.jvYear, 
                         jvDate: ev.jvDate, 
                         jvStatus: ev.statusName,
                         statusType: ev.jvStatus,
                         refnoDate: ev.refnoDate,
                         refnoTranId: ev.refNo,
                         currCd: ev.currCd,
                         currRate: ev.currRate,
                         jvAmt: parseFloat(ev.jvAmt.toString().split(',').join('')),
                         localAmt: parseFloat(ev.localAmt.toString().split(',').join('')),
                         jvType: ev.tranTypeName,
                         tranType: ev.tranTypeCd
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
        this.entryData.statusName =  'New';
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
        
        this.cancelJVBut  = true;
        this.approveBut   = true;
        this.printBut     = true;
        this.UploadBut    = true;
        this.allocBut     = true;
        this.dcBut        = true;
        this.approvedStat = false;
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
    $('#jvTypeModal #modalBtn').trigger('click');
  }

  setTranType(data){
    this.entryData.tranTypeName = data.tranTypeName;
    this.entryData.tranTypeCd = data.tranTypeCd;
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

  prepareData(){
    this.jvDatas.tranIdJv       = this.tranId;
    this.jvDatas.jvYear         = this.entryData.jvYear;
    this.jvDatas.jvNo           = parseInt(this.entryData.jvNo);
    this.jvDatas.jvDate         = this.entryData.jvDate;
    this.jvDatas.jvStatus       = this.entryData.jvStatus;
    this.jvDatas.jvTranTypeCd   = this.entryData.tranTypeCd;
    this.jvDatas.tranTypeName   = this.entryData.tranTypeName;
    this.jvDatas.autoTag        = this.entryData.autoTag;
    this.jvDatas.refnoTranId    = this.entryData.refnoTranId == null ? '': this.entryData.refNoTranId;
    this.jvDatas.refnoDate      = this.entryData.refnoDate == '' ? '': this.ns.toDateTimeString(this.entryData.refnoDate);
    this.jvDatas.particulars    = this.entryData.particulars;
    this.jvDatas.currCd         = this.entryData.currCd;
    this.jvDatas.currRate       = (parseFloat(this.entryData.currRate.toString().split(',').join(''))),
    this.jvDatas.jvAmt          = (parseFloat(this.entryData.jvAmt.toString().split(',').join(''))),
    this.jvDatas.localAmt       = (parseFloat(this.entryData.localAmt.toString().split(',').join(''))),
    this.jvDatas.allocTag       = this.entryData.allocTag;
    this.jvDatas.allocTranId    = this.entryData.allocTranId;
    this.jvDatas.preparedBy     = this.entryData.preparedBy;
    this.jvDatas.preparedDate   = this.entryData.preparedDate == '' ? '' : this.ns.toDateTimeString(this.entryData.preparedDate);
    this.jvDatas.approvedBy     = this.entryData.approvedBy;
    this.jvDatas.approvedDate   = this.entryData.approvedDate == '' ? '' : this.ns.toDateTimeString(this.entryData.approvedDate);
    this.jvDatas.createUserJv   = this.ns.getCurrentUser();
    this.jvDatas.createDateJv   = this.ns.toDateTimeString(0);
    this.jvDatas.updateUserJv   = this.ns.getCurrentUser();
    this.jvDatas.updateDateJv   = this.ns.toDateTimeString(0);
  }

  saveData(cancel?){
    this.prepareData();
    console.log(this.jvDatas);
    this.accountingService.saveAcseJVEntry(this.jvDatas).subscribe((data:any) =>{
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.tranId = data.tranIdOut;
        this.retrieveJVEntry();
      }
    });
  }

  cancel(){

  }

  onClickApprove(){
    this.accountingService.getAcctDefName(this.ns.getCurrentUser()).subscribe((data:any) => {
      console.log(data);
      this.entryData.approver = data.employee.employeeName;
      this.entryData.approvedBy = data.employee.userName;
      this.entryData.approverDate = this.ns.toDateTimeString(0);
    });
    this.approveJV.openNoClose();
  }

  approveJVStatus(){
    this.sendData.tranId = this.tranId;
    this.sendData.approvedBy  = this.entryData.approvedBy;
    this.sendData.approvedDate = this.entryData.approverDate === '' ? '':this.ns.toDateTimeString(this.entryData.approvedDate);
    this.sendData.updateUser = this.ns.getCurrentUser();
    this.sendData.updateDate = this.ns.toDateTimeString(0);
    this.accountingService.approveJvService(this.sendData).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveJVEntry();
      }
    });
  }

  cancelJV(){
    this.sendData.tranId = this.tranId;
    this.sendData.jvNo = parseInt(this.entryData.jvNo);
    this.sendData.jvYear = this.entryData.jvYear;
    this.sendData.tranType = this.entryData.tranTypeCd;
    this.sendData.updateUser = this.ns.getCurrentUser();
    this.sendData.updateDate = this.ns.toDateTimeString(0);

    this.accountingService.cancelJvService(this.sendData).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveJVEntry();
      }
    });
  }

  onClickCancelJV(){
    this.cancelEntries.openNoClose();
  }

  onClickApproval(){
    
  }
}

