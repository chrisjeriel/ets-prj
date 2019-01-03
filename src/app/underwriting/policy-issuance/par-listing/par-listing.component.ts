import { Component, OnInit } from '@angular/core';
import { PARListing } from '@app/_models'
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';

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

    constructor(private uwService: UnderwritingService, private titleService: Title) { }
    passData: any = {
        tHeader: [
            "Policy No", "Type Cession", "Line Class", "Status", "Ceding Company", "Principal", "Contractor", "Insured", "Risk", "Object", "Site", "Quotation No", "Company", "Issue Date", "Inception Date", "Expiry Date", "Created By"
        ],

        resizable: [
            false, false, true, true, true, true, true, true, true, true, true, false,
            false, false, false, false, true
        ],
        dataTypes: [
            "text", "text", "text", "text", "text", "text", "text", "text", "text",
            "text", "text", "text", "text", "date", "date", "date", "text"
        ],
        tableData: this.uwService.getParListing(),
        addFlag: true,
        editFlag: true,
        pageLength: 10,
        filters: [
            {
                key: 'policyNo',
                title: 'Policy No.',
                dataType: 'text'
            },
            {
                key: 'cessionType',
                title: 'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'lineClass',
                title: 'Line Class',
                dataType: 'text'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title: 'Ceding Company',
                dataType: 'text'
            },
            {
                key: 'principal',
                title: 'Principal',
                dataType: 'text'
            },
            {
                key: 'contractor',
                title: 'Contractor',
                dataType: 'text'
            },
            {
                key: 'insured',
                title: 'Insured',
                dataType: 'text'
            },
            {
                key: 'risk',
                title: 'Risk',
                dataType: 'text'
            },
            {
                key: 'object',
                title: 'Object',
                dataType: 'text'
            },
            {
                key: 'site',
                title: 'Site',
                dataType: 'text'
            },
            {
                key: 'quoteDate',
                title: 'Period From',
                dataType: 'date'
            },
            {
                key: 'quotationNo',
                title: 'Quotation No',
                dataType: 'text'
            },
            {
                key: 'company',
                title: 'Company',
                dataType: 'text'
            },
            {
                key: 'issueDate',
                title: 'Issue Date',
                dataType: 'date'
            },
            {
                key: 'inceptionDate',
                title: 'Inception Date',
                dataType: 'date'
            },
            {
                key: 'expiryDate',
                title: 'Expiry Date',
                dataType: 'date'
            },
            {
                key: 'createdBy',
                title: 'Created By',
                dataType: 'text'
            },
        ],

    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Policy List");
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
