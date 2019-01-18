import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accounting-in-trust',
  templateUrl: './accounting-in-trust.component.html',
  styleUrls: ['./accounting-in-trust.component.css']
})
export class AccountingInTrustComponent implements OnInit {
  
  ipbTab: boolean = true;
  crTab: boolean = true;
  qsoaTab: boolean = true;

  private sub: any;
  record: any = {
                   arNo: null,
                   payor: null,
                   arDate: null,
                   paymentType: null,
                   status: null,
                   particulars: null,
                   amount: null
                 };
  action: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];
    });

    if(this.action == 'edit') {
    	this.sub = this.route.params.subscribe(params => {
      		this.record = JSON.parse(params['slctd']);
    	});
    	this.tabController(this.record.paymentType.toUpperCase());

    } else {
    	this.tabController('');
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkTabs(event) {
  	var type = event.type.toUpperCase();

  	this.tabController(type);
  	
  }

  tabController(type) {
  	type = type.trim();

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
