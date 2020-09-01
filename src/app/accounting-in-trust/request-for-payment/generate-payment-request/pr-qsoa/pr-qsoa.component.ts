import { Component, OnInit } from '@angular/core';
import { QSOA } from '@app/_models';
import { AccountingService } from '@app/_services/'

@Component({
  selector: 'app-pr-qsoa',
  templateUrl: './pr-qsoa.component.html',
  styleUrls: ['./pr-qsoa.component.css']
})
export class PrQsoaComponent implements OnInit {
  
  passData: any = {
  	tableData:[],
  	tHeader:['Quarter Ending','DR Balance','CR Balance', 'Beginning Balance DR', 'Beginning Balance CR', 'Ending Balance DR', 'Ending Balance CR'],
  	dataTypes:['date','currency','currency','currency','currency','currency','currency'],
  	total:['Total','drBalance','crBalance','begBalDR','begBalCR','endBalDR','endBalCR'],
  	addFlag:true,
  	deleteFlag:true,
  	genericBtn: "Save",
  	infoFlag:true,
  	paginateFlag:true,	
  	nData: new QSOA(null, null, null, null, null, null, null),
  	checkFlag: true,
  	widths:['auto','auto','auto','auto','auto','auto','auto'],
  	searchFlag:true,
  	filters:[
  		{
  			key:"drBalance",
  			title:"DR Balance",
  			dataType:"text"
  		},
  		{
  			key:"crBalance",
  			title:"CR Balance",
  			dataType:"text"
  		},
  		{
  			key:"begBalDR",
  			title:"Beginning Balance DR",
  			dataType:"text"
  		},
  		{
  			key:"begBalCR",
  			title:"Beginning Balance CR",
  			dataType:"text"
  		},
  		{
  			key:"endBalDR",
  			title:"Ending Balance DR",
  			dataType:"text"
  		},
  		{
  			key:"endBalCR",
  			title:"Ending Balance CR",
  			dataType:"text"
  		},

  	]
  }
  
  constructor(private accService: AccountingService) { }

  ngOnInit() {
  	this.passData.tableData = this.accService.getQSOAData();
  }

}
