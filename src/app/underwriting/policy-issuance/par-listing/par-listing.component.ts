import { Component, OnInit } from '@angular/core';
import { PARListing } from '@app/_models'
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
    line: string = "";
    constructor(private uwService: UnderwritingService, private titleService: Title, private router: Router) { }
    passData: any = {
        tHeader: [
            "Line","Policy No", "Type Cession","Ceding Company", "Insured", "Risk", "Object", "Site", "Currency", "Sum Insured", "Premium" , "Issue Date", "Inception Date", "Expiry Date","Accounting Date","Status"
        ],

        resizable: [
            false,false, false, true, true, true, true, true, false, true, true, false,
            false, false, false, false
        ],
        dataTypes: [
            "text","text", "text", "text", "text", "text", "text", "text",
            "text", "currency", "currency", "date", "date", "date", "date", "text"
        ],
        tableData: this.uwService.getParListing(),
        addFlag: true,
        editFlag: true,
        pageStatus: true,
        pagination: true,
        pageLength: 10,
        filters: [
             {
                key: 'line',
                title: 'Line',
                dataType: 'text'
            },
            {
                key: 'policyNo',
                title: 'Policy No.',
                dataType: 'text'
            },
            {
                key: 'typeCession',
                title: 'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title: 'Ceding Company',
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
                key: 'currency',
                title: 'PCurrency',
                dataType: 'date'
            },
            {
                key: 'sumInsured',
                title: 'Sum Insured',
                dataType: 'text'
            },
            {
                key: 'premium',
                title: 'Premium',
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
                key: 'accountingDate',
                title: 'Accounting Date',
                dataType: 'date'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
        ],

    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Policy List");
       /* this.tHeader.push("Policy No");
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

        this.tableData = this.uwService.getParListing();*/
    }

    slctd: string = "";
    slctdArr: any[] = [];
    polLine: string = "";

    onRowDblClick(event) {
        this.slctd = event.target.closest("tr").children[1].innerText;
        this.slctdArr = this.slctd.split("-");
        for (var i = 0; i < this.slctdArr.length; i++) {
            this.polLine = this.slctdArr[0];
        }
      /*  console.log(this.polLine);*/
        this.router.navigate(['/policy-issuance', { line: this.polLine }], { skipLocationChange: true });
    }

}
