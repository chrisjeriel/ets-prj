import { Component, OnInit, Input } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '@app/_services';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
    //test
    @Input() tableData: any[] = [];
    @Input() tHeader: any[] = [];
    @Input() dataTypes: any[] = [];
    @Input() filters: any[] = [];

    //modal activator
    @Input() btnTitle: string = "Button name";

    //modal title
    @Input() modalTitle: string = "Sample Title";

    //modal body
    @Input() modalCustTable: boolean = false;
    @Input() modalCustEditableTable: boolean = false;
    @Input() modalProgressBar: boolean;
    @Input() modalText: string;

    //modal footer
    @Input() btnModalOk: boolean;
    @Input() btnModalCancel: boolean;
    @Input() btnModalYes: boolean;
    @Input() btnModalNo: boolean;


    constructor(private modalService: NgbModal, private quotationService: QuotationService) { }

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

    open(content) {
        this.modalService.open(content, { centered: true, backdrop: 'static', windowClass : "xl" });
    }


}