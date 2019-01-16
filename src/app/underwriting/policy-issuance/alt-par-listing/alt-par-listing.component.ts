import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
    line: string = "";

    altParListData: any = {
        tableData: this.uwService.getAltParListing(),
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
        addFlag: true,
        editFlag: true,
        pageStatus: true,
        pagination: true,
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

    constructor(private uwService: UnderwritingService, private titleService: Title, private router: Router) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Alteration List");
        this.tHeader.push("PAR No");
        this.tHeader.push("Status");
        this.tHeader.push("Type of Cession");
        this.tHeader.push("Line Class");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Principal");
        this.tHeader.push("Contractor");
        this.tHeader.push("Created By");

        this.filters.push("PAR No");
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

        this.tableData = this.uwService.getAltParListing();
    }
    slctd: string = "";
    slctdArr: any[] = [];
    polLine: string = "";

    onRowDblClick(event) {
        this.slctd = event.target.closest("tr").children[0].innerText;
        this.slctdArr = this.slctd.split("-");
        for (var i = 0; i < this.slctdArr.length; i++) {
            this.polLine = this.slctdArr[0];
        }
        //console.log(this.polLine);
        this.router.navigate(['/policy-issuance-alt', { line: this.polLine, alteration: true }], { skipLocationChange: true });
    }
}
