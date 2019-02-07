import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pcv-acc-entries',
  templateUrl: './pcv-acc-entries.component.html',
  styleUrls: ['./pcv-acc-entries.component.css']
})
export class PcvAccEntriesComponent implements OnInit {
  
  passData: any = {
  	tHeader: ['Code','Account', 'SL Type', 'SL Name', 'Debit', 'Credit'],
  	dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
  	widths: [110, 'auto', 110, 'auto', 110, 110],
  	total: [null, null, null, 'Total', '4', '5'],
  	tableData: [
  		['5-01-11-05','Representation and Entertainment Others','', '', 250,0],
  		['5-01-11-02','Transportation and Travel Inspection Expense','', '', 250,0]
  	],
  	addFlag: true,
  	deleteFlag: true,
  	genericBtn: 'Save',
  	checkFlag: true,
  	infoFlag: true,
  	paginateFlag: true
  }

  constructor() { }

  ngOnInit() {
  }

}
