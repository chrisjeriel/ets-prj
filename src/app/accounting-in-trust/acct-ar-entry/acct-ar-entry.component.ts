import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-acct-ar-entry',
  templateUrl: './acct-ar-entry.component.html',
  styleUrls: ['./acct-ar-entry.component.css']
})
export class AcctArEntryComponent implements OnInit {

  paymentType: string = "";

  passData: any = {
        tableData:[
        	['Check','PHP',1,1642857.14,'Bank of the Philippine Islands',22786739,new Date('2018-09-25'),'Local Clearing']
        ],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Check No.','Check Date','Check Class'],
        magnifyingGlass: ['0','1','4','7'],
        dataTypes: ['text','text','percent','currency','text','number','date','text'],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 5,
        widths: [],
        pageID: 1,
    };

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  tabController(event) {
  	this.onChange.emit({ type: this.paymentType });
  }
}
