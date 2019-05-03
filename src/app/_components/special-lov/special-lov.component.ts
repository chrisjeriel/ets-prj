import { Component, OnInit, Input, Renderer, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { MaintenanceService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';


@Component({
  selector: 'app-special-lov',
  templateUrl: './special-lov.component.html',
  styleUrls: ['./special-lov.component.css']
})
export class SpecialLovComponent implements OnInit {
    
    
    @Output() selectedData: EventEmitter<any> = new EventEmitter();

    @ViewChild('paw') page: any;
    @ViewChild(ModalComponent) modal : ModalComponent;

    nullRow: boolean = false;
    unselect: boolean = false;

    passData: any = {
        tableData: [],   
        tHeader: ['Insured Id', 'Insured Name','Address'],
        dataTypes: ['sequence-3', 'text', 'text'],
		keys:['insuredId', 'insuredName','address'],
        resizable: [],     
        colSize: ['74px','374px','374px'],      
        tabIndexes: [],   
        pageLength: 10,         
        pageID: 1,
        dbKeys:['INSURED_ID','INSURED_NAME','ADDRESS']               
    }

    start:    any;
    pressed:  any;
    startX:   any;
    startWidth: any;
    autoFill: number[];

    sortBy:boolean = true;
    sortIndex:number;
    searchString: string = "";
    p:number = 1;
    checked:boolean;
    selected: any[] = [];
    indvSelect: any = "";
    fillData:any = {};

    loadingFlag:boolean = true;
    loadingTableFlag: boolean = false;

    count:number;

    modalOpen: boolean = false;

    constructor(config: NgbDropdownConfig, public renderer: Renderer, private mtnService:MaintenanceService) {
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
        
    }

    //when enter key is pressed

    ngOnInit(): void {}

    openModal(): void {
        this.modalOpen = true;
        this.fillData = new Object();
        for(let key of this.passData.keys){
            this.fillData[key] = "";
        }

        this.search();
        //temporary fix delete this later
        //setTimeout(()=>{this.loadingFlag = false;},2000)
    }

    request:any = {
        lovParam:'',
        count:'10',
        position:'1',
        sortKey:'',
        order:''
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
        }
    }

    
    
    highlight(data){
        
        this.selected.push(data);
    }
    

    sort(str,sortBy){
        this.request.sortKey = str;
        this.request.order = sortBy ? 'ASC' :'DESC';

        // this.passData.tableData = this.passData.tableData.sort(function(a, b) {
        //     if(sortBy){
        //         if(a[str] < b[str]) { return -1; }
        //         if(a[str] > b[str]) { return 1; }
        //     }else{
        //         if(a[str] < b[str]) { return 1; }
        //         if(a[str] > b[str]) { return -1; }
        //     }
        // });
        // this.mtnService.getMtnInsuredLov(this.request).subscribe(a=>{
        //     this.addFiller();
        //     this.placeData(a['list'])
        //     this.loadingFlag = false;
        // })
        this.search();
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
    
    

    search(){
        this.loadingTableFlag = true;
        this.request = {
            lovParam:this.searchString,
            count:this.passData.pageLength,
            position:'1',
            sortKey:this.request.sortKey,
            order:this.request.order
        }
        this.mtnService.getMtnInsuredLov(this.request).subscribe(a=>{
            this.count = a['count'];
            this.addFiller();
            this.placeData(a['list'])
            this.loadingFlag = false;
            this.loadingTableFlag = false;
        })
    }

    placeData(items){
        var start = (this.p - 1) * this.passData.pageLength;
        for(let itm of items){
            this.passData.tableData[start] = itm;
            start++;
        }
    }

    updatePage(){
        this.request.position = this.p;
        if(this.passData.tableData[(this.p - 1) * this.passData.pageLength] == this.fillData){
            this.loadingTableFlag = true;
        	this.mtnService.getMtnInsuredLov(this.request).subscribe(a=>{
        		this.placeData(a['list']);
        		this.loadingTableFlag = false;
        	})
        }
    }

    openLOV(){
      this.modal.openNoClose();
    }

    
    okBtnClick(){
      this.indvSelect.insuredId = this.pad(this.indvSelect.insuredId,6);
      this.selectedData.emit(this.indvSelect);
    
    }


  checkCode(code, id, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        insuredId: '',
        insuredName: '',
        ev: ev
      });
    } else {
      this.mtnService.getMtnInsured(code).subscribe(data => {
        if(data['insured'].length > 0) {
          data['insured'][0]['ev'] = ev;
          data['insured'][0].insuredId = this.pad(data['insured'][0].insuredId, 6); //Ensures 6 digit for insured ID
          this.selectedData.emit(data['insured'][0]);
        } else {
          this.selectedData.emit({
            insuredId: '',
            insuredName: '',
            ev: ev
          });        

          this.openLOV();
        }      
      });
    }
  }

  pad(str, num?) {
    if(str === '' || str == null){
      return '';
    }
    
    return String(str).padStart(num != null ? num : 3, '0');
  }

}