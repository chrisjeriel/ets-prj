import { Component, OnInit ,OnChanges,Input,Output,EventEmitter , ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AccountingService, NotesService } from '@app/_services' 
import { DecimalPipe } from '@angular/common';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

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
  @ViewChild('AcctEntries') acctEntryMdl: ModalComponent;
  @ViewChild('ApproveJV') approveJV: ModalComponent;
  @ViewChild('CancelEntries') cancelEntries: ModalComponent;
  @ViewChild('PrintEntries') printEntries: ModalComponent;
  
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(LovComponent)lov: LovComponent;
  @ViewChild('myForm') form:any;

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

  sendData:any = {
    tranId:null,
    jvNo: null,
    jvYear: null,
    updateUser: null,
    updateDate: null
  }

  tranId:any;
  jvDate: any;
  saveJVBut: boolean = false;
  cancelJVBut: boolean = false;
  approveBut: boolean = false;
  printBut: boolean = false;
  UploadBut: boolean = false;
  allocBut: boolean = false;
  dcBut: boolean = false;
  cancelFlag: boolean = false;
  dialogIcon : any;
  dialogMessage : any;

  constructor(private titleService: Title, private route: ActivatedRoute,private accService:AccountingService, private ns: NotesService, private decimal : DecimalPipe) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Journal Voucher");

    this.route.params.subscribe(params => {
      if(params.tranId != '' && params.tranId != undefined){
        this.tranId = params.tranId;
      }else{
        this.tranId = this.jvData.tranId;
      }

      if(params.from == 'add'){
        this.newJV();
      }else{
        this.tranId = params.tranId;
        this.jvDatas.closeDate = params.closeDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran)), 
        this.jvDatas.createDate = this.ns.toDateTimeString(parseInt(params.createDateTran)), 
        this.jvDatas.createUser = params.createUserTran, 
        this.jvDatas.deleteDate = params.deleteDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran)), 
        this.jvDatas.postDate = params.postDateTran == "null" ? null:this.ns.toDateTimeString(parseInt(params.deleteDateTran)), 
        this.jvDatas.tranClass = params.tranClassTran, 
        this.jvDatas.tranClassNo = parseInt(params.tranClassNoTran), 
        this.jvDatas.tranDate = this.ns.toDateTimeString(parseInt(params.tranDateTran)), 
        this.jvDatas.tranId = parseInt(params.tranIdTran), 
        this.jvDatas.tranStat = params.tranStatTran, 
        this.jvDatas.tranYear = parseInt(params.tranYearTran), 
        this.jvDatas.updateDate = this.ns.toDateTimeString(parseInt(params.updateDateTran)), 
        this.jvDatas.updateUser = params.updateUserTran;
      }
    });
    this.cancelJVBut = true;
    this.approveBut = true;
    this.printBut = true;
    this.UploadBut = true;
    this.allocBut = true;
    this.dcBut = true;
    this.retrieveJVEntry();
  }

  retrieveJVEntry(){
    this.accService.getJVEntry(this.tranId).subscribe((data:any) => {
      console.log(data)
      if(data.transactions != null){
        this.entryData = data.transactions.jvListings;
        this.tranId = this.entryData.tranId;
        this.jvDatas.tranId = data.transactions.tranId;
        this.jvDatas.tranYear = data.transactions.tranYear;
        this.jvDatas.tranClassNo  = data.transactions.tranClassNo;
        this.entryData.jvDate = this.entryData.jvDate == null ? '':this.ns.toDateTimeString(this.entryData.jvDate);
        this.entryData.refnoDate = this.entryData.refnoDate == null ? '' : this.ns.toDateTimeString(this.entryData.refnoDate);
        this.entryData.preparedDate = this.entryData.preparedDate == null ? '':this.ns.toDateTimeString(this.entryData.preparedDate);
        this.entryData.approvedDate = this.entryData.approvedDate == null ? '':this.ns.toDateTimeString(this.entryData.approvedDate);
        this.entryData.jvAmt = this.decimal.transform(this.entryData.jvAmt,'1.2-2');
        this.entryData.localAmt = this.decimal.transform(this.entryData.localAmt,'1.2-2');
        this.entryData.currRate = this.decimal.transform(this.entryData.currRate,'1.6-6')

        //this.entryData.jvNo = this.entryData.jvNo;
        this.entryData.jvNo = String(this.entryData.jvNo).padStart(8,'0');
        this.entryData.createDate = this.ns.toDateTimeString(this.entryData.createDate);
        this.entryData.updateDate = this.ns.toDateTimeString(this.entryData.updateDate);

        this.cancelJVBut = false;
        this.approveBut = false;
        this.UploadBut = false;
        this.allocBut = false;
        this.dcBut = false;
        if(this.entryData.jvStatus == 'N' || this.entryData.jvStatus == 'F' || this.entryData.jvStatus == 'A'){
          this.printBut = false;
        }else{
          this.printBut = true;
        }
        this.check(this.entryData)
        this.tabController(this.entryData.tranTypeCd);
      }else{
        this.entryData.jvDate = this.ns.toDateTimeString(0);
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
    this.entryData.currRate = '';
    this.entryData.jvAmt = '';
    this.entryData.localAmt = '';
    this.entryData.preparedBy = this.ns.getCurrentUser();
    this.entryData.preparedDate = this.ns.toDateTimeString(0);
    this.entryData.approvedBy = '';
    this.entryData.approvedDate = '';
    this.entryData.createUser = '';
    this.entryData.createDate = '';
    this.entryData.updateUser = '';
    this.entryData.updateDate = '';
       
    this.cancelJVBut = true;
    this.approveBut = true;
    this.printBut = true;
    this.UploadBut = true;
    this.allocBut = true;
    this.dcBut = true;
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
                         tranType: ev.tranTypeCd
                       });
  }

  setTranType(data){
    this.entryData.tranTypeName = data.tranTypeName;
    this.entryData.tranTypeCd = data.tranTypeCd;
    this.tabController(this.entryData.tranTypeCd);
    this.form.control.markAsDirty();

  }

  openJVType(){
    $('#jvTypeModal #modalBtn').trigger('click');
  }

  prepareData(){
    this.jvDatas.tranIdJv = this.tranId;
    this.jvDatas.jvYear = this.entryData.jvYear;
    this.jvDatas.jvNo = parseInt(this.entryData.jvNo);
    this.jvDatas.jvDate = this.entryData.jvDate;
    this.jvDatas.jvStatus = this.entryData.jvStatus;
    this.jvDatas.jvTranTypeCd = this.entryData.tranTypeCd;
    this.jvDatas.tranTypeName = this.entryData.tranTypeName;
    this.jvDatas.autoTag = this.entryData.autoTag;
    this.jvDatas.refnoTranId = this.entryData.refnoTranId == '' ? '': this.entryData.refNoTranId;
    this.jvDatas.refnoDate = this.ns.toDateTimeString(this.entryData.refnoDate);
    this.jvDatas.particulars = this.entryData.particulars;
    this.jvDatas.currCd = this.entryData.currCd;
    this.jvDatas.currRate = parseFloat(this.entryData.currRate.toString().split(',').join('')),
    this.jvDatas.jvAmt = parseFloat(this.entryData.jvAmt.toString().split(',').join('')),
    this.jvDatas.localAmt = parseFloat(this.entryData.localAmt.toString().split(',').join('')),
    this.jvDatas.allocTag = this.entryData.allocTag;
    this.jvDatas.allocTranId = this.entryData.allocTranId;
    this.jvDatas.preparedBy = this.entryData.preparedBy;
    this.jvDatas.preparedDate = this.entryData.preparedDate == '' ? '' : this.ns.toDateTimeString(this.entryData.preparedDate);
    this.jvDatas.approvedBy = this.entryData.approvedBy;
    this.jvDatas.approvedDate = this.entryData.approvedDate == '' ? '' : this.ns.toDateTimeString(this.entryData.approvedDate);
    this.jvDatas.createUserJv = this.ns.getCurrentUser();
    this.jvDatas.createDateJv = this.ns.toDateTimeString(0);
    this.jvDatas.updateUserJv = this.ns.getCurrentUser();
    this.jvDatas.updateDateJv = this.ns.toDateTimeString(0);
  }

  saveJV(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
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
    this.approveJV.openNoClose();
  }

  onClickSave(){
     $('#JVEntry #confirm-save #modalBtn2').trigger('click');
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
      this.entryData.refNoDate = this.ns.toDateTimeString(data.data.tranDate);
      this.entryData.refNo = data.data.tranNo;
      this.form.control.markAsDirty();
    }
  }

  cancelJournalVoucher(){
    this.sendData.tranId = this.tranId;
    this.sendData.jvNo = parseInt(this.entryData.jvNo);
    this.sendData.jvYear = this.entryData.jvYear;
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

  onClickPrint(){
    this.printEntries.openNoClose();
  }

  onClickPrintable(){
    $('#printableNames #modalBtn').trigger('click');
  }
  
  setPrintable(data){
    this.entryData.preparedBy = data.userId;
    this.entryData.preparedName = data.printableName
    this.entryData.preparedPosition = data.designation;
  }

  validateCurr(){
    if(this.entryData.jvAmt !== '' && this.entryData.currRate !== ''){
      this.entryData.localAmt = this.entryData.jvAmt * this.entryData.currRate;
      this.entryData.localAmt = this.decimal.transform(this.entryData.localAmt,'1.2-2');
    }else{
      this.entryData.localAmt = null;
    }
  }

}