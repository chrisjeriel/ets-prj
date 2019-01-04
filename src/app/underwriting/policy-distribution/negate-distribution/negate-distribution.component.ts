import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-negate-distribution',
  templateUrl: './negate-distribution.component.html',
  styleUrls: ['./negate-distribution.component.css']
})
export class NegateDistributionComponent implements OnInit {
  limitsPassData:any = {
  	tableData:[
  		['Quota & 1st Surplus',1500000000],
  		['2nd Surplus', 1500000000]
  	],
  	tHeader: ['Treaty Name', 'Amount'],
  	dataTypes:['text','currency'],
  	pageLength: 3,
  	resizable: [true,true],
  	tableOnly: true,

  }

  distributionPassData:any = {
  	tableData:[
  		['QS','Munich Rice',38,570000000,142500,30],
  	],
  	tHeader: ['Treaty', 'Treaty Company','Share (%)', 'SI Amount', 'Premium Amount', 'Comm Share (%)'],
  	dataTypes:['text','text', 'percent', 'currency', 'currency', 'percent'],
  	pageLength: 10,
  	resizable: [true,true,true,true,true,true],
  	pageStatus: true,
  	pagination: true,
  	tableOnly:true
  	
  }

  poolPassData:any = {
  	tableData:[
  		['QS','MAPFRE INSULAR',1,200000,62.50,199,39800000,12437.50],
  	],
  	tHeader: ['Treaty', 'Treaty Company','1st Ret Line', '1st Ret SI Amt','1st Ret Prem Amt', '2nd Ret Line', '2nd Ret SI Amt', '2nd Ret Prem Amt'],
  	dataTypes:['text','text', 'number', 'currency', 'currency', 'number', 'currency', 'currency'],
  	pageLength: 10,
  	resizable: [true,true,true,true,true,true],
  	pageStatus: true,
  	pagination: true,
  	tableOnly:true
  }

  policyNo:string;
  negateDistribution:any = {
  	distNo : "",
  	riskDistNo : "",
  	status : "",
  	cedingCo : "",
  	insured : "",
  	risk : "",
  	totalSI : "",
  	rate : "",
  	totalPremium : "",
  	oneRetLine : "",
  	firstRetLine : "",
  	secRetLine : "",
  };

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  	this.policyNo  = "CAR-2018-00001-009-0001-000";
  	this.negateDistribution.distNo = "";
  	this.negateDistribution.riskDistNo = "";
  	this.negateDistribution.status = "";
  	this.negateDistribution.cedingCo = "";
  	this.negateDistribution.insured = "";
  	this.negateDistribution.risk = "";
  	this.negateDistribution.totalSI = "";
  	this.negateDistribution.rate = "";
  	this.negateDistribution.totalPremium = "";
  	this.negateDistribution.oneRetLine = "";
  	this.negateDistribution.firstRetLine = "";
  	this.negateDistribution.secRetLine = "";

  }

  test(){
  	console.log(this.negateDistribution.totalSI);
  }

}
