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
    @Input() filterDataTypes: any[] = [];
    
    btnDisabled: boolean = true;
    
    
    @Input() filterObj:any[] = [
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

    ];

    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() rowDblClick: EventEmitter<any> = new EventEmitter();

    @Input() printBtn: boolean = false;
    //@Input() fixedCol: boolean = false;
    
    //test
    @Input() newData: any = new QuotationList(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
    @Input() passData: any = {
        tableData: [], tHeader: [], dataTypes: [], resizable: [], filters: [],
        pageLength: 10,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, pageStatus: true, pagination: true, addFlag: false, editFlag: false, deleteFlag: false,
    }

    dataKeys: any[] = [];
    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;
    autoFill: number[];

    displayData:any[];
    
    sortBy:boolean = true;
    sortIndex:number;
    searchString: string;
    displayLength: number;
    p:number = 1;
    checked:boolean;
    selected: any;
    fillData:any = {};

    constructor(config: NgbDropdownConfig, public renderer: Renderer, private quotationService: QuotationService,) {
        config.placement = 'bottom-right';
        config.autoClose = false;
        
    }

    ngOnInit(): void {
        console.log(this.passData.conditions)
        if (this.passData.tableData.length > 0) {
            this.dataKeys = Object.keys(this.passData.tableData[0]);
        } else {
            if(this.tHeader.length <= 0)
            this.tHeader.push("No Data");
        }
        this.displayData = JSON.parse(JSON.stringify( this.passData.tableData));
        this.displayLength = this.displayData.length;
        this.addFiller();
        
        for (var i = this.dataKeys.length - 1; i >= 0; i--) {
           this.fillData[this.dataKeys[i]] = null;
        }

        for(var filt in this.filterObj){
            this.filterObj[filt].search='';
            this.filterObj[filt].enabled=false;
        }
        /*if(this.passData.tableOnly){
            document.getElementById('#non-datatable').style.marginTop = "0px";
        }*/
    }

    processData(key: any, data: any) {
        return data[key];
    }
    consoled(){
        console.log(this.displayData);
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
        this.btnDisabled = false;
        /*for(var i = 0; i < event.target.parentElement.children.length; i++) {
            event.target.parentElement.children[i].style.backgroundColor = "";
        }

        event.target.parentElement.parentElement.style.backgroundColor = "#67b4fc";
        console.log(event.target.parentElement.parentElement);*/
        this.rowClick.next(event);
    }
    
    highlight(event, data){
        this.selected = data;
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
                return itm[filterObj[filt].key].toLowerCase( ).includes(filterObj[filt].search.toLowerCase( ));
/*=======
                     if(filterObj[filt]["dataType"]=="date")
                    return itm[filterObj[filt].key].toString().includes(new Date(filterObj[filt].search).toString());
                return itm[filterObj[filt].key].includes(filterObj[filt].search);
>>>>>>> b1c3410835a529fe6647f1324d64311af1ffe184*/
            })
        }
        this.addFiller();
    }

    addFiller(){
        this.autoFill = Array(this.pageLength).fill(this.fillData);
        if(this.displayData.length%this.pageLength != 0){
            this.autoFill = Array(this.pageLength -  this.displayData.length%this.pageLength).fill(this.fillData);
        }
        this.displayLength = this.displayData.length;
        if((typeof this.autoFill != "undefined" && this.displayData.length%this.pageLength != 0) || this.displayData.length==0)
            this.displayData = this.displayData.concat(this.autoFill);
    }

    addCheckFlag(cell){
        return !(cell===this.fillData);
    }

}
