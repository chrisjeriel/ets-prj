import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AgainstNegativeTreaty, AgainstLoss } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-jv-offsetting-against-negative-treaty',
  templateUrl: './jv-offsetting-against-negative-treaty.component.html',
  styleUrls: ['./jv-offsetting-against-negative-treaty.component.css']
})
export class JvOffsettingAgainstNegativeTreatyComponent implements OnInit {
  
  @Output() emitData = new EventEmitter<any>();
  @Input() cedingParams:any;
  @Input() jvDetail:any;
  @ViewChild('quarterTable') quarterTable: CustEditableNonDatatableComponent;
  @ViewChild('trytytrans') trytytransTable: CustEditableNonDatatableComponent;
  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(QuarterEndingLovComponent) quarterModal: QuarterEndingLovComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  /*passData: any = {
    tableData: this.accountingService.getAgainstNegativeTreaty(),
    tHeader: ['Quarter Ending','Currency', 'Currency Rate', 'Amount','Amount(PHP)'],
    resizable: [true, true, true, true, true,true, true, true],
    dataTypes: ['date','text','percent','currency','currency'],
    nData: new AgainstNegativeTreaty(new Date(),null,null,null,null),
    total:[null,null,'Total','amount','amountPhp'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 5,
    pageID: 'passdata',
    widths: [203,50,130,130,130],

  };*/

  passData: any = {
      tableData: [],
      tHeader: ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
      dataTypes: ['date', 'text', 'percent', 'currency', 'currency'],
      nData: {
        showMG:1,
        tranId:'',
        quarterNo : '',
        cedingId : '',
        quarterEnding : '',
        currCd : '',
        currRate : '',
        balanceAmt : '',
        localAmt : '',
        createUser : this.ns.getCurrentUser(),
        createDate : '',
        updateUser : this.ns.getCurrentUser(),
        updateDate : '',
        clmOffset: []
      },
      magnifyingGlass: ['quarterEnding'],
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      disableAdd: true,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 3,
      pageID: 'passDataNegative',
      uneditable: [true,true,true,false,true],
      total: [null, null, 'Total', 'balanceAmt', 'localAmt'],
      keys: ['quarterEnding', 'currCd', 'currRate', 'balanceAmt', 'localAmt'],
      widths: [203,50,130,130,130],
  }

  claimsOffset: any = {
    tableData: [],
    tHeader: ['Claim No', 'Hist No','Hist Category', 'Hist Type', 'Payment For', 'Insured', 'Ex-Gratia', 'Curr','Curr Rate', 'Hist Amount','Cumulative Payment','Paid Amount',' Paid Amount (Php)'],
    dataTypes: ['text', 'sequence-2', 'text', 'text', 'text', 'text','checkbox', 'text', 'percent', 'currency','currency', 'currency', 'currency'],
    nData: {
      showMG:1,
      claimNo:'',
      claimId:'',
      quarterNo: '',
      histNo: '',
      histCategoryDesc: '',
      histTypeDesc: '',
      paymentFor: '',
      insuredDesc: '',
      exGratia: null,
      currCd: '',
      currRate: '',
      reserveAmt: '',
      currAmt: '',
      localAmt: '',
      createUser: this.ns.getCurrentUser(),
      createDate:'',
      updateUser: this.ns.getCurrentUser(),
      updateDate: ''
    },
    magnifyingGlass: ['claimNo'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    disableAdd: true,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    uneditable: [true,true,true,true,false,true,true,true,true,true,true,false,true],
    total: [null, null,null, null, null,null, null, null, 'Total', 'reserveAmt', 'paytAmt', 'clmPaytAmt', 'localAmt'],
    widths: [110,47,98,125,78,354,62,50,64,110,110,110,110],
    keys:['claimNo','histNo','histCategoryDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currCd','currRate','reserveAmt','paytAmt','clmPaytAmt','localAmt']
  }

  jvDetails: any = {
    cedingName: '',
    deleteNegTrty: [],
    saveNegTrty:[],
    saveClmOffset: [],
    deleteClmOffset : []
  }

  passLov: any = {
    selector: 'clmResHistPaytsOffset',
    cedingId: '',
    hide: []
  }

  quarterNo: any = null;
  dialogIcon : any;
  dialogMessage : any;
  totalTrtyBal: number = 0;
  errorFlag: boolean = false;
  disable: boolean = true;
  readOnly :boolean = false;
  cancelFlag: boolean = false;

  //ADDED BY NECO 09/03/2019
  positiveHistType: number[] = [4,5,10];
  negativeHistType: number[] = [7,8,9];
  //END

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService) { }

