import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { CreateParInfo } from '../../../_models/CreatePAR';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pol-create-par',
  templateUrl: './pol-create-par.component.html',
  styleUrls: ['./pol-create-par.component.css']
})
export class PolCreatePARComponent implements OnInit {
  
  private createParInfo : CreateParInfo
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  fromQuotation: boolean = true;
  quoteLine: any;

  constructor(private underwritingService : UnderwritingService, private modalService : NgbModal, private router : Router ) {

   }

  ngOnInit() {
  	this.tHeader.push("Quotation No");
  	this.tHeader.push("Branch");
  	this.tHeader.push("Line Class");
  	this.tHeader.push("Quote Status");
  	this.tHeader.push("Ceding Company");
  	this.tHeader.push("Principal");
  	this.tHeader.push("Contractor");
  	this.tHeader.push("Insured");
  	this.tHeader.push("Quote Date");
  	this.tHeader.push("Validity Date");
  	this.tHeader.push("Requested By");
  	this.tHeader.push("Created By");

    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("date");
    this.dataTypes.push("date");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
        
   // this.tableData = this.quotationService.getQuotationListInfo();
    this.tableData = this.underwritingService.getAlterationFromQuotation();

    this.createParInfo = new CreateParInfo();
    this.createParInfo.line = "test";
    this.createParInfo.year = new Date(2018);
    this.createParInfo.seqNo = 0;
    this.createParInfo.altNo = 0;
    this.createParInfo.branch = "test";
    this.createParInfo.lineClass = "test";
    this.createParInfo.cedingCompany = "test";

  }
  
  fromHoldCover(){
    this.fromQuotation = !this.fromQuotation;
  }

  navigateToGenInfo() {
    console.log(this.quoteLine);
    this.router.navigate(['/policy-issuance', { line: this.quoteLine }]); //, {skipLocationChange: true}
  }
}
