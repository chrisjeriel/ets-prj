import { Component, OnInit } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService } from '../../_services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-hold-cover',
  templateUrl: './hold-cover.component.html',
  styleUrls: ['./hold-cover.component.css']
})
export class HoldCoverComponent implements OnInit {

tableData: any[] = [];
tHeader: any[] = [];
quoteLine:any;
private holdCover: HoldCoverInfo;

  constructor( private quotationService: QuotationService,private modalService: NgbModal) { }

  ngOnInit() {

    this.tHeader.push("Quotation No");
    this.tHeader.push("Ceding Company");
    this.tHeader.push("Insured");
    this.tHeader.push("Risk");

    this.tableData = this.quotationService.getListOfValuesHoldCover();
  
  	this.holdCover = new HoldCoverInfo();
  	this.holdCover.quotationNo = "MOCK TEST";
    this.holdCover.cedingCompany = "MOCK TEST";
  	this.holdCover.insured ="MOCK TEST";
  	this.holdCover.risk = "MOCK TEST";
  	this.holdCover.holdCoverNo = "MOCK TEST";
    this.holdCover.periodFrom = new Date();
  	this.holdCover.coRefHoldCoverNo = "MOCK TEST";
  	this.holdCover.periodTo = new Date();
    this.holdCover.requestedBy = "MOCK TEST";
    this.holdCover.requestDate = new Date();
    this.holdCover.status = "MOCK TEST";

  }

  search(){
    if (this.quoteLine === 'CAR' || 
        this.quoteLine === 'EAR' || 
        this.quoteLine === 'EEI' || 
        this.quoteLine === 'CEC' || 
        this.quoteLine === 'MBI' || 
        this.quoteLine === 'BPV' || 
        this.quoteLine === 'MLP' || 
        this.quoteLine === 'DOS') {

         $('#modalBtn').trigger('click'); 
    }
       
  }

}
