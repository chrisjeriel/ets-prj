import { Component, OnInit, Input } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';


@Component({
  selector: 'app-cust-editable-table',
  templateUrl: './cust-editable-table.component.html',
  styleUrls: ['./cust-editable-table.component.css'],
  providers: [NgbDropdownConfig]
})
export class CustEditableTableComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  @Input() tableData: any[] = [];
  @Input() tHeader: any[] = [];
  @Input() nData;
  @Input() addFlag;
  @Input() editFlag;
  @Input() deleteFlag;
  dataKeys: any[] = [];
  
  tableLoad: boolean = true;
  nextId: number = 0;

  constructor(config: NgbDropdownConfig) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() : void {

  	this.dtOptions = {
  	  pagingType: 'full_numbers',
  	  lengthChange: false,
  	  info: false,
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

}
