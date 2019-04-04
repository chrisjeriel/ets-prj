import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-deductible',
    templateUrl: './deductible.component.html',
    styleUrls: ['./deductible.component.css'],
    providers: [NgbDropdownConfig]
})
export class DeductibleComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    fixedAmount: boolean = true;

    passData: any = {
        tableData: [],
        tHeader: ['Deductible', 'Title', 'Deductible Type','Deductible Amount','Rate','Minimum Amount','Maximum Amount','Deductible Text','Active','Remarks'],
        dataTypes: ['text','text','select','currency','percent','currency','currency','text','checkbox','text'],
        nData:
            {
                deductibleCd      : null,
                deductibleTitle   : null,
                typeDesc          : null,
                deductibleAmt     : null,
                deductibleRate    : null,
                minAmt            : null,
                maxAmt            : null,
                deductibleText    : null,
                activeTag         : null,
                remarks           : null
            }
        ,
        opts: [{
            selector: 'typeDesc',
            prev: [],
            vals: [],
        }],
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        //checkboxFlag: true,
        pageLength: 10,
        checkFlag: true,
        addFlag: true,
        deleteFlag: true,
        keys: ['deductibleCd','deductibleTitle','typeDesc','deductibleAmt','deductibleRate','minAmt','maxAmt','deductibleText','activeTag','remarks'],
        uneditable:[false,false,false,false,false,false,false,false,false,false],
        pageID:'mtn-deductibles',
        widths:['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto']

    };
    data: any;
    
    constructor(config: NgbDropdownConfig,private titleService: Title, private mtnService: MaintenanceService ) { }

    ngOnInit() {
        this.titleService.setTitle('Mtn | Deductibles'); 
        this.getMtnDeductibles();

    }

    getMtnDeductibles(){
         this.mtnService.getRefCode('MTN_DEDUCTIBLES.DEDUCTIBLE_TYPE')
            .subscribe(data =>{
                console.log(data);
                var rec = data['refCodeList'];
                for(let i of rec){

                    // this.passData.opts[0].push({selector :'typeDesc', prev:[i.description], vals:[i.code]});    
                    this.passData.opts[0].vals.push(i.code);
                    this.passData.opts[0].prev.push(i.description);
                }
                this.table.refreshTable();
        });

        this.passData.tableData = [];
        this.mtnService.getMtnDeductibles('','','','')
            .subscribe(data =>{
                var rec = data['deductibles'];
                //this.passData.tableData = rec;
                for(let i of rec){
                    this.passData.tableData.push({
                        deductibleCd      : i.deductibleCd,
                        deductibleTitle   : i.deductibleTitle,
                        typeDesc          : i.deductibleType,                        
                        deductibleAmt     : i.deductibleAmt,
                        deductibleRate    : i.deductibleRate,
                        minAmt            : i.minAmt,
                        maxAmt            : i.maxAmt,
                        deductibleText    : i.deductibleText,
                        activeTag         : i.activeTag,
                        remarks           : i.remarks
                    });
                }

                // for(var i = 0; i<this.passData.tableData.length;i++){
                //     var records = this.passData.tableData[i];
                //     console.log(records.deductibleCd + " >>> deductibleCd");
                //     console.log(records.typeDesc + " >>> typeDesc");

                // }
                // console.log(this.passData.opts.length + " >>> len before");
                // this.passData.opts[0].vals.push('OOO');
                // this.passData.opts[0].prev.push('OOO');

                // this.passData.opts[0].vals.push('YYYY');
                // this.passData.opts[0].prev.push('YYYY');
                // console.log(this.passData.opts.length + " >>> len after");
                this.table.refreshTable();
            });

    }

    FixedAmount(){
        this.fixedAmount = true;
    }

    NotFixedAmount(){
        this.fixedAmount = false;
    }

}
