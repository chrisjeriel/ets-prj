import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
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

  exitLink: string;
  exitTab: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      /*this.exitLink = params['link'] !== undefined ? params['link'] : 'adasdas';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';*/

      this.action = params['action'];

      if(this.action == 'edit') {
        this.record = JSON.parse(params['slctd']);
        console.log(this.record);
        this.tabController(this.record.paymentType.toUpperCase());
      } else {
        this.tabController('');
      }
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkTabs(event) {
  	var type = event.type.toUpperCase();

  	this.tabController(type);
  	
  }

  tabController(type) {
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

  /* onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        // this.router.navigateByUrl('');
        this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
      } 
  
  }*/

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('acct-ar-listings');
    }
  }



}
