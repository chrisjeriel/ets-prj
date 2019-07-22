import { Component, OnInit, Input } from '@angular/core';
import { AccountingService } from '@app/_services';
import { CMDM } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-debit-memo',
  templateUrl: './credit-debit-memo.component.html',
  styleUrls: ['./credit-debit-memo.component.css']
})
export class CreditDebitMemoComponent implements OnInit {
  passDataCMDMListing: any = {
        tableData: this.accountingService.getCreditDebit(),
        tHeader: ["CM/DM No.","CM/DM Date","Recipient","Particulars","CM/DM Type","Ref No","Prepared By","Amount"],
        dataTypes: ['text','date','text','text','text','text','text','currency',],
        filters: [],
        addFlag:true,
        editFlag:true,
        pageLength: 10,
        pageStatus: true,
        pagination: true,
    };

  selected:any;
  constructor(private accountingService: AccountingService, private router: Router, private titleService: Title) { }

  ngOnInit() {
  }

  onClickAdd(event){
    this.router.navigate(['/accounting-service-credit-debit-memo'], { skipLocationChange: true }); 
  }

  toGenerateCMDM(data) {
    console.log(data)
    this.router.navigate(['/accounting-service-credit-debit-memo', {memoType:data.memoType,tranId:data.tranId}], { skipLocationChange: true });
  }

}
