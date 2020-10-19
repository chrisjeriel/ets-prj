import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { LoadingLovComponent } from '@app/_components/common/loading-lov/loading-lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-jv-unapplied-inwpol',
  templateUrl: './jv-unapplied-inwpol.component.html',
  styleUrls: ['./jv-unapplied-inwpol.component.css']
})
export class JvUnappliedInwpolComponent implements OnInit {
  
  @Input() jvDetail: any;
  @Input() cedingParams:any;
  @Output() emitData = new EventEmitter<any>();
  @Output() infoData = new EventEmitter<any>();
  @ViewChild('tbl') table: CustEditableNonDatatableComponent;
  @ViewChild('inwTbl') inwTbl: CustEditableNonDatatableComponent;
  @ViewChild('lov') lovMdl: LovComponent;
  @ViewChild('inw') lovInwMdl: LoadingLovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  
  passDataUnapplied :any = {
  	tableData: [],
    tHeaderWithColspan: [{header:'', span:1},{header: 'Unapplied Collection Info', span: 9}, {header: 'Payment Details', span: 2}, {header: '', span: 2}],
  	tHeader: ['Type', 'Item', 'Reference No', 'Description', 'Curr', 'Curr Rate', 'Unapplied Amt', 'Previous Payment','Balance','Payment Amount','Payment Amount(PHP)','Total Payment', 'Remaining Bal'],
  	dataTypes: ['text', 'text', 'text', 'text', 'text', 'percent', 'currency',  'currency', 'currency',  'currency', 'currency','currency','currency'],
  	nData: {
  	  showMG: 1,
  	  tranId:'',
      refTranId:'',
      refBillId: '',
      refItemNo: '',
  	  transDtlName :'',
      itemName :'',
      refNo :'',
      remarks :'',
      currCd :'',
      currRate:'',
      prevPaytAmt :'',
      prevBalance :'',
      unappliedAmt :'',
      actualBalPaid:'',
      localAmt:'',
      newPaytAmt :'',
      newBalance:'',
  	  createUser : this.ns.getCurrentUser(),
  	  createDate : '',
  	  updateUser : this.ns.getCurrentUser(),
  	  updateDate : '',
      unappliedId: '',
  	},
  	magnifyingGlass: ['transDtlName'],
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	disableAdd: true,
  	searchFlag: true,
  	infoFlag: true,
  	paginateFlag: true,
  	pageLength: 5,
  	pageID: '1',
  	uneditable: [true, true,true,true,true,true,true,true,true,false,true,true,true],
  	total: [null, null, null, null, null, 'Total', 'unappliedAmt', 'prevPaytAmt', 'prevBalance', 'actualBalPaid', 'localAmt', 'newPaytAmt', 'newBalance'],
  	keys: ['transDtlName', 'itemName', 'refNo', 'remarks', 'currCd', 'currRate', 'unappliedAmt', 'prevPaytAmt', 'prevBalance', 'actualBalPaid','localAmt','newPaytAmt', 'newBalance'],
  	widths: [100,100,85,110,1,65,105,85,90,100,130,90,90],
  }

  passData: any = {};

  jvDetails: any = {
    cedingName: '',
  };

  passLov: any = {
    selector: '',
    cedingId: '',
    hide: []
  };

  params:any = {
    tranId: null,
    tranType: null,
    saveUnappliedColl: [],
    delUnappliedColl: [],
    saveInwCollection: [],
    delInwCollection: []
  }

  forkSub: any;
  dialogIcon : any;
  dialogMessage : any;
  cancelFlag: boolean = false;
  readOnly: boolean = false;

  constructor(private ns:NotesService, private accountingService: AccountingService) { }

  ngOnInit() {
    this.passData = this.accountingService.getInwardPolicyKeys('JV');
    this.passData.disableAdd = true;
    this.passDataUnapplied.disableAdd = true;
    this.passData.nData = {showMG:1,tranId: '',soaNo: '', itemNo: '',policyId: '',instNo: '',policyNo: '',coRefNo: '',effDate: '',dueDate: '',currCd: '',currRate: '',premAmt: '',riComm: '',riCommVat: '',charges: '',netDue: '',prevPaytAmt: '',balPaytAmt: '',overdueInt: '',remarks: '',createUser: this.ns.getCurrentUser(),createDate: '',updateUser: this.ns.getCurrentUser(),updateDate: ''};
    this.passData.tableData = [];
    this.retrieveUnappInw();

    if(this.jvDetail.statusType == 'A' || this.jvDetail.statusType == 'X' || this.jvDetail.statusType == 'P') {
      this.passDataUnapplied.addFlag = false;
      this.passDataUnapplied.deleteFlag = false;
      this.passDataUnapplied.checkFlag = false;
      this.passDataUnapplied.tHeaderWithColspan = this.passDataUnapplied.tHeaderWithColspan.slice(1);
      this.passDataUnapplied.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true];

      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      this.passData.checkFlag = false;
      this.passData.tHeaderWithColspan = this.passData.tHeaderWithColspan.slice(1);
      this.passData.uneditable = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];

