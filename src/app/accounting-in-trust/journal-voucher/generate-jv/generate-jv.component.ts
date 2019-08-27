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
  disableTab: boolean = true;
  jvType: string = '';
  jvTypeFlag: boolean = true;
  record: any = {
                   jvType: null
                 };

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

  cedingParams : any = {
    cedingId : '',
    cedingName : '',
  };

  disabledTypes: any = [
      1,2,3,4,5,6,7,8,9
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
    var type = event.type === null ? "" : event.type;
    if(!this.disabledTypes.includes(type)){
      this.jvTypeFlag = true;
    }else{
      this.jvTypeFlag = false;
    }
    this.jvType = type;    
  }

  jvInfo(data){
     this.jvData.tranId = data.jvTranId;
     this.jvData.type =  data.jvType;
     this.jvData.jvNo =  data.jvNo;
     this.jvData.jvYear =  data.jvYear;
     this.jvData.jvDate =  data.jvDate;
     this.jvData.jvStatus =  data.jvStatus;
     this.jvData.statusType = data.statusType;
     this.jvData.refnoDate =  data.refnoDate;
     this.jvData.refnoTranId =  data.refnoTranId;
     this.jvData.currCd =  data.currCd;
     this.jvData.currRate =  data.currRate;
     this.jvData.jvAmt =  data.jvAmt;
     this.jvData.localAmt =  data.localAmt;
     this.jvData.jvType = data.jvType;
     this.jvData.tranType = data.tranType;
  }

  cedingOutput(data){
    console.log(data)
    this.cedingParams.cedingId = data.cedingId;
    this.cedingParams.cedingName = data.cedingName;
  }
}
