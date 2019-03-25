import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PolAttachmentInfo } from '@app/_models';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-pol-attachment',
    templateUrl: './pol-attachment.component.html',
    styleUrls: ['./pol-attachment.component.css'],
    providers: [NgbDropdownConfig]
})
export class PolAttachmentComponent implements OnInit {

    @Input() alterationFlag: true;

    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    
    attachmentData: any = {
        tableData: [],
        tHeader: ['File Name', 'Description', 'Actions'],
        dataTypes: ['string', 'string', 'Actions'],
        nData: new PolAttachmentInfo(null, null),
        checkFlag: true,
        addFlag: true,
        deleteFlag: true,
        searchFlag: true,
        infoFlag: true,
        paginateFlag: true,
        pageLength: 10,
        keys: ['fileName', 'description'],
        widths: ['auto', 'auto', 1]
    }

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Attachment");
        this.retrievePolAttachment();
    }

    retrievePolAttachment(){
        this.underwritingService.getPolAttachment('8','CAR-2019-1-001-1-1').subscribe((data: any) =>{
            console.log(data);
            for(var i of data.polAttachmentList.attachments){
                this.attachmentData.tableData.push(i);
            }
            this.table.refreshTable();
        });
    }

}
