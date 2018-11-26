import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../_services';

@Component({
  selector: 'app-internal-competition',
  templateUrl: './internal-competition.component.html',
  styleUrls: ['./internal-competition.component.css']
})
export class InternalCompetitionComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];

  constructor(private quotationService: QuotationService) { }

  ngOnInit() {
  	this.tHeader.push("Advice No.");
  	this.tHeader.push("Company");
  	this.tHeader.push("Attention");
  	this.tHeader.push("Position");
  	this.tHeader.push("Advice Option");
  	this.tHeader.push("Advice Wordings");
  	this.tHeader.push("Created By");
  	this.tHeader.push("Date Created");	
  	this.tHeader.push("Last Updated By");
  	this.tHeader.push("Last Update");

  	this.tableData = this.quotationService.getIntCompAdvInfo();

  }

}
