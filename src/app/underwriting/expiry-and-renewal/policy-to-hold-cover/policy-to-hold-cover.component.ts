import { Component, OnInit } from '@angular/core';
import { PolicyHoldCoverInfo } from '../../../_models/PolicyToHoldCover';

@Component({
  selector: 'app-policy-to-hold-cover',
  templateUrl: './policy-to-hold-cover.component.html',
  styleUrls: ['./policy-to-hold-cover.component.css']
})
export class PolicyToHoldCoverComponent implements OnInit {
  
  private policyHoldCoverInfo : PolicyHoldCoverInfo;

  constructor() { }

  ngOnInit() {
  	this.policyHoldCoverInfo = new PolicyHoldCoverInfo();
  	this.policyHoldCoverInfo.policyNo = 1;
  	this.policyHoldCoverInfo.insured ="MOCK TEST";
  	this.policyHoldCoverInfo.risk = "MOCK TEST";
  	this.policyHoldCoverInfo.holdCoverNo = 1;
  	this.policyHoldCoverInfo.compRefHoldCoverNo = 1;
  	this.policyHoldCoverInfo.status = "MOCK TEST";
  	this.policyHoldCoverInfo.periodFrom = new Date();
  	this.policyHoldCoverInfo.periodTo = new Date();
  	this.policyHoldCoverInfo.requestedBy = "MOCK TEST";
  	this.policyHoldCoverInfo.requestDate = new Date();

  }

}
