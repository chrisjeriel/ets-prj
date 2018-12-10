import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';

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
  line: string = "CAR";

  constructor(private uwService: UnderwritingService) { }

  ngOnInit() {
  	this.tHeader.push("Policy No");
  	this.tHeader.push("Status");
  	this.tHeader.push("Type of Cession");
  	this.tHeader.push("Line Class");
  	this.tHeader.push("Ceding Company");
  	this.tHeader.push("Principal");
  	this.tHeader.push("Contractor");
  	this.tHeader.push("Created By");

  	this.filters.push("Policy No");
  	this.filters.push("Status");
  	this.filters.push("Type of Cession");
  	this.filters.push("Line Class");
  	this.filters.push("Ceding Company");
  	this.filters.push("Principal");
  	this.filters.push("Contractor");
  	this.filters.push("Created By");

    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");

  	this.tableData = this.uwService.getParListing();
  }

}
