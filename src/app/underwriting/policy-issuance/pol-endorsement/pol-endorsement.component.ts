import { Component, OnInit, Input } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PolicyEndorsement } from '../../../_models/PolicyEndorsement'
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-pol-endorsement',
    templateUrl: './pol-endorsement.component.html',
    styleUrls: ['./pol-endorsement.component.css']
})
export class PolEndorsementComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    tableData: any[] = [];
    options: any[] = [];
    dataTypes: any[] = [];
    magnifyingGlass: any[] = ["endtCode"];
    nData: PolicyEndorsement = new PolicyEndorsement(null, null, null, null);

    passDataEndorsement: any = {
        tHeader: ['C', 'Endt Code', 'Endt Title', 'Remarks'],
        dataTypes: [
                    "text", "text", "text", "text"
                   ],
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
    };


    @Input() alteration: boolean;

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title
    ) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Endorsement");
        this.passDataEndorsement.tableData = this.underwritingService.getPolicyEndorsement();
    }

    onClickCancel() {

    }

    onClickSave() {

    }
}
