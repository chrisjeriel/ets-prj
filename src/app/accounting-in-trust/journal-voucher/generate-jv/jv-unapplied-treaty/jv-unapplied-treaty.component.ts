import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-jv-unapplied-treaty',
  templateUrl: './jv-unapplied-treaty.component.html',
  styleUrls: ['./jv-unapplied-treaty.component.css'],
  providers: [DatePipe]
})
export class JvUnappliedTreatyComponent implements OnInit {
  
  @Input() jvDetail: any;
  @Input() cedingParams:any;
  @Output() emitData = new EventEmitter<any>();
  @Output() infoData = new EventEmitter<any>();
  @ViewChild('tbl') table: CustEditableNonDatatableComponent;
  @ViewChild('inwTbl') inwTbl: CustEditableNonDatatableComponent;
  @ViewChild('lov') lovMdl: LovComponent;
  @ViewChild('qsoaMdl') qsoaMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;

  passDataUnapplied :any = {
  	tableData: [],
    tHeaderWithColspan: [{header:'', span:1},{header: 'Unapplied Collection Info', span: 9}, {header: 'Payment Details', span: 2}, {header: '', span: 2}],
  	tHeader: ['Type', 'Item', 'Reference No', 'Description', 'Curr', 'Curr Rate', 'Unapplied Amt', 'Previous Payment','Balance', 'Payment Amount','Payment Amount(PHP)','Total Payment', 'Remaining Bal'],
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
  	uneditable: [true, true,true,true,true,true,true,true,true,false,false,false,false],
  	total: [null, null, null, null, null, 'Total', 'unappliedAmt', 'prevPaytAmt', 'prevBalance', 'actualBalPaid', 'localAmt', 'newPaytAmt', 'newBalance'],
  	keys: ['transDtlName', 'itemName', 'refNo', 'remarks', 'currCd', 'currRate', 'unappliedAmt', 'prevPaytAmt', 'prevBalance', 'actualBalPaid','localAmt','newPaytAmt', 'newBalance'],
  	widths: [110,100,85,110,48,65,105,85,90,100,130,90,90],
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
    saveUnappliedColl: [],
    delUnappliedColl: [],
    saveTrtyUnapplied: [],
    delTrtyUnapplied: []
  }

  forkSub: any;
  dialogIcon : any;
  dialogMessage : any;
  cancelFlag: boolean = false;

  constructor(private ns: NotesService, private accountingService:AccountingService, private maintenanceService: MaintenanceService, private dp: DatePipe) { }

  ngOnInit() {
  	this.passData = this.accountingService.getTreatyKeys('JV');
    this.passData.disableAdd = true;
    this.passData.nData.currRate = this.jvDetail.currRate;
    this.passData.nData.currCd = this.jvDetail.currCd;
    this.passDataUnapplied.disableAdd = true;
  	this.retrieveUnappTrty();
  }

  retrieveUnappTrty(){
  	var join = forkJoin(this.accountingService.getJvUnappliedColl(this.jvDetail.tranId),
                        this.accountingService.getJvTrtyUnappliedColl(this.jvDetail.tranId)).pipe(map(([collection, treaty]) => {return {collection, treaty}}));

  	this.forkSub = join.subscribe((data: any) => {
  	  console.log(data);
  	  if(data.collection.unappliedColl.length !== 0 || data.treaty.trtyUnappColl.length !== 0){
  	    this.passDataUnapplied.tableData = data.collection.unappliedColl;
  	  }

      if(data.collection.unappliedColl.length !== 0){
        this.table.onRowClick(null,this.passDataUnapplied.tableData[0]);
        this.jvDetails.cedingName = this.passDataUnapplied.tableData[0].cedingName;
        this.jvDetails.ceding = this.passDataUnapplied.tableData[0].cedingId;
      }
  	  this.table.refreshTable();
  	});
  }

