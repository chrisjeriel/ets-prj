import { Component, OnInit } from '@angular/core';
import { PoolDistribution } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  	pageID:1,
    pagination:true,
    pageStatus: true
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
  	pageID:2,
    tableOnly:true,
    pagination:true,
    pageStatus: true
  }

  poolDistPassData: any = {
  	tableData: [
      ["QS","MAPFRE INSULAR","1",200000,199,39800000],
      ["QS","RELIANCE","1",200000,99,19800000],
      ["QS","INTRA_STRATA","1",200000,74,14800000],
      ["QS","PHIL_FIRE","1",200000,48,9600000],
      ["QS","FEDERAL PHOENIX","1",200000,99,19800000],
      ["QS","LIBERTY","1",200000,74,14800000],
      ["QS","ASIA INSURANCE","1",200000,49,9800000],
      ["QS","MERIDIAN","1",200000,49,9800000],
      ["QS","BPI/MS","1",200000,124,24800000],
      ["QS","ASIA UNITED","1",200000,99,19800000]
  	],
  	tHeader: ['Treaty','Treaty Company', '1st Ret Line','1st Ret Amount','2nd Ret Line', '2nd Ret Amount'],
  	dataTypes: ['text','text','number','currency','number','currency'],
  	pageLength:'10',
  	resizable: [true,true,true,true,true,true],
  	pageID: 3,
    pagination: true,
    pageStatus: true,
    tableOnly: true
  }	

  reserveDistPassData: any = {
    tHeader: ['Distribution No','History No','Hist. Type','Type','Reserve','Payment','Distribution Status'],
    dataTypes: ['text','number','text','text','currency','currency','text'],
    tableData: [
                 ['00003468','1','Loss','Initial Loss',500000,0,'Distributed'],
                 ['00003490','2','Loss','Increase Loss',300000,0,'Distributed'],
                 ['00003501','3','Loss','Decrease Loss',-100000,0,'Distributed']
    ],
    pageLength: 5,
    resizable:[false,false,false,false,false,false,false],
    pageID: 5,
    tableOnly: true,
    pagination: true,
    pageStatus: true
  }

  paymentDistPassData: any = {
    tHeader: ['Distribution No','History No','Hist. Type','Type','Reserve','Payment','Distribution Status'],
    dataTypes: ['text','number','text','text','currency','currency','text'],
    tableData: [
                 ['00003502','4','Loss','Partial Payment',-351000,351000,'Distributed'],
                 ['00003503','5','Loss','Full Payment',0,349000,'Distributed']
    ],
    pageLength: 5,
    resizable:[false,false,false,false,false,false,false],
    pageID: 6,
    tableOnly: true,
    pagination: true,
    pageStatus: true
  }

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

}
