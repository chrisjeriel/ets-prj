import { Component, OnInit } from '@angular/core';
import { AccARInvestments } from '@app/_models';
import { AccountingService } from '@app/_services';
 
@Component({
  selector: 'app-ar-details-investments',
  templateUrl: './ar-details-investments.component.html',
  styleUrls: ['./ar-details-investments.component.css']
})
export class ArDetailsInvestmentsComponent implements OnInit {
  
  passDataInvestment: any = {
    tableData:[],
    tHeader:['Bank','Account No.','Maturity Period','Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Bank Charge','Withholding Tax','Investment','Maturity Value','Income'],
    dataTypes:['text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,'Total','bankCharge','withTax','investment','matValue','income'],
    addFlag:true,
    deleteFlag:true,
    genericBtn: "Save",
    infoFlag:true,
    paginateFlag:true, 
    nData: new AccARInvestments(null, null, null, null, null, null, null, null, null, null, null, null, null, null ),
    uneditable: [false, false, false, false, false, true, true, false, false, false, false, false, false, false ],
    checkFlag: true,
    pageID: 6,
    widths:[1, 1, 1, 1, 1, 1, 1, 1, 1, 100, 100, 100, 100, 100]
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
    this.passDataInvestment.tableData = this.accountingService.getAccARInvestments();
  }

}
