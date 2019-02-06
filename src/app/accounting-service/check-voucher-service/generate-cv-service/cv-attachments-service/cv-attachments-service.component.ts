import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { AccCvAttachment } from '@app/_models'

@Component({
  selector: 'app-cv-attachments-service',
  templateUrl: './cv-attachments-service.component.html',
  styleUrls: ['./cv-attachments-service.component.css']
})
export class CvAttachmentsServiceComponent implements OnInit {

	passData: any = {
    tableData: [],
    tHeader: ['File Path','Description','Actions'],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    nData: new AccCvAttachment(null,null),
    opts: [],
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: ['auto','auto',71]
  };

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passData.tableData = this.accountingService.getAccCVAttachment();
  }

}
