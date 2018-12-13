import { Component, OnInit, ViewChild } from '@angular/core';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-dummy',
    templateUrl: './dummy.component.html',
    styleUrls: ['./dummy.component.css']
})
export class DummyComponent implements OnInit {
    @ViewChild('content') content; 
    tableData: any[] = [];
    tableData2: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    filterDataTypes: any[] = [];
    nData: DummyInfo = new DummyInfo(null, null, null, null, null, null, null);

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

        this.filters.push("ID");
        this.filters.push("First Name");
        this.filters.push("Last Name");
        this.filters.push("Middle Name");
        this.filters.push("Gender");
        this.filters.push("Age");
        this.filters.push("Birth Date");

        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("date");

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
    openAgain(){
        this.modalService.dismissAll();
    }
}
