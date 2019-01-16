import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { AttachmentInfo } from '@app/_models';

@Component({
  selector: 'app-acc-attachments',
  templateUrl: './acc-attachments.component.html',
  styleUrls: ['./acc-attachments.component.css']
})
export class AccAttachmentsComponent implements OnInit {
  
  passData:any = {
  	tableData:[],
  	tHeader: ['File Path','Description', 'Actions'],
  	checkFlag: true,
  	addFlag:true,
  	deleteFlag:true,
  	infoFlag:true,
  	paginateFlag: true,
  	widths:['auto','auto',71],
  	nData: new AttachmentInfo(null,null),

  };

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passData.tableData = this.accountingService.getAttachmentInfo();
  }

}
