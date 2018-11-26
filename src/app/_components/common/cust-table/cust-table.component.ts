import { Component, OnInit } from '@angular/core';
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
  tableData: any[] = [];
  tHeader: any[] = [];

  constructor(config: NgbDropdownConfig,
  			  private quotationService: QuotationService) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() : void {

  	this.tHeader.push("Id");
  	this.tHeader.push("First Name");
  	this.tHeader.push("Last Name");
  	this.tHeader.push("Middle Name");
  	this.tHeader.push("Gender");
  	this.tHeader.push("Age");
  	this.tHeader.push("Birth Date");

  	console.log(this.tHeader);

  	this.dtOptions = {
  	  pagingType: 'full_numbers'
    };

    this.tableData = this.quotationService.getDummyInfo();
  }

}
