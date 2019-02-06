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
    widths: ['auto', 'auto', 1],
    keys: ['filePath', 'description'],
  };

  data: any;

  constructor(private titleService: Title, private quotationService: QuotationService) { }

  ngOnInit() {
  	this.titleService.setTitle("Quo-OC | Attachment");
  	this.quotationService.getAttachmentOc().subscribe((data: any) => {
        this.data = data;
        for(var i = 0; i < this.data.quotationOc.length; i++){
          this.passData.tableData.push(
            new AttachmentInfo(this.data.quotationOc[i].attachment[0].fileName, this.data.quotationOc[i].attachment[0].description)
          );
        }
        this.custEditableNonDatatableComponent.refreshTable();
      }
    );
  }

}
