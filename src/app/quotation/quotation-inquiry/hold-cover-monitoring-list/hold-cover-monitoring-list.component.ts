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
        this.tHeader.push("Quotation No.");
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

        this.tableData = this.quotationService.getQuotationListInfo();
    }
}
