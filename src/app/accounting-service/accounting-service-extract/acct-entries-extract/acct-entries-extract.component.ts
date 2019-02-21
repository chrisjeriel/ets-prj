import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-acct-entries-extract',
  templateUrl: './acct-entries-extract.component.html',
  styleUrls: ['./acct-entries-extract.component.css']
})
export class AcctEntriesExtractComponent implements OnInit {
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  taxType: any;
  defaultTab: false;

  postingDateFlag: string = '1';

  constructor() { }

  ngOnInit() {
  }

   tabController(event) {
   	this.taxType = event.target.value;
  	this.onChange.emit(this.taxType);
  }
}