  showCedingCompanyLOV() {
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

  onRowClick(data){
    console.log(data)
    if(data !== null){
      this.passData.disableAdd = false;
      this.passDataUnapplied.disableAdd = false;
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

  unappliedLOV(data){
    this.passLov.cedingId = this.jvDetails.ceding;
    this.passLov.hide = this.passDataUnapplied.tableData.filter((a)=>{return a.refTranId !== null && !a.deleted}).map(a=>{return a.refTranId.toString()});
    this.passLov.selector = 'unappliedColl';
    setTimeout(() => {
      this.lovMdl.openLOV();
    });
  }

  setLOV(data){
    console.log(data.data)
    this.passDataUnapplied.tableData = this.passDataUnapplied.tableData.filter(a=>a.showMG!=1);
    for (var i = 0; i < data.data.length; i++) {
      this.passDataUnapplied.tableData.push(JSON.parse(JSON.stringify(this.passDataUnapplied.nData)));
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].showMG         = 0;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].edited         = true;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].refTranId      = data.data[i].tranId;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].refBillId      = data.data[i].billId;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].refItemNo      = data.data[i].itemNo;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].transDtlName   = data.data[i].transdtlName;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].transdtlType   = data.data[i].transdtlType;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].itemNo         = data.data[i].itemNo;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].itemName       = data.data[i].itemName;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].refNo          = data.data[i].refNo;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].remarks        = data.data[i].remarks;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].currCd         = data.data[i].currCd;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].currRate       = data.data[i].currRate;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].prevPaytAmt    = data.data[i].prevPaytAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].prevBalance    = data.data[i].prevBalance;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].unappliedAmt   = data.data[i].unappliedAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].actualBalPaid  = data.data[i].actualBalPaid;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].localAmt       = data.data[i].localAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].newPaytAmt     = data.data[i].newPaytAmt;
      this.passDataUnapplied.tableData[this.passDataUnapplied.tableData.length - 1].newBalance     = data.data[i].newBalance;
    }
    this.table.refreshTable();
    this.table.onRowClick(null, this.passDataUnapplied.tableData[0]);
  }

    showOsQsoaMdl() {
	    this.passLov.selector = 'osQsoa';
	    this.passLov.hide = this.passData.tableData.map(a => a.qsoaId);
	    this.passLov.params = {
	      qsoaId: '',
	      currCd: this.jvDetail.currCd,
	      cedingId: this.jvDetails.ceding
	    }

	    this.qsoaMdl.openLOV();
	}		

    setQsoaLOV(data){
	    data['data'].forEach(a => {
	    if(this.passData.tableData.some(b => b.qsoaId != a.qsoaId)) {
	      a.currCd = this.jvDetail.currCd;
	      a.currRate = this.jvDetail.currRate;
	      a.prevPaytAmt = a.cumPayt;
	      a.prevBalance = a.remainingBal;
	      a.balanceAmt = a.remainingBal;
	      a.newPaytAmt = +(parseFloat(a.cumPayt) + parseFloat(a.balanceAmt)).toFixed(2);
	      a.newBalance = 0;
	      a.quarterEnding = this.dp.transform(a.quarterEnding, 'MM/dd/yyyy');
	      a.edited = true;
	      a.checked = false;
	      a.createDate = '';
	      a.createUser = '';
	      a.localAmt = +(parseFloat(a.remainingBal) * parseFloat(this.jvDetail.currRate)).toFixed(2);
	      this.passData.tableData.push(a);
	    }
	  });

	  this.passData.tableData = this.passData.tableData.filter(a => a.qsoaId != '');
	  this.inwTbl.refreshTable();
	  this.inwTbl.markAsDirty();
    }

    updateTreatyBal(data){
      var deletedFlag = false;
      var table = ''

      for (var i = 0; i < this.passData.tableData.length; i++) {
        this.passData.tableData[i].localAmt = isNaN(this.passData.tableData[i].currRate) ? 1:this.passData.tableData[i].currRate * this.passData.tableData[i].balanceAmt;

        this.passData.tableData[i].newPaytAmt = +(parseFloat(this.passData.tableData[i].prevPaytAmt) + parseFloat(this.passData.tableData[i].localAmt)).toFixed(2);
        this.passData.tableData[i].newBalance = +(parseFloat(this.passData.tableData[i].netQsoaAmt) - parseFloat(this.passData.tableData[i].newPaytAmt)).toFixed(2);

        if(this.passData.tableData[i].deleted){
          deletedFlag = true;
        }
      }
      this.table.refreshTable();
    }

    onClickSave(){
    	this.confirm.confirmModal();
    }

    prepareData(){
    	this.params.saveUnappliedColl = [];
	    this.params.delUnappliedColl  = [];
      this.params.saveTrtyUnapplied = [];
      this.params.delTrtyUnapplied  = [];

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

      for( var i = 0 ; i < this.passData.tableData.length; i++){
        if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.jvDetails.saveTrtyUnapplied.push(this.passData.tableData[i]);
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].tranId = this.jvDetail.tranId;
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].qsoaId = this.passData.tableData[i].qsoaId;
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].cedingId = this.jvDetails.ceding;
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].quarterEnding = this.ns.toDateTimeString(this.passData.tableData[i].quarterEnding);
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].createDate = this.ns.toDateTimeString(0);
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].updateDate = this.ns.toDateTimeString(0);
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].createUser = this.ns.getCurrentUser();
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].updateUser = this.ns.getCurrentUser();
          this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].quarterNo = this.jvDetails.saveTrtyUnapplied[this.jvDetails.saveTrtyUnapplied.length - 1].qsoaId;
        }

        if(this.passData.tableData[i].deleted){
          this.jvDetails.delTrtyUnapplied.push(this.passData.tableData[i]);
          this.jvDetails.delTrtyUnapplied[this.jvDetails.delTrtyUnapplied.length - 1].tranId = this.jvDetail.tranId;
        }
      }
      console.log(this.params)
    }	

    saveData(cancel?){
    	this.prepareData();

    	if(this.params.saveUnappliedColl.length != 0 || this.params.delUnappliedColl.length != 0){
	        this.accountingService.saveJvUnappliedColl(this.params).subscribe((data:any) => {
	          if(data['returnCode'] != -1) {
	            this.dialogMessage = data['errorList'][0].errorMessage;
	            this.dialogIcon = "error";
	            this.successDiag.open();
	          }else{
	            if(this.params.saveTrtyUnapplied.length != 0 || this.params.delTrtyUnapplied.length != 0){
                this.accountingService.saveJvTrtyUnappliedColl(this.params).subscribe((data:any) => {
                  this.dialogMessage = "";
                  this.dialogIcon = "success";
                  this.successDiag.open();
                  this.retrieveUnappTrty();
                });
	            }else{
	              this.dialogMessage = "";
	              this.dialogIcon = "success";
	              this.successDiag.open();
	              this.retrieveUnappTrty();
	            }
	          }
	        });
      }else if(this.params.saveTrtyUnapplied.length != 0 || this.params.delTrtyUnapplied.length != 0){
        this.accountingService.saveJvTrtyUnappliedColl(this.params).subscribe((data:any) => {
          if(data['returnCode'] != -1) {
            this.dialogMessage = data['errorList'][0].errorMessage;
            this.dialogIcon = "error";
            this.successDiag.open();
          }else{
            this.dialogMessage = "";
            this.dialogIcon = "success";
            this.successDiag.open();
            this.retrieveUnappTrty();
          }
        });
      }

    }
}
