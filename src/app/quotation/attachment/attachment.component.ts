import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../../_services';
import { AttachmentInfo } from '../../_models/Attachment';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'


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
    nData: new AttachmentInfo(null, null),
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
  
  constructor(config: NgbDropdownConfig,
    private quotationService: QuotationService, private titleService: Title) {
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
    
    this.quotationService.getAttachment('1').subscribe((data: any) => {
        this.attachmentData = data.quotation[0].attachmentsList;
        console.log(data);
        // this.passData.tableData = data.quotation.project.coverage.sectionCovers;
        for (var i = 0; i < this.attachmentData.length; i++) {
          this.passData.tableData.push(this.attachmentData[i]);
        }
        this.table.refreshTable();
    });
  }

  saveData(){
    this.savedData = [];

    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData.edited){
          this.savedData.push(this.passData.tableData[this.editedData[i]]);
          this.savedData[i].createDate = new Date(this.savedData[i].createDate[0],this.savedData[i].createDate[1]-1,this.savedData[i].createDate[2]).toISOString();
          this.savedData[i].updateDate = new Date(this.savedData[i].updateDate[0],this.savedData[i].updateDate[1]-1,this.savedData[i].updateDate[2]).toISOString();
        }
      // delete this.savedData[i].tableIndex;
    }
    this.quotationService.saveQuoteAttachment(1,this.savedData).subscribe((data: any) => {});
    console.log(this.savedData);  

  }

  cancel(){
    console.log(this.savedData);
  }

}
