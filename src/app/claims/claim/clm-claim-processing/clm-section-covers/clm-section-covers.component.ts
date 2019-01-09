import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clm-section-covers',
  templateUrl: './clm-section-covers.component.html',
  styleUrls: ['./clm-section-covers.component.css']
})
export class ClmSectionCoversComponent implements OnInit {

  passData: any = {
		tableData:[],
		tHeader:[],
		tHeaderWithColspan:[],
		magnifyingGlass:[],
		options:[],
		dataTypes:[],
		opts:[],
		nData:{},
		checkFlag:false,
		selectFlag:false,
		addFlag:false,
		editFlag:false,
		deleteFlag:false,
		paginateFlag: false,
		infoFlag:false,
		searchFlag:false,
		checkboxFlag:false,
		pageLength:10,
		widths: [],
		pageID:1,
	};

  constructor() { }

  ngOnInit() {
  	this.passData.tHeader.push("Deductible Code", "Deductible Title", "Rate (%)", "Amount", "Deductible Text");
  	this.passData.tableData.push(["AOG30", "ACTS OF GOD 30", "0.50000000000","","Acts of Nature - Php 1,800,000.00 each and every loss"],
  								 ["AOC31", "39,000 - AOC", "","39,000.00","Any Other Cause - Php 39,000.00 for each and every loss"]);
  	this.passData.dataTypes.push("text", "text", "percent", "currency", "text");
  	this.passData.widths.push("1","auto","auto","auto","auto");
  	this.passData.searchFlag = true;
  	this.passData.paginateFlag = true;
  	this.passData.infoFlag = true;
  	this.passData.pageLength = 5;
  }

}
