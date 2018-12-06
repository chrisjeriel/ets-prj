import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { CreateAlterationParInfo } from '../../../_models/CreateAlterationPAR';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pol-create-alteration-par',
  templateUrl: './pol-create-alteration-par.component.html',
  styleUrls: ['./pol-create-alteration-par.component.css']
})
export class PolCreateAlterationPARComponent implements OnInit {
  
  private createAlterationPar : CreateAlterationParInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[]= [];
  btnTitle:string = "Convert Quotation";
  modalTitle: string = "Convert Quotation";
  
  btnTitle2:string = "Save";
  modalTitle2: string = "Convert Quotation to Alteration Record";
  modalText: string = "A policy record will be created with all the information entered in the quotation. Do you want to continue?";
  
  constructor(private underwritingService : UnderwritingService, private router: Router) { }

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

  	this.tableData = this.underwritingService.getAlterationFromQuotation();
  
    this.createAlterationPar = new CreateAlterationParInfo();
    this.createAlterationPar.line = "test";
    this.createAlterationPar.year = new Date();
    this.createAlterationPar.seqNo = 0;
    this.createAlterationPar.altNo =0;
    this.createAlterationPar.cedingCompany = "test";
    this.createAlterationPar.principal = "test";
    this.createAlterationPar.contractor = "test";
  }

}
