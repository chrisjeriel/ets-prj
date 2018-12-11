import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuotationService } from '../../../_services';

@Component({
    selector: 'app-list-of-quotations',
    templateUrl: './list-of-quotations.component.html',
    styleUrls: ['./list-of-quotations.component.css']
})
export class ListOfQuotationsComponent implements OnInit {
    tableData: any[] = [];
    allData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    pageLength: number;
    i: number;
    a: any;
    line: string = "";

    constructor(private quotationService: QuotationService, private router: Router) { 
        this.pageLength = 10;
    }

    ngOnInit() {
        this.tHeader.push("Quotation No.");
        this.tHeader.push("Type of Cession");
        this.tHeader.push("Line Class");
        this.tHeader.push("Status");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Principal");
        this.tHeader.push("Contractor");
        this.tHeader.push("Insured");
        this.tHeader.push("Risk");
        this.tHeader.push("Object");
        this.tHeader.push("Location");
        this.tHeader.push("Policy Number");
        this.tHeader.push("Currency");
        //remove this
        /* this.tHeader.push("Quote Date");
        this.tHeader.push("Validity Date");
        this.tHeader.push("Requested By");
        this.tHeader.push("Created By");*/

        this.filters.push("Quotation No.");
        this.filters.push("Type of Cession");
        this.filters.push("Line Class");
        this.filters.push("Quote Status");
        this.filters.push("Company");
        this.filters.push("Principal");
        this.filters.push("Contractor");
        this.filters.push("Insured");
        this.filters.push("Risk");
        this.filters.push("Object");
        this.filters.push("Location");
        this.filters.push("Policy Number");
        this.filters.push("Currency");

        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        //remove this
        /* this.dataTypes.push("date");
        this.dataTypes.push("date");
        this.dataTypes.push("text");
        this.dataTypes.push("text");*/

        this.tableData = this.quotationService.getQuotationListInfo();
    }
    onRowClick(event) {
        for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
            console.log(event.target.parentElement.children[i].innerText);
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
