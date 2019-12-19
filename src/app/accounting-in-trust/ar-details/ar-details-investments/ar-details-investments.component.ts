import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccARInvestments } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-ar-details-investments',
  templateUrl: './ar-details-investments.component.html',
  styleUrls: ['./ar-details-investments.component.css']
})
export class ArDetailsInvestmentsComponent implements OnInit {

  @Input() record: any = {};
  @Input() invData: any[] = [];

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(ModalComponent) netMdl: ModalComponent;
  @Output() investment: EventEmitter<any> = new EventEmitter();
  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();
  
  passData: any = {
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
    magnifyingGlass: ['invtCode'],
    nData: {
      tranId: '',
      billId: 1,
      itemNo: '',
      invtId: '',
      invtCode: '',
      certNo: '',
      invtType: '',
      invtTypeDesc: '',
      invtSecCd: '',
      securityDesc: '',
      maturityPeriod: '',
      durationUnit: '',
      interestRate: '',
      purchasedDate: '',
      maturityDate: '',
      pulloutType: '',
      currCd: '',
      currRate: '',
      invtAmt: '',
      incomeAmt: '',
      bankCharge: '',
      whtaxAmt: '',
      maturityValue: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
      showMG: 1
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue'],
    uneditable: [false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ],
    checkFlag: true,
    pageID: 6,
    widths:[130, 120, 1, 130, 1, 1, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120]
  }

  passLov: any = {
    selector: 'acitArInvPullout',
    searchParams: [],
    hide: []
  }
  cancelFlag: boolean;
  totalLocalAmt: number = 0;
  dialogIcon: string = '';
  dialogMessage: string = '';
  invtPulloutIndex: number = 0;

  isReopen: boolean = false;
  originalNet: number = 0;
  newAlteredAmt: number = 0;

  savedData: any[] = [];
  deletedData: any[] = [];

  constructor(private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    console.log(this.record.tranId);
    console.log(this.invData);
    this.passData.nData.tranId = this.record.tranId;
    this.isReopen = this.record.reopenTag == 'Y';
    this.passLov.searchParams = [{key: 'bankCd', search: this.record.payeeNo}, {key:'invtStatus', search: 'M%'}, {key:'currCd', search:this.record.currCd}];
    if(this.invData !== undefined){
      for(var i of this.invData){
        this.passLov.hide.push(i);
      }
    }
    if(this.record.arStatDesc.toUpperCase() != 'NEW'){
      this.passData.uneditable = [true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ];
      this.passData.addFlag = false;
      this.passData.deleteFlag =  false;
      this.passData.checkFlag = false;
    }
    this.retrieveFullPullout();
  }

  retrieveFullPullout(){
    this.passData.tableData = [];

    this.accountingService.getAcitArInvPullout(this.record.tranId, 1, 'F').subscribe(  //F is pullout type for this screen. Bill Id is always 1 for Investment Pullout
      (data: any)=>{
        for(var i of data.invPulloutList){
          i.uneditable = ['invtCode'];
          this.originalNet += i.maturityValue;
          this.passData.tableData.push(i);
          this.passLov.hide.push(i.invtCode);
        }
        console.log(this.passLov.hide);
        this.investment.emit(this.passLov.hide);
        this.table.refreshTable();
      }
    );
  }

  openInvPulloutLOV(data){
    console.log(this.invData);
    this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
    for(var i of this.invData){
      this.passLov.hide.push(i);
    }
    console.log(this.passLov.hide);
    this.invtPulloutIndex = data.index;
    this.lovMdl.openLOV();
  }

  setSelectedData(data){
    let selected = data.data;
    this.passData.tableData = this.passData.tableData.filter(a=>a.showMG!=1);
    for(var i = 0; i < selected.length; i++){
      this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
      this.passData.tableData[this.passData.tableData.length - 1].tranId = this.record.tranId; 
      this.passData.tableData[this.passData.tableData.length - 1].billId = 1;
      this.passData.tableData[this.passData.tableData.length - 1].invtId = selected[i].invtId; 
      this.passData.tableData[this.passData.tableData.length - 1].invtCode = selected[i].invtCd; 
      this.passData.tableData[this.passData.tableData.length - 1].certNo = selected[i].certNo;
      this.passData.tableData[this.passData.tableData.length - 1].invtType = selected[i].invtType;
      this.passData.tableData[this.passData.tableData.length - 1].invtTypeDesc = selected[i].invtTypeDesc;
      this.passData.tableData[this.passData.tableData.length - 1].invtSecCd = selected[i].invtSecCd;
      this.passData.tableData[this.passData.tableData.length - 1].securityDesc = selected[i].securityDesc;
      this.passData.tableData[this.passData.tableData.length - 1].maturityPeriod = selected[i].matPeriod;
      this.passData.tableData[this.passData.tableData.length - 1].durationUnit = selected[i].durUnit;
      this.passData.tableData[this.passData.tableData.length - 1].purchasedDate = selected[i].purDate;
      this.passData.tableData[this.passData.tableData.length - 1].maturityDate = selected[i].matDate;
      this.passData.tableData[this.passData.tableData.length - 1].currCd = selected[i].currCd;
      this.passData.tableData[this.passData.tableData.length - 1].currRate = selected[i].currRate;
      this.passData.tableData[this.passData.tableData.length - 1].interestRate = selected[i].intRt;
      this.passData.tableData[this.passData.tableData.length - 1].invtAmt = selected[i].invtAmt;
      this.passData.tableData[this.passData.tableData.length - 1].incomeAmt = selected[i].incomeAmt;
      this.passData.tableData[this.passData.tableData.length - 1].bankCharge = selected[i].bankCharge;
      this.passData.tableData[this.passData.tableData.length - 1].whtaxAmt = selected[i].whtaxAmt;
      this.passData.tableData[this.passData.tableData.length - 1].maturityValue = selected[i].matVal;
      this.passData.tableData[this.passData.tableData.length - 1].localAmt = Math.round((selected[i].matVal * selected[i].currRate)*100) / 100;
      console.log(Math.round((selected[i].matVal * selected[i].currRate)*100) / 100);
      this.passData.tableData[this.passData.tableData.length - 1].pulloutType = 'F';
      this.passData.tableData[this.passData.tableData.length - 1].edited = true;
      this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
      this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['invtCode'];
    }
    this.table.refreshTable();
  }

  onClickSave(cancel?){
      if(this.record.dcbStatus == 'C' || this.record.dcbStatus == 'T'){
        this.dialogIcon = 'error-message';
        this.dialogMessage = 'A.R. cannot be saved. DCB No. is '; 
        this.dialogMessage += this.record.dcbStatus == 'T' ? 'temporarily closed.' : 'closed.';
        this.successDiag.open();
      }else if(this.isReopen && this.checkOriginalAmtvsAlteredAmt()){
        this.netMdl.openNoClose();
      }else{
        if(cancel != undefined){
          this.save(cancel);
        }else{
          this.confirm.confirmModal();
        }
      }
  }

  save(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    //prepare params from table
    this.savedData = [];
    this.deletedData = [];
    this.totalLocalAmt = 0;
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(!this.passData.tableData[i].deleted){
        this.totalLocalAmt += this.passData.tableData[i].localAmt;
      }
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].tranId = this.record.tranId;
          this.savedData[this.savedData.length-1].billId = 1; //1 for Investment Pull out Transaction Type
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = this.ns.getCurrentUser();
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = this.ns.getCurrentUser();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
         this.deletedData[this.deletedData.length-1].billId = 1; //1 for Claim Recovery / Overpayment Transaction Type
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }
    }
    let params: any = {
      tranId: this.record.tranId,
      billId: 1, //1 for Claim Recovery / Overpayment Transaction Type
      billType: this.record.tranTypeCd,
      totalLocalAmt: this.totalLocalAmt,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
      saveInvPullout: this.savedData,
      delInvPullout: this.deletedData
    }
    console.log(params);

    this.accountingService.saveAcitArInvPullout(params).subscribe(
      (data:any)=>{
       if(data.returnCode === -1){
          this.dialogIcon = '';
          this.successDiag.open();
          this.retrieveFullPullout();
          this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
          this.investment.emit(this.passLov.hide);
          this.table.markAsPristine();
        }else if(data.returnCode === 0 && data.custReturnCode !== 2){
          this.dialogIcon = 'error';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }else if(data.returnCode === 0 && data.custReturnCode === 2){
          this.dialogIcon = 'error-message';
          this.dialogMessage = 'Total Maturity Value of the Investment Pull-outs must not exceed the AR Amount.';
          this.successDiag.open();
          if(this.cancelFlag){
            this.cancelFlag = false;
          }
        }
      },
      (error: any)=>{

      }
    );
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  onRowClick(data){
    if(data !== null){
      data.updateDate = this.ns.toDateTimeString(data.updateDate);
      data.createDate = this.ns.toDateTimeString(data.createDate);
      this.emitCreateUpdate.emit(data);
    }else{
      this.emitCreateUpdate.emit(null);
    }
  }
  onTableDataChange(data){
    console.log(data);
  }

  checkOriginalAmtvsAlteredAmt(): boolean{
    this.newAlteredAmt = 0;
    for(var i of this.passData.tableData){
      if(!i.deleted){
        this.newAlteredAmt += i.currAmt;
      }
    }
    console.log('originalAmt => ' + this.originalNet );
    console.log('newAlterAmt => ' + this.newAlteredAmt);
    return this.newAlteredAmt != this.originalNet;
  }

  export(){
        //do something
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'ARDetails_#'+this.record.formattedArNo+'_'+currDate+'.xls'
    var rowLength: number = this.passData.tableData.length + 7;
    console.log("Row Length >>>" + rowLength);
    var mystyle = {
        headers:false, 
        column: {style:{Font:{Bold:"1"}}},
        rows: {0:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               2:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               5:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               6:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}},
               [rowLength]:{style:{Font:{Bold:"1"},Interior:{Color:"#C9D9D9", Pattern: "Solid"}}}}
      };
    console.log(mystyle);

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

       alasql.fn.currency = function(currency) {
            var parts = parseFloat(currency).toFixed(2).split(".");
            var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
                (parts[1] ? "." + parts[1] : "");
            return num
      };

      alasql.fn.rate = function(rate) {
            var parts = parseFloat(rate).toFixed(10).split(".");
            var num = parts[0].replace(new RegExp(",", "g"),'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num
      };
    var invtAmt = 0;
    var incomeAmt = 0;
    var bankCharge = 0;
    var whtaxAmt = 0;
    var maturityValue = 0;

    alasql('CREATE TABLE sample(row1 VARCHAR2, row2 VARCHAR2, row3 VARCHAR2, row4 VARCHAR2, row5 VARCHAR2, row6 VARCHAR2, row7 VARCHAR2, row8 VARCHAR2, row9 VARCHAR2, row10 VARCHAR2,'+
                                'row11 VARCHAR2, row12 VARCHAR2, row13 VARCHAR2, row14 VARCHAR2, row15 VARCHAR2, row16 VARCHAR2)');
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['AR No', 'AR Date', 'DCB No.', 'Payment Type', 'Amount', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,datetime(?),?,?,?,currency(?),?,?,?,?,?,?,?,?,?,?)', [this.record.formattedArNo, this.record.arDate, this.record.dcbNo, this.record.tranTypeName, this.record.currCd, this.record.arAmt, '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['Payor', '', '', 'Status', 'Local Amount', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,currency(?),?,?,?,?,?,?,?,?,?,?)', [this.record.payor, '','', this.record.arStatDesc, 'PHP', this.record.currRate * this.record.arAmt, '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['Full Pullout', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value']);
    for(var i of this.passData.tableData){
      invtAmt      += i.invtAmt;
      incomeAmt   += i.incomeAmt;
      bankCharge     += i.bankCharge;
      whtaxAmt      += i.whtaxAmt;
      maturityValue     += i.maturityValue;
      alasql('INSERT INTO sample VALUES(?,?,?,?,?,?,rate(?), datetime(?), datetime(?), ?, rate(?), currency(?), currency(?), currency(?), currency(?), currency(?))', [i.invtCode, i.certNo, i.invtTypeDesc, i.securityDesc, i.maturityPeriod, i.durationUnit, i.interestRate, i.purchasedDate, i.maturityDate, i.currCd, i.currRate, 
           i.invtAmt , i.incomeAmt, i.bankCharge, i.whtaxAmt, i.maturityValue]);
    }
    //alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    alasql('INSERT INTO sample VALUES (?,?,?,?,?,?,?, ?, ?, ?, ?, currency(?), currency(?), currency(?), currency(?), currency(?))', ["", "", "", "", "","", "", "", "", "","TOTAL",invtAmt ,incomeAmt ,bankCharge ,whtaxAmt ,maturityValue]);
    alasql('SELECT row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15, row16 INTO XLSXML("'+filename+'",?) FROM sample', [mystyle]);
    alasql('DROP TABLE sample');  
  }

}
