import { Component, OnInit, Input, Renderer, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';
import { IntCompAdvInfo, QuotationList } from '../../../_models';

@Component({
    selector: 'app-cust-non-datatable',
    templateUrl: './cust-non-datatable.component.html',
    styleUrls: ['./cust-non-datatable.component.css']
})
export class CustNonDatatableComponent implements OnInit {
    @Input() tableData: any[] = [];
    @Input() resizable: boolean[] = [];
    @Input() tHeader: any[] = [];
    @Input() expireFilter: boolean;
    @Input() dataTypes: any[] = [];
    @Input() filters: any[] = [];
    @Input() pageLength: number = 10;
    @Input() checkFlag: boolean;
    @Input() tableOnly: boolean = false;
    @Input() searchQuery: any = "cessionType";
    @Input() filterDataTypes: any[] = [];

    @Input() filterObj:any[] = [
        {
            key: 'quotationNo',
            title:'Quotation No.',
        },
        {
            key: 'cessionType',
            title:'Type of Cession',
        },
        {
            key: 'lineClass',
            title:'Line Class',
        },
        {
            key: 'quoteStatus',
            title:'Quote Status',
        },
        {
            key: 'cedingCompany',
            title:'Ceding Company',
        },
        {
            key: 'principal',
            title:'Principal',
        },
        {
            key: 'insured',
            title:'Insured',
        },
        {
            key: 'risk',
            title:'Risk',
        },
        {
            key: 'object',
            title:'Object',
        },
        {
            key: 'location',
            title:'Insured',
        },

    ];

    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() rowDblClick: EventEmitter<any> = new EventEmitter();

    @Input() printBtn: boolean = false;
    
    //test
    @Input() passData: any = {
        tableData: [], tHeader: [], dataTypes: [], resizable: [],
        expireFilter: false, filters: [], pageLength: 10, checkFlag: false,
        tableOnly: false, 
    }

    dataKeys: any[] = [];
    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;
    autoFill: number[];

    displayData:any[];
    newData: any =new QuotationList(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
    sortBy:boolean = true;
    sortIndex:number;
    searchString: string;
    displayLength: number;
    p:number = 1;

    constructor(config: NgbDropdownConfig, public renderer: Renderer, private quotationService: QuotationService,) {
        config.placement = 'bottom-right';
        config.autoClose = false;
        
    }

    ngOnInit(): void {
        if (this.passData.tableData.length > 0) {
            this.dataKeys = Object.keys(this.passData.tableData[0]);
        } else {
            if(this.tHeader.length <= 0)
            this.tHeader.push("No Data");
        }
        this.displayData = JSON.parse(JSON.stringify( this.passData.tableData));
        this.displayLength = this.displayData.length;
        this.addFiller()

        for(var filt in this.filterObj){
            this.filterObj[filt].search='';
            this.filterObj[filt].enabled=false;
        }
    }

    processData(key: any, data: any) {
        return data[key];
    }

    private onMouseDown(event){
        this.start = event.target;
        this.pressed = true;
        this.startX = event.x;
        this.startWidth = $(this.start).parent().width();
        this.initResizableColumns();
    }

    private initResizableColumns() {
        this.renderer.listenGlobal('body', 'mousemove', (event) => {
            if(this.pressed) {
                let width = this.startWidth + (event.x - this.startX);
                $(this.start).parent().css({'min-width': width, 'max-width': width});
                let index = $(this.start).parent().index() + 1;
                $('.glowTableBody tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width});
            }
        });
        this.renderer.listenGlobal('body', 'mouseup', (event) => {
            //$('#cust-datatable').DataTable().draw();
            if(this.pressed) {
                this.pressed = false;
            }
        });
    }

    onRowClick(event) {

        for(var i = 0; i < event.target.parentElement.parentElement.children.length; i++) {
            event.target.parentElement.parentElement.children[i].style.backgroundColor = "";
        }

        event.target.parentElement.style.backgroundColor = "#67b4fc";
        this.rowClick.next(event);
    }

    onRowDblClick(event) {
        this.rowDblClick.next(event);
    }

    sort(str,sortBy){
        this.displayData = this.displayData.sort(function(a, b) {
            if(sortBy){
                if(a[str] < b[str]) { return -1; }
                if(a[str] > b[str]) { return 1; }
            }else{
                if(a[str] < b[str]) { return 1; }
                if(a[str] > b[str]) { return -1; }
            }
        });
        this.sortBy = !this.sortBy;
   
    }

    showSort(sortBy,i){
        return sortBy && i==this.sortIndex;
    }

    filterDisplay(filterObj,searchString){
        this.displayData = this.passData.tableData.filter((item) => this.dataKeys.some(key => item.hasOwnProperty(key) && new RegExp(searchString, 'gi').test(item[key])));
        for (var filt in filterObj) {    
            if (!filterObj[filt]["enabled"]) {continue;}
            this.displayData = this.displayData.filter(function(itm){
                return itm[filterObj[filt].key].includes(filterObj[filt].search);
            })
        }
        this.addFiller();
    }

    addFiller(){
        this.autoFill = Array(this.passData.pageLength).fill(this.newData);
        if(this.displayData.length%this.passData.pageLength != 0){
            this.autoFill = Array(this.passData.pageLength -  this.displayData.length%this.passData.pageLength).fill(this.newData);
        }
        this.displayLength = this.displayData.length;
        if(typeof this.autoFill != "undefined")
            this.displayData = this.displayData.concat(this.autoFill);
    }



}
