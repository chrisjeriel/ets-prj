import { Component, OnInit ,OnChanges,Input,Output,EventEmitter , ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AccountingService, NotesService, MaintenanceService, PrintService } from '@app/_services' 
import { DecimalPipe } from '@angular/common';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { MtnPrintableNamesComponent } from '@app/maintenance/mtn-printable-names/mtn-printable-names.component';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { JvTypeLovComponent } from '@app/accounting-in-trust/journal-voucher/generate-jv/jv-type-lov/jv-type-lov.component';
import { UploaderComponent } from '@app/_components/common/uploader/uploader.component';

@Component({
  selector: 'app-jv-entry',
  templateUrl: './jv-entry.component.html',
  styleUrls: ['./jv-entry.component.css']
})
export class JvEntryComponent implements OnInit {

  @Input() record: any = {
                  jvType: null
                 };

  @Input() jvData: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() emitData = new EventEmitter<any>();
  @Output() disableTab : EventEmitter<any> = new EventEmitter();  
  @ViewChild('AcctEntries') acctEntryMdl: ModalComponent;
  @ViewChild('ApproveJV') approveJV: ModalComponent;
  @ViewChild('Alloc') allocJV: ModalComponent;
  @ViewChild('printJVDetailed') printJVDetailed: ModalComponent;
  @ViewChild('ApproverNames') approverName: MtnPrintableNamesComponent;
  @ViewChild('printableNames') printableNames: MtnPrintableNamesComponent;
  @ViewChild('CancelEntries') cancelEntries: ModalComponent;
  @ViewChild('PrintEntries') printEntries: ModalComponent;
  @ViewChild('currencyModal') currLov: MtnCurrencyComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(LovComponent)lov: LovComponent;
  @ViewChild('myForm') form:any;
  @ViewChild('jvTypeLov') jvTypeLov: JvTypeLovComponent;
  @ViewChild(UploaderComponent) up: UploaderComponent;

  passData: any = {
    tableData: [],
    tHeader: ['Tran Type','Tran No','Tran Date','Payee/Payor', 'Particulars', 'Amount'],
    dataTypes: ['text','sequence-8','date','text','text','currency'],
    nData:{
    },
    infoFlag: true,
    paginateFlag: true,
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    uneditable: [true,true,true,true,true,true],
    keys:['tranType','tranNo','tranDate','payee','particulars','allocAmt']
  };

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
    approvedDate:'',
    tranData: {}
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

  sendData:any = {
    tranId:null,
    jvNo: null,
    jvYear: null,
    updateUser: null,
    updateDate: null
  }

  printData:any = {
    reportType : 0
  };

  tranId:any;
  jvDate: any;
  saveJVBut: boolean = false;
  cancelJVBut: boolean = false;
  approveBut: boolean = false;
  printBut: boolean = false;
  UploadBut: boolean = false;
  allocBut: boolean = false;
  dcBut: boolean = false;
  approvedStat: boolean = false;
  disableBut: boolean = false;
  printStat: boolean = false;
  cancelFlag: boolean = false;
  uploadLoading: boolean = false;
  dialogIcon : any;
  dialogMessage : any;
  canUploadAcctEnt: boolean = true;

  acctEntryFile: any;
  fileName: string = '';
  emitMessage: string = '';

