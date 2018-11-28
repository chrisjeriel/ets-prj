import { Component, OnInit, Input } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';



@Component({
  selector: 'app-cust-table',
  templateUrl: './cust-table.component.html',
  styleUrls: ['./cust-table.component.css'],
  providers: [NgbDropdownConfig]
})
export class CustTableComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  @Input() tableData: any[] = [];
  @Input() tHeader: any[] = [];
  dataKeys: any[] = [];

  constructor(config: NgbDropdownConfig) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() : void {

  	this.dtOptions = {
  	  pagingType: 'full_numbers'
    };

    if (this.tableData.length > 0) {
    	this.dataKeys = Object.keys(this.tableData[0]);
    } else {
    	this.tHeader.push("No Data");
    }
  }

  processData(key: any, data: any) {
  	return data[key];
  }

}
