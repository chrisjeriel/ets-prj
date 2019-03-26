import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PolicyEndorsement } from '../../../_models/PolicyEndorsement'
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
    selector: 'app-pol-endorsement',
    templateUrl: './pol-endorsement.component.html',
    styleUrls: ['./pol-endorsement.component.css']
})
export class PolEndorsementComponent implements OnInit {

    @ViewChildren(CustEditableNonDatatableComponent) table : QueryList<CustEditableNonDatatableComponent>;

    passData: any = {
        tableData: [],
        tHeader: ['C', 'Endt Code', 'Endt Title', 'Remarks'],
        magnifyingGlass: ['endtCd'],
        dataTypes: ['checkbox', 'text', 'text', 'text', 'text'],
        nData: {
            changeTag: 'N',
            endtCd: '',
            endtTitle: '',
            remarks: '',
        },
        addFlag: true,
        deleteFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageLength: 10,
        pageID: 'endt',
        widths: [1, 'auto', 'auto', 'auto'],
        keys: ['changeTag','endtCd', 'endtTitle', 'remarks']
    };

    deductiblesData: any = {
        tableData: [],
        tHeader: ['Deductible Code', 'Deductible Title', 'Deductible Text', 'Deductible Rate (%)', 'Deductible Amount'],
        dataTypes: ['text', 'text', 'text', 'percent', 'currency'],
        nData: {
            deductibleCd: '',
            deductibleTitle: '',
            deductibleTxt: '',
            deductibleRt: 0,
            deductibleAmt: 0
        },
        addFlag: true,
        disableAdd: true,
        deleteFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageLength: 10,
        pageID: 'deductible',
        widths: [1, 'auto', 'auto', 'auto', 'auto'],
        keys: ['deductibleCd','deductibleTitle', 'deductibleTxt', 'deductibleRt', 'deductibleAmt']
    }


    @Input() alteration: boolean = false;

    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title
    ) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Endorsement");
        if(this.alteration){
            //do something
            this.passData.magnifyingGlass = ['endtCd'];
            this.passData.checkFlag = true;
            this.deductiblesData.checkFlag = true;
            this.deductiblesData.magnifyingGlass = ['deductibleCd'];
        }else{
            this.passData.dataTypes[0] = 'text';
            this.passData.uneditable = [true,true,true,true];
            this.passData.addFlag = false;
            this.passData.deleteFlag = false;

            this.deductiblesData.uneditable = [true,true,true,true,true];
            this.deductiblesData.addFlag = false;
            this.deductiblesData.deleteFlag = false;
        }
        this.retrieveEndt();
    }

    //retrieve Endorsement
    retrieveEndt(){
        this.underwritingService.getPolicyEndorsement('8', '').subscribe((data: any) =>{
            if(data.endtList !== null){
                for(var i = 0; i < data.endtList.endorsements.length; i++){
                    if(this.alteration){
                        data.endtList.endorsements[i].showMG = 1; 
                    }
                    this.passData.tableData.push(data.endtList.endorsements[i]);
                }
                this.table.forEach(t => {t.refreshTable()});
            }
        });
    }

    //retrieve deductibles
    retrieveDeductibles(data){
        this.deductiblesData.tableData = [];
        if(data !== null && data.deductibles !== undefined){
            for(var j = 0; j < data.deductibles.length; j++){
                if(this.alteration){        
                    data.deductibles[j].showMG = 1;
                }
                this.deductiblesData.tableData.push(data.deductibles[j]);
            }
        }
        this.table.forEach(t => {t.refreshTable()});
    }

    onClickCancel() {
    }

    onClickSave() {
    }

    rowClick(data){
        if(data === null){
            this.deductiblesData.disableAdd = true;
        }else{
            this.deductiblesData.disableAdd = false;
        }
        //retrieve Deductibles when selecting an endorsement
       this.retrieveDeductibles(data);
    }

}
