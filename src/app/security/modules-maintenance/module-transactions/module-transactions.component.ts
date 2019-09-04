import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService } from '@app/_services';
import { ModuleTransaction } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';

@Component({
  selector: 'app-module-transactions',
  templateUrl: './module-transactions.component.html',
  styleUrls: ['./module-transactions.component.css']
})
export class ModuleTransactionsComponent implements OnInit {

 @ViewChild("modulesList") modulesList: CustEditableNonDatatableComponent;

 PassDataTransactions: any = {
    tableData: [],
    tHeader: ['Tran Code', 'Description','Remarks'],
    dataTypes: ['text', 'text', 'text'],
    keys: ['tranCd','tranDesc','remarks'],
    nData: {
        tranCd: '',
        tranDesc: '',
        remarks: '',
        createUser: '',
        createDate: 1546304400000,
        updateUser: '',
        updateDate: 1546304400000
    },
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    pageLength:10,
    searchFlag: true,
    paginateFlag: true,
    widths: [],
  }

  PassDataModules: any = {
    tableData: [],
    tHeader: ['Module Id', 'Description'],
    dataTypes: ['text', 'text'],
    keys: ['moduleId','moduleDesc'],
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

  transactionData:any = {};
  btnDisabled:boolean = true;

  constructor(private securityServices: SecurityService,public modalService: NgbModal) { }

  ngOnInit() {
      this.getMtnTransactions();
  }

  getMtnTransactions() {
    this.securityServices.getMtnTransactions(null, null).subscribe((data: any) => {
      this.PassDataTransactions.tableData = data['transactions'];
    });
  }

  onRowClickTransactions(data){
    if(data != null){
      this.btnDisabled = false;
      this.transactionData = data;

      this.getMtnModules();
    }else{
      this.btnDisabled = true;
      this.transactionData = {};
    }
  }

  getMtnModules() {
      this.PassDataModules.tableData = [];
      this.securityServices.getMtnModules(null, this.transactionData.tranCd).subscribe((data: any) => {
        for(var i =0; i < data.modules.length;i++){
          this.PassDataModules.tableData.push(data.modules[i]);
          this.PassDataModules.tableData[i].uneditable = ['moduleId', 'moduleDesc'];
        }

        this.modulesList.refreshTable();
      });
  }

  modules(){
    $('#modules #modalBtn').trigger('click');
  }

  user(){
      $('#users #modalBtn').trigger('click');
  }

}
