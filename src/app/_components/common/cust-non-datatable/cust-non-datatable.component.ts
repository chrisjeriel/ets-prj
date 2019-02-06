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
    @Output() add: EventEmitter<any> = new EventEmitter();
    @Output() edit: EventEmitter<any> = new EventEmitter();
    @Output() copy: EventEmitter<any> = new EventEmitter();
    @Output() print: EventEmitter<any> = new EventEmitter();

    @Input() printBtn: boolean = false;
    //@Input() fixedCol: boolean = false;
    
    //test
    @Input() newData: any = new QuotationList(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
    @Input() passData: any = {
        tableData: [],          //REQUIRED. 
        tHeader: [],            //REQUIRED.
        dataTypes: [],          //DEFAULT is 'text'. Set 'percent', 
                                //'number', 'time', 'datetime', 'date', 'text', 'checkbox' accordingly.
        
        resizable: [],          //Set to determine what columns need to be resized. Default is all columns are resizable.
        filters: [],            //Required if tableOnly is false.
        colSize: [],            //REQUIRED. STRING VALUE. DEFAULT VALUE is '100%'. Just add '' as a value
        pageLength: 10,         //specify max number of rows in the table before it breaks to pagination.
                                //use 'unli' as pageLength for unlimited rows.
        
        expireFilter: false,    //expire filter 
        checkFlag: false,       //checkbox column
        tableOnly: false,       //disable search and filter
        fixedCol: false,        //fix first column
        printBtn: false,        //print btn
        pageStatus: true,       //pagination labels. must always be assigned unless you don't want this
        pagination: true,       //pagination buttons. must always be assigned unless you don't want this
        addFlag: false,         //add btn. 
                                //add functionality by placing it with [passData] as (add)="onClickAdd($event)"
        
        editFlag: false,        //edit btn
                                //add functionality by placing it with [passData] as (edit)="onClickEdit($event)"
        
        deleteFlag: false,      //delete btn
                                //add functionality by placing it with [passData] as (delete)="onClickDelete($event)"
        
        copyFlag: false,        //copy btn
                                //add functionality by placing it with [passData] as (copy)="onClickCopy($copy)"

        btnDisabled: true,      //your custom button disabler flag. Use this if you still need to disable button even after
                                //selecting a row

        pageID: 1               //if you use multiple instances of this component, this is a must
    }

    dataKeys: any[] = [];
    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;
    autoFill: number[];

    displayData:any[]= [];

    unliFlag: boolean = false;
    sortBy:boolean = true;
    sortIndex:number;
    searchString: string;
    displayLength: number;
    p:number = 1;
    checked:boolean;
    selected: any[] = [];
    indvSelect: any;
    fillData:any = {};
    nullKey: any;

    pinDataHeader:any[] = [];
    pinKeys:any[] = [];
    pinDatatypes:any[] = [];
    constructor(config: NgbDropdownConfig, public renderer: Renderer, private quotationService: QuotationService,) {
        config.placement = 'bottom-right';
        config.autoClose = false;
        
    }

    refreshTable(){
        for(var i = 0 ;i<this.passData.tableData.length;i++){
            this.displayData[i] = this.passData.tableData[i];
        }
        
        console.log(this.passData.tableData);
        //this.displayData = JSON.parse(JSON.stringify( this.passData.tableData));
        this.displayLength = this.displayData.length;
        this.unliTableLength();
        this.addFiller();
    }

    ngOnInit(): void {
        this.passData.btnDisabled = false;
        this.passData.pageID = typeof this.passData.pageID == "undefined" ? 1 : this.passData.pageID;
        this.passData.colSize = typeof this.passData.colSize == "undefined" ? [] : this.passData.colSize;
        this.unliFlag = this.passData.pageLength == 'unli';
        this.passData.pageLength = typeof this.passData.pageLength != 'number' ? 10 : this.passData.pageLength;
        this.passData.tHeader = typeof this.passData.tHeader == 'undefined' ? ['No Data'] : this.passData.tHeader;
        this.passData.tableData = typeof this.passData.tableData == 'undefined' ? [['No Data']] : this.passData.tableData;
        this.unliTableLength();
        
        if (this.passData.tableData.length > 0 && this.dataKeys.length == 0 ) {
            this.dataKeys = Object.keys(this.passData.tableData[0]);
        } else {
            this.dataKeys = this.passData.keys;
        }

        // this.displayData = JSON.parse(JSON.stringify( this.passData.tableData));
        // this.displayLength = this.displayData.length;
        // this.addFiller();
        this.refreshTable();
        
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

        if(typeof this.passData.resizable === "undefined"){
            this.passData.resizable = [];
            for(let i = 0; i < this.passData.tHeader.length; i++){
                this.passData.resizable.push(true);
            }
        }
        
        if(typeof this.passData.dataTypes === "undefined"){
            this.passData.dataTypes = [];
            for(let i = 0; i < this.passData.tHeader.length; i++){
                this.passData.dataTypes.push('text');
            }
        }
    }

    processData(key: any, data: any) {
        this.nullKey = key;
        return data[key];
    }
    consoled(){
        console.log(this.displayData);
    }

    unliTableLength(){
        if(this.unliFlag){
            console.log(this.passData.pageLength <= 10);
            this.passData.pageLength = this.passData.tableData.length <= 10 ? 10 :this.passData.tableData.length;
            console.log(this.passData.tableData.length);
        }
        
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
                $(this.start).parent().css({'min-width': width, 'max-width': width, 'width': width});
                let index = $(this.start).parent().index() + 1;
                $('.content-container tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width, 'width': width});
                
            }
        });
        this.renderer.listenGlobal('body', 'mouseup', (event) => {
            //$('#cust-datatable').DataTable().draw();
            if(this.pressed) {
                this.pressed = false;
            }
        });
    }

    onRowClick(event, data) {
        if(data[this.nullKey] !== null){
            this.btnDisabled = false;
            this.indvSelect = data;
        }
        /*for(var i = 0; i < event.target.parentElement.children.length; i++) {
            event.target.parentElement.children[i].style.backgroundColor = "";
        }
        event.target.parentElement.parentElement.style.backgroundColor = "#67b4fc";
        console.log(event.target.parentElement.parentElement);*/
        this.rowClick.emit(data);
    }
    
    highlight(data){
        this.selected.push(data);
        console.log('data pushed'); 
    }
    removeSelected(event, data){
        if(!event.target.checked){
            this.selected.splice(this.selected.indexOf(data), 1);
            console.log('wow');
        }else{
            this.selected.push(data);
        }
        
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
        this.filterDisplay(this.filterObj, this.searchString);
    }

    showSort(sortBy,i){
        return sortBy && i==this.sortIndex;
    }

    filterDisplay(filterObj,searchString){
        this.displayData = this.passData.tableData.filter((item) => this.dataKeys.some(key => item.hasOwnProperty(key) && new RegExp(searchString, 'gi').test(item[key])));
        for (var filt in filterObj) {    
            if (!filterObj[filt]["enabled"]) {continue;}
            this.displayData = this.displayData.filter(function(itm){
                return itm[filterObj[filt].key].toString().toLowerCase( ).includes(filterObj[filt].search.toLowerCase( ));

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

    onClickAdd(event){
        //do some adding
         this.add.next(event);
    }
    
    onClickEdit(event){
        //do some editing
        this.edit.next(event);
    }
    onClickDelete(){
        //do some deleting
    }
    onClickCopy(event){
        //do some copying
        this.copy.next(event);
    }
    onClickPrint(event){
        //do some copying
        this.print.next(event);
    }
    getSum(data){
        let sum = 0;
        if(this.dataKeys.indexOf(data)==-1){
            return data;
        }
        else{
            for (var i = this.displayData.length - 1; i >= 0; i--) {
                if(this.displayData[i][data] !== null){
                    sum += this.displayData[i][data];
                }            
            }
            return sum;
        }
    }

    pinColumn(event,index:number){
        this.pinKeys.push(this.dataKeys[index]);
        this.pinDataHeader.push(this.passData.tHeader[index]);
        this.pinDatatypes.push(this.passData.dataTypes[index]);
        let addWidth = $(event.path[1]).outerWidth();
        let startWidth = $('#pinTable'+this.passData.pageID).width();
        if(this.pinKeys.length == 1)
            addWidth += 30;
        $('#notPin'+this.passData.pageID).css('padding-left',startWidth+addWidth);
    }

    unPinColumn(event,index:number){
        this.pinKeys.splice(index,1);
        this.pinDataHeader.splice(index,1);
        this.pinDatatypes.splice(index,1);
        console.log(this.pinKeys);
        let minusWidth = $(event.path[1]).outerWidth();
        let startWidth = $('#pinTable'+this.passData.pageID).outerWidth();
        if(this.pinKeys.length == 0)
            minusWidth += 30;
        $('#notPin'+this.passData.pageID).css('padding-left',startWidth-minusWidth);
    }

}