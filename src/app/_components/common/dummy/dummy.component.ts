import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';
import { ModalComponent } from '../../../_components/common/modal/modal.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-dummy',
    templateUrl: './dummy.component.html',
    styleUrls: ['./dummy.component.css']
})
export class DummyComponent implements OnInit, AfterViewInit {
    //@ViewChild('content') content;
    @ViewChild(ModalComponent) modalComp: ModalComponent;

    tableData: any[] = [];
    tableData2: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    nData: DummyInfo = new DummyInfo(null, null, null, null, null, null, null);
    resizable: boolean[] = [];

    constructor(private quotationService: QuotationService, private modalService: NgbModal) { 
    }

    ngOnInit() {
        this.tHeader.push("ID");
        this.tHeader.push("First Name");
        this.tHeader.push("Last Name");
        this.tHeader.push("Middle Name");
        this.tHeader.push("Gender");
        this.tHeader.push("Age");
        this.tHeader.push("Birth Date");

        this.resizable.push(false);
        this.resizable.push(true);
        this.resizable.push(true);
        this.resizable.push(false);
        this.resizable.push(false);
        this.resizable.push(false);
        this.resizable.push(false);

        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");

        this.tableData = this.quotationService.getDummyInfo();
        this.tableData2 = this.quotationService.getDummyEditableInfo();
    }

    ngAfterViewInit(){
        console.log(this.modalComp.test);
    }
    open(){
        this.modalService.dismissAll();
        this.modalService.open(this.modalComp.test, { centered: true, backdrop: 'static', windowClass : 'modal-size' });
    }
    openAgain(){
        this.modalService.dismissAll();
    }
}
