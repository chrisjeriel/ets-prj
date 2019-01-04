import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../_services';
import { AttachmentInfo } from '../../_models/Attachment';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
  providers: [NgbDropdownConfig]
})

export class AttachmentComponent implements OnInit {

 /* dtOptions: DataTables.Settings = {};*/
  tableData: any[] = [];
  tHeader: any[] = [];
  options: any[] = [];
  dataTypes: any[] = [];
  opts: any[] = [];
  checkFlag;
  selectFlag;
  addFlag;
  editFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  searchFlag;
  checkboxFlag;
  columnId;
  pageLength;
  editedData: any[] = [];
  nData: AttachmentInfo = new AttachmentInfo(null, null);
  test: boolean = true;
  private attachmentInfo: AttachmentInfo;

  passData: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: new AttachmentInfo(null, null),
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: false,
    infoFlag: false,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

  constructor(config: NgbDropdownConfig,
    private quotationService: QuotationService, private titleService: Title) {
    config.placement = 'bottom-right';
    config.autoClose = false;
    this.pageLength = 10;
  }

  ngOnInit(): void {

   /* this.titleService.setTitle("Quo | Attachment");
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
    this.tableData = this.quotationService.getAttachment();*/

    this.passData.tHeader.push("File Name");
    this.passData.tHeader.push("Description");
    this.passData.tHeader.push("Actions");
    this.passData.tableData = this.quotationService.getAttachment();

  }

}
