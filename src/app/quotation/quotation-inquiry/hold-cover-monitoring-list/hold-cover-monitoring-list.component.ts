import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuotationService } from '../../../_services';
import { Title } from '@angular/platform-browser';

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
    constructor(private quotationService: QuotationService, private router: Router, private titleService: Title) {
        this.pageLength = 10;
    }

    passData: any = {
        tableData: [],
        tHeader: ['Hold Cover No.', 'Status', 'Ceding Company', 'Quotation No.', 'Risk', 'Insured', 'Period From', 'Period To', 'Comp. Ref. Hold Cover No.', 'Requested By', 'Request Date'],
        dataTypes: [],
        resizable: [false, false, true, false, true, true, false, false, false, true, false],
        filters: [
            {
                key: 'holdCoverNo',
                title: 'Hold Cover No.',
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
                key: 'quotationNo',
                title: 'Quotation No',
                dataType: 'text'
            },
            {
                key: 'risk',
                title: 'Risk',
                dataType: 'text'
            },
            {
                key: 'insured',
                title: 'Insured',
                dataType: 'text'
            },
            {
                key: 'periodFrom',
                title: 'Period From',
                dataType: 'date'
            },
            {
                key: 'periodTo',
                title: 'Period To',
                dataType: 'date'
            },
            {
                key: 'compRefHoldCoverNo',
                title: 'Comp. Ref. Hold Cover No.',
                dataType: 'text'
            },
            {
                key: 'requestedBy',
                title: 'Requested By',
                dataType: 'text'
            },
            {
                key: 'requestDate',
                title: 'Request Date',
                dataType: 'date'
            },

        ],
        pageLength: 10,
        expireFilter: true, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: true, pagination: true, pageStatus: true
    }

    ngOnInit() {
        this.titleService.setTitle("Quo | Hold Cover Monitoring");
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

        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("date");
        this.passData.dataTypes.push("date");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("date");

        this.passData.tableData = this.quotationService.getQuotationHoldCoverInfo();
    }
    onRowClick(event) {
        for (var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }
    }

    onRowDblClick(event) {
        for (var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }

        this.line = this.quotationService.rowData[0].split("-")[0];

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        this.router.navigate(['/quotation']);
    }
}
