import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-cancel-cv-service',
  templateUrl: './cancel-cv-service.component.html',
  styleUrls: ['./cancel-cv-service.component.css']
})
export class CancelCvServiceComponent implements OnInit {
  
  passDataCV: any = {
  	tableData:  this.accountingService.getCancelCV(),
  	tHeader:['CV No.','Payee','CV Date', 'Status', 'Particulars', 'Amount'],
  	dataTypes:['text','text','date','text','text','currency'],
  	uneditable:[true, true, true, true, true, true],
  	searchFlag: true,
  	infoFlag:true,
  	paginateFlag:true,
  	checkFlag:true,
  	widths:[1,'auto',1,1,'auto',105]

  }
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
