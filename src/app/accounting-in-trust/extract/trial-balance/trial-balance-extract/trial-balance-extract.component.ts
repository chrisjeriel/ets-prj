import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-trial-balance-extract',
  templateUrl: './trial-balance-extract.component.html',
  styleUrls: ['./trial-balance-extract.component.css']
})
export class TrialBalanceExtractComponent implements OnInit {

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
