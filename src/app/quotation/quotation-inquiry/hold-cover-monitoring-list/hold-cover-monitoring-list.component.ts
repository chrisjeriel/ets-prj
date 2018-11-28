import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../../_services';

@Component({
  selector: 'app-hold-cover-monitoring-list',
  templateUrl: './hold-cover-monitoring-list.component.html',
  styleUrls: ['./hold-cover-monitoring-list.component.css']
})
export class HoldCoverMonitoringListComponent implements OnInit {

   tableData: any[] = [];
    tHeader: any[] = [];

    constructor(private quotationService: QuotationService) { 
    }

    ngOnInit() {
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Quotation No.");
        this.tHeader.push("Hold Cover No.");
        this.tHeader.push("Risk");
        this.tHeader.push("Insured");
        this.tHeader.push("Period From");
        this.tHeader.push("Period To");
        this.tHeader.push("Comp. Ref. Hold Cover No.");
        this.tHeader.push("Requested By");
        this.tHeader.push("Request Date");
        this.tHeader.push("Status");

        this.tableData = this.quotationService.getQuotationHoldCoverInfo();
    }
}
