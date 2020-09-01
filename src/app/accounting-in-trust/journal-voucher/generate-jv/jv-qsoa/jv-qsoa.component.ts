import { Component, OnInit } from '@angular/core';
import { QSOABalances } from '@app/_models/';
import { AccountingService } from '@app/_services'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-jv-qsoa',
  templateUrl: './jv-qsoa.component.html',
  styleUrls: ['./jv-qsoa.component.css']
})
export class JvQsoaComponent implements OnInit {

  passData: any = {
  	tableData:[],
  	tHeader:['Quarter Ending','Currency','Currency Rate','Amount','Amount(PHP)'],
  	dataTypes:['date','text','percent','currency','currency'],
  	total:[null,null,'Total','amount','amountPhp'],
  	filters: [
  		{
  			key: 'quarterEnding',
  			title: 'Quarter Ending',
  			dataType: 'date',
  		},
  		{
  			key: 'amount',
  			title: 'Amount',
  			dataType: 'text',
  		},
  		{
  			key: 'amountPhp',
  			title: 'Amount(PHP)',
  			dataType: 'text',
  		}
  	],
  	addFlag:true,
  	deleteFlag:true,
  	genericBtn: "Save",
  	infoFlag:true,
  	paginateFlag:true,	
  	nData: new QSOABalances(null, null, null, null, null,null),
  	checkFlag: true,
  	searchFlag: true,
  	widths:['auto','auto','auto','auto','auto']
  }

  constructor(private accService: AccountingService, private titleService: Title) { }

  ngOnInit() {
  	this.passData.tableData = this.accService.getQSOABalancesData();
  	this.titleService.setTitle("Acct-IT | JV QSOA");
  }

}
