import { Component, OnInit, ViewChild } from '@angular/core';
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
    widths: ['auto','auto',1],
    keys: ['filePath', 'description'],
  };

  data: any;
  savedData: any[];

  constructor(private titleService: Title, private quotationService: QuotationService) { }

  ngOnInit() {
  	this.titleService.setTitle("Quo-OC | Attachment");
  	this.quotationService.getAttachmentOc().subscribe((data: any) => {
        this.data = data;
        for(var i = 0; i < this.data.quotationOc.length; i++){
          this.passData.tableData.push(
            new AttachmentInfo(this.data.quotationOc[i].attachmentOc[0].fileName, this.data.quotationOc[i].attachmentOc[0].description)
          );
        }
        this.custEditableNonDatatableComponent.refreshTable();
      }
    );
  }

  saveData(){
    this.savedData = [];
    
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].createDate = new Date().toISOString();
          this.savedData[this.savedData.length-1].updateDate = new Date().toISOString();
          this.savedData[this.savedData.length-1].createUser = "NDC";
          this.savedData[this.savedData.length-1].updateUser = "NDC";
          console.log(this.savedData);
        }
      // delete this.savedData[i].tableIndex;
    }
    this.quotationService.saveQuoteAttachmentOc(1,this.savedData).subscribe((data: any) => {});
  }

  cancel(){
    console.log(this.passData.tableData);
  }

}
