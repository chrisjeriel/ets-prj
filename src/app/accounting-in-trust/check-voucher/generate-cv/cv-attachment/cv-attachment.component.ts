import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService } from '@app/_services';
import { AccCvAttachement } from '@app/_models'

@Component({
  selector: 'app-cv-attachment',
  templateUrl: './cv-attachment.component.html',
  styleUrls: ['./cv-attachment.component.css']
})
export class CvAttachmentComponent implements OnInit {

  passData: any = {
    tableData: [],
    tHeader: ['File Path','Description','Actions'],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    nData: new AccCvAttachement(null,null),
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

  constructor(private accountingService: AccountingService, private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle(" Acct | CV | Attachment");
  	this.passData.tableData = this.accountingService.getAccCVAttachment();
  }

}
