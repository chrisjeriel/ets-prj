import { Component, OnInit, Input } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PolAttachmentInfo } from '@app/_models';
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
    
    tableData: any[] = [];
    tHeader: any[] = ["File Path", "Description", "Actions"];
    nData: PolAttachmentInfo = new PolAttachmentInfo(null, null);
    
    attachmentData: any = {
        tableData: this.underwritingService.getPolAttachment(),
        tHeader: ['File Name', 'Description', 'Actions'],
        dataTypes: ['string', 'string', 'Actions'],
        nData: new PolAttachmentInfo(null, null),
        checkFlag: true,
        addFlag: true,
        deleteFlag: true,
        searchFlag: true,
        infoFlag: true,
        paginateFlag: true,
        pageLength: 10
    }

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Attachment");
        this.tableData = this.underwritingService.getPolAttachment();
    }

}
