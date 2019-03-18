import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../_services';
import { ARDetails } from '@app/_models'

@Component({
  selector: 'app-ar-details2',
  templateUrl: './ar-details.component.html',
  styleUrls: ['./ar-details.component.css']
})
export class ArDetailsComponent2 implements OnInit {
   passDataAmountDetails: any = {
        tableData: this.accountingService.getAmountDetails(),
        tHeader: ["Detail", "Amount", "Amount(Php)", "Plus.Minus", "Amount Plus.Minus"],
        total : [null,null,null,"Total","amountPlusMinus"],
        dataTypes: ['text','currency','currency','text','currency'],
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        //totalFlag:true,
        pageLength: 10,
        infoFlag: true,
        paginateFlag: true,
    };

    passDataAccountingEntries: any = {
        tableData: this.accountingService.getAccountingEntries(),
        tHeader: ["Code", "Amount", "SL Type", "SL Name", "Debit","Credit"],
        total : [null,null,null,"Total","debit","credit"],
        dataTypes: ['text','currency','text','text','currency','currency'],
        addFlag:true,
        deleteFlag:true,
        //totalFlag:true,
        pageLength: 10,
        infoFlag: true,
        paginateFlag: true,
    };

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
