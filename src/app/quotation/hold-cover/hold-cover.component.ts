import { Component, OnInit } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';

@Component({
  selector: 'app-hold-cover',
  templateUrl: './hold-cover.component.html',
  styleUrls: ['./hold-cover.component.css']
})
export class HoldCoverComponent implements OnInit {

private holdCover: HoldCoverInfo;
	
  constructor() { }

  ngOnInit() {
  	this.holdCover = new HoldCoverInfo();
  	this.holdCover.quotationNo = 1;
  	this.holdCover.insured ="Earl";
  	this.holdCover.risk = "";
  	this.holdCover.holdCoverNo = 1;
  	this.holdCover.compRefHoldCoverNo = 1;
  	this.holdCover.status = "";
  	this.holdCover.periodFrom = "";
  	this.holdCover.periodTo = "";
  	this.holdCover.requestedBy = "";
  	this.holdCover.requestDate = "";

  }

}
