import { Component, OnInit } from '@angular/core';
import { QSOA } from '@app/_models/';
import { ClaimsService } from '@app/_services/'

@Component({
  selector: 'app-qsoa',
  templateUrl: './qsoa.component.html',
  styleUrls: ['./qsoa.component.css']
})
export class QsoaComponent implements OnInit {
  
  passData: any = {
  	tableData:[],
  	tHeader:['Quarter Ending', 'Beginning Balance DR', 'Beginning Balance CR', 'Ending Balance DR', 'Ending Balance CR'],
  	dataTypes:['text','currency','currency','currency','currency'],
  	total:['Total','begBalDR','begBalCR','endBalDR','endBalCR'],
  	addFlag:true,
  	deleteFlag:true,
  	genericBtn: "Save",
  	infoFlag:true,
  	paginateFlag:true,	
  	nData: new QSOA(null, null, null, null, null),
  	checkFlag: true,
  	widths:[425,'auto','auto','auto','auto']
  }
  constructor(private claimsService: ClaimsService) { }

  ngOnInit() {
  	this.passData.tableData = this.claimsService.getQSOAData();
  }

}
