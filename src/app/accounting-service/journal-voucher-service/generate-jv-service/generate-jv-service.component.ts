import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-generate-jv-service',
  templateUrl: './generate-jv-service.component.html',
  styleUrls: ['./generate-jv-service.component.css']
})
export class GenerateJvServiceComponent implements OnInit {

  constructor(private route: ActivatedRoute ,private router: Router) { }

  exitLink: string;
  exitTab: string;
  sub: any;
  jvType: any;

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
  
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.exitLink = params['link'] !== undefined ? params['link'] : 'journal-voucher-service';
      this.exitTab = params['tab'] !== undefined ? params['tab'] : '';
    });
    //console.log(this.jvType);
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigate([this.exitLink,{tabID:this.exitTab}],{ skipLocationChange: true });
    }
  }

  tabController(jvType){
    console.log(this.jvType);
    this.jvType = jvType;
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
}
