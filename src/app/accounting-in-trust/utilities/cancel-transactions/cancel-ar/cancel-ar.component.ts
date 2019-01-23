import { Component, OnInit } from '@angular/core';
import { AccountingService} from '@app/_services';


@Component({
  selector: 'app-cancel-ar',
  templateUrl: './cancel-ar.component.html',
  styleUrls: ['./cancel-ar.component.css']
})
export class CancelArComponent implements OnInit {
  
  passDataAR : any = {
  	tableData: this.accountingService.getCancelAR(),
  	tHeader:['A.R. No.','Payor','AR Date', 'Payment Type', 'Status', 'Particulars', 'Amount'],
  	dataTypes:['sequence-6','text','date','text','text','text','currency'],
  	uneditable:[true, true, true, true, true, true, true],
  	searchFlag: true,
  	infoFlag:true,
  	paginateFlag:true,
  	checkFlag:true,
  	widths:[1,210,1,1,1,'auto',105]

  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
