import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-claim-distribution',
  templateUrl: './claim-distribution.component.html',
  styleUrls: ['./claim-distribution.component.css']
})
export class ClaimDistributionComponent implements OnInit {

  distHeaderPassData: any = {
  	tableData: [
  		['00003468',1,10000000,'Posted'],
  		['00003490',2,300000,'Distributed but not Posted'],
  		['00003501',3,-6000000,'Undistributed'],
  		['00003502',4,-6000000,'Undistributed'],
  	],
  	tHeader: ['Distribution Header','History No', 'Amount','Distribution Status'],
  	dataTypes: ['text','number','currency','text'],
  	pageLength:5,
  	resizable:[true,true,true,true],
  	pageID:1
  }

  treatyDistPassData: any = {
  	tableData: [
  		['Proportional','QS','MunichRe',38,3800000],
  		['Proportional','QS','PhilNaRe',2,200000],
  		['Proportional','QS','QS Pool',60,6000000],
  	],
  	tHeader: ['Treaty Type','Treaty', 'Company','Share(%)','Amount'],
  	dataTypes: ['text','text','text','percent','currency'],
  	pageLength:10,
  	resizable:[true,true,true,true,true],
  	pageID:2
  }

  poolDistPassData: any = {
  	tableData: [
  		['AFP',1,146341.46,199,0],
  		['Allied Bankers',1,146341.46,199,0],
  		['Alpha',1,146341.46,58,0],
      ['AFP',1,146341.46,199,0],
      ['Allied Bankers',1,146341.46,199,0],
      ['Alpha',1,146341.46,58,0],
      ['AFP',1,146341.46,199,0],
      ['Allied Bankers',1,146341.46,199,0],
      ['Alpha',1,146341.46,58,0],
      ['AFP',1,146341.46,199,0],
      ['Allied Bankers',1,146341.46,199,0],
      ['Alpha',1,146341.46,58,0],
      ['AFP',1,146341.46,199,0],
      ['Allied Bankers',1,146341.46,199,0],
      ['Alpha',1,146341.46,58,0],
      ['AFP',1,146341.46,199,0],
      ['Allied Bankers',1,146341.46,199,0],
      ['Alpha',1,146341.46,58,0],
      ['AFP',1,146341.46,199,0],
      ['Allied Bankers',1,146341.46,199,0],
      ['Alpha',1,146341.46,58,0],
      ['AFP',1,146341.46,199,0],
      ['Allied Bankers',1,146341.46,199,0],
      ['Alpha',1,146341.46,58,0],
      ['AFP',1,146341.46,199,0],
      ['Allied Bankers',1,146341.46,199,0],
      ['Alpha',1,146341.46,58,0],
  	],
  	tHeader: ['Company','1st Ret Line', '1st Retention','2nd Ret Line','2nd Retention'],
  	dataTypes: ['text','number','currency','number','currency'],
  	pageLength:'10',
  	resizable:[true,true,true,true,true],
  	pageID:3,
    pagination:false,
    pageStatus:false
  }	

  constructor() { }

  ngOnInit() {
  }

}
