import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() nData;
  @Input() checkFlag;
  @Input() selectFlag;
  @Input() addFlag;
  @Input() editFlag;
  @Input() deleteFlag;
  @Input() checkboxFlag;
  dataKeys: any[] = [];
  
  tableLoad: boolean = true;
  nextId: number = 0;
  editedData:any[] = [];
  @Output() editedDataChange:EventEmitter<any[]> = new EventEmitter<any[]>();
  
  constructor(config: NgbDropdownConfig) { 
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

  onChange(row:any){
    for(var _i = 0; _i < this.editedData.length; _i++){
      if(this.editedData[_i][0]==row[0])
        this.editedData.splice(_i,1);
    }
    this.editedData.push(row);
  }
}
