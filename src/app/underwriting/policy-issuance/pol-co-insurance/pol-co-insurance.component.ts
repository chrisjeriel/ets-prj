import { Component, OnInit, Input } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService } from '../../../_services';
import { PolicyCoInsurance } from '@app/_models';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'app-pol-co-insurance',
    templateUrl: './pol-co-insurance.component.html',
    styleUrls: ['./pol-co-insurance.component.css']
})

export class PolCoInsuranceComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    tableData: any[] = [];
    tHeader: any[] = [];
    options: any[] = [];
    dataTypes: any[] = [];
    nData: PolicyCoInsurance = new PolicyCoInsurance(null, null, null, null, null, null);

    @Input() alteration: boolean;

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title
    ) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit(): void {
        this.titleService.setTitle("Pol | Co-Insurance");
        //this.tHeader.push("");
        this.tHeader.push("Policy No");
        this.tHeader.push("Ref Policy No");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Share Percentage");
        this.tHeader.push("Share Sum Insured");
        this.tHeader.push("Share Premium");
        //this.tHeader.push("Actions");

        //this.dataTypes.push("checkbox");
        this.dataTypes.push("string");
        this.dataTypes.push("string");
        this.dataTypes.push("string");
        this.dataTypes.push("percent");
        this.dataTypes.push("currency");
        this.dataTypes.push("currency");

        this.tableData = this.underwritingService.getCoInsurance();
    }

    onClickCancel() {

    }

    onClickSave() {

    }
}
