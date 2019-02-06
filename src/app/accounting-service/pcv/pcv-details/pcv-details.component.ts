import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pcv-details',
  templateUrl: './pcv-details.component.html',
  styleUrls: ['./pcv-details.component.css']
})
export class PcvDetailsComponent implements OnInit {
  
  passData: any = {
  	tHeader: ['Item No.','Particulars', 'Amount'],
  	dataTypes: ['sequence-2', 'text', 'currency'],
  	widths: [110, 'auto', 110],
  	total: [ null, 'Total', '2'],
  	tableData: [
  		[1, 'Taxi Fare', 250],
  		[2, 'Meal', 250]
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
