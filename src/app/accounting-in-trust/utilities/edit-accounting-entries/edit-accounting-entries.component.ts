import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingEntriesCV } from '@app/_models';
import { AccountingService } from '@app/_services';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-accounting-entries',
  templateUrl: './edit-accounting-entries.component.html',
  styleUrls: ['./edit-accounting-entries.component.css']
})
export class EditAccountingEntriesComponent implements OnInit {

  accountingEntriesUtilData: any = {
  	tableData: this.accountingService.getAccountingEntriesUtil(),
  	tHeader: ['Code', 'Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
  	dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
  	nData: new AccountingEntriesCV(null,null,null,null,null,null),
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null, null, 'Total', 'debit', 'credit'],
  }

  constructor(private accountingService: AccountingService, private titleService: Title, private router: Router) {
  		this.titleService.setTitle("Acct-IT | Edit Acct Entries");
   }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
