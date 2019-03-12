import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttachmentInfo } from '@app/_models';
import { QuotationService } from '@app/_services';
import { Title } from '@angular/platform-browser';

import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-attachment-oc',
  templateUrl: './attachment-oc.component.html',
  styleUrls: ['./attachment-oc.component.css']
})
export class AttachmentOcComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) custEditableNonDatatableComponent : CustEditableNonDatatableComponent;

  passData: any = {
    tableData: [],
    tHeader: ['File Name', 'Description', 'Actions'],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {
              fileNo: 0,
              fileName: '',
              description: '',
              createUser: 'NDC',
              createDate: [0,0,0],
              updateUser: 'NDC',
              updateDate: [0,0,0]
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
    widths: ['auto','auto',1],
    keys: ['fileName', 'description'],
  };

  data: any;
  savedData: any[];
  deletedData: any[];

  @Input() inquiryFlag: boolean = false;

  @Input() quoteData: any = {};

  constructor(private titleService: Title, private quotationService: QuotationService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.titleService.setTitle("Quo-OC | Attachment");
  	/*this.quotationService.getAttachmentOc().subscribe((data: any) => {
        this.data = data;
        for(var i = 0; i < this.data.quotationOc.length; i++){
          this.passData.tableData.push(
            new AttachmentInfo(this.data.quotationOc[i].attachmentOc[0].fileName, this.data.quotationOc[i].attachmentOc[0].description)
          );
        }
        this.custEditableNonDatatableComponent.refreshTable();
      }
    );*/
     if(this.inquiryFlag){
          this.passData.tHeader.pop();
          this.passData.opts = [];
          this.passData.uneditable = [];
          this.passData.magnifyingGlass = [];
          this.passData.addFlag = false;
          this.passData.deleteFlag = false;
          for(var count = 0; count < this.passData.tHeader.length; count++){
            this.passData.uneditable.push(true);
          }
        }
    let params = {

    }
    this.quotationService.getAttachmentOc(this.quoteData.quoteIdOc, '').subscribe((data: any) => {
        this.data = data.quotationOc[0].attachmentOc;
        // this.passData.tableData = data.quotation.project.coverage.sectionCovers;
        for (var i = 0; i < this.data.length; i++) {
          this.passData.tableData.push(this.data[i]);
        }
        this.custEditableNonDatatableComponent.refreshTable();
    });
  }

  saveData(){
    this.savedData = [];
    this.deletedData = [];
    /*for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].createDate = new Date().toISOString();
          this.savedData[this.savedData.length-1].updateDate = new Date().toISOString();
          this.savedData[this.savedData.length-1].createUser = "NDC";
          this.savedData[this.savedData.length-1].updateUser = "NDC";
          console.log(this.data);
        }
    }*/
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          //this.savedData[this.savedData.length-1].createDate = new Date(this.savedData[this.savedData.length-1].createDate[0],this.savedData[this.savedData.length-1].createDate[1]-1,this.savedData[this.savedData.length-1].createDate[2]).toISOString();
          //this.savedData[this.savedData.length-1].updateDate = new Date(this.savedData[this.savedData.length-1].updateDate[0],this.savedData[this.savedData.length-1].updateDate[1]-1,this.savedData[this.savedData.length-1].updateDate[2]).toISOString();
          //this.savedData[this.savedData.length-1].fileNo = 0;
          this.savedData[this.savedData.length-1].createDate = new Date().toISOString();
          this.savedData[this.savedData.length-1].updateDate = new Date().toISOString();
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].createDate = new Date().toISOString();
         this.deletedData[this.deletedData.length-1].updateDate = new Date().toISOString();
      }

    }
    //console.log(this.savedData);
    this.quotationService.saveQuoteAttachmentOc(this.quoteData.quoteIdOc,this.savedData,this.deletedData).subscribe((data: any) => {

      $('#successModalBtn').trigger('click');
      this.custEditableNonDatatableComponent.refreshTable();
    });
  }

  cancel(){
  }

  onClickSave(){
  $('#confirm-save #modalBtn2').trigger('click');
}

}
