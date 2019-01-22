import { Component, OnInit } from '@angular/core';
import { QSOA } from '@app/_models/';
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
  	tHeader:['Quarter Ending','DR Balance','CR Balance', 'Beginning Balance DR', 'Beginning Balance CR', 'Ending Balance DR', 'Ending Balance CR'],
  	dataTypes:['date','currency','currency','currency','currency','currency','currency'],
  	total:['Total','drBalance','crBalance','begBalDR','begBalCR','endBalDR','endBalCR'],
  	filters: [
  		{
  			key: 'quarterEnding',
  			title: 'Quarter Ending',
  			dataType: 'date',
  		},
  		{
  			key: 'drBalance',
  			title: 'DR Balance',
  			dataType: 'text',
  		},
  		{
  			key: 'crBalance',
  			title: 'CR Balance',
  			dataType: 'text',
  		},
  		{
  			key: 'begBalDR',
  			title: 'Beginning Balance DR',
  			dataType: 'text',
  		},
  		{
  			key: 'begBalCR',
  			title: 'Beginning Balance CR',
  			dataType: 'text',
  		},
  		{
  			key: 'endBalDR',
  			title: 'Ending Balance DR',
  			dataType: 'text',
  		},
  		{
  			key: 'endBalCR',
  			title: 'Ending Balance CR',
  			dataType: 'text',
  		},
  	],
  	addFlag:true,
  	deleteFlag:true,
  	genericBtn: "Save",
  	infoFlag:true,
  	paginateFlag:true,	
  	nData: new QSOA(null, null, null, null, null, null, null),
  	checkFlag: true,
  	searchFlag: true,
  	widths:['auto','auto','auto','auto','auto','auto','auto']
  }

  constructor(private accService: AccountingService, private titleService: Title) { }

  ngOnInit() {
  	this.passData.tableData = this.accService.getQSOAData();
  	this.titleService.setTitle("Acct-IT | JV QSOA");
  }

}
