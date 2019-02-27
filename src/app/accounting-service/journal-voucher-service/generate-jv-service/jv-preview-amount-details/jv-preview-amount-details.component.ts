import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ORPrevAmountDetails  } from '@app/_models';

@Component({
  selector: 'app-jv-preview-amount-details',
  templateUrl: './jv-preview-amount-details.component.html',
  styleUrls: ['./jv-preview-amount-details.component.css']
})
export class JvPreviewAmountDetailsComponent implements OnInit {
   passDataAmountDetails: any = {
  	tableData:this.accountingService.getORPrevAmountDetails(),
    tHeader: ["Item No", "Gen Type", "Detail", "Original Amount", "Currency","Currency Rate","Local Amount"],
    dataTypes: ["text", "text", "text", "currency", "text","percent","currency"],
    resizable: [true, true, true, true, true, true, true],
    nData: new ORPrevAmountDetails(null,null,null,null,null,null,null),
    total:[null,null,'TOTAL',null,null,null,'localAmount'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [70,70,'auto',160,60,160,160],
    paginateFlag:true,
    infoFlag:true
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
