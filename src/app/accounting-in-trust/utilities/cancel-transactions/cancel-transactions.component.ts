import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { AccCVPayReqList } from '@app/_models';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal,NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cancel-transactions',
  templateUrl: './cancel-transactions.component.html',
  styleUrls: ['./cancel-transactions.component.css']
})
export class CancelTransactionsComponent implements OnInit {
  @ViewChild('arTbl') arTbl : CustNonDatatableComponent;
  @ViewChild('cvTbl') cvTbl : CustNonDatatableComponent;
  @ViewChild('jvTbl') jvTbl : CustNonDatatableComponent;

  passDataAr : any = {
    tableData    : [],
    tHeader      : ['AR No','Payor','AR Date','Status','Payment Type','Particulars','Amount'],
    dataTypes    : ['sequence-6','text','date','text','text','text','currency'],
    keys         : ['arNo', 'payor', 'arDate', 'arStatDesc','tranTypeName', 'particulars', 'arAmt'],
    colSize      : ['25px', '80px', '40px', '100px', '100px', '200px', '125px'],
    filters: [
        {key   : 'arNo',title: 'AR No',dataType: 'text'},
        {key   : 'payor',title: 'Payor',dataType: 'text'},
        {keys  : {from: 'arDateFrom',to: 'arDateTo'},title: 'AR Date',dataType: 'datespan'},
        {key   : 'arStatDesc',title: 'Status',dataType: 'text'},
        {key   : 'tranTypeName',title: 'Payment Type',dataType: 'text'},
        {key   : 'particulars',title: 'Particulars',dataType: 'text'},
        {keys  : {from: 'arAmtFrom',to: 'arAmtTo'},title: 'Amount',dataType: 'textspan'}
    ],
    pageLength    : 10,
    pageStatus    : true,
    pagination    : true,
    pageID        : 'ctArTbl',
    checkFlag     : true,
    exportFlag    : true
  };

  passDataCv : any = {
    tableData    : [],
    tHeader      : ["CV No", "Payee", "CV Date", "Status","Particulars","Amount"],
    dataTypes    : ['text','text','date','text','text','currency'],
    keys         : ['cvGenNo','payee','cvDate','cvStatusDesc','particulars','cvAmt'],
    colSize      : ['25px', '80px', '40px', '100px', '200px', '125px'],
    filters: [
        {key   : 'cvGenNo',title: 'CV No',dataType: 'text'},
        {key   : 'payee',title: 'Payee',dataType: 'text'},
        {keys  : {from: 'cvDateFrom',to: 'cvDateTo'},title: 'CV Date',dataType: 'datespan'},
        {key   : 'statusDesc',title: 'Status',dataType: 'text'},
        {key   : 'particulars',title: 'Particulars',dataType: 'text'},
        {keys  : {from: 'cvAmtFrom',to: 'cvAmtTo'},title: 'Amount',dataType: 'textspan'}
    ],
    pageLength    : 10,
    pageStatus    : true,
    pagination    : true,
    pageID        : 'ctCvTbl',
    checkFlag     : true,
    exportFlag    : true
  };

  passDataJv : any = {
    tableData    : [],
    tHeader      : ["JV No", "JV Date","Particulars","JV Type", "JV Ref. No.", "Prepared By","Amount"],
    dataTypes    : ['text','date','text','text','text','text','currency'],
    keys         : ['jvNo','jvDate','particulars','tranTypeName','refNo','preparedName','jvAmt'],
    colSize      : ['120px','98px','171px','335px','110px','118px','115px'],
    filters: [
        {key  : 'jvNo',title: 'J.V. No.',dataType: 'text'},
        {keys : {from: 'jvDateFrom',to: 'jvDateTo'},title: 'AR Date',dataType: 'datespan'},
        {key  : 'particulars',title: 'Particulars',dataType: 'text'},
        {key  : 'jvType',title: 'J.V Type',dataType: 'text'},
        {key  : 'jvRefNo',title: 'J.V Ref No',dataType: 'text'},
        {key  : 'preparedBy',title: 'Prepared By',dataType: 'text'},
        {keys  : {from: 'jvAmtFrom',to: 'jvAmtTo'},title: 'Amount',dataType: 'textspan'}
    ],
    pageLength    : 10,
    pageStatus    : true,
    pagination    : true,
    pageID        : 'ctJvTbl',
    checkFlag     : true,
    exportFlag    : true
  };

  otherData: any = {
    createUser : '',
    createDate : '',
    updateUser : '',
    updateDate : '',
  };

  constructor( private acctService: AccountingService, private router: Router) { }

  ngOnInit() {
    this.getAcitList();
  }

  getAcitList(){
    this.acctService.getArList([])
    .subscribe(data => {
      console.log(data);
      this.passDataAr.tableData = data['ar'].filter(e => e.arStat == 'N');
      this.arTbl.refreshTable();
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
