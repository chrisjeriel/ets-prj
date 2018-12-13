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
  pageLength:number;
  nData: AttachmentInfo = new AttachmentInfo(null, null);
  test:boolean =true;
  private attachmentInfo : AttachmentInfo;

  constructor(config: NgbDropdownConfig,
  			  private quotationService: QuotationService) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
     this.pageLength = 10;
  }

  ngOnInit() : void {

  	this.tHeader.push("File Name");
  	this.tHeader.push("Description");
  	this.tHeader.push("Actions");

  	// this.options.push("");
  	// this.options.push("Q - Quotation");
  	// this.options.push("P - Policy");
  	// this.options.push("C - Claim");
  	// this.options.push("A - Accounting");

  	// this.dataTypes.push("text");
  	// this.dataTypes.push("text");
  	// this.dataTypes.push("select1");
  	// this.dataTypes.push("text");

    this.tableData = this.quotationService.getAttachment();
  }

  clickk(){
     $(document).ready(function(){
        $(".checkk").click(function(){            
            $('input[type="checkbox"]').attr("checked", "checked");
        });
    });
  }
}
