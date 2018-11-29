import { Component, OnInit, Input } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cust-editable-non-datatable-table',
  templateUrl: './cust-editable-non-datatable-table.component.html',
  styleUrls: ['./cust-editable-non-datatable-table.component.css']
})
export class CustEditableNonDatatableTableComponent implements OnInit {

  @Input() tableData: any[] = [];
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

  constructor(config: NgbDropdownConfig) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() {
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
  
  sortColumn(key:any){
    console.log(key);
  }
}
