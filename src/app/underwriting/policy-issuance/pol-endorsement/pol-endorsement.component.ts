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
    checkFlag;
    checkboxFlag;
    addFlag;
    deleteFlag;
    paginateFlag;
    infoFlag;
    searchFlag;

    passData: any = {
        tableData: [],
        tHeader: [],
        magnifyingGlass: [],
        dataTypes: [],
        nData: {},
        checkFlag: true,
        addFlag: true,
        deleteFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        checkboxFlag: true,
        pageLength: 10,
        widths: []
    };
    nData: PolicyEndorsement = new PolicyEndorsement(null, null, null, null);


    @Input() alteration: boolean;
    holdCover: boolean;

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title
    ) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Endorsement");
        this.passData.tHeader.push("C", "Endt Code", "Endt Title", "Remarks");
        this.passData.dataTypes.push("text", "text", "text", "text");
        this.passData.widths.push("1", "auto", "auto", "auto");
        this.passData.magnifyingGlass.push("endtCode");
        this.passData.tableData = this.underwritingService.getPolicyEndorsement();
    }

    onClickCancel() {
        this.holdCover = true;
    }

    onClickSave() {
        this.holdCover = false;
    }

}
