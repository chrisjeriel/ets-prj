import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService, PrintService } from '@app/_services';
import { AccCVPayReqList } from '@app/_models';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { OverrideLoginComponent } from '@app/_components/common/override-login/override-login.component';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.css']
})
export class BudgetDetailsComponent implements OnInit {
  @ViewChild('budgetYrTbl') budgetYrTbl : CustEditableNonDatatableComponent;
  @ViewChild('budYrLov') budYrLov       : LovComponent;
  @ViewChild('can') can                 : CancelButtonComponent;
  @ViewChild('con') con                 : ConfirmSaveComponent;
  @ViewChild('suc') suc                 : SucessDialogComponent;
  @ViewChild('myForm') form             : NgForm;
  @ViewChild('copyYear') copyYear       : ModalComponent;
  @ViewChild('override') overrideLogin: OverrideLoginComponent;
  @ViewChild('conOvr') conOvr                 : ConfirmSaveComponent;
  @ViewChild('conOvrMdl') conOvrMdl       : ModalComponent;
  @ViewChild('printMdl') printMdl: ModalComponent;

  budgetYrData: any = {
    tableData        : [],
    tHeader          : ["Account Code", "Account Name","SL Type", "SL Name", "Total Budget", "Total Expense"],
    resizable        : [true, true, true, true, true, true],
    uneditable       : [true, false, true, true, false, true],
    dataTypes        : ["text", "text", "text","text","currency","currency"],
    nData  : {
      glAcctId     : '',
      glShortCd    : '',
      glShortDesc  : '',
      slTypeCd     : '',
      slTypeName   : '',
      slCd         : '',
      slName       : '',
      totalBudget  : '',
      showMG       : 1,
    },
    addFlag          : true,
    deleteFlag       : true,
    checkFlag        : true,
    searchFlag       : true,
    pageLength       : 15,
    infoFlag         : true,
    widths           : [117, 'auto', 'auto', 'auto', 125, 125],
    paginateFlag     : true,
    pageID           : 'budgetYrDataID',
    magnifyingGlass  : ['glShortCd','slTypeName','slName'],
    total            : [null,null,null,'TOTAL','totalBudget', 'totalExpense'],
    keys             : ['glShortCd','glShortDesc','slTypeName','slName','totalBudget', 'totalExpense'],
    filters: [
            {key: 'accCode',title: 'Account Code',dataType: 'text'},
            {key: 'accName',title: 'Account Name',dataType: 'text'},
            {key: 'slType', title: 'SL Type',dataType: 'text'},
            {key: 'slName', title: 'SL Name',dataType: 'text'},
            {key: 'amount', title: 'Amount',dataType: 'text'},
        ],
  };

  otherData : any =  {
    createUser : '',
    createDate : '',
    updateUser : '',
    updateDate : ''
  };

  params : any =  {
    saveBudgetExpense     : [],
    deleteBudgetExpense   : [],
    desYear:'',
    originYear:''
  };

  passDataLov  : any = {
    selector  : '',
    payeeCd   : '',
    currCd    : '',
    params    : {}
  };

  budgetYear     : string = '';
  budgetYearArr  : any[] = [];
  cancelFlag     : boolean;
  dialogIcon     : string;
  dialogMessage  : string;
  lovCheckBox    : boolean = true;
  lovRow         : any;
  approvalCd: string = 'AC011';
  conOvrMsg: string = '';

  printParams: any = {
    reportId: 'ACSER004',
    asOfDate: '',
    destination: 'screen'
  };

  passDataCsv : any[] =[];

  constructor(private titleService: Title,private acctService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService, 
              public modalService: NgbModal, private router : Router, public ps: PrintService) { }

  ngOnInit() {
    this.yearsRange();
  }

  getAcseBudgetExpense(){
    this.budgetYrTbl.overlayLoader = true;
    this.acctService.getAcseBudgetExpense(this.budgetYear)
    .subscribe(data => {
      this.budgetYrTbl.overlayLoader = false;
      this.budgetYrData.tableData = data['acseBudgetExpenseList'].map(e => {
        e.updateDate = this.ns.toDateTimeString(e.updateDate);
        e.createDate = this.ns.toDateTimeString(e.createDate);
        return e;
      });
      this.budgetYrTbl.refreshTable();
    });
  }

