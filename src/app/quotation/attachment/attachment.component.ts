import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../_services';
import { AttachmentInfo } from '../../_models/Attachment';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
  providers: [NgbDropdownConfig]
})

export class AttachmentComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
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
  test: boolean = false;
  attachmentInfoData: AttachmentInfo[] = [];
  private attachmentInfo: AttachmentInfo;


  attachmentData: any;
  passData: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {
      createDate: [0,0,0],
      createUser: "PCPR",
      description: null,
      fileName: null,
      fileNo: null,
      updateDate: [0,0,0],
      updateUser: "PCPR"
    },
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 10,
    widths: [],
    keys:['fileName','description']
  };
  savedData: any[];
  deletedData: any[];
  sub:any;
  quotationNo: string;
  quoteId: string;
  @Input() quotationInfo: any = {};
  quoteNo: string = '';
  
  constructor(config: NgbDropdownConfig,
    private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute) {
    config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit(): void {

    this.titleService.setTitle("Quo | Attachment");
    /*this.tHeader.push("File Name");
    this.tHeader.push("Description");
    this.tHeader.push("Actions");*/
    // this.options.push("");
    // this.options.push("Q - Quotation");
    // this.options.push("P - Policy");
    // this.options.push("C - Claim");
    // this.options.push("A - Accounting");
    // this.dataTypes.push("text");
    // this.dataTypes.push("text");
    // this.dataTypes.push("select1");
    // this.dataTypes.push("text");
    /*this.tableData = this.quotationService.getAttachment();*/

    this.passData.tHeader.push("File Name");
    this.passData.tHeader.push("Description");
    this.passData.tHeader.push("Actions");

    /*let arrayData = [];
    this.quotationService.getAttachment().subscribe((data: any) => {
      for (var i = 0; i <  data.quotation.length ; i++) {
        arrayData.push(new AttachmentInfo(data.quotation[i].attachment.fileName, data.quotation[i].attachment.description));
      }
     });
    this.passData.tableData = arrayData;
*/
  this.quotationNo = this.quotationInfo.quotationNo;
  this.quoteNo = this.quotationNo.split(/[-]/g)[0]
  for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
     this.quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
   } 
    
    this.getAttachment();
  }

  getAttachment(){
    this.quotationService.getAttachment(null,this.quoteNo).subscribe((data: any) => {
      this.quoteId = data.quotation[0].quoteId;
        this.attachmentData = data.quotation[0].attachmentsList;
        // this.passData.tableData = data.quotation.project.coverage.sectionCovers;
        this.passData.tableData = this.attachmentData;
        this.table.refreshTable();
    });
  }

  saveData(){
    this.savedData = [];
    this.deletedData = [];
    
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].createDate = new Date(this.savedData[this.savedData.length-1].createDate[0],this.savedData[this.savedData.length-1].createDate[1]-1,this.savedData[this.savedData.length-1].createDate[2]).toISOString();
          this.savedData[this.savedData.length-1].updateDate = new Date(this.savedData[this.savedData.length-1].updateDate[0],this.savedData[this.savedData.length-1].updateDate[1]-1,this.savedData[this.savedData.length-1].updateDate[2]).toISOString();
      }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
        this.deletedData.push(this.passData.tableData[i]);
        this.deletedData[this.deletedData.length-1].createDate = new Date(this.deletedData[this.deletedData.length-1].createDate[0],this.deletedData[this.deletedData.length-1].createDate[1]-1,this.deletedData[this.deletedData.length-1].createDate[2]).toISOString();
        this.deletedData[this.deletedData.length-1].updateDate = new Date(this.deletedData[this.deletedData.length-1].updateDate[0],this.deletedData[this.deletedData.length-1].updateDate[1]-1,this.deletedData[this.deletedData.length-1].updateDate[2]).toISOString();
      }
      // delete this.savedData[i].tableIndex;
    }
    this.quotationService.saveQuoteAttachment(this.quoteId,this.savedData,this.deletedData).subscribe((data: any) => {
      $('#successModalBtn').trigger('click');
      this.getAttachment();
    });
  }

  cancel(){
    console.log(this.passData.tableData);
  }

}
