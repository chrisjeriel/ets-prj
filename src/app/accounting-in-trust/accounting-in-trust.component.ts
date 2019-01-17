import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting-in-trust',
  templateUrl: './accounting-in-trust.component.html',
  styleUrls: ['./accounting-in-trust.component.css']
})
export class AccountingInTrustComponent implements OnInit {
  
  ipbTab: boolean = true;
  crTab: boolean = true;
  qsoaTab: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  checkTabs(event) {
  	var type = event.type.toUpperCase();

  	if(type == 'INWARD POLICY BALANCES') {
  		this.ipbTab = false;
  		this.crTab = true;
  		this.qsoaTab = true;
  	} else if (type == 'CLAIM RECOVERY') {
  		this.crTab = false;
  		this.ipbTab = true;
  		this.qsoaTab = true;
  	} else if (type == 'QSOA') {
  		this.qsoaTab = false;
  		this.ipbTab = true;
  		this.crTab = true;
  	} else {
  		this.ipbTab = true;
  		this.crTab = true;
  		this.qsoaTab = true;
  	}
  }
}
