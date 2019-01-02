import { Component, OnInit, Input, Output, EventEmitter, Renderer } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { DummyInfo } from '../../../_models';

@Component({
    selector: 'app-cust-editable-non-datatable',
    templateUrl: './cust-editable-non-datatable.component.html',
    styleUrls: ['./cust-editable-non-datatable.component.css'],
    providers: [NgbDropdownConfig]
})
export class CustEditableNonDatatableComponent implements OnInit {

    @Input() tableData: any[] = [];
    @Output() tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Input() tHeader: any[] = [];
    @Input() magnifyingGlass: any[] = [];
    @Input() options: any[] = [];
    @Input() dataTypes: any[] = [];
    @Input() opts: any[] = [];
    @Input() nData;
    @Input() checkFlag;
    @Input() selectFlag;
    @Input() addFlag;
    @Input() editFlag;
    @Input() deleteFlag;
    @Input() paginateFlag;
    @Input() infoFlag;
    @Input() searchFlag;

    @Input() checkboxFlag;
    @Input() columnId;
    @Input() pageLength = 10;

    @Input() editedData: any[] = [];
    @Output() editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() rowDblClick: EventEmitter<any> = new EventEmitter();

    @Input() passData: any = {
        tableData:[],
        tHeader:[],
        tHeaderWithColspan:[],
        magnifyingGlass:[],
        options:[],
        dataTypes:[],
        opts:[],
        nData:{},
        checkFlag:false,
        selectFlag:false,
        addFlag:false,
        editFlag:false,
        deleteFlag:false,
        paginateFlag:false,
        infoFlag:false,
        searchFlag:false,
        checkboxFlag:false,
        pageLength:10,
        //set width for columns 
        //"1" to fit the header columns
        // "auto" to auto-adjust
        widths: []
    };

    dataKeys: any[] = [];
    tableLoad: boolean = true;
    nextId: number = 0;
    exists:Boolean = false;

    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;
    autoFill: number[];

    displayData:any[];
    newData: any = new DummyInfo(null,null,null,null,null,null,null);
    sortBy:boolean = true;
    sortIndex:number;
    searchString: string;
    displayLength: number;
    p:number = 1;
    fillData:any = {};
    checked: boolean;
    @Input() totalFlag = false;
    @Input() widths: string[] = [];
    unliFlag:boolean = false;
    constructor(config: NgbDropdownConfig, public renderer: Renderer) { 
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.passData.magnifyingGlass = typeof this.passData.magnifyingGlass == 'undefined'? [] : this.passData.magnifyingGlass;
        this.unliFlag = this.passData.pageLength == 'unli';
        this.passData.pageLength = typeof this.passData.pageLength != 'number' ? 10 : this.passData.pageLength;
        this.unliTableLength();
        this.passData.dataTypes = typeof this.passData.dataTypes == 'undefined' ? [] : this.passData.dataTypes;
        if (this.passData.tableData.length > 0) {
            this.dataKeys = Object.keys(this.passData.tableData[0]);
        } else {
            //this.passData.tHeader.push("No Data");
        }
        this.displayData = JSON.parse(JSON.stringify( this.passData.tableData));
        this.displayLength = this.displayData.length;
        // this.autoFill = Array(this.passData.pageLength).fill(this.newData);
        // if(this.displayData.length%this.passData.pageLength != 0){
        //     this.autoFill = Array(this.passData.pageLength - this.displayData.length%this.passData.pageLength).fill(this.newData);
        // }
        // if(typeof this.autoFill != "undefined")
        //     this.displayData = this.displayData.concat(this.autoFill);

        
        for (var i = this.dataKeys.length - 1; i >= 0; i--) {
           this.fillData[this.dataKeys[i]] = null;
        }
        this.addFiller();
        
    }

    processData(key: any, data: any) {
        return data[key];
    }

    onClickAdd() {
        this.passData.tableData.push(this.passData.nData);
        this.unliTableLength();    
        this.search(this.searchString);
    }

    onClickDelete() {
        this.passData.tableData.pop();
        this.unliTableLength();
        this.search(this.searchString);
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
                $(this.start).parent().css({'min-width': width, 'max-   width': width});
                let index = $(this.start).parent().index() + 1;
                $('.glowTableBody tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width});
            }
        });
        this.renderer.listenGlobal('body', 'mouseup', (event) => {
            if(this.pressed) {
                this.pressed = false;
            }
        });
    }

    onRowClick(event) {
        this.rowClick.next(event);
    }

    onRowDblClick(event) {
        this.rowDblClick.next(event);
    }
    sort(str,sortBy){
        this.passData.tableData = this.passData.tableData.sort(function(a, b) {
            if(sortBy){
                if(a[str] < b[str]) { return -1; }
                if(a[str] > b[str]) { return 1; }
            }else{
                if(a[str] < b[str]) { return 1; }
                if(a[str] > b[str]) { return -1; }
            }
        });
        this.sortBy = !this.sortBy;
        this.search(this.searchString);
   
    }

    showSort(sortBy,i){
        return sortBy && i==this.sortIndex;
    }

    search(event){
        this.displayData = this.passData.tableData.filter((item) => this.dataKeys.some(key => item.hasOwnProperty(key) && new RegExp(event, 'gi').test(item[key])));
        // this.autoFill = Array(this.passData.pageLength).fill(this.newData);
        // if(this.displayData.length%this.passData.pageLength != 0){
        //     this.autoFill = Array(this.passData.pageLength -  this.displayData.length%this.passData.pageLength).fill(this.newData);
        // }
        // this.displayLength = this.displayData.length;
        // if(typeof this.autoFill != "undefined")
        //     this.displayData = this.displayData.concat(this.autoFill);
        this.addFiller();
    }

    addFiller(){
        this.autoFill = Array(this.passData.pageLength).fill(this.fillData);
        if(this.displayData.length%this.passData.pageLength != 0){
            this.autoFill = Array(this.passData.pageLength -  this.displayData.length%this.passData.pageLength).fill(this.fillData);
        }
        this.displayLength = this.displayData.length;
        if((typeof this.autoFill != "undefined" && this.displayData.length%this.passData.pageLength != 0) || this.displayData.length==0)
            this.displayData = this.displayData.concat(this.autoFill);
    }

    addCheckFlag(cell){
        return !(cell===this.fillData);
    }

    isNumber(i){
        if(typeof this.passData.dataTypes=='undefined' || i>=this.passData.dataTypes.length)
            return false;
        else if(this.passData.dataTypes[i]=="currency" ||this.passData.dataTypes[i]=="number" ||this.passData.dataTypes[i]=="percent")
            return true;
        else
            return false;
    }

    unliTableLength(){
        if(this.unliFlag){
            console.log(this.passData.pageLength <= 10);
            this.passData.pageLength = this.passData.tableData.length <= 10 ? 10 :this.passData.tableData.length;
            console.log(this.passData.tableData.length);
        }
        
    }
}
