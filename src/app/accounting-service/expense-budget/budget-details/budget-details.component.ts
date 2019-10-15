import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
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

  budgetYrData: any = {
    tableData        : [],
    tHeader          : ["Account Code", "Account Name","SL Type", "SL Name", "Amount"],
    resizable        : [true, true, true, true, true],
    uneditable       : [true, true, true, true, false],
    dataTypes        : ["text", "text", "text","text","currency"],
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
    widths           : [117, 'auto', 'auto', 'auto', 125],
    paginateFlag     : true,
    pageID           : 'budgetYrDataID',
    magnifyingGlass  : ['glShortCd','slTypeName','slName'],
    total            : [null,null,null,'TOTAL','totalBudget'],
    keys             : ['glShortCd','glShortDesc','slTypeName','slName','totalBudget'],
    filters: [
            {
                key: 'accCode',
                title: 'Account Code',
                dataType: 'text'
            },
            {
                key: 'accName',
                title: 'Account Name',
                dataType: 'text'
            },
            {
                key: 'slType',
                title: 'SL Type',
                dataType: 'text'
            },
            {
                key: 'slName',
                title: 'SL Name',
                dataType: 'text'
            },
            {
                key: 'amount',
                title: 'Amount',
                dataType: 'text'
            },
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
    deleteBudgetExpense   : []
  };

  passDataLov  : any = {
    selector  : '',
    payeeCd   : '',
    currCd    : '',
    params    : {}
  };

  budgetYear     : string = '';
  cancelFlag     : boolean;
  dialogIcon     : string;
  dialogMessage  : string;
  lovCheckBox    : boolean = true;
  lovRow         : any;

  constructor(private titleService: Title,private acctService: AccountingService, private ns : NotesService, private mtnService : MaintenanceService, 
              public modalService: NgbModal, private router : Router) { }

  ngOnInit() {
  	//this.getAcseBudgetExpense();
  }

  getAcseBudgetExpense(){
    this.budgetYrTbl.overlayLoader = true;
    this.acctService.getAcseBudgetExpense(this.budgetYear)
    .subscribe(data => {
      console.log(data);
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
      }else if(e.edited && !e.deleted){
        e.fromCancel = true;
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
    });

    console.log(this.budgetYrData.tableData);
    console.log(this.params.saveBudgetExpense);
    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.suc.open();
      this.params.saveBudgetExpense = [];
    }else{
    console.log('1');
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
    console.log(data);
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
      this.can.onNo();
    }else{
      this.suc.modal.modalRef.close();
    }
  }

  onRowClick(data){
    console.log(data);
    this.otherData = data;
  }
}



