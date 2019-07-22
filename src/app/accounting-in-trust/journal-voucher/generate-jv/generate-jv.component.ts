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

  jvType: string = '';

  jvData: any = {
     type: '', 
     jvNo: '', 
     jvYear: '', 
     jvDate: '', 
     jvStatus: '',
     refnoDate: '',
     refnoTranId: '',
     currCd: '',
     currRate: '',
     jvAmt: '',
     localAmt: ''
  };

  jvTypeFlag: boolean = true;

  disabledTypes: string[] = [
      "GAIN FOREIGN EXCHANGE",
      "LOSS FOREIGN EXCHANGE",
      "INTEREST INCOME ON SAVINGS",
      "INTEREST ON PREMIUM RESERVE RELEASED",
      "WITHHOLDING TAX - INTEREST ON PREMIUM RESERVE RELEASED",
      "PAYMENT OF WHTAX BY SERVICE",
      "XOL MINDEP",
      "XOL PREMIUM ADJUSTMENT",
      "UNCOLLECTED CREDITABLE WITHHOLDING TAX",
      "BAD DEBTS SET UP",
      "BAD DEBTS WRITE-OFF",
      "PAYMENT OF RISK MANAGEMENT FEE TO EMPLOYEES",
      "MISCELLANEOUS INCOME ALLOCATION",
      ""
  ];

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      this.exitLink = params['exitLink'] !== undefined ? params['exitLink'] : 'adasdas';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
  		} 
  
  }

  checkTabs(event) {
     console.log(event)
    var type = event.type === null ? "" : event.type.toUpperCase();
    if(this.disabledTypes.includes(type)){
      this.jvTypeFlag = true;
    }else{
      this.jvTypeFlag = false;
    }
    this.jvType = type;    
  }

  jvInfo(data){
     console.log(data);
     this.jvData.type =  data.type;
     this.jvData.jvNo =  data.jvNo;
     this.jvData.jvYear =  data.jvYear;
     this.jvData.jvDate =  data.jvDate;
     this.jvData.jvStatus =  data.jvStatus;
     this.jvData.refnoDate =  data.refnoDate;
     this.jvData.refnoTranId =  data.refnoTranId;
     this.jvData.currCd =  data.currCd;
     this.jvData.currRate =  data.currRate;
     this.jvData.jvAmt =  data.jvAmt;
     this.jvData.localAmt =  data.localAmt;
     this.jvData.jvType = data.jvType;
  }

}
