import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-par-listing',
  templateUrl: './par-listing.component.html',
  styleUrls: ['./par-listing.component.css']
})
export class ParListingComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];

  constructor() { }

  ngOnInit() {
  	this.tHeader.push("PAR No");
  	this.tHeader.push("Status");
  	this.tHeader.push("Branch");
  	this.tHeader.push("Line Class");
  	this.tHeader.push("Ceding Company");
  	this.tHeader.push("Principal");
  	this.tHeader.push("Contractor");
  	this.tHeader.push("Created By");

  	this.filters.push("PAR No");
  	this.filters.push("Status");
  	this.filters.push("Branch");
  	this.filters.push("Line Class");
  	this.filters.push("Ceding Company");
  	this.filters.push("Principal");
  	this.filters.push("Contractor");
  	this.filters.push("Created By");

  	//tawag ng service function para maglagay ng data sa table
  }

}
