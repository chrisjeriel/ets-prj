import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccTBTotDebCred, AccTBNet} from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common';

@Component({
  selector: 'app-trial-balance-tb',
  templateUrl: './trial-balance-tb.component.html',
  styleUrls: ['./trial-balance-tb.component.css']
})
export class TrialBalanceTbComponent implements OnInit {

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];
  @Input() accountCode: string;

   passData: any = {
    tableData: [/*{accCode:null,accDesc:null,slType:null,drBal:null,crBal:null}*/],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','DR Balance','CR Balance'],
    resizable: [true, true, true, true, true],
    dataTypes: ['text','text','text','text','currency','currency'],
    total:[null,null,null,'Total','totalDebit','totalCredit'],
    searchFlag: true,
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    keys:['acctCode','acctName','slTypeName','slName','totalDebit','totalCredit'],
    colSize: ['50px','auto','auto','1px','100px','100px'],
    minColSize: ['50px','auto','auto','1px','100px','100px'],
  };

  extractParams:any = {
    periodFrom:'',
    periodTo: '',
    extractType:'',
    extractDate: ''
  }

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  constructor(private accountingService: AccountingService,private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Trial Balance | Extract");
  	//this.accountCode = 'Total Debits and Credits' ;
    this.getData();
  }

  getData(){
    this.accountingService.getAcitTrialBalExt(this.ns.getCurrentUser()).subscribe(data=>{
      if(data['list'].length == 0){
        this.accountCode= 'N';
      }else{
        this.accountCode = data['list'][0].type;
        this.extractParams.periodFrom = this.ns.toDateTimeString(data['list'][0].periodFrom);
        this.extractParams.periodTo = this.ns.toDateTimeString(data['list'][0].periodTo);
        this.extractParams.extractType = this.accountCode == 'T' ? 'Total Debit & Total Credits' : 'Net';
        this.extractParams.extractDate = this.ns.toDateTimeString(data['list'][0].extractDate);
        this.passData.tableData = data['list'];
        if(this.accountCode == 'T'){
          this.passData.tHeader = ['Account Code','Account Name','SL Type','SL Name','Debit','Credit'];
        }
        this.table.refreshTable();
      }
    })
  }

}
