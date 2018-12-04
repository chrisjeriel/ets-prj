import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';

@Component({
  selector: 'app-alt-par-listing',
  templateUrl: './alt-par-listing.component.html',
  styleUrls: ['./alt-par-listing.component.css']
})
export class AltParListingComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  filters: any[] = [];

  constructor(private uwService: UnderwritingService) { }

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

    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");

  	this.tableData = this.uwService.getAltParListing();
  }

}
