import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-change-to-new-cv',
  templateUrl: './change-to-new-cv.component.html',
  styleUrls: ['./change-to-new-cv.component.css']
})
export class ChangeToNewCvComponent implements OnInit {

  passData: any = {
  	tableData:[],
  	tHeader:['CV No.','Payee','CV Date', 'Status', 'Particulars', 'Amount'],
  	dataTypes:['text','text','date','text','text','currency'],
  	uneditable:[true, true, true, true, true, true],
  	genericBtn:'Change Status to New',
  	searchFlag: true,
  	infoFlag:true,
  	paginateFlag:true,
  	checkFlag:true,
  	widths:[1,'auto',1,1,'auto',105],
    filters:[
      {
          key: 'cvNo',
          title:'CV No.',
          dataType: 'text'
      },
      {
          key: 'payee',
          title:'Payee',
          dataType: 'text'
      },
      {
          key: 'cvDate',
          title:'CV Date',
          dataType: 'datespan'
      },
      {
          key: 'status',
          title:'Status',
          dataType: 'text'
      },
      {
          key: 'particulars',
          title:'Particulars',
          dataType: 'text'
      },
      {
          key: 'amount',
          title:'Amount',
          dataType: 'text'
      },
    ]

  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passData.tableData = this.accountingService.getChangeTxToNewCV();
  }

}
