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
    tHeader: ['Claim No', 'Hist No','Hist Category', 'Hist Type', 'Payment For', 'Insured', 'Ex-Gratia', 'Curr','Curr Rate', 'Reserve Amount','Paid Amount',' Paid Amount (Php)'],
    dataTypes: ['text', 'sequence-2', 'text', 'text', 'text', 'text','checkbox', 'text', 'percent', 'currency', 'currency', 'currency'],
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
    total: [null, null,null, null, null,null, null, null, 'Total', 'reserveAmt', 'clmPaytAmt', 'localAmt'],
    widths: [110,47,98,125,78,354,62,50,64,110,110,110],
    keys:['claimNo','histNo','histCategoryDesc','histTypeDesc','paymentFor','insuredDesc','exGratia','currCd','currRate','reserveAmt','clmPaytAmt','localAmt']
  }

  jvDetails: any = {
    cedingName: '',
    deleteNegTrty: [],
    saveNegTrty:[],
    saveClmOffset: [],
    deleteClmOffset : []
  }

  passLov: any = {
    selector: 'acitJVNegativeTreaty',
    cedingId: '',
    hide: []
  }

  quarterNo: any = null;
  dialogIcon : any;
  dialogMessage : any;
  totalTrtyBal: number = 0;
  errorFlag: boolean = false;
  disable: boolean = true;

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal, private ns: NotesService) { }

  ngOnInit() {
    this.passData.nData.currRate = this.jvDetail.currRate;
    this.passData.nData.currCd = this.jvDetail.currCd;
    
    this.retrieveNegativeTreaty();
  }

  retrieveNegativeTreaty(){
    this.accountingService.getNegativeTreaty(this.jvDetail.tranId).subscribe((data:any) => {
      this.passData.tableData = [];
      this.totalTrtyBal = 0;
      this.passData.disableAdd = false;
      this.disable = false;
      if(data.negativeTrty.length != 0){
        this.jvDetails.cedingName = data.negativeTrty[0].cedingName;
        this.jvDetails.cedingId = data.negativeTrty[0].cedingId;
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
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
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
    this.passLov.hide = this.claimsOffset.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.claimNo});
    console.log(this.passLov.hide)
    this.lovMdl.openLOV();
  }

  quarterEndModal(){
    console.log('test')
    this.quarterModal.modal.openNoClose();
    //$('#quarterEnd #modalBtn').trigger('click');
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
  }

  updateTreatyBal(data){
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].localAmt = isNaN(this.passData.tableData[i].currRate) ? 1:this.passData.tableData[i].currRate * this.passData.tableData[i].balanceAmt;
    }
    this.quarterTable.refreshTable();
  }

  setClaimOffset(data){
    console.log(data)
    this.claimsOffset.tableData = this.claimsOffset.tableData.filter((a) => a.showMG != 1);
    for(var  i=0; i < data.data.length;i++){
      this.claimsOffset.tableData.push(JSON.parse(JSON.stringify(this.claimsOffset.nData)));
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].showMG = 0;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].edited  = true;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].itemNo = null;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].claimId = data.data[i].claimId;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].projId = data.data[i].projId;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].histNo = data.data[i].histNo;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].policyId = data.data[i].policyId;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].currCd = this.jvDetail.currCd;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].currRate = this.jvDetail.currRate;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].claimNo = data.data[i].claimNo;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].histCategoryDesc = data.data[i].histCategoryDesc;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].histCategory = data.data[i].histCategory;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].histType = data.data[i].histType;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].histTypeDesc = data.data[i].histTypeDesc;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].insuredDesc = data.data[i].insuredDesc;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].reserveAmt = data.data[i].reserveAmt;
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].clmPaytAmt = null; 
      this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].localAmt = null; //change to currency rt
      //this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].quarterNo = this.quarterTable.indvSelect.quarterNo;;
    }
    this.trytytransTable.refreshTable();
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
    this.errorFlag = false;
    var totalPaid = 0;

    for (var i = 0; i < this.passData.tableData.length; i++) {
      totalPaid = 0;
      for (var j = 0; j < this.passData.tableData[i].clmOffset.length; j++) {
        totalPaid += this.passData.tableData[i].clmOffset[j].clmPaytAmt
        if(this.passData.tableData[i].balanceAmt < totalPaid){
          this.errorFlag = true;
        }
      }
    }

    totalPaid = 0;
    for (var i = 0; i <  this.passData.tableData.length; i++) {
      for (var j = 0; j < this.passData.tableData[i].clmOffset.length; j++) {
        totalPaid += this.passData.tableData[i].clmOffset[j].clmPaytAmt;
      }
    }

    if(this.errorFlag){
        this.dialogMessage = 'The total Paid Amount of claims for offset on Quarter Ending must not exceed its Treaty Balance Amount.' ;
        this.dialogIcon = "error-message";
        this.successDiag.open();
    }else if(totalPaid > this.jvDetail.jvAmt){
        this.dialogMessage = 'The total Paid Amount of all claims for offset must not exceed the JV Amount.' ;
        this.dialogIcon = "error-message";
        this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
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
    console.log(this.claimsOffset.tableData)
    for(var i = 0 ; i < this.passData.tableData.length; i++){
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
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
      this.jvDetails.saveNegTrty[this.jvDetails.saveNegTrty.length - 1].actualBalPaid = actualBalPaid;
    }

    this.jvDetails.tranId = this.jvDetail.tranId;
    this.jvDetails.tranType = this.jvDetail.tranType;
  }

  saveNegativeTreatyBal(){
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
    this.prepareData();
    console.log(this.jvDetails);
  }
}


/*this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].instNo = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].paymentFor = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].currAmt = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].localAmt = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].remarks = data.data[i].;
this.claimsOffset.tableData[this.claimsOffset.tableData.length - 1].exGratia = data.data[i].;*/