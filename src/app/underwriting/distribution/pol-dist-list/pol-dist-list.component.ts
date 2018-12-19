import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-pol-dist-list',
    templateUrl: './pol-dist-list.component.html',
    styleUrls: ['./pol-dist-list.component.css']
})
export class PolDistListComponent implements OnInit {


    passData: any = {
        tHeader: [
            "Dist No.", "Risk Dist No.", "Status", "Policy No.",
            "Ceding Company", "Insured", "Risk"
        ],
        filters: [
            "Dist No.", "Risk Dist No.", "Status", "Policy No.",
            "Ceding Company", "Insured", "Risk"
        ],
        resizable: [
            false, false, true, false, true, true, true
        ],
        dataTypes: [
            "number", "number", "text", "text", "text", "text", "text"
        ],
        tableData: this.underwritingService.getPolicyDistListInfo(),
        pageLength: 10,

    }
    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Policy Distribution List");
    }

    add() {
        //do something
    }

}
