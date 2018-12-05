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
    }

    open(content) {
        this.modalService.open(content, { centered: true, backdrop: 'static', windowClass : "xl" });
    }


}