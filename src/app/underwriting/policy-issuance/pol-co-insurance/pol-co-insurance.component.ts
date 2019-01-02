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
    
    coInsuranceData: any = {
        tableData: this.underwritingService.getCoInsurance(),
        tHeader: ['Policy No', 'Ref Policy No', 'Ceding Company', 'Share Percentage', 'Share Sum Insured', 'Share Premium'],
        addFlag:false,
        editFlag:false,
        deleteFlag:false,
        pageLength: 10,
        nData: new PolicyCoInsurance(null, null, null, null, null, null),
        dataTypes: ['string', 'string', 'string', 'percent', 'currency', 'currency'],
        infoFlag: true,
        paginateFlag: true,
        widths: [1, 1, 1, 1, 1, 1]
    }

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title
    ) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit(): void {
        this.titleService.setTitle("Pol | Co-Insurance");
    }

    onClickCancel() {

    }

    onClickSave() {

    }
}
