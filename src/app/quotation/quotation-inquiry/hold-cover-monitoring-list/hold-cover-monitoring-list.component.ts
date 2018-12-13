import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuotationService } from '../../../_services';

@Component({
    selector: 'app-hold-cover-monitoring-list',
    templateUrl: './hold-cover-monitoring-list.component.html',
    styleUrls: ['./hold-cover-monitoring-list.component.css']
})
export class HoldCoverMonitoringListComponent implements OnInit {

    tableData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    pageLength: number;
    line: string = "";
    filterDataTypes: any[] = [];
    constructor(private quotationService: QuotationService, private router: Router) { 
        this.pageLength = 10;
    }

    ngOnInit() {
        this.tHeader.push("Hold Cover No.");
        this.tHeader.push("Status");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Quotation No.");
        this.tHeader.push("Risk");
        this.tHeader.push("Insured");
        this.tHeader.push("Period From");
        this.tHeader.push("Period To");
        this.tHeader.push("Comp. Ref. Hold Cover No.");
        this.tHeader.push("Requested By");
        this.tHeader.push("Request Date");

        this.filters.push("Ced. Company");
        this.filters.push("Quotation No.");
        this.filters.push("Hold Cover No.");
        this.filters.push("Risk");
        this.filters.push("Insured");
        this.filters.push("Period From");
        this.filters.push("Period To");
        this.filters.push("Comp. Ref. Hold Cover No.");
        this.filters.push("Requested By");
        this.filters.push("Request Date");
        this.filters.push("Status");

        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("date");
        this.filterDataTypes.push("date");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("date");
        this.filterDataTypes.push("text");

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
        this.dataTypes.push("date");
        
        this.tableData = this.quotationService.getQuotationHoldCoverInfo();
    }
    onRowClick(event) {
        for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }
    }

    onRowDblClick(event) {
        for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }

        this.line = this.quotationService.rowData[0].split("-")[0]; 

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        this.router.navigate(['/quotation']);
    }
}
