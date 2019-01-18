import { Component, OnInit } from '@angular/core';
import { QSOA } from '@app/_models/';
import { AccountingService } from '@app/_services/'

@Component({
  selector: 'app-qsoa',
  templateUrl: './qsoa.component.html',
  styleUrls: ['./qsoa.component.css']
})
export class QsoaComponent implements OnInit {
  
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
  	widths:['auto','auto','auto','auto','auto','auto','auto']
  }
  constructor(private accService: AccountingService) { }

  ngOnInit() {
  	this.passData.tableData = this.accService.getQSOAData();
  }

}
