import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-acct-trial-bal-extract',
  templateUrl: './acct-trial-bal-extract.component.html',
  styleUrls: ['./acct-trial-bal-extract.component.css']
})
export class AcctTrialBalExtractComponent implements OnInit {


  constructor(private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Trial Balance");
  }

  accountCode:string = 'Total';
  @Output() accCodeChange : EventEmitter<any> = new EventEmitter();

  changeAccountCode(){
  	this.accCodeChange.emit(this.accountCode);
  }

}
