import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CMDM } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-in-trust-credit-debit',
  templateUrl: './in-trust-credit-debit.component.html',
  styleUrls: ['./in-trust-credit-debit.component.css']
})
export class InTrustCreditDebitComponent implements OnInit {

  @ViewChild('table') table:any;

  passDataCMDMListing: any = {
        tableData: [],
        tHeader: ["CM/DM No.","CM/DM Date","Recipient","Particulars","Tran Type","Ref No","Status","Amount"],
        keys:['cmdmNo','memoDate','payee','particulars','tranTypeName','refNo','status','localAmt'],
        dataTypes: ['text','date','text','text','text','text','text','currency',],
        filters: [],
        addFlag:true,
        editFlag:true,
        pageLength: 18,
        pageStatus: true,
        pagination: true,
        colSize: ['50px', '90px', '80px', '', '', '', '', '125px'],
    };

    seqDigits:number = 1;

  selected:any;
    
  constructor(private accountingService: AccountingService, private router: Router, private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Credit/Debit Memo");
    this.getSeqDigits()
    this.getListing()
  }

  getSeqDigits(){
    this.mtnService.getMtnParameters('N','CMDM_NO_DIGITS').subscribe(a=>{
      console.log(a)
      this.seqDigits = a['parameters'][0].paramValueN;
    })
  }

  getListing(){
    this.accountingService.getCMDMListing(undefined).subscribe(a=>{
      this.passDataCMDMListing.tableData = a['cmdmList'];
      this.passDataCMDMListing.tableData.forEach((a:any)=>{
        a.cmdmNo = a.memoType + '-' + a.memoTranType+ '-' + a.memoYear+ '-' + a.memoMm + '-' + String(a.memoSeqNo).padStart(this.seqDigits,'0');
        a.memoDate = this.ns.toDateTimeString(a.memoDate);
        a.createDate = this.ns.toDateTimeString(a.createDate);
        a.updateDate = this.ns.toDateTimeString(a.updateDate);
      })
      this.table.refreshTable();

    });
  }

  onClickAdd(event){
    this.router.navigate(['/acct-it-generate-cmdm',{exitLink: '/acc-s-credit-debit-memo'}], { skipLocationChange: true }); 
  }

  onClickEdit(){
    this.router.navigate(['/acct-it-generate-cmdm',{tranId:this.selected.tranId,memoType:this.selected.memoType,exitLink: '/acc-s-credit-debit-memo'}], { skipLocationChange: true }); 
  }

  onRowClick(data){
    this.selected = data;
    console.log(data)
  }

  onRowDblClick(data){
     this.router.navigate(['/acct-it-generate-cmdm',{tranId:data.tranId,memoType:data.memoType,exitLink: '/acc-s-credit-debit-memo'}], { skipLocationChange: true }); 
  }
}
