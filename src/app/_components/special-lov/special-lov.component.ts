import { Component, OnInit, Input, Renderer, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { MaintenanceService } from '@app/_services';


@Component({
  selector: 'app-special-lov',
  templateUrl: './special-lov.component.html',
  styleUrls: ['./special-lov.component.css']
})
export class SpecialLovComponent implements OnInit {
    
    
    unselect: boolean = false;

    nullRow: boolean = false;

    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() rowDblClick: EventEmitter<any> = new EventEmitter();
    @Output() newRowDblClick: EventEmitter<any> = new EventEmitter();

    @ViewChild('paw') page: any;

 
    passData: any = {
        tableData: [],          //REQUIRED. 
        tHeader: ['Insured Id', 'Insured Name','Address'],
        dataTypes: ['sequence-3', 'text', 'text'],
		keys:['insuredId', 'insuredName','address'],
        resizable: [],     
        colSize: [],      
        tabIndexes: [],   
        pageLength: 10,         
        pageID: 1,               
    }

    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;
    autoFill: number[];

    sortBy:boolean = true;
    sortIndex:number;
    searchString: string;
    p:number = 1;
    checked:boolean;
    selected: any[] = [];
    indvSelect: any;
    fillData:any = {};
    nullKey: any;
    keyCounter: number = 0;

    loadingFlag:boolean = true;
    loadingTableFlag: boolean = false;

    count:number;

    constructor(config: NgbDropdownConfig, public renderer: Renderer, private appComponent: AppComponent, private mtnService:MaintenanceService) {
        config.placement = 'bottom-right';
        config.autoClose = false;
        
    }
    currentIndex: number;
    tablePress(event: KeyboardEvent, data: any, index){

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
        
        this.rowClick.emit(this.indvSelect);
    }

    //when enter key is pressed

    ngOnInit(): void {
        

        if(this.passData.tableData.length != 0)
            this.loadingFlag = false;
        


        this.updateData();
        //temporary fix delete this later
        //setTimeout(()=>{this.loadingFlag = false;},2000)
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
            if(this.pressed) {
                this.pressed = false;
            }
        });
    }

    onRowClick(event, data, index?) {
        this.currentIndex = index + ((this.p - 1) * this.passData.pageLength );   //this.p is the current page number

        if(this.passData.checkFlag === undefined || !this.passData.checkFlag){
            if(data !== null){
                this.nullRow = false;
                if( Object.entries(data).length !== 0){
                        if(this.indvSelect == data){
                            this.unselect = true;
                            this.indvSelect = "";
                            data = {};
                        }else{
                           
                            this.indvSelect = data;
                        }
                }
                else{
                     this.indvSelect = "";
                 }
            }
            else{
                 this.indvSelect = "";
                 this.nullRow = true;
            }
            this.rowClick.emit(data);
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
    }

    showSort(sortBy,i){
        
        return sortBy && i==this.sortIndex;
    }

    

    addFiller(){
        
        this.passData.tableData = Array(this.count + this.passData.pageLength - (this.count%this.passData.pageLength)).fill(this.fillData);
        // if(this.passData.tableData.length%this.passData.pageLength != 0){
        //     this.autoFill = Array().fill(this.fillData);
        // }
        //this.passData.tableData = this.passData.tableData.length;
        // if((typeof this.autoFill != "undefined" && this.passData.tableData.length%this.passData.pageLength != 0) || this.passData.tableData.length==0)
        //     this.passData.tableData = this.passData.tableData.concat(this.autoFill);
    }

    addCheckFlag(cell){
        
        return !(cell===this.fillData);
    }
    
    request:any = {
    	lovParam:'',
    	count:'10',
    	position:'1',
    	sortKey:'',
    	order:''
    }

    updateFiller(){

    }

    updateData(){
    	this.loadingFlag = true;
    	this.mtnService.getMtnInsuredLov(this.request).subscribe(a=>{
    		this.count = a['count'];
    		var start = (this.p - 1) * this.passData.pageLength + 1
    		for(let itm of a['list']){
    			this.passData.tableData[start] = itm;
    			start++;
    		}
    		this.addFiller();
    		this.passData.tableData = a['list'].concat(this.autoFill);
    		this.loadingFlag = false;
    	})
    }

}