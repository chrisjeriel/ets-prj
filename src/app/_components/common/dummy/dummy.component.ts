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
    tableData3: any[] = [];
    tHeader: any[] = [];
    tHeader2: any[] = [];
    filters: any[] = [];
    dataTypes: any[] = [];
    dataTypes2: any[] = [];
    nData: DummyInfo = new DummyInfo(null, null, null, null, null, null, null);
    resizables: boolean[] = [];
    //test
    passData: any = {
        tHeader: [
            "Quotation No.", "Type of Cession", "Line Class", "Status",
            "Ceding Company", "Principal", "Contractor", "Insured", "Risk",
            "Object", "Site", "Policy No", "Currency",
        ],
        filters: [
            "Quotation No.", "Type of Cession", "Line Class", "Status",
            "Ceding Company", "Principal", "Contractor", "Insured", "Risk",
            "Object", "Site", "Policy No", "Currency",
        ],
        resizable: [
            false,false,true,true,true,true,true,true,true,true,true,false,
            false,
        ],
        dataTypes: [
            "text","text","text","text","text","text","text","text","text",
            "text","text","text","text",
        ],
        tableData: this.quotationService.getQuotationListInfo(),
        pageLength: 5,
        
    }

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

        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");

        this.tHeader2.push("Quotation No.");
        this.tHeader2.push("Type of Cession");
        this.tHeader2.push("Line Class");
        this.tHeader2.push("Status");
        this.tHeader2.push("Ceding Company");
        this.tHeader2.push("Principal");
        this.tHeader2.push("Contractor");
        this.tHeader2.push("Insured");
        this.tHeader2.push("Risk");
        this.tHeader2.push("Object");
        this.tHeader2.push("Site");
        this.tHeader2.push("Policy No.");
        this.tHeader2.push("Currency");

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
        this.filters.push("Site");
        this.filters.push("Policy No.");
        this.filters.push("Currency");

        this.resizables.push(false);
        this.resizables.push(false);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(false);
        this.resizables.push(false);
        
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        
        this.tableData = this.quotationService.getDummyInfo();
        this.tableData2 = this.quotationService.getDummyEditableInfo();
        this.tableData3 = this.quotationService.getQuotationListInfo();
        this.tableData3.forEach(function(e){
            delete e.quoteDate;
            delete e.validityDate;
            delete e.createdBy;
            delete e.requestedBy;
        });
         this.passData.tableData.forEach(function(e){
            delete e.quoteDate;
            delete e.validityDate;
            delete e.createdBy;
            delete e.requestedBy;
        });
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
