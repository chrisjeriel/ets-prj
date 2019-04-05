import { Component, OnInit, Input, Output, EventEmitter, Renderer, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { DummyInfo } from '../../../_models';
import { FormsModule }   from '@angular/forms';
import { NotesService, UploadService } from '@app/_services';

@Component({
    selector: 'app-cust-editable-non-datatable',
    templateUrl: './cust-editable-non-datatable.component.html',
    styleUrls: ['./cust-editable-non-datatable.component.css'],
    providers: [NgbDropdownConfig]
})
export class CustEditableNonDatatableComponent implements OnInit {
    @ViewChild("deleteModal") deleteModal:ModalComponent;
    @ViewChild('myForm') form:any;
    @ViewChild('api') pagination: any;
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
    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() newClick: EventEmitter<any> = new EventEmitter();
    @Output() rowDblClick: EventEmitter<any> = new EventEmitter();
    @Output() add: EventEmitter<any> = new EventEmitter();
    @Output() edit: EventEmitter<any> = new EventEmitter();
    @Output() genericBtn : EventEmitter<any> = new EventEmitter();
    @Output() uploadedFiles : EventEmitter<any> = new EventEmitter();

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
        widths: [],
        //use if you have different tables in 1 page
        pageID:1,
        keys:[],
        tabIndexes:[]
    };
    indvSelect: any;
    dataKeys: any[] = [];
    tableLoad: boolean = true;
    nextId: number = 0;
    exists:Boolean = false;

    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;
    autoFill: number[];
    selected: any[] = [];
    fileName: string ='';

    displayData:any[] = [];
    newData: any = new DummyInfo(null,null,null,null,null,null,null);
    sortBy:boolean = true;
    sortIndex:number;
    searchString: string;
    displayLength: number;
    p:number = 1;
    p2:number = 1;
    fillData:any = {};
    checked: boolean;
    @Input() totalFlag = false;
    @Input() widths: string[] = [];
    unliFlag:boolean = false;
    @Output() clickLOV: EventEmitter<any> = new EventEmitter();
    constructor(config: NgbDropdownConfig, public renderer: Renderer, private appComponent: AppComponent,private modalService: NgbModal,private ns: NotesService, private up: UploadService) { 
        config.placement = 'bottom-right';
        config.autoClose = false;
    }
    loadingFlag: boolean = true;
    @Output() retrieveData: EventEmitter<any> = new EventEmitter();
    failed: boolean = false;
    isDirty: boolean = false;
    selectAllFlag:boolean = false;
    @Input() tabIndex: string[] = []; //0 - Tabbable | -1 - Untabbable

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
            this.passData.tableData[i].edited = this.passData.tableData[i].edited ? true : false;
            this.passData.tableData[i].checked = this.passData.tableData[i].checked ? true : false;
            if(!this.passData.tableData[i].deleted){
                this.displayData.push(this.passData.tableData[i]);
            }
        }
        //this.displayData = JSON.parse(JSON.stringify( this.passData.tableData));
        //this.displayLength = this.displayData.length;
        this.unliTableLength();
        this.addFiller();
        //this.appComponent.ngOnInit();
    }

    ngOnInit() {
        this.passData.magnifyingGlass = typeof this.passData.magnifyingGlass == 'undefined'? [] : this.passData.magnifyingGlass;
        this.unliFlag = typeof this.passData.pageLength == "string" && this.passData.pageLength.split("-")[0] == 'unli';
        this.passData.pageLength = typeof this.passData.pageLength == 'number' ? this.passData.pageLength : (this.passData.pageLength===undefined || this.passData.pageLength.split("-")[1]===undefined? 10 : parseInt(this.passData.pageLength.split("-")[1]));
        this.unliTableLength();
        this.passData.dataTypes = typeof this.passData.dataTypes == 'undefined' ? [] : this.passData.dataTypes;

        if (this.passData.tableData.length > 0 && this.dataKeys.length == 0 && this.passData.keys === undefined) {
            this.dataKeys = Object.keys(this.passData.tableData[0]);
        } else if(this.passData.keys !== undefined){
            this.dataKeys = this.passData.keys;
        }else{
            this.dataKeys = [];
        }
        if(this.passData.tableData.length != 0)
            this.loadingFlag = false;

        // if(this.dataKeys.indexOf('edited') != -1){
        //   this.dataKeys.pop();
        // }
        // if(this.dataKeys.indexOf('checked') != -1){
        //   this.dataKeys.pop();
        // }
        // if(this.dataKeys.indexOf('deleted') != -1){
        //   this.dataKeys.pop();
        // }

       if(this.dataKeys!==undefined && this.dataKeys.indexOf('edited') != -1){
         this.dataKeys.splice(this.dataKeys.indexOf('edited'),1);
       }
       if(this.dataKeys!==undefined && this.dataKeys.indexOf('checked') != -1){
         this.dataKeys.splice(this.dataKeys.indexOf('checked'),1);
       }
       if(this.dataKeys!==undefined && this.dataKeys.indexOf('deleted') != -1){
         this.dataKeys.splice(this.dataKeys.indexOf('deleted'),1);
       }

        this.refreshTable('first');
        // this.autoFill = Array(this.passData.pageLength).fill(this.newData);
        // if(this.displayData.length%this.passData.pageLength != 0){
        //     this.autoFill = Array(this.passData.pageLength - this.displayData.length%this.passData.pageLength).fill(this.newData);
        // }
        // if(typeof this.autoFill != "undefined")
        //     this.displayData = this.displayData.concat(this.autoFill);

        
        for (var i = this.dataKeys.length - 1; i >= 0; i--) {
           this.fillData[this.dataKeys[i]] = null;
        }

        for(var filt in this.passData.filterObj){
            this.passData.filterObj[filt].search='';
            this.passData.filterObj[filt].enabled=false;
        }
        this.retrieveFromSub();
        // this.addFiller();
        if(this.passData.nData !== undefined)
            this.passData.nData.add = true;
        //temporary fix delete this later
        setTimeout(()=>{this.refreshTable()},2000)
        
    }

    processData(key: any, data: any) {
        return data[key];
    }

    onClickAdd(event) {
        this.passData.tableData.push(JSON.parse(JSON.stringify(this.passData.nData)));
        this.passData.tableData[this.passData.tableData.length-1].edited = true;
        this.unliTableLength();    
        this.search(this.searchString);
        this.tableDataChange.emit(this.passData.tableData);
        this.add.next(event);
        if(this.passData.paginateFlag){
            setTimeout(a=>{this.pagination.setCurrent(this.pagination.getLastPage())},0);
        }
        this.form.control.markAsDirty();
    }

    onClickDelete() {
        // for (var i = 0; i < this.passData.tableData.length; ++i) {
        //     if(this.passData.tableData[i].checked){
        //         this.passData.tableData[i].checked = false;
        //         this.passData.tableData[i].deleted = true;
        //         this.passData.tableData[i].edited = true;
        //     }
        // }
        for(let i = 0; i<this.selected.length;i++){
           if(!this.selected[i].add){
               this.selected[i].checked = false;
               this.selected[i].deleted = true;
               this.selected[i].edited = true;
           }else {
               this.passData.tableData = this.passData.tableData.filter(a => a!= this.selected[i])
               if(this.filesToUpload.length !== 0){
                   this.filesToUpload = this.filesToUpload.filter(b => b[0].name != this.selected[i].fileName);
               }
           }

        }
        console.log(this.selected);
        console.log(this.filesToUpload);
        this.selectAllFlag = false;
        this.form.control.markAsDirty();
        $('#cust-scroll').addClass('ng-dirty');
        this.selected = [];
        this.refreshTable();
        this.search(this.searchString);
        this.tableDataChange.emit(this.passData.tableData);
        this.uploadedFiles.emit(this.filesToUpload);
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
                $(this.start).parent().css({'min-width': width, 'max-width': width,'width':width});
                let index = $(this.start).parent().index() + 1;
                $('#non-datatable tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width,'width':width});
            }
        });
        this.renderer.listenGlobal('body', 'mouseup', (event) => {
            if(this.pressed) {
                this.pressed = false;
            }
        });
    }

    onRowClick(event,data) {
        if(data != this.fillData && data != this.indvSelect){
            this.indvSelect = data;
        }else if(data != this.fillData && data == this.indvSelect){
            this.indvSelect = null;
        }
        if(data != this.fillData)
            setTimeout(() => this.newClick.emit(this.indvSelect),0) ;
        //this.rowClick.next(event);
        
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
        // if($('.ng-dirty').length != 0){
        //     $('#cust-table-container').addClass('ng-dirty');
        // }
        this.sortBy = !this.sortBy;
        this.search(this.searchString);
   
    }

    showSort(sortBy,i){
        return sortBy && i==this.sortIndex;
    }

    search(event){
        this.displayData = this.passData.tableData.filter((item) => this.dataKeys.some(key => !item.deleted && item.hasOwnProperty(key) && new RegExp(event, 'gi').test(item[key])));
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
            this.passData.pageLength = this.passData.tableData.length <= this.passData.pageLength ? this.passData.pageLength :this.passData.tableData.length;
        }
        
    }

   format(event,data, key,dataType?){
       let temp:string = event.target.value;
       if(dataType == 'percent' && parseFloat(temp)>100){
           temp = '100';
       }
       if(event.target.value.indexOf('(')!= -1){
           temp = '-'+temp.substring(1,event.target.value.length-1);
       }
       if(data[key] != parseFloat(temp.split(',').join(''))){
           data[key] = parseFloat(temp.split(',').join('')) ;
       }
   }

   addClicked(event) {
       this.add.next(event);
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

    onClickGeneric(){
        this.genericBtn.emit(this.indvSelect);
    }

    typeOf(data){
        return typeof data;
    }


    filterDisplay(filterObj,searchString){
        this.displayData = this.passData.tableData.filter((item) => this.dataKeys.some(key => item.hasOwnProperty(key) && new RegExp(searchString, 'gi').test(item[key])));
        for (var filt in filterObj) {    
            if (!filterObj[filt]["enabled"]) {continue;}
            this.displayData = this.displayData.filter(function(itm){
                return itm[filterObj[filt].key].toString().toLowerCase( ).includes(filterObj[filt].search.toLowerCase( ));
            })
        }
        this.addFiller();
    }


    onDataChange(ev,data,key){
        // if($(ev.target).next().children().prop("tagName") === 'A') {
        if($(ev.target).hasClass('lovInput')) {
            let retData:any = {};
            retData.key = key;
            retData.tableData = this.passData.tableData;
            for (var i = this.passData.tableData.length - 1; i >= 0; i--) {
                if(data == this.passData.tableData[i]){
                    retData.index = i;
                    break;
                }
            }

            this.ns.lovLoader(ev, 1);
            this.passData.tableData['ev'] = ev;
            this.passData.tableData['index'] = retData.index;
            this.passData.tableData['lovInput'] = true;
        } else {
            delete this.passData.tableData.ev;
            delete this.passData.tableData.index;
            delete this.passData.tableData.lovInput;
        }

        data.edited = true;
        setTimeout(() => { 
            this.tableDataChange.emit(this.passData.tableData),0
            delete this.passData.tableData.ev;
            delete this.passData.tableData.index;
            delete this.passData.tableData.lovInput;
        });
    }



    onClickLOV(data,key){
        let retData:any = {};
        retData.key = key;
        retData.tableData = this.passData.tableData;
        for (var i = this.passData.tableData.length - 1; i >= 0; i--) {
            if(data == this.passData.tableData[i]){
                retData.index = i;
                break;
            }
        }
        retData.data = data;
        this.form.control.markAsDirty();
        this.clickLOV.emit(retData);
    }

    removeSelected(event, data){
        data.checked = event.target.checked;
        if(!event.target.checked){
            this.selected.splice(this.selected.indexOf(data), 1);
        }else{
            this.selected.push(data);
        }
        
    }

    assignChckbox(event,data,key){
        if(typeof data[key] == 'boolean')
            data[key] = event.target.checked;
        else
            data[key] = event.target.checked ? 'Y' : 'N';
    }

    retrieveFromSub(){
        this.loadingFlag =true;
        this.failed = false;
        if(this.passData.observable !== undefined){
            this.passData.observable.subscribe(
                (data:any)=>{this.retrieveData.emit(data);this.failed=false;this.loadingFlag=false},
                (err) => {this.failed=true;this.loadingFlag=false});
        }
    }

    selectAll(value){
        for (let data of this.displayData) {
            if(data != this.fillData){
                data.checked = value;
                this.selected.push(data);
            }
        }
        if(!value){
            this.selected = this.selected.filter(a=>false);
        }
        this.refreshTable();
    }

    confirmDelete(){
        if(this.selected.length != 0 ){
            $('#confirm-delete'+this.passData.pageID+' #modalBtn2').trigger('click');
        }
    }

    closeModal(){
        this.deleteModal.closeModal()
    }

    //upload
    filesToUpload: any[] = [];
    upload(data,event){
        data.fileName=event.target.files[0].name;
        data.edited=true;
        this.form.control.markAsDirty();
        this.filesToUpload.push(event.target.files);
        console.log(this.filesToUpload);
        this.uploadedFiles.emit(this.filesToUpload);
    }

    //download
    download(file){
        console.log(file);
        /*this.up.downloadFile(file).subscribe((data: any)=>{
           var newBlob = new Blob([data], { type: "application/pdf" });
           var downloadURL = window.URL.createObjectURL(data);
           console.log(downloadURL);
           window.open(downloadURL);
        },
        error =>{
            console.log(error);
        });*/
        let url = this.up.downloadFile(file);
        //window.open(url);
        var link = document.createElement('a');
        link.href = url;
        link.download = file;
        link.click();
    }

    /*downloadFile(data) {
        console.log("here");
      const blob = new Blob([data], { type: 'application/text' });
      const url= window.URL.createObjectURL(data);
      window.open(url);
    }*/

    markAsPristine(){
        this.form.control.markAsPristine();
    }

    markAsDirty(){
        this.form.control.markAsDirty();
    }

 
}
