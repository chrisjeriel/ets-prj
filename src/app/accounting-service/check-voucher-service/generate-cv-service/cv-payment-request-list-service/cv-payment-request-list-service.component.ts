import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { AccCVPayReqList} from '@app/_models';

@Component({
  selector: 'app-cv-payment-request-list-service',
  templateUrl: './cv-payment-request-list-service.component.html',
  styleUrls: ['./cv-payment-request-list-service.component.css']
})
export class CvPaymentRequestListServiceComponent implements OnInit {

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];


  passData: any = {
    tableData: [],
    tHeader: ['Payment Request No.','Payee','Payment Type','Status','Request Date','Particulars','Requested By','Curr','Amount'],
    resizable: [true, true, true, true, true, true, true, true, true],
    dataTypes: ['text','text','text','text','date','text','text','text','currency'],
    nData: new AccCVPayReqList(null,null,null,null,new Date(),null,null,null,null),
    total:[null,null,null,null,null,null,null,'Total','amount'],
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
    widths: [100,200,'auto',70,50,200,150,42,'auto'],
    genericBtn: 'Save'
  };



  constructor(private accountingService: AccountingService) { }

  ngOnInit() {    
  	this.passData.tableData = this.accountingService.getAccCVPayReqList();
  }

}
