
import { Component, OnInit, ViewChild } from '@angular/core';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';
import { ModalComponent } from '../../../_components/common/modal/modal.component';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-dummy',
    templateUrl: './dummy.component.html',
    styleUrls: ['./dummy.component.css']
})
export class DummyComponent implements OnInit {
    //@ViewChild('content') content;
    @ViewChild(ModalComponent) modalComp: ModalComponent;

    tableData: any[] = [];
    tableData2: any[] = [];
    tableData3: any[] = [];
    tHeader: any[] = [];
    tHeader2: any[] = [];
    filters: any[] = [];
    filters2: any[] = [];
    dataTypes: any[] = [];
    filterDataTypes: any[] = [];
    filterDataTypes2: any[] = [];
    dataTypes2: any[] = [];
    nData: DummyInfo = new DummyInfo(null, null, null, null, null, null, null);
    resizables: boolean[] = [];
    require: any;
    //test
    passData: any = {
        tHeader: [
            "Quotation No.", "Type of Cession", "Line Class", "Status",
            "Ceding Company", "Principal", "Contractor", "Insured", "Risk",
            "Object", "Site", "Policy No", "Currency","Period From"
        ],
        filters: [
            {
                key: 'quotationNo',
                title:'Quotation No.',
                dataType: 'text'
            },
            {
                key: 'cessionType',
                title:'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'lineClass',
                title:'Line Class',
                dataType: 'text'
            },
            {
                key: 'quoteStatus',
                title:'Quote Status',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title:'Ceding Company',
                dataType: 'text'
            },
            {
                key: 'principal',
                title:'Principal',
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
                key: 'object',
                title:'Object',
                dataType: 'text'
            },
            {
                key: 'location',
                title:'Insured',
                dataType: 'text'
            },
            {
                key: 'quoteDate',
                title:'Period From',
                dataType: 'date'
            },
        ],
        /*resizable: [
            false,false,true,true,true,true,true,true,true,true,true,false,
            false,true
        ],*/
        /*dataTypes: [
            "text","text","text","text","text","text","text","text","text",
            "text","text","text","text","date"
        ],*/
        colSize: [
            '', '', '', '', '', '', '', '', '900px', '', '', '', '',  
        ],
           tableData: this.quotationService.getQuotationListInfo(),
        pageLength: 10,
        expireFilter: false,
        tableOnly:true,
        pagination:true,
        checkFlag:true
        
    };

    testingData: any = {
        tHeader: ['test', 'test2'],
        tableData: [
            {first: 'test', second: 'test2'}, {first: 'test3', second: 'test4'}
        ],
        dataTypes: ['text', 'text'],
        pageLength: 3,
        tableOnly: false,
        checkFlag: true,
    }

    passDataEditable: any = {
        tableData: [],
        tHeader: ["ID", "First Name", "Last Name", "Middle Name", "Gender", "Age", "Birth Date","Actions"],
        // total : [null,null,null,null,"Total","age",null,null],
        nData: new DummyInfo(null, null, null, null, null, null, null),
        dataTypes: ['number','text','text','text','text','currency','date'],
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        //totalFlag:true,
        pageLength: 5,
        searchFlag:true,
        infoFlag: true,
        paginateFlag: true,
        magnifyingGlass:['id'],
        uneditable:[true,false,false,false,true,true,true],
        widths:[46]
    };
        
    constructor(private quotationService: QuotationService, private modalService: NgbModal) { 
    }

    t: any = {
        ttt: null
    }
    
    ttt: any = 'ttt';
    uuu: any = '';

    testCont: any = 'TEST';
    teest: any = {
        testMask: null
    }

    ngOnInit() {
        this.t.ttt = 5;
        this.tHeader.push("ID");
        this.tHeader.push("First Name");
        this.tHeader.push("Last Name");
        this.tHeader.push("Middle Name");
        this.tHeader.push("Gender");
        this.tHeader.push("Age");
        this.tHeader.push("Birth Date");

        this.filters.push("ID");
        this.filters.push("First Name");
        this.filters.push("Last Name");
        this.filters.push("Middle Name");
        this.filters.push("Gender");
        this.filters.push("Age");
        this.filters.push("Birth Date");

        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("text");
        this.filterDataTypes.push("date");

        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");

        this.tHeader2.push("Quotation No.");
        this.tHeader2.push("Type of Cession");
        this.tHeader2.push("Line Class");
        this.tHeader2.push("Status");
        this.tHeader2.push("Ceding Company");
        this.tHeader2.push("Principal");
        this.tHeader2.push("Contractor");
        this.tHeader2.push("Insured");
        this.tHeader2.push("Risk");
        this.tHeader2.push("Object");
        this.tHeader2.push("Site");
        this.tHeader2.push("Policy No.");
        this.tHeader2.push("Currency");

        this.filters2.push("Quotation No.");
        this.filters2.push("Type of Cession");
        this.filters2.push("Line Class");
        this.filters2.push("Quote Status");
        this.filters2.push("Company");
        this.filters2.push("Principal");
        this.filters2.push("Contractor");
        this.filters2.push("Insured");
        this.filters2.push("Risk");
        this.filters2.push("Object");
        this.filters2.push("Site");
        this.filters2.push("Policy No.");
        this.filters2.push("Currency");

        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("text");
        this.filterDataTypes2.push("date");

        this.resizables.push(false);
        this.resizables.push(false);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(false);
        this.resizables.push(false);

        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");
        this.dataTypes2.push("text");

        this.tableData = this.quotationService.getDummyInfo();
        this.tableData2 = this.quotationService.getDummyEditableInfo();
        this.tableData3 = this.quotationService.getQuotationListInfo();
        this.tableData3.forEach(function(e){
            delete e.quoteDate;
            delete e.validityDate;
            delete e.createdBy;
            delete e.requestedBy;
        });
        this.passData.tableData.forEach(function(e){

            delete e.validityDate;
            delete e.createdBy;
            delete e.requestedBy;
        });

         this.passDataEditable.tableData = this.quotationService.getDummyEditableInfo();
    }

    open(){
        this.modalService.dismissAll();
        this.modalService.open(this.modalComp.test, { centered: true, backdrop: 'static', windowClass : 'modal-size' });
    }
    
    openAgain(){
        this.modalService.dismissAll();
    }

    // random(){
    //     var randomWords = require('random-words');
    //     console.log(randomWords());
    // }

    testingInternalComp(){
        var internalCompParams: any[] = [{
          adviceNo: 0,
          cedingId: 3,
          cedingRepId: 3,
          createDate: new Date().toISOString(),
          createUser: 'ndc',
          option: '',
          quoteId: 210,
          updateDate: new Date().toISOString(),
          updateUser: 'ndc',
          wordings: ''
        }];
        console.log(internalCompParams);
        this.quotationService.saveQuoteCompetition(internalCompParams).subscribe((result: any) => {
          console.log(result);
        });
    }

    test() {        
        console.log('aw');
        return 'NICE' + this.ttt;
    }

    testVal() {
        
        // console.log('change' + this.teest.testMask);
        // console.log('change' + this.t.ttt);
        console.log('change' + this.ttt);
    }

    testblur() {
        this.uuu = 'u ' + this.ttt;
    }
}
