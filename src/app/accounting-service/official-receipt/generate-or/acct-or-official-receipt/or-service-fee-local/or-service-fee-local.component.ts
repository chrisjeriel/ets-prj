import { Component, OnInit } from '@angular/core';
import { AccORSerFeeLoc } from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-or-service-fee-local',
  templateUrl: './or-service-fee-local.component.html',
  styleUrls: ['./or-service-fee-local.component.css']
})
export class OrServiceFeeLocalComponent implements OnInit {
  passData: any = {
		tableData:[],
		tHeader: ['Ceding Company','Quarter Ending','Curr','Curr Rate','Amount','Amount(PHP)'],
		widths:['auto',1,1,100,100,100],
		nData: new AccORSerFeeLoc(null,null,null,null,null,null),
		total:[null,null,null,'Total','amount','amountPHP'],
		dataTypes: ['text','date','text','percent','currency','currency'],
		addFlag:true,
		deleteFlag: true,
		genericBtn: 'Save',
		checkFlag: true,
		infoFlag:true,
		paginateFlag: true,
		magnifying:['cedingCompany']
	}
  constructor(private accountingService: AccountingService ) { }

  ngOnInit() {
  	this.passData.tableData = this.accountingService.getAccORSerFeeLoc();
  }

}
