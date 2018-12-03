import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../_services';
import { AttachmentInfo } from '../../_models/Attachment';


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
  options: any[] = [];
  dataTypes: any[] = [];
  nData: AttachmentInfo = new AttachmentInfo(null, null);

  private attachmentInfo : AttachmentInfo;

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

  	this.options.push("");
  	this.options.push("Q - Quotation");
  	this.options.push("P - Policy");
  	this.options.push("C - Claim");
  	this.options.push("A - Accounting");

  	// this.dataTypes.push("text");
  	// this.dataTypes.push("text");
  	// this.dataTypes.push("select1");
  	// this.dataTypes.push("text");

    this.tableData = this.quotationService.getAttachment();
  }

}