  ngOnInit() {
    this.passData.nData.currRate = this.jvDetail.currRate;
    this.passData.nData.currCd = this.jvDetail.currCd;
    this.passLov.currCd = this.jvDetail.currCd;
    
    if(this.jvDetail.statusType == 'N'){
      this.readOnly = false;
    }else {
      this.readOnly = true;
      this.passData.addFlag = false;
      this.passData.checkFlag = false;
      this.claimsOffset.checkFlag = false;
      this.passData.deleteFlag = false;
      this.claimsOffset.addFlag = false;
      this.claimsOffset.deleteFlag = false;
      this.passData.uneditable = [true,true,true,true,true];
      this.passData.disableAdd = true;
      this.claimsOffset.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true];
      this.claimsOffset.disableAdd = true;
    }

    this.retrieveNegativeTreaty();
  }

  retrieveNegativeTreaty(){
    this.accountingService.getNegativeTreaty(this.jvDetail.tranId).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      this.totalTrtyBal = 0;
      if(data.negativeTrty.length != 0){
        this.claimsOffset.disableAdd = false;
        this.passData.disableAdd  = false;
        this.jvDetails.cedingName = data.negativeTrty[0].cedingName;
        this.jvDetails.ceding     = data.negativeTrty[0].cedingId;
        this.passLov.cedingId     = this.jvDetails.ceding;
        this.check(this.jvDetails);
        for (var i = 0; i < data.negativeTrty.length; i++) {
           this.passData.tableData.push(data.negativeTrty[i]);
           this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = this.ns.toDateTimeString(data.negativeTrty[i].quarterEnding);
           this.totalTrtyBal += this.passData.tableData[this.passData.tableData.length - 1].balanceAmt;
        }
        this.quarterTable.refreshTable();
        this.quarterTable.onRowClick(null,this.passData.tableData[0]);
      }
    });
  }

  calculateTotal(){
    this.totalTrtyBal = 0;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.totalTrtyBal += this.passData.tableData[i].balanceAmt;
    }
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  checkCode(ev){
     this.ns.lovLoader(ev, 1);
     this.cedingCoLov.checkCedingCo(this.jvDetails.ceding, ev);
    
  }

  setCedingcompany(data){
    console.log(data)
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.ceding = data.payeeCd;
    this.passLov.cedingId = data.payeeCd;
    this.passData.disableAdd = false;
    this.ns.lovLoader(data.ev, 0);
    this.retrieveNegativeTreaty();
    this.check(this.jvDetails);
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  openLOV(data){
    this.passLov.hide = this.claimsOffset.tableData.filter((a)=>{return !a.deleted}).map((a)=> {return JSON.stringify({claimId: a.claimId, histNo:a.histNo})});  
    console.log(this.passLov.hide)
    this.lovMdl.openLOV();
  }

  quarterEndModal(){
    this.quarterModal.modal.openNoClose();
  }

  setQuarter(data){
      console.log(data)
      var quarterNo = null;
      this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].quarterEnding = data;
      quarterNo = data.split('T');
      quarterNo = quarterNo[0].split('-');
      quarterNo = quarterNo[0]+quarterNo[1];
      this.passData.tableData[this.passData.tableData.length - 1].quarterNo = parseInt(quarterNo); 
      this.quarterTable.refreshTable();
      this.quarterTable.onRowClick(null, this.passData.tableData[0]);
  }

  updateTreatyBal(data){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].localAmt = isNaN(this.passData.tableData[i].currRate) ? 1:this.passData.tableData[i].currRate * this.passData.tableData[i].balanceAmt;
    }
    this.quarterTable.refreshTable();
  }

  setClaimOffset(data){
    console.log(data.data)
    this.quarterTable.indvSelect.clmOffset = this.quarterTable.indvSelect.clmOffset.filter(a=>a.showMG!=1);
    for(var  i=0; i < data.data.length;i++){
      this.quarterTable.indvSelect.clmOffset.push(JSON.parse(JSON.stringify(this.claimsOffset.nData)));
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].showMG = 0;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].edited  = true;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].itemNo = null;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].claimId = data.data[i].claimId;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].projId = data.data[i].projId;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].histNo = data.data[i].histNo;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].policyId = data.data[i].policyId;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].currCd = this.jvDetail.currCd;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].currRate = this.jvDetail.currRate;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].claimNo = data.data[i].claimNo;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].histCategoryDesc = data.data[i].histCategoryDesc;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].histCategory = data.data[i].histCategory;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].histType = data.data[i].histType;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].histTypeDesc = data.data[i].histTypeDesc;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].insuredDesc = data.data[i].insuredDesc;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].reserveAmt = data.data[i].reserveAmt;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].paytAmt = data.data[i].cumulativeAmt;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].clmPaytAmt = data.data[i].reserveAmt;
      this.quarterTable.indvSelect.clmOffset[this.quarterTable.indvSelect.clmOffset.length - 1].localAmt = data.data[i].reserveAmt * this.jvDetail.currRate;
    }
    this.trytytransTable.refreshTable();
    this.quarterTable.onRowClick(null,this.quarterTable.indvSelect);
  }

  onrowClick(data){
    console.log(data)
    if(data!==null && data.quarterNo !== '' && data.clmOffset.length != 0){
      console.log(data)
      this.quarterNo = data.quarterNo;
      this.claimsOffset.disableAdd = false;
      this.claimsOffset.nData.quarterNo = this.quarterNo;
      this.claimsOffset.tableData = data.clmOffset;
    }else if(data!==null){
      this.claimsOffset.disableAdd = false;
      this.claimsOffset.tableData = [];
    }else{
      this.claimsOffset.tableData = [];
      this.claimsOffset.disableAdd = true;
    }
    this.trytytransTable.refreshTable();
  }

  onClickSave(){
    this.confirm.confirmModal();
    
    /*if(!this.validPayment()){
      this.dialogMessage = 'Payment for selected claim is not proportion to payment for Treaty Balance.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else if(!this.validHistAmt()){
      this.dialogMessage = 'Paid Amount must not greater than Hist Amount.';
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }*/
  }

  validPayment() : boolean{
    var totalPaid = 0;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      totalPaid = 0;
      for (var j = 0; j < this.passData.tableData[i].clmOffset.length; j++) {
        totalPaid += this.passData.tableData[i].clmOffset[j].clmPaytAmt;
      }
      if(totalPaid + this.passData.tableData[i].balanceAmt == 0){
        return true;
        break;
      }
    }
    return false;
  }

  validHistAmt() : boolean{
    for (var i = 0; i < this.passData.tableData.length; i++) {
      for (var j = 0; j < this.passData.tableData[i].clmOffset.length; j++) {
        if(this.passData.tableData[i].clmOffset[j].clmPaytAmt <= this.passData.tableData[i].clmOffset[j].reserveAmt){
          console.log('condition true')
          return true;
          break;
        }
      }
    }
     return false;
  }

  balanceTreaty() : boolean{
    this.errorFlag = false;
    var clmPaymentFlag = false;
    var totalPaid = 0;
    var totalTreaty = 0;
    for (var i = 0; i < this.passData.tableData.length; i++) {
      totalPaid = 0;

      for (var j = 0; j < this.passData.tableData[i].clmOffset.length; j++) {
        totalPaid += this.passData.tableData[i].clmOffset[j].clmPaytAmt;
        totalTreaty += this.passData.tableData[i].clmOffset[j].clmPaytAmt;
        if(totalPaid > this.passData.tableData[i].balanceAmt){
          this.errorFlag = true;
          break;
        }
      }

      if(totalTreaty !== this.passData.tableData[i].balanceAmt){

      }
    }
    return true;
  }

  update(data){
    for (var i = 0; i < this.claimsOffset.tableData.length; i++) {
      this.claimsOffset.tableData[i].localAmt = this.claimsOffset.tableData[i].clmPaytAmt * this.jvDetail.currRate;
    }
    this.trytytransTable.refreshTable();
  }

  prepareData(){
    this.jvDetails.saveNegTrty = [];
    this.jvDetails.deleteNegTrty = [];
    this.jvDetails.saveClmOffset = [];
    this.jvDetails.deleteClmOffset = [];
    var quarterNo = null;
    var actualBalPaid = 0;
    for(var i = 0 ; i < this.passData.tableData.length; i++){
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveNegTrty.push(this.passData.tableData[i]);
        this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].tranId = this.jvDetail.tranId;
        this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].cedingId = this.jvDetails.ceding;
        this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].quarterEnding = this.ns.toDateTimeString(this.passData.tableData[i].quarterEnding)
        this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].createDate = this.ns.toDateTimeString(this.passData.tableData[i].createDate);
        this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].updateDate);
        
        if(this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].quarterNo === ''){
          quarterNo = this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].quarterEnding.split('T');
          quarterNo = quarterNo[0].split('-');
          quarterNo = quarterNo[0]+quarterNo[1];
          this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].quarterNo =  parseInt(quarterNo); 
        }
      }

      if(this.passData.tableData[i].deleted){
        this.jvDetails.deleteNegTrty.push(this.passData.tableData[i]);
      }

      for(var j = 0 ; j < this.passData.tableData[i].clmOffset.length; j++){
        if(this.passData.tableData[i].clmOffset[j].edited && !this.passData.tableData[i].clmOffset[j].deleted){
          console.log(this.passData.tableData[i].clmOffset[j].clmPaytAmt);
          actualBalPaid += this.passData.tableData[i].clmOffset[j].clmPaytAmt;
          this.jvDetails.saveClmOffset.push(this.passData.tableData[i].clmOffset[j]);
          this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].tranId = this.jvDetail.tranId;
          this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].quarterNo = this.passData.tableData[i].quarterNo;
          this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].exGratia = this.passData.tableData[i].clmOffset[j].exGratia == null ? 'N':'Y';
          this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].createDate =  this.ns.toDateTimeString(this.passData.tableData[i].clmOffset[j].createDate);
          this.jvDetails.saveClmOffset[this.jvDetails.saveClmOffset.length - 1].updateDate = this.ns.toDateTimeString(this.passData.tableData[i].clmOffset[j].updateDate);
        }

        if(this.passData.tableData[i].clmOffset[j].deleted){
          this.jvDetails.deleteClmOffset.push(this.passData.tableData[i].clmOffset[j]);
          this.jvDetails.deleteClmOffset[this.jvDetails.deleteClmOffset.length - 1].tranId = this.jvDetail.tranId;
        }
      }
      if(!this.passData.tableData[i].deleted){
        this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].actualBalPaid = actualBalPaid;
      }
    }

    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
  }

  saveNegativeTreatyBal(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.prepareData();
    this.accountingService.saveAcitJvNegTreaty(this.jvDetails).subscribe((data:any) => {
        if(data['returnCode'] != -1) {
          this.dialogMessage = data['errorList'][0].errorMessage;
          this.dialogIcon = "error";
          this.successDiag.open();
        }else{
          this.dialogMessage = "";
          this.dialogIcon = "success";
          this.successDiag.open();
          this.retrieveNegativeTreaty();
        }
    });
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  refundError():boolean{
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(!this.passData.tableData[i].deleted){
        if(1==1){
          return true;
        }
      }
    }
    return false;
  }
}