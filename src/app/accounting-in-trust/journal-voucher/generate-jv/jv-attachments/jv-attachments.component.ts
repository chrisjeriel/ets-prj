import { Component, OnInit } from '@angular/core';
import { AttachmentInfo} from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-jv-attachments',
  templateUrl: './jv-attachments.component.html',
  styleUrls: ['./jv-attachments.component.css']
})
export class JvAttachmentsComponent implements OnInit {
  
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