  constructor(private titleService: Title, private route: ActivatedRoute,private accService:AccountingService, private ns: NotesService, private decimal : DecimalPipe, private router: Router, private mtnService: MaintenanceService, private ps : PrintService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Journal Voucher");

    this.canUploadAcctEntMethod();

    this.route.params.subscribe(params => {
      if(params.tranId != '' && params.tranId != undefined){
        this.tranId = params.tranId;
      }else{
        this.tranId = this.jvData.tranId;
      }

      if(params.from == 'add' && this.jvData.tranId == undefined){
        this.newJV();
      }else{
        // this.tranId = this.jvData.tranId == undefined ? params.tranId : this.jvData.tranId;
        // this.jvDatas.closeDate   = params.closeDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran)), 
        // this.jvDatas.createDate  = this.ns.toDateTimeString(parseInt(params.createDateTran)), 
        // this.jvDatas.createUser  = params.createUserTran, 
        // this.jvDatas.deleteDate  = params.deleteDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran)), 
        // this.jvDatas.postDate    = params.postDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran)), 
        // this.jvDatas.tranClass   = params.tranClassTran, 
        // this.jvDatas.tranClassNo = parseInt(params.tranClassNoTran), 
        // this.jvDatas.tranDate    = this.ns.toDateTimeString(parseInt(params.tranDateTran)), 
        // this.jvDatas.tranId      = parseInt(params.tranIdTran), 
        // this.jvDatas.tranStat    = params.tranStatTran, 
        // this.jvDatas.tranYear    = parseInt(params.tranYearTran), 
        // this.jvDatas.updateDate  = this.ns.toDateTimeString(parseInt(params.updateDateTran)), 
        // this.jvDatas.updateUser  = params.updateUserTran;

        if(this.jvData.tranId == undefined) {
          this.tranId = params.tranId;
          this.jvDatas.closeDate   = params.closeDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran));
          this.jvDatas.createDate  = this.ns.toDateTimeString(parseInt(params.createDateTran));
          this.jvDatas.createUser  = params.createUserTran;
          this.jvDatas.deleteDate  = params.deleteDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran));
          this.jvDatas.postDate    = params.postDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran));
          this.jvDatas.tranClass   = params.tranClassTran;
          this.jvDatas.tranClassNo = parseInt(params.tranClassNoTran);
          this.jvDatas.tranDate    = this.ns.toDateTimeString(parseInt(params.tranDateTran));
          this.jvDatas.tranId      = parseInt(params.tranIdTran);
          this.jvDatas.tranStat    = params.tranStatTran;
          this.jvDatas.tranYear    = parseInt(params.tranYearTran);
          this.jvDatas.updateDate  = this.ns.toDateTimeString(parseInt(params.updateDateTran));
          this.jvDatas.updateUser  = params.updateUserTran;
        } else {
          this.tranId = this.jvData.tranId;
          this.jvDatas.closeDate   = this.ns.toDateTimeString(this.jvData.tranData.closeDate);
          this.jvDatas.createDate  = this.ns.toDateTimeString(this.jvData.tranData.createDate);
          this.jvDatas.createUser  = this.jvData.tranData.createUser;
          this.jvDatas.deleteDate  = this.ns.toDateTimeString(this.jvData.tranData.deleteDate);
          this.jvDatas.postDate    = this.ns.toDateTimeString(this.jvData.tranData.postDate);
          this.jvDatas.tranClass   = this.jvData.tranData.tranClass;
          this.jvDatas.tranClassNo = this.jvData.tranData.tranClassNo;
          this.jvDatas.tranDate    = this.ns.toDateTimeString(this.jvData.tranData.tranDate);
          this.jvDatas.tranId      = this.jvData.tranData.tranId;
          this.jvDatas.tranStat    = this.jvData.tranData.tranStat;
          this.jvDatas.tranYear    = this.jvData.tranData.tranYear;
          this.jvDatas.updateDate  = this.ns.toDateTimeString(this.jvData.tranData.updateDate);
          this.jvDatas.updateUser  = this.jvData.tranData.updateUser;
        }
      }
    });
    this.cancelJVBut = true;
    this.approveBut  = true;
    this.printBut    = true;
    this.UploadBut   = true;
    this.allocBut    = true;
    this.dcBut       = true;
    this.retrieveJVEntry();
    this.getPrinters();
  }

  retrieveJVEntry(){
    this.accService.getJVEntry(this.tranId).subscribe((data:any) => {
      console.log(data)
      if(data.transactions != null){
        this.entryData              = data.transactions.jvListings;
        this.tranId                 = this.entryData.tranId;
        this.jvDatas.tranId         = data.transactions.tranId;
        this.jvDatas.tranYear       = data.transactions.tranYear;
        this.jvDatas.tranClassNo    = data.transactions.tranClassNo;
        this.jvDatas.adjEntryTag    = data.transactions.adjEntryTag;
        this.entryData.jvDate       = this.entryData.jvDate == null ? '':this.ns.toDateTimeString(this.entryData.jvDate);
        this.entryData.refnoDate    = this.entryData.refnoDate == '' ? '' : this.ns.toDateTimeString(this.entryData.refnoDate);
        this.entryData.preparedDate = this.entryData.preparedDate == null ? '':this.ns.toDateTimeString(this.entryData.preparedDate);
        this.entryData.approvedDate = this.entryData.approvedDate == null ? '':this.ns.toDateTimeString(this.entryData.approvedDate);
        this.entryData.jvAmt        = this.decimal.transform(this.entryData.jvAmt,'1.2-2');
        this.entryData.localAmt     = this.decimal.transform(this.entryData.localAmt,'1.2-2');
        this.entryData.currRate     = this.decimal.transform(this.entryData.currRate,'1.6-6');

        //this.entryData.jvNo = this.entryData.jvNo;
        //this.entryData.jvNo = String(this.entryData.jvNo).padStart(8,'0');
        this.entryData.createDate   = this.ns.toDateTimeString(this.entryData.createDate);
        this.entryData.updateDate   = this.ns.toDateTimeString(this.entryData.updateDate);

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
          this.cancelJVBut = true;
        }

        this.entryData.tranData = {};

        this.entryData.tranData.tranDate = this.ns.toDateTimeString(data.transactions.tranDate);
        this.entryData.tranData.tranClass = data.transactions.tranClass;
        this.entryData.tranData.tranTypeCd = data.transactions.tranTypeCd;
        this.entryData.tranData.tranYear = data.transactions.tranYear;
        this.entryData.tranData.tranClassNo = data.transactions.tranClassNo;
        this.entryData.tranData.tranStat = data.transactions.tranStat;
        this.entryData.tranData.tranStatDesc = data.transactions.tranStatDesc;
        this.entryData.tranData.closeDate = this.ns.toDateTimeString(data.transactions.closeDate);
        this.entryData.tranData.deleteDate = this.ns.toDateTimeString(data.transactions.deleteDate);
        this.entryData.tranData.postDate = this.ns.toDateTimeString(data.transactions.postDate);
        this.entryData.tranData.createUser = data.transactions.createUser;
        this.entryData.tranData.createDate = this.ns.toDateTimeString(data.transactions.createDate);
        this.entryData.tranData.updateUser = data.transactions.updateUser;
        this.entryData.tranData.updateDate = this.ns.toDateTimeString(data.transactions.updateDate);
        this.entryData.tranData.adjEntryTag = data.transactions.adjEntryTag;
        this.entryData.tranData.acctEntDate = this.ns.toDateTimeString(data.transactions.acctEntDate);

        this.check(this.entryData)
        this.tabController(this.entryData.tranTypeCd);
        this.disableTab.emit(false);
      }else{
        this.entryData.jvDate   = this.ns.toDateTimeString(0);
        this.entryData.jvStatus = 'New';
        this.tabController(0);
        this.onChange.emit({ type: ''});
      }
      
    });
  }

  tabController(event) {
  	this.onChange.emit({ type: event});
  }

  newJV(){
    this.getDefName();
    setTimeout(() => {
        this.jvDatas.closeDate          = null; 
        this.jvDatas.createDate         = this.ns.toDateTimeString(0)
        this.jvDatas.createUser         =  this.ns.getCurrentUser();
        this.jvDatas.deleteDate         = null;
        this.jvDatas.postDate           = null;
        this.jvDatas.tranClass          = 'JV'; 
        this.jvDatas.tranTypeCd         = null; 
        this.jvDatas.tranClassNo        = null; 
        this.jvDatas.tranDate           = this.ns.toDateTimeString(0), 
        this.jvDatas.tranId             = null; 
        this.jvDatas.tranStat           = 'O'; 
        this.jvDatas.tranYear           = null;
        this.jvDatas.updateDate         = this.ns.toDateTimeString(0), 
        this.jvDatas.updateUser         = this.ns.getCurrentUser();
        this.jvDatas.adjEntryTag      = 'N';

        this.entryData.jvYear           = '';
        this.entryData.jvNo             =  '';
        this.entryData.jvStatus         =  'N';
        this.entryData.jvStatusName     =  'New';
        this.entryData.tranTypeName     = '';
        this.entryData.jvDate           = this.ns.toDateTimeString(0);
        this.entryData.autoTag          = 'N';
        this.entryData.refNo            = '';
        this.entryData.refnoTranId      = '';
        this.entryData.refNoDate        = '';
        this.entryData.jvType           =  '';
        this.entryData.particulars      =  '';
        this.entryData.currCd           = 'PHP';
        this.entryData.currRate         = 1;
        this.entryData.jvAmt            = 0;
        this.entryData.localAmt         = 0;
        this.entryData.preparedBy       = this.ns.getCurrentUser();
        this.entryData.preparedDate     = this.ns.toDateTimeString(0);
        this.entryData.approvedBy       = '';
        this.entryData.approvedName     ='';
        this.entryData.approvedPosition = '';
        this.entryData.approvedDate     = '';
        this.entryData.createUser       = '';
        this.entryData.createDate       = '';
        this.entryData.updateUser       = '';
        this.entryData.updateDate       = '';
           
        this.cancelJVBut  = true;
        this.approveBut   = true;
        this.printBut     = true;
        this.UploadBut    = true;
        this.allocBut     = true;
        this.dcBut        = true;
        this.saveJVBut    = false;
        this.disableBut   = false;
        this.approvedStat = false;
        this.disableBut   = false;

        this.entryData.currRate  = this.decimal.transform(this.entryData.currRate,'1.6-6');
        this.entryData.jvAmt     = this.decimal.transform(this.entryData.jvAmt,'1.2-2');
        this.entryData.localAmt  = this.decimal.transform(this.entryData.localAmt,'1.2-2');
        this.disableTab.emit(true);
    },0);
  }
  
  getDefName(){
    this.accService.getAcctDefName(this.ns.getCurrentUser()).subscribe((data:any) => {
      this.entryData.preparedName = data.employee.employeeName;
      this.entryData.preparedPosition = data.employee.designation;
    });
  }

  check(ev){
    this.emitData.emit({ jvTranId: ev.tranId,
                         jvNo: ev.jvNo, 
                         jvYear: ev.jvYear, 
                         jvDate: ev.jvDate, 
                         jvStatus: ev.jvStatusName,
                         statusType: ev.jvStatus,
                         refnoDate: ev.refnoDate,
                         refnoTranId: ev.refNo,
                         currCd: ev.currCd,
                         currRate: ev.currRate,
                         jvAmt: parseFloat(ev.jvAmt.toString().split(',').join('')),
                         localAmt: parseFloat(ev.localAmt.toString().split(',').join('')),
                         jvType: ev.tranTypeName,
                         tranType: ev.tranTypeCd,
                         tranData: ev.tranData
                       });
  }

  setTranType(data) {
    this.ns.lovLoader(data.ev, 0);

    this.entryData.tranTypeName = data.tranTypeName;
    this.entryData.tranTypeCd = data.tranTypeCd;
    this.entryData.particulars = data.defaultParticulars;
    this.tabController(this.entryData.tranTypeCd);
    this.form.control.markAsDirty();
    setTimeout(()=>{
      $('.tranTypeName').focus().blur();
    }, 0);
  }

  openJVType(){
    // $('#jvTypeModal #modalBtn').trigger('click');
    this.jvTypeLov.modal.openNoClose();
  }

  setCurrency(data){
    this.entryData.currCd = data.currencyCd;
    this.entryData.currRate = data.currencyRt;
    // this.entryData.localAmt = isNaN((parseFloat(this.entryData.jvAmt.toString().split(',').join('')))) ? 0 : this.decimal.transform(this.entryData.jvAmt * data.currencyRt,'1.2-2');
    // this.entryData.currRate = this.decimal.transform(this.entryData.currRate,'1.6-6');
    this.validateCurr();
    this.ns.lovLoader(data.ev, 0);
    
    setTimeout(()=>{
      this.form.control.markAsDirty();
      $('.currCd').focus().blur();
    }, 0);
  }

  prepareData(){
    console.log(this.jvDatas);
    this.jvDatas.tranIdJv       = this.tranId;
    this.jvDatas.jvYear         = this.entryData.jvYear;
    this.jvDatas.jvNo           = parseInt(this.entryData.jvNo);
    this.jvDatas.jvDate         = this.entryData.jvDate;
    this.jvDatas.jvStatus       = this.entryData.jvStatus;
    this.jvDatas.jvTranTypeCd   = this.entryData.tranTypeCd;
    this.jvDatas.tranTypeName   = this.entryData.tranTypeName;
    this.jvDatas.autoTag        = this.entryData.autoTag;
    this.jvDatas.refnoTranId    = this.entryData.refnoTranId == '' ? '': this.entryData.refNoTranId;
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

  saveJV(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    console.log(this.jvDatas);
    this.accService.saveAccJVEntry(this.jvDatas).subscribe((data:any) => {
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
        this.form.control.markAsPristine();
      }
    });
  }

  dc(ev, data, type) {
    return this.ns.dateConstructor(ev, data, type);
  }

  cancel(){
  }

  upload(){
    this.acctEntryMdl.openNoClose();
  }

  onClickApprove(){
    this.accService.getAcctDefName(this.ns.getCurrentUser()).subscribe((data:any) => {
      this.entryData.approver     = data.employee.employeeName;
      this.entryData.approvedBy   = data.employee.userName;
      this.entryData.approverDate = this.ns.toDateTimeString(0);
    });
    this.approveJV.openNoClose();
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
       this.entryData.particulars.length  === 0 ||
       this.entryData.currCd.length === 0 || 
       this.entryData.jvAmt.length === 0 || 
       this.entryData.currRate.length === 0 || 
       this.entryData.jvDate.length === 0  ){
      return true;
    }else{
      return false;
    }
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

  setLov(data){
    if(data.selector == 'refNo'){
      this.entryData.refNoTranId = parseInt(data.data.tranId);
      this.entryData.refNoDate   = this.ns.toDateTimeString(data.data.tranDate);
      this.entryData.refNo       = data.data.tranClass +'-'+ data.data.tranNo;
      this.form.control.markAsDirty();
    }
  }

  cancelJournalVoucher(){
    this.sendData.tranId     = this.tranId;
    this.sendData.jvNo       = parseInt(this.entryData.jvNo);
    this.sendData.jvYear     = this.entryData.jvYear;
    this.sendData.tranType   = this.entryData.tranTypeCd;
    this.sendData.updateUser = this.ns.getCurrentUser();
    this.sendData.updateDate = this.ns.toDateTimeString(0);

    this.accService.cancelJournalVoucher(this.sendData).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.cancelJVBut = true;
        this.approveBut = true;
        this.printBut = true;
        this.saveJVBut = true;
        this.retrieveJVEntry();
      }
    });
  }

  onClickCancelJV(){
    this.cancelEntries.openNoClose();
  }

  printJV(){
    this.sendData.tranId = this.tranId;
    this.sendData.jvNo = parseInt(this.entryData.jvNo);
    this.sendData.jvYear = this.entryData.jvYear;
    this.sendData.updateUser = this.ns.getCurrentUser();
    this.sendData.updateDate = this.ns.toDateTimeString(0);

    this.accService.printJournalVoucher(this.sendData).subscribe((data:any) => {
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

  ApproveJVStatus(){
    this.sendData.tranId = this.tranId;
    this.sendData.jvNo         = parseInt(this.entryData.jvNo);
    this.sendData.jvYear       = this.entryData.jvYear;
    this.sendData.approvedBy   = this.entryData.approvedBy;
    this.sendData.approvedDate = this.entryData.approverDate === '' ? '':this.ns.toDateTimeString(this.entryData.approvedDate);
    this.sendData.updateUser   = this.ns.getCurrentUser();
    this.sendData.updateDate   = this.ns.toDateTimeString(0);
    this.accService.approveJV(this.sendData).subscribe((data:any) => {
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

  onClickPrint(){
    this.printJVDetailed.openNoClose();
  }

  printJVDetails(){
    window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=ACITR_JV' + '&userId=' + 
                      this.ns.getCurrentUser() + '&tranId=' + this.entryData.tranId + '&reportType=' + this.printData.reportType, '_blank');
    this.printEntries.openNoClose();
  }

  onClickPrintable(){
    // $('#printableNames #modalBtn').trigger('click');
    this.printableNames.modal.openNoClose();
  }

  onClickApproval(){
    this.approverName.modal.openNoClose();
  }

  getApproveame(){
    
  }

  setApproval(data){
    this.entryData.approvedBy = data.userId;
    this.entryData.approver   = data.printableName;
  }
  
  setPrintable(data){
    this.ns.lovLoader(data.ev, 0);

    this.entryData.preparedBy       = data.userId;
    this.entryData.preparedName     = data.printableName
    this.entryData.preparedPosition = data.designation;
    this.form.control.markAsDirty();
    setTimeout(()=>{
      $('.preparedName').focus().blur();
    }, 0);
  }

  validateCurr(){
    this.entryData.jvAmt = (parseFloat(this.entryData.jvAmt.toString().split(',').join('')));
    this.entryData.currRate = (parseFloat(this.entryData.currRate.toString().split(',').join('')));
    if(this.entryData.jvAmt !== '' && this.entryData.currRate !== ''){
      this.entryData.localAmt = this.decimal.transform(this.entryData.jvAmt * this.entryData.currRate,'1.2-2');
      // this.entryData.localAmt = this.decimal.transform(this.entryData.localAmt,'1.2-2');
      this.entryData.currRate = this.decimal.transform(this.entryData.currRate,'1.6-6');
    }else{
      this.entryData.localAmt = null;
    }
    
  }

  onClickCMDM(){
    this.router.navigate(['/acct-it-generate-cmdm', {exitLink:'/generate-jv',tranId: this.tranId}], { skipLocationChange: true }); 
  }

  onClickAlloc(){
    this.allocJV.openNoClose();
  }

  checkCode(ev, str) {
    this.ns.lovLoader(ev, 1);

    if(str == 'preparedName') {
      this.printableNames.checkCode(this.entryData.preparedName, ev);
    } else if(str == 'currCd') {
      this.currLov.checkCode(this.entryData.currCd, ev);
    } else if(str == 'jvType') {
      this.jvTypeLov.checkCode(this.entryData.tranTypeName, ev);
    }
  }

//open file box
  openFile(){
    $('#upload').trigger('click');
  }

//validate file to be uploaded
  validateFile(event){
    console.log(event.target.files);
    var validate = '';
    validate = this.up.validateFiles(event);

    if(validate.length !== 0 ){
      this.acctEntryFile = undefined;
      this.fileName = '';
      this.dialogIcon = 'error-message';
      this.dialogMessage = validate;
      this.successDiag.open();
    }else{
      this.acctEntryFile = event;
      this.fileName = event.target.files[0].name;
    }
  }

//upload accounting entries
uploadAcctEntries(){
  var result = '';
  this.emitMessage = '';
   if(this.acctEntryFile == undefined){
     this.dialogIcon = 'info';
     this.dialogMessage = 'No file selected.';
     this.successDiag.open();
   }else{
     console.log(this.entryData.tranId);
     this.uploadLoading = true;
     this.up.uploadMethod(this.acctEntryFile, 'acct_entries', 'ACIT', 'JV', this.entryData.tranId);
     /*setTimeout(()=>{
       if(this.emitMessage.length === 0){
         this.dialogIcon = 'info';
         this.dialogMessage = 'Upload successfully.';
         this.fileName = '';
         this.acctEntryFile = undefined;
         this.successDiag.open();
       }else{
         this.dialogIcon = 'error-message';
         this.dialogMessage = this.emitMessage;
         this.successDiag.open();
       }

       this.acctEntryMdl.closeModal(); 
     }, 0);*/
   }
  }

  uploaderActivity(event){
    console.log(event);
    if(event instanceof Object){ //If theres an error regarding the upload
      this.dialogIcon = 'error-message';
     this.dialogMessage = event.message;
     this.successDiag.open();
     this.uploadLoading = false;
    }else{
      if(event.toUpperCase() == 'UPLOAD DONE'){
            this.uploadLoading = false;
        }else if(event.toUpperCase() == 'SUCCESS'){
          this.dialogIcon = 'info';
          this.dialogMessage = 'Upload successfully.';
          this.fileName = '';
          this.acctEntryFile = undefined;
          this.successDiag.open();
          this.uploadLoading = false;
          this.acctEntryMdl.closeModal();
        }
    }
  }

  canUploadAcctEntMethod(){
    this.mtnService.getMtnParameters('V', 'ACITJV_ACCTENTRY_UPLOAD').subscribe(
       (data:any)=>{
         if(data.parameters.length !== 0){
            this.canUploadAcctEnt = data.parameters[0].paramValueV == 'Y';
         }
         else{
           this.canUploadAcctEnt = false;
         }
       }
    );
  }

  getPrinters(){
    this.ps.getPrinters().subscribe(data => {
      this.printData.printers = data;
    });
  }
}