import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService } from '../../../_services';
import { PolicyCoInsurance } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'


@Component({
    selector: 'app-pol-co-insurance',
    templateUrl: './pol-co-insurance.component.html',
    styleUrls: ['./pol-co-insurance.component.css']
})

export class PolCoInsuranceComponent implements OnInit {
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

    @Input() policyInfo:any = {};

    polCoInsurance: any = {
        coRefNo: null,
        cedingId : null,
        cedingName: null,
        pctShare: null,
        shareSiAmt: null,
        sharePremAmt: null,
        createUser: null,
        createDate: null,
        updateUser: null,
        updateDate: null
    };
    
    coInsuranceData: any = {
        tableData: [new PolicyCoInsurance("CAR-2018-000001-099-0001-000", "EN-CAR-2018-0000001-00", "Malayan", 12.2, 10000, 500000)],
        tHeader: ['Policy No', 'Ref Policy No', 'Ceding Company', 'Share Percentage', 'Share Sum Insured', 'Share Premium'],
        addFlag:false,
        editFlag:false,
        deleteFlag:false,
        pageLength: 10,
        nData: new PolicyCoInsurance(null, null, null, null, null, null),
        dataTypes: ['string', 'string', 'string', 'percent', 'currency', 'currency'],
        infoFlag: true,
        paginateFlag: true,
        widths: [1, 1, 1, 1, 1, 1],
        keys: ['policyNo','refPolNo','cedingCo','sharePercentage','shareSi','sharePremium'],
        pageID: 10,
        uneditable: [true,true,true,true,true,true]
    }

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title
    ) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit(): void {
        this.titleService.setTitle("Pol | Co-Insurance");
        this.getPolCoInsurance();
    }

    onClickCancel() {

    }

    onClickSave() {

    }

    getPolCoInsurance() {
        this.underwritingService.getPolCoInsurance(this.policyInfo.policyId, '') .subscribe((data: any) => {
           this.coInsuranceData.tableData = [];
           if (data.policy != null) {
               var dataInfos = data.policy.coInsurance;
               

               for (var i=0; i<dataInfos.length; i++) {
                   this.coInsuranceData.tableData.push(new PolicyCoInsurance(data.policy.policyNo, dataInfos[i].coRefNo, dataInfos[i].cedingName,
                       dataInfos[i].pctShare, dataInfos[i].shareSiAmt, dataInfos[i].sharePremAmt));
               }

               this.table.refreshTable();
           }
           
        });
    }

}