  onClickSave(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    var isEmpty = 0;

    this.budgetYrData.tableData.forEach(e =>{
      if(this.budgetYear == '' || this.budgetYear == null || e.glShortCd == '' || e.glShortCd == null || e.totalBudget == '' || e.totalBudget == null){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deleteBudgetExpense.push(e);
        }
      }else { 
        e.fromCancel = true;
        if(e.edited && !e.deleted){
          this.params.saveBudgetExpense = this.params.saveBudgetExpense.filter(i => i.glAcctId != e.glAcctId);
          e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
          e.createDate    = this.ns.toDateTimeString(e.createDate);
          e.updateUser    = this.ns.getCurrentUser();
          e.updateDate    = this.ns.toDateTimeString(0);
          e.budgetYear    = this.budgetYear;
          e.totalExpense  = 0;
          this.params.saveBudgetExpense.push(e);
        }else if(e.edited && e.deleted){ 
          this.params.deleteBudgetExpense.push(e);  
        }
      }
    });

    console.log(this.budgetYrData.tableData);
    console.log(this.params.saveBudgetExpense);
    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.suc.open();
      this.params.saveBudgetExpense = [];
    }else{
      if(this.params.saveBudgetExpense.length == 0 && this.params.deleteBudgetExpense.length == 0){
        this.budgetYrTbl.markAsPristine();
        this.con.confirmModal();
        this.params.saveBudgetExpense   = [];
        this.params.deleteBudgetExpense = [];
        this.budgetYrData.tableData = this.budgetYrData.tableData.filter(e => e.glAcctId != '');
      }else{
        if(this.cancelFlag == true){
          this.con.showLoading(true);
          setTimeout(() => { try{this.con.onClickYes();}catch(e){}},500);
        }else{
          this.con.confirmModal();
        }
      }
    }
  }

  onSaveAcseBudgetExpense(){
    this.acctService.saveAcseBudgetExpense(JSON.stringify(this.params))
    .subscribe(data => {
      console.log(data);
      if(data['returnCode'] == 0){
        this.dialogIcon = 'error';
      }else{
        this.getAcseBudgetExpense();
        this.budgetYrTbl.markAsPristine();
      }
      this.suc.open();
      this.params.saveBudgetExpense  = [];
      this.params.deleteBudgetExpense  = [];
    });
  }

  showLov(data){
    console.log(data);
    this.lovRow = data;
    var key = data['key'].toUpperCase();
    this.passDataLov.selector = '';
    if(key == 'GLSHORTCD'){
      this.passDataLov.selector = 'acseChartAcct';
      this.lovCheckBox = true;
      this.passDataLov.params = {};
    }else if(key == 'SLTYPENAME'){
      this.passDataLov.selector = 'slType';
      this.lovCheckBox = false;
      this.passDataLov.params = {};
    }else if(key == 'SLNAME'){
      this.passDataLov.selector = 'sl';
      this.lovCheckBox = false;
      this.passDataLov.params.slTypeCd = data.data.slTypeCd;
    }
    this.budYrLov.openLOV();
  }

  setData(data){
    var rec = data['data'];
    console.log(rec);
    if(data.selector == 'acseChartAcct'){
      rec.forEach(e => {
        this.budgetYrData.tableData.push(e);
      });
    }else if(data.selector == 'slType'){
      this.budgetYrData.tableData[this.lovRow.index].slTypeCd = rec.slTypeCd;
      this.budgetYrData.tableData[this.lovRow.index].slTypeName = rec.slTypeName;
      this.budgetYrData.tableData[this.lovRow.index].slCd = '';
      this.budgetYrData.tableData[this.lovRow.index].slName = '';
    }else if(data.selector == 'sl'){
      this.budgetYrData.tableData[this.lovRow.index].slCd = rec.slCd;
      this.budgetYrData.tableData[this.lovRow.index].slName = rec.slName;
    }
    
    this.budgetYrData.tableData = this.budgetYrData.tableData.filter(e => e.glAcctId != '').map(e => {
      if(e.newRec == 1){
        e.glShortCd   = e.shortCode;
        e.glShortDesc = e.shortDesc;
        e.createUser  = '';
        e.createDate  = '';
        e.updateUser  = '';
        e.updateDate  = '';
        e.edited      = true;
        e.checked     = false;
        e.showMG      = 1;
      }
      return e;
    });
    
    console.log(this.budgetYrData.tableData);
    this.budgetYrTbl.refreshTable();
  }

  checkCancel(){
    if(this.cancelFlag){
      if(this.budgetYrData.tableData.some(e => e.fromCancel == false)){
        return;
      }else{
        this.can.onNo();  
      }
    }
  }

  onRowClick(data){
    console.log(data);
    this.otherData = data;
  }

  yearsRange(){
    var d = new Date().getFullYear();
    for(var i=2000;i<=d+10;i++){
      this.budgetYearArr.push(i);
    }
    this.budgetYearArr.sort((a,b) => b-a);
    this.budgetYear = d.toString(); //this.budgetYearArr[0];
    this.getAcseBudgetExpense();
  }

  onClickCopy(){
    this.params.originYear = '';
    this.copyYear.openNoClose();
  }

  copyExpenseBudget(fromOverride?){
    if(fromOverride !== undefined && !fromOverride) {
      return;
    }

    this.params.desYear = this.budgetYear;

    this.params['force'] = fromOverride == undefined ? 'N' : 'Y';

    this.con.showLoading(true);
    this.acctService.copyExpenseBudget(this.params).subscribe((data:any) => {
      console.log(data);
      this.con.showLoading(false);
      if(data['returnCode'] == 0) {
        this.dialogIcon = 'error';
        this.suc.open();
      } else if (data['returnCode'] == 1) {
        this.conOvrMsg = data['messageList'][0]['message'];
        this.conOvrMdl.openNoClose();
      } else if(data['returnCode'] == 2) {
        this.dialogIcon = 'error-message';
        this.dialogMessage = data['messageList'][0]['message'];
        this.suc.open();
      } else {
        this.dialogMessage = 'Expense Budget for '+this.params.desYear+' was successfully copied from '+this.params.originYear;
        this.dialogIcon = 'success-message';
        this.getAcseBudgetExpense();
        this.suc.open();
      }
      
    });
  }

  checkUser() {
    this.con.showLoading(true);
    this.mtnService.getMtnApprovalFunction(this.approvalCd).subscribe(
      (data:any)=>{
        this.con.showLoading(false);
        if(data.approverFn.map(a=>{return a.userId}).includes(this.ns.getCurrentUser())){
          //User has the authority to print AR
          this.copyExpenseBudget(true);
        }else{
          //User has no authority. Open Override Login
          this.overrideLogin.getApprovalFn();
          this.overrideLogin.overrideMdl.openNoClose();
        }
      }
    );
  }

  onClickPrint() {
    this.printParams = {
      reportId: 'ACSER004',
      asOfDate: '',
      destination: 'screen'
    };

    this.printMdl.openNoClose();
  }

  print() {

    if(this.printParams.destination == 'exl'){
      this.passDataCsv = [];
      this.getExtractToCsv();
      return;
    }

    this.ps.printLoader = true;
    let params: any = {
      "reportId": this.printParams.reportId,
      "acser024Params.reportId": this.printParams.reportId,
      "acser024Params.eomDate": this.printParams.asOfDate,
      "fileName": this.printParams.reportId + '_' + String(this.ns.toDateTimeString(0)).replace(/:/g, '.') + '.pdf'
    }

    this.ps.print(this.printParams.destination, this.printParams.reportId, params);
  }

  getExtractToCsv(){
    console.log('extract to csv from trial balance processing');
    this.mtnService.getExtractToCsv(this.ns.getCurrentUser(),this.printParams.reportId,null,this.printParams.asOfDate)
      .subscribe(data => {
        console.log(data);
    
        var months = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
        "Oct", "Nov", "Dec");

        alasql.fn.myFormat = function(d){
          if(d == null){
            return '';
          }
          var date = new Date(d);
          var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
          var mos = months[date.getMonth()];
          return day+'-'+mos+'-'+date.getFullYear(); 
        };

        alasql.fn.negFmt = function(m){
          return (m==null || m=='')?0:(Number(String(m).replace(/,/g, ''))<0?('('+String(m).replace(/-/g, '')+')'):isNaN(Number(String(m).replace(/,/g, '')))?'0.00':m);
        };

        alasql.fn.isNull = function(n){
          return n==null?'':n;
        };

        var name = this.printParams.reportId;
        var query = '';

        if(this.printParams.reportId == 'ACSER004'){
          this.passDataCsv = data['listAcser004'];
          query = 'SELECT budgetYear as [BUDGET YEAR], itemNo as [ITEM NO], itemName as [ACCOUNT TITLES], isNull(slName) as [SL NAME],'+
          'negFmt(currency(currAsofBudget)) as [BUDGET CURRENT DATE], negFmt(currency(currAsofExpense)) as [EXPENSES CURRENT DATE],' +
          'negFmt(currency(saveOvrdrft)) as [SAVING OVERDRAFT], negFmt(saveOvrdrftPct) as [% SAVING OVERDRAFT],negFmt(currency(prevAsofExpense)) as [EXPENSES LAST YEAR],'+
          'negFmt(overunderPct) as [% OVER UNDER], negFmt(currency(currTotalBudget)) as [CURRENT TOTAL BUDGET], negFmt(asofVsTotalExp) as [CURR EXPENSES VS TOTAL BUDGET],'+
          'myFormat(paramDate) AS [PARAM DATE]';
        }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);

      });
    }

}



