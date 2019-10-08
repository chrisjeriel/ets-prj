import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountingService } from '../../../_services/accounting.service';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'

@Component({
  selector: 'app-acct-it-cancelled-transactions',
  templateUrl: './acct-it-cancelled-transactions.component.html',
  styleUrls: ['./acct-it-cancelled-transactions.component.css']
})
export class AcctItCancelledTransactionsComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  cancelledTransactionsData: any = {
  	tableData: [],
  	tHeader: ['Tran Class', 'Ref. No.', 'Tran Date', 'Tran Type','Payee/Payor', 'Particulars', 'Cancelled By', 'Cancelled Date', 'Reason', 'Amount'],
  	keys: ['tranClass','refNo','tranDate','tranTypeDesc','payee','particulars','cancelledBy','cancelledDate','reason','amount'],
    dataTypes: ['text', 'text', 'date','text', 'text', 'text', 'text', 'date', 'text', 'text'],
  	widths:[63,67,115,245,90,152,80,115,100,100],
    uneditable:[true,true,true,true,true,true,true,true,true,true],
    filters: [
  		{
  		    key: 'tranType',
  		    title:'Tran. Type',
  		    dataType: 'text'
  		},
  		{
  		    key: 'refNo',
  		    title:'Ref. No.',
  		    dataType: 'text'
  		},
  		{
  		    key: 'tranDate',
  		    title:'Tran Date',
  		    dataType: 'date'
  		},
  		{
  		    key: 'payeePayor',
  		    title:'Payee/Payor',
  		    dataType: 'text'
  		},
  		{
  		    key: 'particulars',
  		    title:'Particulars',
  		    dataType: 'text'
  		},
  		{
  		    key: 'cancelledBy',
  		    title:'Cancelled By',
  		    dataType: 'text'
  		},
  		{
  		    key: 'cancelledDate',
  		    title:'Cancelled Date',
  		    dataType: 'date'
  		},
  		{
  		    key: 'reason',
  		    title:'Reason',
  		    dataType: 'text'
  		},
  		{
  		    key: 'status',
  		    title:'Status',
  		    dataType: 'text'
  		},
  	],
  	pageLength: 20,
  	pagination: true,
  	pageStatus: true,
    infoFlag:true
  }

  params :any ={
    tranclass:'',
    cancelFrom:'',
    cancelTo:''
  }

  tranClass: string = '';
  tranId:any;
  viewTran: boolean = true;

  constructor(private titleService: Title, private accountingService: AccountingService, private route: Router) { }


  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Cancelled Tran");
    this.retrieveCancelledTrans();
  }

  retrieveCancelledTrans(){
    this.accountingService.getAcitCancelledTran(null,null,null,null).subscribe((data:any) => {
      if(data.cancelledTran.length !== 0){
        this.cancelledTransactionsData.tableData = [];
        for (var i = 0; i < data.cancelledTran.length; i++) {
          this.cancelledTransactionsData.tableData.push(data.cancelledTran[i]);
        }
      }
      this.table.refreshTable();
    });
  }

  onRowClick(data){
    console.log(data)
    if(data !== null){
      this.viewTran = false;
      this.tranClass = data.tranClass;
      this.tranId = data.tranId;
    }else{
      this.viewTran = true;
    }
  }

  onClickSearch(){
    console.log(this.params);
  }

  onRowDblClick(event){
     if(this.tranClass == 'AR'){
      this.route.navigate(['accounting-in-trust',{exitLink:'/acct-it-cancelled-trans',tranId: this.tranId,from:'CMDM'}],{ skipLocationChange: true });
    }else if(this.tranClass == 'CV'){
      this.route.navigate(['generate-cv',{exitLink:'/acct-it-cancelled-trans',tranId: this.tranId}],{ skipLocationChange: true });
    }else if(this.tranClass == 'JV'){
      this.route.navigate(['generate-jv',{exitLink:'/acct-it-cancelled-trans',tranId: this.tranId}],{ skipLocationChange: true });
    }else{
      //do something
    }
  }

  viewTranDetails(){
    if(this.tranClass == 'AR'){
      this.route.navigate(['accounting-in-trust',{exitLink:'/acct-it-cancelled-trans',tranId: this.tranId,from:'CMDM'}],{ skipLocationChange: true });
    }else if(this.tranClass == 'CV'){
      this.route.navigate(['generate-cv',{exitLink:'/acct-it-cancelled-trans',tranId: this.tranId}],{ skipLocationChange: true });
    }else if(this.tranClass == 'JV'){
      this.route.navigate(['generate-jv',{exitLink:'/acct-it-cancelled-trans',tranId: this.tranId}],{ skipLocationChange: true });
    }else{
      //do something
    }
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.route.navigateByUrl('');
      } 
  
  }
}
