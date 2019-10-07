import { Component, OnInit } from '@angular/core';
import { AccountingService, NotesService } from '@app/_services'

@Component({
  selector: 'app-jv-acct-entries-service',
  templateUrl: './jv-acct-entries-service.component.html',
  styleUrls: ['./jv-acct-entries-service.component.css']
})
export class JvAcctEntriesServiceComponent implements OnInit {
  
  passData: any = {};

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passData = this.accountingService.getAccEntriesPassData();
  }


}
