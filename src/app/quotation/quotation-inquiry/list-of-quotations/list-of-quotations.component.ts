import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../../_services';
import { QuotationList, HoldCoverMonitoringList } from '../../../_models';

@Component({
    selector: 'app-list-of-quotations',
    templateUrl: './list-of-quotations.component.html',
    styleUrls: ['./list-of-quotations.component.css'],
    providers: [NgbDropdownConfig]
})
export class ListOfQuotationsComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    tableData: any[] = [];
    tHeader: any[] = [];

    constructor(config: NgbDropdownConfig,
                 private quotationService: QuotationService) { 
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() : void {

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
        
        console.log(this.tHeader);

        this.dtOptions = {
        pagingType: 'full_numbers'
    };

    this.tableData = this.quotationService.getQuotationListInfo();
}
}
