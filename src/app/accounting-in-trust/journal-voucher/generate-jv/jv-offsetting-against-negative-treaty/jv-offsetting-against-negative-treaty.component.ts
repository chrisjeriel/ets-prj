import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AgainstNegativeTreaty, AgainstLoss } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-jv-offsetting-against-negative-treaty',
  templateUrl: './jv-offsetting-against-negative-treaty.component.html',
  styleUrls: ['./jv-offsetting-against-negative-treaty.component.css']
})
export class JvOffsettingAgainstNegativeTreatyComponent implements OnInit {
  
  passData: any = {
    tableData: this.accountingService.getAgainstNegativeTreaty(),
    tHeader: ['Quarter Ending','Currency', 'Currency Rate', 'Amount','Amount(PHP)'],
    resizable: [true, true, true, true, true,true, true, true],
    dataTypes: ['date','text','percent','currency','currency'],
    nData: new AgainstNegativeTreaty(new Date(),null,null,null,null),
    total:[null,null,'Total','amount','amountPhp'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 5,
    pageID: 'passdata',
    widths: [203,50,130,130,130],

  };

  passDataNegative: any = {
      tableData: [],
      tHeader: ['Quarter Ending', 'Currency', 'Currency Rate', 'Amount', 'Amount(PHP)'],
      dataTypes: ['text', 'text', 'text', 'text', 'text'],
      //nData: ,
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 3,
      pageID: 'passDataNegative',
      uneditable: [true, false],
      keys: ['quarterEnding', 'currencyCd', 'currencyRt', 'amount', 'localAmount'],
      widths: ['auto', 'auto', 1]
  }

  ClaimsOffset: any = {
    tableData: this.accountingService.getClaimLosses(),
    tHeader: ['Claim No', 'Payment For/To', 'Insured', 'Hist No', 'Hist Type', 'Ex-Gratia', 'Curr','Curr Rate', 'Reserve Amount','Amount','Amount (Php)'],
    dataTypes: ['text', 'text', 'text', 'number', 'text', 'checkbox', 'text', 'percent', 'currency', 'currency', 'currency'],
    nData: new AgainstLoss(null,null,null,null,null,null,null,null,null,null,null),
    paginateFlag: true,
    infoFlag: true,
    pageID: 1,
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    total: [null, null,null, null, null,null, null, null, 'Total', 'amount', 'amountPhp'],
    genericBtn: 'Save',
    widths: ['auto','auto','auto',1,'auto',1,1,2,100,100,100]
  }

  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
  }

  ShowModal() {
      $('#ViewClaims > #modalBtn').trigger('click');
  }

}
