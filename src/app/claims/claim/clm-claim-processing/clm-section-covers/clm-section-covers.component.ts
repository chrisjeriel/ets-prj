import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clm-section-covers',
  templateUrl: './clm-section-covers.component.html',
  styleUrls: ['./clm-section-covers.component.css']
})
export class ClmSectionCoversComponent implements OnInit {

  /*passData: any = {
        tableData: [],
        tHeader: [],
        dataTypes: [],
        resizable: [],
        filters: [],
        pageLength: 10,
        expireFilter: false,
        checkFlag: false,
        tableOnly: false,
        fixedCol: false,
        printBtn: false,
        pageStatus: false,
        pagination: false,
        addFlag: false,
        editFlag: false,
        deleteFlag: false,
        copyFlag: false,
        pageID: 1
    }*/

  passData: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 5,
    widths: [],
    pageID: 1
  };

  constructor() { }

  ngOnInit() {
  	this.passData.tHeader.push("Deductible Code", "Deductible Title", "Rate (%)", "Amount", "Deductible Text");
  	this.passData.tableData.push(["AOG30", "ACTS OF GOD 30", "0.50000000000","","Acts of Nature - Php 1,800,000.00 each and every loss"],
  								 ["AOC31", "39,000 - AOC", "","39000","Any Other Cause - Php 39,000.00 for each and every loss"]);
  	this.passData.dataTypes.push("text", "text", "percent", "currency", "text");
  	this.passData.widths.push("1","auto","auto","auto","auto");
  }

}
