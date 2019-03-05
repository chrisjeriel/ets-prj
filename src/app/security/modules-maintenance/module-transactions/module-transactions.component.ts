import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/_services';
import { ModuleTransaction } from '@app/_models';

@Component({
  selector: 'app-module-transactions',
  templateUrl: './module-transactions.component.html',
  styleUrls: ['./module-transactions.component.css']
})
export class ModuleTransactionsComponent implements OnInit {

 PassData: any = {
    tableData: this.securityServices.getModuleTransaction(),
    tHeader: ['Tran Code', 'Description','Remarks'],
    dataTypes: ['text', 'text', 'text'],
    nData: new ModuleTransaction(null,null,null),
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:10,
    searchFlag: true,
    widths: [],
  }

  constructor(private securityServices: SecurityService) { }

  ngOnInit() {
  }

}
