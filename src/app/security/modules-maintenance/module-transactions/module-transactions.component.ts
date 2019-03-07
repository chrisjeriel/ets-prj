import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@app/_services';
import { ModuleTransaction } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  PassDataModules: any = {
    tableData: [['QUOTE001','Quotation Processing'],['QUOTE002','General Info (Quotation)'],['QUOTE003','Coverage (Quotation)'],['QUOTE004','Quote Option (Quotation)'],['QUOTE005','Endorsement (Quotation)']],
    tHeader: ['Module Id', 'Description'],
    dataTypes: ['text', 'text'],
    pageID: 1,
    pageLength:5,
    searchFlag: true,
    paginateFlag: true,
    infoFlag: true,
    widths: [110,225],
  }

  PassDatAUserListing: any = {
  tableData: [['LCUARESMA','Lope Cuaresma','Y']],
  tHeader: ['User Id', 'User Name', 'Active'],
  dataTypes: ['text', 'text','checkbox'],
  pageID: 7,
  pageLength:5,
  searchFlag: true,
  paginateFlag: true,
  infoFlag: true,
  widths: [110,225,30],
  }

  constructor(private securityServices: SecurityService,private modalService: NgbModal) { }

  ngOnInit() {
  }

  modules(){
    $('#modules #modalBtn').trigger('click');
  }

  user(){
      $('#users #modalBtn').trigger('click');
    }

}
