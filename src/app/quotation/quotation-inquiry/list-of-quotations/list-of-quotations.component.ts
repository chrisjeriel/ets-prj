import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../../_services';

@Component({
    selector: 'app-list-of-quotations',
    templateUrl: './list-of-quotations.component.html',
    styleUrls: ['./list-of-quotations.component.css']
})
export class ListOfQuotationsComponent implements OnInit {
    tableData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    pageLength: number;
    
    constructor(private quotationService: QuotationService) { 
        this.pageLength = 10;
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

        this.filters.push("Quotation No.");
        this.filters.push("Branch");
        this.filters.push("Line Class");
        this.filters.push("Quote Status");
        this.filters.push("Company");
        this.filters.push("Principal");
        this.filters.push("Contractor");
        this.filters.push("Insured");
        this.filters.push("Quote Date");
        this.filters.push("Validity Date");
        this.filters.push("Requested By");
        this.filters.push("Created By");

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
        
        this.tableData = this.quotationService.getQuotationListInfo();
    }
}
