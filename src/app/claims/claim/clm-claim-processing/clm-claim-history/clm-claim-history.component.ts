import { Component, OnInit } from '@angular/core';
import { ClaimsHistoryInfo } from '@app/_models';
import { ClaimsService } from '@app/_services/claims.service';

@Component({
  selector: 'app-clm-claim-history',
  templateUrl: './clm-claim-history.component.html',
  styleUrls: ['./clm-claim-history.component.css']
})
export class ClmClaimHistoryComponent implements OnInit {
  private claimsHistoryInfo =  ClaimsHistoryInfo;
  
  passDataHistory: any = {
        tHeader: ["History No", "Amount Type", "History Type", "Currency","Amount","Remarks","Accounting Tran ID","Accounting Date"],
        dataTypes: [
                    "number", "select", "select","select","currency","text","number","date"
                   ],
        opts: [{ selector: "amountType", vals: ["Loss", "Adjuster Expense", "Other Expenses"] }, { selector: "historyType", vals: ["OS Reserve", "Payment", "Recovery"] }, { selector: "currency", vals: ["Php", "USD"] }],
        pageLength:10,
        paginateFlag:true,
        infoFlag:true,
        tableData:[],
        nData: new ClaimsHistoryInfo(null,null,null,null,null,null,null,null)
   };

  constructor(private claimsService: ClaimsService) { 

  }

  ngOnInit() {
    this.passDataHistory.tableData = this.claimsService.getClaimsHistoryInfo()

  }

}
