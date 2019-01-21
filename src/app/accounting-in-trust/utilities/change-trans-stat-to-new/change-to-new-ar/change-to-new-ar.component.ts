import { Component, OnInit } from '@angular/core';
import { AccountingService} from '@app/_services';

@Component({
  selector: 'app-change-to-new-ar',
  templateUrl: './change-to-new-ar.component.html',
  styleUrls: ['./change-to-new-ar.component.css']
})
export class ChangeToNewArComponent implements OnInit {
  passData: any = {
  	tableData:[],
  	tHeader:['A.R. No.','Payor','AR Date', 'Payment Type', 'Status', 'Particulars', 'Amount'],
  	dataTypes:['sequence-6','text','date','text','text','text','currency'],
  	uneditable:[true, true, true, true, true, true, true],
  	genericBtn:'Change Status to New',
  	searchFlag: true,
  	infoFlag:true,
  	paginateFlag:true,
  	checkFlag:true,
  	widths:[1,210,1,1,1,'auto',105]

  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passData.tableData = this.accountingService.getChangeTxToNewAR();
  }

}
