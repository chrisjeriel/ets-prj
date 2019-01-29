import { Component, OnInit } from '@angular/core';
import {QSOA} from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-ar-details-qsoa',
  templateUrl: './ar-details-qsoa.component.html',
  styleUrls: ['./ar-details-qsoa.component.css']
})
export class ArDetailsQsoaComponent implements OnInit {

    passDataQSOA: any = {
    tableData:[],
    tHeader:['Quarter Ending','DR Balance','CR Balance', 'Beginning Balance DR', 'Beginning Balance CR', 'Ending Balance DR', 'Ending Balance CR'],
    dataTypes:['date','currency','currency','currency','currency','currency','currency'],
    total:['Total','drBalance','crBalance','begBalDR','begBalCR','endBalDR','endBalCR'],
    addFlag:true,
    deleteFlag:true,
    genericBtn: "Save",
    infoFlag:true,
    paginateFlag:true,  
    nData: new QSOA(null, null, null, null, null, null, null),
    checkFlag: true,
    widths:['auto','auto','auto','auto','auto','auto','auto'],
    pageID: 5
  }

  constructor( private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passDataQSOA.tableData = this.accountingService.getQSOAData();
  }

}
