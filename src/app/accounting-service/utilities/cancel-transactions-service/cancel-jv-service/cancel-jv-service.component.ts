import { Component, OnInit } from '@angular/core';
import { AccountingService} from '@app/_services';

@Component({
  selector: 'app-cancel-jv-service',
  templateUrl: './cancel-jv-service.component.html',
  styleUrls: ['./cancel-jv-service.component.css']
})
export class CancelJvServiceComponent implements OnInit {
  
  passDataJV: any = {
		tableData: this.accountingService.getCancelJV(),
		tHeader:['JV No.','JV Date', 'Particulars', 'JV Type','JV Ref. No', 'Prepared By','JV Status', 'Amount'],
		dataTypes:['text','date','text','text','text','text','text','currency'],
		uneditable:[true, true, true, true, true, true, true, true],
		searchFlag: true,
		infoFlag:true,
		paginateFlag:true,
		checkFlag:true,
		widths:[1,1,'auto',1,1,1,1,105]

	}
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }
}