import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ARUnappliedCollection } from '@app/_models';

@Component({
  selector: 'app-unapplied-collection',
  templateUrl: './unapplied-collection.component.html',
  styleUrls: ['./unapplied-collection.component.css']
})
export class UnappliedCollectionComponent implements OnInit {

  passDataUnappliedDetails: any = {
  	tableData: [],
    tHeader: ["Ceding Company", "Membership Date", "Remarks", "Curr", "Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text", "date", "text", "text", "percent","currency","currency"],
    resizable: [true, true, true, true, true, true, true],
    nData: new ARUnappliedCollection(null,null,null,null,null,null,null),
    total:[null,null,null,null,'Total','amount','amountPHP'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [220,150,'auto',50,100,150,150],
    paginateFlag:true,
    infoFlag:true,
    magnifyingGlass: ['cedCompany'],
  }
  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passDataUnappliedDetails.tableData = this.accountingService.getARUnappliedCollection();
  }

}
