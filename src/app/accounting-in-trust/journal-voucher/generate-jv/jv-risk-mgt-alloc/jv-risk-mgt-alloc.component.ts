import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-jv-risk-mgt-alloc',
  templateUrl: './jv-risk-mgt-alloc.component.html',
  styleUrls: ['./jv-risk-mgt-alloc.component.css']
})
export class JvRiskMgtAllocComponent implements OnInit {

  @Input() jvDetail: any;
  @Output() emitData = new EventEmitter<any>();
  @Output() infoData = new EventEmitter<any>();

  yearParamOpts: any[] = [];
  params: any = {
  	premPeriodFromMm: '',
  	premPeriodFromYear: '',
  	premPeriodToMm: '',
  	premPeriodToYear: '',
  	paytForQtr: '',
  	paytForYear: '',
  	totalRMC: ''
  };

  constructor() { }

  ngOnInit() {
  	var d = new Date();
    for(let x = d.getFullYear(); x >= 2018; x--) {
      this.yearParamOpts.push(x);
    }
  }

}