      this.readOnly = true;
    }
  }

  retrieveUnappInw(){
    var join = forkJoin(this.accountingService.getJvUnappliedColl(this.jvDetail.tranId),
                        this.accountingService.getJvInwUnappliedColl(this.jvDetail.tranId)).pipe(map(([collection,iwnPol]) => {return {collection,iwnPol}}));

    this.forkSub = join.subscribe((data: any) => {
      if(data.collection.unappliedColl.length !== 0 || data.iwnPol.inwUnappColl.length !== 0){
        this.passDataUnapplied.tableData = data.collection.unappliedColl;
        this.passData.tableData = data.iwnPol.inwUnappColl;
      }
      if(data.collection.unappliedColl.length !== 0){
        this.table.onRowClick(null,this.passDataUnapplied.tableData[0]);
        this.jvDetails.cedingName = this.passDataUnapplied.tableData[0].cedingName;
        this.jvDetails.ceding = this.passDataUnapplied.tableData[0].cedingId;
      }

      this.table.refreshTable();
      this.inwTbl.refreshTable();
    });
  }

  showCedingCompanyLOV(ev) {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.payeeName;
    this.jvDetails.ceding = data.payeeCd;
    this.passDataUnapplied.disableAdd = false;
    this.ns.lovLoader(data.ev, 0);
    this.check(this.jvDetails);
  }

  check(data){
    this.emitData.emit({ cedingId: data.ceding,
                         cedingName: data.cedingName
                       });
  }

  unappliedLOV(data){
    this.passLov.cedingId = this.jvDetails.ceding;
    this.passLov.params = {
      unappliedId: '',
      cedingId: this.jvDetails.ceding,
      currCd: this.jvDetail.currCd
    }
    this.passLov.hide = this.passDataUnapplied.tableData.filter((a)=>{return a.unappliedId !== null && !a.deleted}).map(a=>{return a.unappliedId});
    this.passLov.selector = 'unappliedColl';
    setTimeout(() => {
      this.lovMdl.openLOV();
    });
  }

  setLOV(data){
    this.passDataUnapplied.tableData = this.passDataUnapplied.tableData.filter(a=>a.showMG!=1);
    for (var i = 0; i < data.data.length; i++) {
      this.passDataUnapplied.tableData.push(JSON.parse(JSON.stringify(this.passDataUnapplied.nData)));
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].showMG         = 0;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].edited         = true;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].refTranId      = data.data[i].tranId;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].refBillId      = data.data[i].billId;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].refItemNo      = data.data[i].itemNo;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].transDtlName   = data.data[i].transdtlName;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].transDtlType   = data.data[i].transdtlType;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].itemNo         = data.data[i].itemNo;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].itemName       = data.data[i].itemName;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].refNo          = data.data[i].refNo;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].remarks        = data.data[i].remarks;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].currCd         = data.data[i].currCd;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].currRate       = data.data[i].currRate;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].prevPaytAmt    = data.data[i].totalApldAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].prevBalance    = data.data[i].balUnapldAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].unappliedAmt   = data.data[i].totalUnapldAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].actualBalPaid  = data.data[i].balUnapldAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].localAmt       = data.data[i].localAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].newPaytAmt     = +(parseFloat(data.data[i].balUnapldAmt) + parseFloat(data.data[i].totalApldAmt)).toFixed(2);
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].newBalance     = 0;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].unappliedId    = data.data[i].unappliedId;
    }
    this.table.refreshTable();
    this.table.onRowClick(null, this.passDataUnapplied.tableData[0]);
  }
  
  onRowClick(data){
    if(data !== null){
      this.passData.disableAdd = false;
      this.passDataUnapplied.disableAdd = false;
      this.infoData.emit(data);
    }else{
      this.passData.disableAdd = true;
      this.passDataUnapplied.disableAdd = false;
    }
  }

  update(data){
    for (var i = 0; i < this.passDataUnapplied.tableData.length; i++) {
      this.passDataUnapplied.tableData[i].localAmt = this.passDataUnapplied.tableData[i].actualBalPaid * this.jvDetail.currRate;
      this.passDataUnapplied.tableData[i].newPaytAmt = this.passDataUnapplied.tableData[i].actualBalPaid + this.passDataUnapplied.tableData[i].prevPaytAmt;
      this.passDataUnapplied.tableData[i].newBalance = this.passDataUnapplied.tableData[i].unappliedAmt - this.passDataUnapplied.tableData[i].newPaytAmt;
    }
    this.table.refreshTable();
  }

  inwLOV(data){
    this.passLov.cedingId = this.jvDetails.ceding;
    this.passLov.selector = 'acitSoaDtl';
    this.passLov.currCd = this.jvDetail.currCd;
    this.passLov.hide = this.passData.tableData.filter((a)=>{return a.soaNo !== null && !a.deleted}).map(a=>{return a.soaNo.toString()});
    setTimeout(() => {
      this.lovInwMdl.openLOV();
    });
  }

  setInwLOV(data){
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for (var i = 0; i < data.data.length; i++) {
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].showMG           = 0;
      this.passData.tableData[this.passData.tableData.length - 1].edited           = true;
      this.jvDetails.cedingName = data.data[i].cedingName;
      this.passData.tableData[this.passData.tableData.length - 1].policyId         = data.data[i].policyId;
      this.passData.tableData[this.passData.tableData.length - 1].tranId           = this.jvDetail.tranId;
      this.passData.tableData[this.passData.tableData.length - 1].soaNo            = data.data[i].soaNo;
      this.passData.tableData[this.passData.tableData.length - 1].policyNo         = data.data[i].policyNo;
      this.passData.tableData[this.passData.tableData.length - 1].coRefNo          = data.data[i].coRefNo;
      this.passData.tableData[this.passData.tableData.length - 1].instNo           = data.data[i].instNo;
      this.passData.tableData[this.passData.tableData.length - 1].effDate          = data.data[i].effDate;
      this.passData.tableData[this.passData.tableData.length - 1].dueDate          = data.data[i].dueDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd           = data.data[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate         = data.data[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].prevPremAmt      = data.data[i].prevPremAmt;
      this.passData.tableData[this.passData.tableData.length - 1].prevRiComm       = data.data[i].prevRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].prevRiCommVat    = data.data[i].prevRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].prevCharges      = data.data[i].prevCharges;
      this.passData.tableData[this.passData.tableData.length - 1].prevNetDue       = data.data[i].prevNetDue;
      this.passData.tableData[this.passData.tableData.length - 1].netDue           = data.data[i].netDue;
      this.passData.tableData[this.passData.tableData.length - 1].prevPaytAmt      = data.data[i].totalPayments;
      this.passData.tableData[this.passData.tableData.length - 1].cumPayment       = data.data[i].cumPayment;
      this.passData.tableData[this.passData.tableData.length - 1].balance          = data.data[i].prevBalance;
      this.passData.tableData[this.passData.tableData.length - 1].paytAmt          = data.data[i].prevBalance;
      this.passData.tableData[this.passData.tableData.length - 1].localAmt         = data.data[i].prevBalance * this.jvDetail.currRate;
      this.passData.tableData[this.passData.tableData.length - 1].premAmt          = data.data[i].balPremDue;
      this.passData.tableData[this.passData.tableData.length - 1].riComm           = data.data[i].balRiComm;
      this.passData.tableData[this.passData.tableData.length - 1].riCommVat        = data.data[i].balRiCommVat;
      this.passData.tableData[this.passData.tableData.length - 1].charges          = data.data[i].balChargesDue;
      this.passData.tableData[this.passData.tableData.length - 1].totalPayt        = data.data[i].cumPayment + data.data[i].prevBalance;
      this.passData.tableData[this.passData.tableData.length - 1].remainingBal     = data.data[i].prevNetDue - (data.data[i].cumPayment + data.data[i].prevBalance);
      this.passData.tableData[this.passData.tableData.length - 1].insuredDesc      = data.data[i].insuredDesc;
    }

    this.inwTbl.refreshTable();
  }

  updateInw(data){
    
    for (var i = 0; i < this.passData.tableData.length; i++) {
      this.passData.tableData[i].premAmt = (this.passData.tableData[i].paytAmt / this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevPremAmt;
      this.passData.tableData[i].riComm = (this.passData.tableData[i].paytAmt / this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevRiComm;
      this.passData.tableData[i].riCommVat = (this.passData.tableData[i].paytAmt / this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevRiCommVat;
      this.passData.tableData[i].charges = (this.passData.tableData[i].paytAmt / this.passData.tableData[i].prevNetDue) * this.passData.tableData[i].prevCharges;
      this.passData.tableData[i].netDue = this.passData.tableData[i].remainingBal;

      this.passData.tableData[i].totalPayt = this.passData.tableData[i].paytAmt + this.passData.tableData[i].cumPayment;
      this.passData.tableData[i].remainingBal = this.passData.tableData[i].prevNetDue - this.passData.tableData[i].totalPayt;
      this.passData.tableData[i].localAmt = this.passData.tableData[i].paytAmt * this.jvDetail.currRate;
    }
    this.inwTbl.refreshTable();
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  prepareData(){
    this.params.saveUnappliedColl = [];
    this.params.delUnappliedColl  = [];
    this.params.saveInwCollection = [];
    this.params.delInwCollection  = [];

    for (var i = 0; i < this.passDataUnapplied.tableData.length; i++) {
      if(this.passDataUnapplied.tableData[i].edited && !this.passDataUnapplied.tableData[i].deleted){
        this.params.saveUnappliedColl.push(this.passDataUnapplied.tableData[i]);
        this.params.saveUnappliedColl[this.params.saveUnappliedColl.length - 1].tranId     = this.jvDetail.tranId;
        this.params.saveUnappliedColl[this.params.saveUnappliedColl.length - 1].cedingId   = this.jvDetails.ceding;
        this.params.saveUnappliedColl[this.params.saveUnappliedColl.length - 1].createDate = this.ns.toDateTimeString(0);
        this.params.saveUnappliedColl[this.params.saveUnappliedColl.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passDataUnapplied.tableData[i].deleted){
        this.params.delUnappliedColl.push(this.passDataUnapplied.tableData[i]);
        this.params.delUnappliedColl[this.params.delUnappliedColl.length - 1].tranId     = this.jvDetail.tranId;
      }
    }

    for (var j = 0; j < this.passData.tableData.length; j++) {
      if(this.passData.tableData[j].edited && !this.passData.tableData[j].deleted){
        if(this.passData.tableData[j].balance >= 0 && this.passData.tableData[j].paytAmt >= 0){
           this.passData.tableData[j].paytType = 1
         }else if(this.passData.tableData[j].balance >= 0 && this.passData.tableData[j].paytAmt < 0){
           this.passData.tableData[j].paytType = 2
         }else if(this.passData.tableData[j].balance <= 0 && this.passData.tableData[j].paytAmt <= 0){
           this.passData.tableData[j].paytType = 3
         }else if(this.passData.tableData[j].balance <= 0 && this.passData.tableData[j].paytAmt > 0){
           this.passData.tableData[j].paytType = 4
         }

         this.params.saveInwCollection.push(this.passData.tableData[j]);
         this.params.saveInwCollection[this.params.saveInwCollection.length - 1].tranId     = this.jvDetail.tranId;
         this.params.saveInwCollection[this.params.saveInwCollection.length - 1].netDue     = this.passData.tableData[j].premAmt - this.passData.tableData[j].riComm - this.passData.tableData[j].riCommVat + this.passData.tableData[j].charges;
         this.params.saveInwCollection[this.params.saveInwCollection.length - 1].createDate = this.ns.toDateTimeString(0);
         this.params.saveInwCollection[this.params.saveInwCollection.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[j].deleted){
        this.params.delInwCollection.push(this.passData.tableData[j]);
        this.params.delInwCollection[this.params.delInwCollection.length - 1].tranId     = this.jvDetail.tranId;
      }
    }

    this.params.tranId = this.jvDetail.tranId;
    this.params.tranType = this.jvDetail.tranType;
  }

  saveData(cancel?){
    this.cancelFlag = cancel !== undefined;
    this.prepareData();
    if(this.params.saveUnappliedColl.length != 0 || this.params.delUnappliedColl.length != 0 ||
       this.params.saveInwCollection.length != 0 || this.params.delInwCollection.length != 0){
      if(this.params.saveUnappliedColl.length != 0 || this.params.delUnappliedColl.length != 0){
        this.accountingService.saveJvUnappliedColl(this.params).subscribe((data:any) => {
          if(data['returnCode'] != -1) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successDiag.open();
          }else{
            if(this.params.saveInwCollection.length != 0 || this.params.delInwCollection.length != 0){
              this.accountingService.saveJvInwUnappliedColl(this.params).subscribe((data:any) => {
                if(data['returnCode'] != -1) {
                  this.dialogMessage = data['errorList'][0].errorMessage;
                  this.dialogIcon = "error";
                  this.successDiag.open();
                }else{
                  this.dialogMessage = "";
                  this.dialogIcon = "success";
                  this.successDiag.open();
                  this.retrieveUnappInw();
                }
              });
            }else{
              this.dialogMessage = "";
              this.dialogIcon = "success";
              this.successDiag.open();
              this.retrieveUnappInw();
            }
          }
        });
      }else if(this.params.saveInwCollection.length != 0 || this.params.delInwCollection.length != 0){
        this.accountingService.saveJvInwUnappliedColl(this.params).subscribe((data:any) => {
          if(data['returnCode'] != -1) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successDiag.open();
          }else{
            this.dialogMessage = "";
            this.dialogIcon = "success";
            this.successDiag.open();
            this.retrieveUnappInw();
          }
        });
      }
    }
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }
}
