import { Component, OnInit , OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generate-jv',
  templateUrl: './generate-jv.component.html',
  styleUrls: ['./generate-jv.component.css']
})
export class GenerateJvComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  exitLink: string;
  exitTab: string;
  sub: any;

  record: any = {
                   jvType: null
                 };
  jvType: string = "";
  jvTypeFlag: boolean = true;

  disabledTypes: string[] = [
      "GAIN FOREIGN EXCHANGE",
      "LOSS FOREIGN EXCHANGE",
      "Interest Income on Savings",
      "Interest on Premium Reserve Released",
      "Withholding Tax - Interest on Premium Reserve Released",
      "Payment of WHTax by Service",
      "XOL Mindep",
      "XOL Premium Adjustment",
      "Uncollected Creditable Withholding Tax",
      "Bad Debts Set up",
      "Bad Debts Write-Off",
      "Payment of Risk Management Fee to Employees",
      "Miscellaneous Income Allocation",
      ""
  ];

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      this.exitLink = params['link'] !== undefined ? params['link'] : 'adasdas';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
  		} 
  
  }

  checkTabs(event) {
    var type = event.type === null ? "" : event.type;
    if(this.disabledTypes.includes(type)){
      this.jvTypeFlag = true;
    }else{
      this.jvTypeFlag = false;
    }
    this.jvType = type;    
  }


}
