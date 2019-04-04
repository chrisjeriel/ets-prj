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
    insured:string = '';

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
        tableData: [/*new PolicyCoInsurance("CAR-2018-000001-099-0001-000", "EN-CAR-2018-0000001-00", "Malayan", 12.2, 10000, 500000)*/],
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
        keys: ['policyNo','coRefNo','cedingName','pctShare','shareSiAmt','sharePremAmt'],
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

        this.insured = this.policyInfo.principalName + " / " + this.policyInfo.contractorName;

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

               for (let rec of dataInfos) {
                   this.coInsuranceData.tableData.push( {policyNo: data.policy.policyNo, 
                                                         coRefNo: rec.coRefNo, 
                                                         cedingName: rec.cedingName,
                                                         pctShare: rec.pctShare, 
                                                         shareSiAmt: rec.shareSiAmt, 
                                                         sharePremAmt: rec.sharePremAmt} );
               }

               this.table.refreshTable();
           }
           
        });
    }

}
