import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../_services';
import { AttachmentInfo } from '../../_models';


@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
  providers: [NgbDropdownConfig]
})
export class AttachmentComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  tableData: any[] = [];
  tHeader: any[] = [];


  constructor(config: NgbDropdownConfig,
  			  private quotationService: QuotationService) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit() : void {
  	this.tHeader.push("File Path");
  	this.tHeader.push("Description");
  	this.tHeader.push("Table Code");
  	this.tHeader.push("Actions");

  	this.dtOptions = {
  	  pagingType: 'full_numbers'
    };

    this.tableData = this.quotationService.getAttachment();
  }

}
