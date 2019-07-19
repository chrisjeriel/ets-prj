import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jv-app-payments-zero',
  templateUrl: './jv-app-payments-zero.component.html',
  styleUrls: ['./jv-app-payments-zero.component.css']
})
export class JvAppPaymentsZeroComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  passData: any = {
    tableData: [], //this.accountingService.getAccJvInPolBalAgainstLoss(),
    tHeader: ['SOA No.','Policy No','Co. Ref No.','Inst No','Eff Date','Due Date','Curr','Curr Rate','Premium'],
    dataTypes: ['text','text','text','text','date','date','text','percent','currency'],
    //nData: new AccJvInPolBalAgainstLoss(null,null,null,null,new Date(),new Date(),null,null,null,null,null,null,null,null,null,null),
    total:[null,null,null,null,null,null,null,'Total','premium'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: true,
    pagination: true,
    editFlag: false,
    pageLength: 5,
    //widths: [180,180,200,1,1,1,1,80,120,80,80,120,120,120,80,120],
    pageID: 2,
  };

}
