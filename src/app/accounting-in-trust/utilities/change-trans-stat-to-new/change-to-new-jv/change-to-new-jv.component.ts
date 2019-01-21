import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-change-to-new-jv',
  templateUrl: './change-to-new-jv.component.html',
  styleUrls: ['./change-to-new-jv.component.css']
})
export class ChangeToNewJvComponent implements OnInit {

	passData: any = {
		tableData:[],
		tHeader:['JV No.','JV Date', 'Particulars', 'JV Type','JV Ref. No', 'Prepared By','JV Status', 'Amount'],
		dataTypes:['text','date','text','text','text','text','text','currency'],
		uneditable:[true, true, true, true, true, true, true, true],
		genericBtn:'Change Status to New',
		searchFlag: true,
		infoFlag:true,
		paginateFlag:true,
		checkFlag:true,
		widths:[1,1,'auto',1,1,1,1,105]

	}

	constructor(private accountingService: AccountingService) { }

	ngOnInit() {
		this.passData.tableData = this.accountingService.getChangeTxToNewJV();
	}

}
