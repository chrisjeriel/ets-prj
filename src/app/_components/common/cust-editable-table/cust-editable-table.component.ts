import { Component, OnInit, Input, Output, EventEmitter, Renderer } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cust-editable-table',
  templateUrl: './cust-editable-table.component.html',
  styleUrls: ['./cust-editable-table.component.css'],
  providers: [NgbDropdownConfig]
})
export class CustEditableTableComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
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

  @Input() checkboxFlag;
  @Input() columnId;

  @Input() editedData: any[] = [];
  @Output() editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  dataKeys: any[] = [];
  
  tableLoad: boolean = true;
  nextId: number = 0;
  exists:Boolean = false;

  start:    any;
  pressed:  any;
  startX:   any;
  startWidth: any;
  
  constructor(config: NgbDropdownConfig, public renderer: Renderer) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() : void {
    /*$(document).ready(function(){
      $("#sample2").colResizable({liveDrag:true});
    }); */

  	this.dtOptions = {
  	  pagingType: 'full_numbers',
  	  lengthChange: false,
  	  info: false,
  	  ordering: true,
    };

    if (this.tableData.length > 0) {
    	this.dataKeys = Object.keys(this.nData);
    } else {
    	this.tHeader.push("No Data");
    }

  }

  processData(key: any, data: any) {
  	return data[key];
  }

  onClickAdd() {
  	this.tableData.push(this.nData);
  }

  onClickDelete() {
  	this.tableData.pop();
  }

  onChange(row:any,index:number,key:any,data:any){
    
    for(var i= 0; i < this.editedData.length; i++){
      if(this.editedData[i][this.columnId]==row[this.columnId]){
        this.editedData[i][key]=data;
        this.exists=true;
      }
    }
    this.tableData[index][key]=data;
    if(!this.exists){
      this.editedData.push(row);
    }
  }

  private onMouseDown(event){
      console.log(event);
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

}
