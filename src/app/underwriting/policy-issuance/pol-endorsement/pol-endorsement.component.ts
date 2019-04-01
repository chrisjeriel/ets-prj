import { Component, OnInit, Input, ViewChildren, QueryList, ViewChild } from '@angular/core';
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
            showMG: 1,
        },
        addFlag: true,
        deleteFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageLength: 10,
        pageID: 'endt',
        widths: [1, 'auto', 'auto', 'auto'],
        keys: ['changeTag','endtCd', 'endtTitle', 'remarks'],
        tooltip: ['Change Tag'],
        uneditable: [false, false, true, false]
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
            deductibleAmt: 0,
            showMG: 1
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
        keys: ['deductibleCd','deductibleTitle', 'deductibleTxt', 'deductibleRt', 'deductibleAmt'],
        uneditable: [false,true,true,true,true]
    }

    passLOVData: any = {
      selector:'',
      data:{}
    }


    @Input() alteration: boolean = false;
    currentLine: string = "CAR";
    currentEndtCd: string = "";

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
        this.currentEndtCd = data.endtCd;
        if(data === null){
            this.deductiblesData.disableAdd = true;
        }else{
            this.deductiblesData.disableAdd = false;
        }
        //retrieve Deductibles when selecting an endorsement
       this.retrieveDeductibles(data);
    }

    clickEndtLov(data){
        console.log(data);
        $('#endtLov #modalBtn').trigger('click');
    }

    clickDedLov(data){
        this.passLOVData.selector = 'deductibles';
        this.passLOVData.lineCd = 'CAR';
        this.passLOVData.hide = this.deductiblesData.tableData.filter((a)=>{return !a.deleted}).map(a=>a.deductibleCd);
        this.passLOVData.params = {
          coverCd: '0',
          endtCd: this.currentEndtCd,
          activeTag:'Y'
        }
        $('#lov #modalBtn2').trigger('click');
    }

    //set endorsement
    setEndt(data){
        //delete blank
        this.passData.tableData = this.passData.tableData.filter((f)=>{return f.showMG !== 1});
        //add selected
        for(var k = 0; k < data.length; k++){
           this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
           this.passData.tableData[this.passData.tableData.length - 1].endtCd = data[k].endtCd;
           this.passData.tableData[this.passData.tableData.length - 1].endtTitle = data[k].endtTitle;
           this.passData.tableData[this.passData.tableData.length - 1].remarks = data[k].remarks === null ? '' : data[k].remarks;
           this.passData.tableData[this.passData.tableData.length - 1].showMG = 0;
        }
        this.table.forEach(t => {t.refreshTable()});
    }

    //set deductibles
    setSelected(data){
        console.log(data);
        //delete blank
        this.deductiblesData.tableData = this.deductiblesData.tableData.filter((f)=>{return f.showMG !== 1});
        //add selected
        for(var k = 0; k < data.data.length; k++){
           this.passData.tableData.push(JSON.parse(JSON.stringify(this.deductiblesData.nData)));
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleCd = data.data[k].deductibleCd;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleTitle = data.data[k].deductibleTitle;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleTxt = data.data[k].deductibleTxt;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleRt = data.data[k].deductibleRt;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].deductibleAmt = data.data[k].deductibleAmt;
           this.deductiblesData.tableData[this.deductiblesData.tableData.length - 1].showMG = 0;
        }
        console.log(this.deductiblesData.tableData);
        this.table.forEach(t => {t.refreshTable()});
    }
}
