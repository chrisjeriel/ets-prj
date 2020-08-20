import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-jv-risk-mgt-alloc',
  templateUrl: './jv-risk-mgt-alloc.component.html',
  styleUrls: ['./jv-risk-mgt-alloc.component.css']
})
export class JvRiskMgtAllocComponent implements OnInit {

  @Input() jvDetail: any;
  @Output() emitData = new EventEmitter<any>();
  @Output() infoData = new EventEmitter<any>();
  @ViewChild('riskMgtTbl') riskMgtTbl: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;

  yearParamOpts: any[] = [];
  params: any = {
    generate: 'N',
    tranId: '',
  	pwFromMm: '',
  	pwFromYear: '',
  	pwToMm: '',
  	pwToYear: '',
  	paytForQtr: '',
  	paytForYear: '',
    totalRiskmgtCharge: '',
  	totalAmt: '',
    currCd: '',
    currRate: ''
  };

  riskMgtData: any = {
    tableData     : [],
    tHeaderWithColspan: [{header:'', span:4},{header: 'Quarterly Risk Management Charge', span: 4}, {header: '', span: 1}],
    tHeader       : ['Company','Net Prem Ceded','Total Net Prem','Percent Share (%)','1st Quarter','2nd Quarter','3rd Quarter','4th Quarter','Risk Management Charge'],
    dataTypes     : ['text','currency','currency','percent','currency','currency','currency','currency','currency'],
    keys          : ['cedingName','finalPremWrtn','finalNetPrem','finalShrPct','riskMgtQtr1','riskMgtQtr2','riskMgtQtr3','riskMgtQtr4','finalShrAmt'],
    paginateFlag  : false,
    infoFlag      : true,
    checkFlag     : false,
    addFlag       : false,
    deleteFlag    : false,
    uneditable    : [true,true,true,true,true,true,true,true,true],
    total         : [null,null,null,'Total','riskMgtQtr1','riskMgtQtr2','riskMgtQtr3','riskMgtQtr4','finalShrAmt'],
    widths        : ['200','130','130','100','130','130','130','130','130'],
    pageID        : 'riskMgtData',
    pageLength    : 'unli'
  };

  disableFields: boolean = false;
  dialogIcon: string = '';
  dialogMessage: string = '';
  cancelFlag: boolean = false;

  constructor(private ns: NotesService, private as: AccountingService) { }

  ngOnInit() {
    console.log(this.jvDetail);
    this.params.tranId = this.jvDetail.tranId;
    this.params.currCd = this.jvDetail.currCd;
    this.params.currRate = this.jvDetail.currRate;

  	var d = new Date();
    for(let x = d.getFullYear(); x >= 2018; x--) {
      this.yearParamOpts.push(x);
    }

    setTimeout(() => {
      this.riskMgtTbl.refreshTable();
      this.riskMgtTbl.overlayLoader = true;
    }, 0);

    this.disableFields = this.jvDetail.statusType == 'A' || this.jvDetail.statusType == 'X' || this.jvDetail.statusType == 'P';
    this.getAcitJVRiskMgtAlloc();
  }

  getAcitJVRiskMgtAlloc() {
    this.params.generate = 'N';
    this.riskMgtTbl.overlayLoader = true;
    this.as.getAcitJVRiskMgtAlloc(this.params).subscribe(data => {
      console.log(data);
      if(data['riskMgtAllocList'].length > 0) {
        var fDate = new Date(data['riskMgtAllocList'][0].finalFromDate);
        var tDate = new Date(data['riskMgtAllocList'][0].finalToDate);

        this.params.pwFromMm = fDate.getMonth() + 1;
        this.params.pwFromYear = fDate.getFullYear();
        this.params.pwToMm = tDate.getMonth() + 1;
        this.params.pwToYear = tDate.getFullYear();
        this.params.paytForQtr = data['riskMgtAllocList'][0].riskQtr;
        this.params.paytForYear = data['riskMgtAllocList'][0].riskYear;
        this.params.totalRiskmgtCharge = data['riskMgtAllocList'][0].totalRiskmgtCharge;
      }

      this.riskMgtData.tableData = data['riskMgtAllocList'];

      this.riskMgtTbl.refreshTable();
    });
  }

  onClickDistribute() {
    if(this.params.totalRiskmgtCharge == '' || this.params.totalRiskmgtCharge == null || isNaN(this.params.totalRiskmgtCharge)) {
      this.dialogIcon = "error-message";
      this.dialogMessage = "Invalid Amount";
      this.successDialog.open();
      return;
    }

    this.params.generate = 'Y';
    this.riskMgtTbl.overlayLoader = true;
    this.params.totalAmt = Number(String(this.params.totalRiskmgtCharge).replace(/\,/g,''));
    this.as.getAcitJVRiskMgtAlloc(this.params).subscribe(data => {
      console.log(data);
      this.riskMgtTbl.markAsDirty();
      this.riskMgtData.tableData = data['riskMgtAllocList'];

      this.riskMgtTbl.refreshTable();
    });
  }

  onClickSave() {
    this.confirmSave.confirmModal();
  }

  save(cancel?) {
    this.cancelFlag = cancel !== undefined;

    if(cancel !== undefined) {
      this.onClickSave();
      return;
    }

    var param = {
      tranType: this.jvDetail.tranType,
      allocTranId: this.jvDetail.tranId,
      paytForQtr: this.params.paytForQtr,
      paytForYear: this.params.paytForYear,
      totalAmt: Number(String(this.params.totalRiskmgtCharge).replace(/\,/g,'')),
      currCd: this.jvDetail.currCd,
      currRate: this.jvDetail.currRate,
      saveRiskMgtAlloc: this.riskMgtData.tableData.map(a => {
        a.finalFromDate = this.ns.toDateTimeString(a.finalFromDate);
        a.finalToDate = this.ns.toDateTimeString(a.finalToDate);
        a.updateUser = this.ns.getCurrentUser();
        a.updateDate = this.ns.toDateTimeString(0);

        return a;
      })
    };

    this.as.saveAcitJVRiskMgtAlloc(param).subscribe(data => {
      if(data['returnCode'] == 0) {
        this.dialogIcon = "error";
        this.successDialog.open();
      } else if(data['returnCode'] == -1) {
        this.dialogIcon = "success";
        this.dialogMessage = "";
        this.successDialog.open();
        this.riskMgtTbl.markAsPristine();
        this.getAcitJVRiskMgtAlloc();
      }
    })
  }

}
