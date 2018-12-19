import { Component, OnInit } from '@angular/core';
import  { PARListing } from '@app/_models'
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
  nData: PARListing = new PARListing(null, null, null, null, null, null, null,null, null, null, null, null, null, null,null,null,null);
  
  constructor(private underwritingService: UnderwritingService) { }

   passData: any = {
        tHeader: [
            "Policy No", "Type Cession", "Line Class", "Status", "Ceding Company", "Principal", "Contractor", "Insured", "Risk", "Object", "Site", "Quotation No", "Company", "Issue Date", "Inception Date", "Expiry Date", "Created By"
        ],
        resizable: [
            true,true,true,true,true,true,true,true,true,true,true,true,
            true,true,true,true, true
        ],
        dataTypes: [
            "text","text","text","text","text","text","text","text","text",
            "text","text","text","text","date","date","date","text"
        ],
        
        tableData: this.underwritingService.getParListing(),
        pageLength: 10,
        
    }

  ngOnInit() {
  	// this.tHeader.push("PAR No");
  	// this.tHeader.push("Status");
  	// this.tHeader.push("Type of Cession");
  	// this.tHeader.push("Line Class");
  	// this.tHeader.push("Ceding Company");
  	// this.tHeader.push("Principal");
  	// this.tHeader.push("Contractor");
  	// this.tHeader.push("Created By");

  	// this.filters.push("PAR No");
  	// this.filters.push("Status");
  	// this.filters.push("Type of Cession");
  	// this.filters.push("Line Class");
  	// this.filters.push("Ceding Company");
  	// this.filters.push("Principal");
  	// this.filters.push("Contractor");
  	// this.filters.push("Created By");

   //  this.dataTypes.push("text");
   //  this.dataTypes.push("text");
   //  this.dataTypes.push("text");
   //  this.dataTypes.push("text");
   //  this.dataTypes.push("text");
   //  this.dataTypes.push("text");
   //  this.dataTypes.push("text");
   //  this.dataTypes.push("text");

  	// this.tableData = this.uwService.getAltParListing();
  }

}
