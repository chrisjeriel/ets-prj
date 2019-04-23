import { Component, OnInit, Input, Renderer, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';
import { IntCompAdvInfo, QuotationList } from '../../../_models';
import { AppComponent } from '@app/app.component';

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
    unselect: boolean = false;
    expireCounter: number = 0;
    expireValue: any;

    nullRow: boolean = false;
    
    @Input() filterObj:any[] = [];

    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() rowDblClick: EventEmitter<any> = new EventEmitter();
    @Output() newRowDblClick: EventEmitter<any> = new EventEmitter();
    @Output() add: EventEmitter<any> = new EventEmitter();
    @Output() edit: EventEmitter<any> = new EventEmitter();
    @Output() delete: EventEmitter<any> = new EventEmitter();
    @Output() copy: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();
    @Output() print: EventEmitter<any> = new EventEmitter();
    @Output() gnrc1: EventEmitter<any> = new EventEmitter();
    @Output() gnrc2: EventEmitter<any> = new EventEmitter();
    @Output() export: EventEmitter<any> = new EventEmitter();

    @ViewChild('paw') page: any;

    //DB Search Query
    searchQuery: any[] = [];
    @Output() searchToDb: EventEmitter<any> = new EventEmitter();

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
        tabIndexes: [],         //DEFAULT: false = tabIndex = -1 | true = tabIndex = 0
        pageLength: 10,         //specify max number of rows in the table before it breaks to pagination.
                                //use 'unli' as pageLength for unlimited rows.
        
        expireFilter: false,    //expire filter 
        checkFlag: false,       //checkbox column
        tableOnly: false,       //disable search and filter
        fixedCol: false,        //fix first column
        printBtn: false,        //print btn
        exportFlag: false,
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

        saveFlag: false,        //save btn
                                //add functionality by placing it with [passData] as (save)="onClickSave($event)"
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
    keyCounter: number = 0;

    pinDataHeader:any[] = [];
    pinKeys:any[] = [];
    pinDatatypes:any[] = [];
    loadingFlag:boolean = true;
    loadingTableFlag: boolean = false;
    constructor(config: NgbDropdownConfig, public renderer: Renderer, private quotationService: QuotationService, private appComponent: AppComponent) {
        config.placement = 'bottom-right';
        config.autoClose = false;
        
    }
    currentIndex: number;
    tablePress(event: KeyboardEvent, data: any, index){
        //console.log(this.page.getCurrent());
        //console.log(index);

        event.preventDefault();
        if(this.currentIndex === undefined){
            if(event.key === 'ArrowUp' && index !== 0){
                this.currentIndex = index - 1;
                this.indvSelect = this.passData.tableData[index-1];
            }else if(event.key === 'ArrowDown' && index !== this.passData.tableData.length-1){
                this.currentIndex = index + 1;
                this.indvSelect = this.passData.tableData[index+1];
            }else if((event.key === 'ArrowUp' && index === 0) || (event.key === 'ArrowDown' && index === this.passData.tableData.length-1)){
                this.currentIndex = index;
                this.indvSelect = this.passData.tableData[index];
            }
        }else{
            if(event.key === 'ArrowUp' && this.currentIndex !== 0){
                this.currentIndex = this.currentIndex - 1;
                this.indvSelect = this.passData.tableData[this.currentIndex];
            }else if(event.key === 'ArrowDown' && this.currentIndex !== this.passData.tableData.length-1){
                this.currentIndex = this.currentIndex + 1;
                this.indvSelect = this.passData.tableData[this.currentIndex];
            }else if((event.key === 'ArrowUp' && this.currentIndex === 0) || (event.key === 'ArrowDown' && this.currentIndex === this.passData.tableData.length-1)){
                this.indvSelect = this.passData.tableData[this.currentIndex];
            }
        }
        //console.log(this.currentIndex);

        if((this.p - 1) * this.passData.pageLength > this.currentIndex ){
            //this.page.previous();
            this.p -= 1;
            setTimeout(()=>{$('#tableRow').focus();},100);
            console.log('prev');
        }else if(this.p * this.passData.pageLength -1 < this.currentIndex){
            //this.page.next();
            this.p += 1;
            setTimeout(()=>{$('#tableRow').focus();},100);
            console.log('next');
        }
        
        //this.indvSelect = this.displayData[index];
        /*console.log('currentIndex');
        console.log(this.currentIndex);
        console.log('data');
        console.log(data);
        console.log('indvSelect');
        console.log(this.indvSelect);*/
        //console.log(this.indvSelect);
        this.rowClick.emit(this.indvSelect);
    }

    //when enter key is pressed
    enterKey(event, data){
        //console.log(this.indvSelect);
        console.log(event);
       this.onRowDblClick(event,this.indvSelect);
    }

    /*@Output() pageEmit: EventEmitter<any> = new EventEmitter(); 
    pageChange(event){
        console.log(event);
        this.pageEmit.emit(event);
    }*/

    refreshTable(initLoad?){
        
        if(initLoad === undefined){
            this.loadingFlag = false;
        }else{
            this.loadingFlag = true;
        }
        while(this.displayData.length>0){
            this.displayData.pop();
        }
        for(var i = 0 ;i<this.passData.tableData.length;i++){
            this.displayData[i] = this.passData.tableData[i];
             this.passData.tableData[i].checked = this.passData.tableData[i].checked ? true : false;
        }

        if (this.passData.tableData.length > 0 && this.dataKeys.length == 0 ) {
            this.dataKeys = Object.keys(this.passData.tableData[0]);
        } else {
            this.dataKeys = this.passData.keys;
        }

        //this.displayData = JSON.parse(JSON.stringify( this.passData.tableData));
        this.displayLength = this.displayData.length;
        this.unliTableLength();
        this.addFiller();
        //this.appComponent.ngOnInit();
        this.loadingTableFlag = false;
        this.selected = [];

        //select the first row
        if(this.passData.tableData.length !== 0){
            this.onRowClick('event',this.passData.tableData[0], 0);
        }
        $('#tableRow').focus();
        //end select the first row
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

        if(this.dataKeys.indexOf('checked') != -1){
         this.dataKeys.splice(this.dataKeys.indexOf('checked'),1);
       }
        if(this.passData.tableData.length != 0)
            this.loadingFlag = false;
        // this.displayData = JSON.parse(JSON.stringify( this.passData.tableData));
        // this.displayLength = this.displayData.length;
        // this.addFiller();
        this.refreshTable("first");
        
        //Bring this back in case of emergency
        /*for (var i = this.dataKeys.length - 1; i >= 0; i--) {
           this.fillData[this.dataKeys[i]] = null;
        }*/
        this.fillData = null;  //delete this if something bad happens

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
        if(this.passData.filters !== undefined && this.passData.filters.length > 0){
            for(var expireCheck of this.passData.filters){
                if(expireCheck.dataType === 'expire'){
                    break;
                }
                else{
                    this.expireCounter++;
                }
            }
        }

        //temporary fix delete this later
        //setTimeout(()=>{this.refreshTable();},2000)
    }

    processData(key: any, data: any) {
        if(this.keyCounter == 0){
            this.nullKey = key;
            this.keyCounter++;
        }
        return data[key];
    }

    unliTableLength(){
        
        if(this.unliFlag){
            this.passData.pageLength = this.passData.tableData.length <= 10 ? 10 :this.passData.tableData.length;
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
                $('#notPin'+this.passData.pageID+' .content-container tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width, 'width': width});
                
            }
        });
        this.renderer.listenGlobal('body', 'mouseup', (event) => {
            //$('#cust-datatable').DataTable().draw();
            if(this.pressed) {
                this.pressed = false;
            }
        });
    }
