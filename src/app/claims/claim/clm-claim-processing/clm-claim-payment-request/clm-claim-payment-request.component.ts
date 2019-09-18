import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ClaimsService, NotesService, UnderwritingService, AccountingService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';

@Component({
  selector: 'app-clm-claim-payment-request',
  templateUrl: './clm-claim-payment-request.component.html',
  styleUrls: ['./clm-claim-payment-request.component.css']
})

export class ClmClaimPaymentRequestComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(LovComponent) lov: LovComponent;

  passData: any = {
    tableData: [],
    tHeader: ["Payment Request No.", "Status", "Hist. No.", "Hist. Type", "Type", "Curr","Curr Rt", "Amount", "Payment Type","Payee","Particulars"],
    dataTypes: ["text", "text", "number", "text", "text", "text","currencyRate", "currency", "text",'text' ,"text-editor"],
    keys: ['paytReqNo','paytReqStatDesc','histNo','histCategoryDesc','histTypeDesc','currencyCd','currencyRt','reserveAmt','tranTypeName','payee','particulars'],
    uneditable:[true,true,true,true,true,true,true,true,true,false,false],
    magnifyingGlass:['payee'],
    paginateFlag: true,
    pageInfo: true,
    pageLength: 10,
    widths: [1,1,1,1,1,1,1,1,'auto','auto','auto'],

  }

  claimId: any = null;
  selected: any = null;
  disableGenerateBtn: boolean = true;
  disableCancelBtn: boolean = true;


  @Input() claimInfo = {
    claimId: '',
    claimNo: '',
    policyNo: '',
    riskId: '',
    riskName:'',
    insuredDesc:'',
    policyId:''
  }

  @Input()isInquiry;

  passLOV:any = {
    selector: 'payee'
  }

  constructor(private titleService: Title, private router: Router, private cs: ClaimsService, private ns: NotesService, private us: UnderwritingService,
              private as:AccountingService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Generate Payment Request");

    setTimeout(() => {
      this.table.refreshTable();
      this.getClmPaytReq();
    }, 0);
  }

  getClmPaytReq() {
    this.table.overlayLoader = true;
    this.cs.getClmPaytReq(this.claimInfo.claimId,'').subscribe(data => {
      this.passData.tableData = data['paytReqList'].map(a => {
                                                               a.refDate = this.ns.toDateTimeString(a.refDate);
                                                               a.createDate = this.ns.toDateTimeString(a.createDate);
                                                               a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                                               a.showMG = a.paytReqNo == null ? 1 : 0;
                                                               a.uneditable = a.paytReqNo == null ? [] : ['payee','particulars']
                                                               return a;
                                                             });
      this.table.refreshTable();
      //this.disableGenerateBtn = this.passData.tableData.length == 0;
    });
  }

  onRowClick(ev) {
    this.selected = ev == null || (Object.entries(ev).length === 0 && ev.constructor === Object) ? null : ev;
    this.disableGenerateBtn = this.selected == null || this.selected.paytReqNo != null;
    this.disableCancelBtn = this.selected == null || this.selected.paytReqNo == null;
    console.log(ev)
  }

  generateRequest(){
    let params: any = {
      approvedBy      : '',
      approvedDate    : '',
      createDate      : this.ns.toDateTimeString(0),
      createUser      : this.ns.getCurrentUser(),
      currCd          : this.selected.currencyCd,
      currRate        : this.selected.currencyRt,
      localAmt        : this.selected.reserveAmt * this.selected.currencyRt,
      particulars     : this.selected.particulars,
      payee           : this.selected.payee,
      payeeCd         : this.selected.payeeNo,
      payeeClassCd    : '1',
      preparedBy      : this.ns.getCurrentUser(),
      preparedDate    : this.ns.toDateTimeString(0),
      reqAmt          : this.selected.reserveAmt,
      reqDate         : this.ns.toDateTimeString(0),
      reqId           : '',
      reqMm           : Number(this.ns.toDateTimeString(0).split('-')[1]),
      reqPrefix       : '', // hey
      reqSeqNo        : '',
      reqStatus       : 'F',
      reqYear         : this.ns.toDateTimeString(0).split('-')[0],
      requestedBy     : this.ns.getCurrentUser(),
      tranTypeCd      : '', // hey
      updateDate      : this.ns.toDateTimeString(0),
      updateUser      : this.ns.getCurrentUser()
    }

    switch (this.selected.histCategory) {
      case "A":
        // params.reqPrefix = 'CEP';
        params.tranTypeCd = 1
        break;
      case "O":
        // params.reqPrefix = 'CEO';
        params.tranTypeCd = 2
        break;
      case "L":
        // params.reqPrefix = 'CPC';
        params.tranTypeCd = 3
        break;  
      default:
        break;
    }
    this.table.loadingFlag = true;
    this.as.saveAcitPaytReq(JSON.stringify(params))
    .subscribe(data => {
      // this.dialogIcon = '';
      // this.dialogMessage = '';
      // this.success.open();
      this.selected.paytReqId =  data['reqIdOut'];
      this.selected.paytReqStat = 'A';
      this.selected.tranTypeCd = params.tranTypeCd;
      let params2:any = {saveClmPaytReq:[this.selected]};
      this.cs.saveClaimPaytReq(JSON.stringify(params2)).subscribe(a=>{
        this.getClmPaytReq();
      })
      let params3:any = {
        deletePrqTrans:[],
        savePrqTrans: [{
          tranTypeCd : params.tranTypeCd,
          reqId:  this.selected.paytReqId,
          itemNo:  1,
          claimId:  this.claimInfo.claimId,
          projId:  1,
          histNo: this.selected.histNo ,
          policyId:  "",
          instNo:  "",
          quarterEnding: '' ,
          invtId: '' ,
          refNo:  '',
          itemName: '' ,
          paymentFor:  '',
          currCd:   this.selected.currencyCd,
          currRate:  this.selected.currencyRt,
          currAmt:  this.selected.reserveAmt,
          localAmt: this.selected.reserveAmt * this.selected.currencyRt,
          remarks: '' ,
          createUser:  this.ns.getCurrentUser(),
          createDate:  this.ns.toDateTimeString(0),
          updateUser:  this.ns.getCurrentUser(),
          updateDate:  this.ns.toDateTimeString(0),
        }]
      }
      this.as.saveAcitPrqTrans(JSON.stringify(params3)).subscribe(a=>{
        console.log(a)
      })
    });

  }


  showMessage(){

  }

  openPayee(data){
    this.lov.openLOV();
  }

  setPayee(data){
    this.table.indvSelect.payeeNo = data.data.payeeNo;
    this.table.indvSelect.payee = data.data.payeeName;
  }

  cancelRequest(){
      this.selected.reqId = this.selected.paytReqId;
      var updatePaytReqStats = {
        reqId       : this.selected.reqId,
        reqStatus   : 'X',
        updateUser  : this.ns.getCurrentUser()
      };
      this.as.updateAcitPaytReqStat(JSON.stringify(updatePaytReqStats))
      .subscribe(data => {
        this.getClmPaytReq();
      });
      this.selected.paytReqStat = 'X';
      let params2:any = {saveClmPaytReq:[this.selected]};
      this.cs.saveClaimPaytReq(JSON.stringify(params2)).subscribe(a=>{
      })
  }
}
