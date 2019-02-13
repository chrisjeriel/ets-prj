import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingEntriesCV } from '@app/_models';
import { AccountingService } from '@app/_services';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acc-s-edit-accounting-entries',
  templateUrl: './acc-s-edit-accounting-entries.component.html',
  styleUrls: ['./acc-s-edit-accounting-entries.component.css']
})
export class AccSEditAccountingEntriesComponent implements OnInit {

  accountingEntriesUtilData: any = {
  	tableData: this.accountingService.getAccountingEntriesUtil(),
  	tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
  	dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
  	nData: new AccountingEntriesCV(null,null,null,null,null,null),
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, 'Total', 'debit', 'credit'],
  	widths: [150, 'auto', 100, 250, 150, 150]
  }

  tranDate: any;

  constructor(private accountingService: AccountingService, private titleService: Title, private router: Router) {
  		//this.titleService.setTitle("Acct-S | Edit Acct Entries");
   }

  ngOnInit() {
  	this.tranDate = new Date(2015,4,28).toISOString().slice(0, 16);
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }

}
