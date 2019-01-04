import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pol-dist-list',
    templateUrl: './pol-dist-list.component.html',
    styleUrls: ['./pol-dist-list.component.css']
})
export class PolDistListComponent implements OnInit {


    passData: any = {
        tHeader: [
            "Dist No.", "Risk Dist No.", "Status", "Policy No.",
            "Ceding Company", "Insured", "Risk", "Accounting Date"
        ],
        filters: [
           {
                key: 'distNo',
                title:'Dist. No.',
                dataType: 'text'
            },
            {
                key: 'riskDistNo',
                title:'Risk Dist. No.',
                dataType: 'text'
            },
            {
                key: 'status',
                title:'Status',
                dataType: 'text'
            },
            {
                key: 'policyNo',
                title:'Policy No.',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title:'Ceding Co.',
                dataType: 'text'
            },
            {
                key: 'insured',
                title:'Insured',
                dataType: 'text'
            },
            {
                key: 'risk',
                title:'Risk',
                dataType: 'text'
            },
            {
                key: 'accountingDate',
                title:'Accounting Date',
                dataType: 'datespan'
            },
        ],
        resizable: [
            false, false, true, false, true, true, true, false,
        ],
        dataTypes: [
            "number", "number", "text", "text", "text", "text", "text", "date"
        ],
        tableData: this.underwritingService.getPolicyDistListInfo(),
        pageLength: 10,
        printBtn: true,
        addFlag: true,

    }
    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title, private route: Router) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Policy Distribution List");
    }

    onClickAdd(event) {
        //do something
        this.route.navigateByUrl('/pol-dist');
    }

}