/*<<<<<<< Updated upstream
    onRowClick(event, data) {
        
=======*/
    onRowClick(event, data, index?) {
        console.log(data);
        this.currentIndex = index + ((this.p - 1) * this.passData.pageLength );   //this.p is the current page number
/*>>>>>>> Stashed changes*/
        if(this.passData.checkFlag === undefined || !this.passData.checkFlag){
            if(data !== null){
                this.nullRow = false;
                if( Object.entries(data).length !== 0){
                    //if(data[this.nullKey] !== null){
                        this.btnDisabled = false;
                        if(this.indvSelect == data){
                            this.unselect = true;
                            this.btnDisabled = true;
                            this.indvSelect = "";
                            data = {};
                        }else{
                           /* if(this.passData.checkFlag !== undefined && this.passData.checkFlag){
                                console.log('here');
                                this.removeSelected(event, data);
                            }*/
                            this.indvSelect = data;
                        }
                   // }
                }
                else{
                     this.indvSelect = "";
                 }
                /*for(var i = 0; i < event.target.parentElement.children.length; i++) {
                    event.target.parentElement.children[i].style.backgroundColor = "";
                }
                event.target.parentElement.parentElement.style.backgroundColor = "#67b4fc";
                console.log(event.target.parentElement.parentElement);*/
            }
            else{
                 this.indvSelect = "";
                 this.nullRow = true;
            }
            //console.log(this.displayData);
            //console.log(this.passData.tableData);
            //console.log(this.indvSelect);
            this.rowClick.emit(data);
        }
    }

    selectAll(value){
        
        if(value){
            this.selected = [];
             for (let data of this.displayData) {
                if(data != this.fillData){
                    console.log('test');
                    data.checked = value;
                    this.selected.push(data);
                }
            }
            this.rowClick.emit(this.selected);
            this.refreshTable();
        }
        else{
            this.displayData = this.displayData.filter((a) => {
                if(a !== null){
                   a.checked = false; 
                   return true;
                } 
            });
            this.rowClick.emit({});
            this.selected = [];
            this.refreshTable();
        }
         
    }
    
    highlight(data){
        
        this.selected.push(data);
    }
    removeSelected(event, data){
        
        data.checked = event.target.checked;
        if(!event.target.checked){
            this.selected.splice(this.selected.indexOf(data), 1);
        }else{
            this.selected.push(data);
        }
        this.rowClick.emit(this.selected);
        
    }
    onRowDblClick(event,data) {
        
        if(!this.nullRow){
            this.rowDblClick.next(event);
            this.newRowDblClick.emit(data);
        }
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
        
        //OLD VERSION
        this.displayData = this.passData.tableData.filter((item) => this.dataKeys.some(key => item.hasOwnProperty(key) && new RegExp(searchString, 'gi').test(item[key])));
        for (var filt in filterObj) {    
            if (!filterObj[filt]["enabled"]) {continue;}
            this.displayData = this.displayData.filter(function(itm){
                return itm[filterObj[filt].key].toString().toLowerCase( ).includes(filterObj[filt].search.toLowerCase( ));
            })
        }
        this.addFiller();
    }

    pressEnterFilter(){
        $('#okFilter').trigger('click');
    }

    dbQuery(filterObj){
        
        //console.log(filterObj);
        this.searchQuery = [];
        for(var e of filterObj){
            if(e.enabled){
                //if(e.search !== undefined){
                    if(e.dataType === 'seq'){
                        let seqNo:string = "";
                          seqNo = e.search.split(/[-]/g)[0]
                          for (var i = 1; i < e.search.split(/[-]/g).length; i++) {
                           seqNo += '-' + parseInt(e.search.split(/[-]/g)[i]);
                         }
                         e.search = seqNo;
                         this.searchQuery.push(
                                 {
                                     key: e.key,
                                     search: e.search,
                                 }
                             );
                    }
                    else if(e.dataType === 'datespan' ){
                        this.searchQuery.push(
                            {
                                key: e.keys.from,
                                search: (e.keys.search === undefined || !e.enabled) ? '' : e.keys.search,
                            },
                             {
                                key: e.keys.to,
                                search: (e.keys.search2 === undefined || !e.enabled) ? '' : e.keys.search2,
                            }
                        );
                    }
                     else if(e.dataType === 'textspan' ){
                        this.searchQuery.push(
                            {
                                key: e.keys.from,
                                search: (e.keys.search === undefined || !e.enabled) ? '' : (e.keys.search).replace(/[^\d\.\-]/g, "") * 1,
                            },
                             {
                                key: e.keys.to,
                                search: (e.keys.search2 === undefined || !e.enabled) ? '' : (e.keys.search2).replace(/[^\d\.\-]/g, "") * 1,
                            }
                        );
                    }
                    else{
                        this.searchQuery.push(
                            {
                                key: e.key,
                                search: (e.search === undefined || !e.enabled) ? '' : e.search,
                            }
                        );
                    }
                    
                //}
                /*else{
                    this.searchQuery.push(
                        {
                            key: e.key,
                            search: (e.search === undefined || !e.enabled) ? '' : e.search,
                        }
                    );
                }*/
            }
            else if(!e.enabled && e.dataType === 'datespan'){
                   this.searchQuery.push(
                       {
                           key: e.keys.from,
                           search: '',
                       },
                        {
                           key: e.keys.to,
                           search: '',
                       }
                   );
            }
            else if(!e.enabled && e.dataType === 'textspan'){
                   this.searchQuery.push(
                       {
                           key: e.keys.from,
                           search: '',
                       },
                        {
                           key: e.keys.to,
                           search: '',
                       }
                   );
            }
            else{
                if(e.dataType === 'expire'){
                    e.search = (this.expireValue === undefined || 
                                this.expireValue === null || 
                                this.expireValue === '') ? '' : this.expireValue;
                    this.searchQuery.push(
                        {
                            key: e.key,
                            search: e.search.toString(),
                        }
                    );
                }
                else{
                    this.searchQuery.push(
                        {
                            key: e.key,
                            search: (e.search === undefined || !e.enabled) ? '' : e.search,
                        }
                    );
                }
            }
        }
        this.searchToDb.emit(this.searchQuery);
        this.loadingTableFlag = true;
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
        this.delete.next(event);
    }
    onClickCopy(event){

        //do some copying
        this.copy.next(event);
    }
    onClickSave(event){

        //do some saving
        this.save.next(event);
    }
    onClickPrint(event){

        //do some printing
        this.print.next(event);
    }
    onClickExport(event){
        //do some exporting
        this.export.next(event);
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
        let minusWidth = $(event.path[1]).outerWidth();
        let startWidth = $('#pinTable'+this.passData.pageID).outerWidth();
        if(this.pinKeys.length == 0)
            minusWidth += 30;
        $('#notPin'+this.passData.pageID).css('padding-left',startWidth-minusWidth);
    }

    onClickGeneric1(ev){
        
        this.gnrc1.emit(ev);
    }

    onClickGeneric2(ev){
        
        this.gnrc2.emit(ev);
    }
}