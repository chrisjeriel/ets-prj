import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { AccountingEntryCMDM } from '@app/_models';
import { ActivatedRoute,Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cmdm-entry',
  templateUrl: './cmdm-entry.component.html',
  styleUrls: ['./cmdm-entry.component.css']
})
export class CmdmEntryComponent implements OnInit {
  
  passData: any = {
    tableData: this.accountingService.getAccountingEntryCMDM(),
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Debit','Credit'],
    resizable: [true, true, true, true, true, true],
    dataTypes: ['text','text','text','text','currency','currency'],
    nData: new AccountingEntryCMDM(null,null,null,null,null,null),
    total:[null,null,null,'Total','debit','credit'],
    addFlag: true,
    deleteFlag: true,
    editFlag: false,
    pageLength: 10,
    widths: [205,305,163,176,122,154],
    genericBtn: 'Save'
  };

  exitLink: string;
  exitTab: string;
  sub: any;

  constructor(private accountingService: AccountingService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
    this.exitLink = params['link'] !== undefined ? params['link'] : 'credit-debit-memo';
    this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
    }
  }
  
  
}
