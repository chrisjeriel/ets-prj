import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingService } from '@app/_services';
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

  passDataCMDMListing: any = {
        tableData: this.accountingService.getCreditDebit(),
        tHeader: ["CM/DM No.","CM/DM Date","Recipient","Particulars","Tran Type","Ref No","Status","Amount"],
        dataTypes: ['text','date','text','text','text','text','text','currency',],
        filters: [],
        addFlag:true,
        editFlag:true,
        pageLength: 10,
        pageStatus: true,
        pagination: true,
        colSize: ['50px', '90px', '80px', '', '', '', '', '125px'],
    };
    
  constructor(private accountingService: AccountingService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Credit/Debit Memo");
  }

  onClickAdd(event){
    this.router.navigate(['/acct-it-generate-cmdm'], { skipLocationChange: true }); 
  }

  onClickEdit(){
    this.router.navigate(['/acct-it-generate-cmdm'], { skipLocationChange: true }); 
  }

  onRowClick(data){

  }

  onRowDblClick(data){
     this.router.navigate(['/acct-it-generate-cmdm'], { skipLocationChange: true }); 
  }
}
