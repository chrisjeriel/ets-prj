import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountingService } from '@app/_services';
import { AccCVPayReqList} from '@app/_models';

@Component({
  selector: 'app-cv-payment-request-list',
  templateUrl: './cv-payment-request-list.component.html',
  styleUrls: ['./cv-payment-request-list.component.css']
})
export class CvPaymentRequestListComponent implements OnInit {

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];


  passData: any = {
    tableData: [],
    tHeader: ['Year','Seq. No.','Payee','Payment Type','Status','Request Date','Particulars','Requested By','Curr','Amount'],
    resizable: [true, true, true, true, true, true, true, true, true, true],
    dataTypes: ['text','text','text','text','text','date','text','text','text','currency'],
    nData: new AccCVPayReqList(null,null,null,null,null,new Date(),null,null,null,null),
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: true,
    saveBtn: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 10,
  };



  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passData.tableData = this.accountingService.getAccCVPayReqList();
  }

}
