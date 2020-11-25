import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingEntriesExtract, CredibleWithholdingTaxDetails ,InputVatDetails, OutputVatDetails, WithholdingVATDetails } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'

@Component({
  selector: 'app-acct-details',
  templateUrl: './acct-details.component.html',
  styleUrls: ['./acct-details.component.css']
})
export class AcctDetailsComponent implements OnInit {
  @Input() taxType: string = "";
  @ViewChild('table') table: CustEditableNonDatatableComponent;

  passData: any = {
    tableData: [],
    tHeader: ["Transaction No.","Transaction Date","Company Name","TIN","Address","Base Amount","Tax Amount","Tax Code","Tax Rate"],
    dataTypes: ["text","date","text","text","text","currency","currency","text","percent"],
    keys: ['tranNo','tranDate','payeeName','tin','mailAddress','baseAmt','taxAmt','taxCd','rate'],
    pageLength: 15,
    // widths: [150,220,150,150,150,150,150,150,150],
    uneditable: [true,true,true,true,true,true,true,true,true],
    total:[null,null,null,null,'Total',null,'taxAmt',null,null],
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true
  }

  tempDate = '2020-12-01';
  periodFrom = '';
  periodTo = '';
  extractUser = '';
  extractDate = '';

  constructor(private accountingService: AccountingService, private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.getBirTaxes();
  }

  getBirTaxes() {
    setTimeout(() => {
      this.table.refreshTable();
      this.table.overlayLoader = true;
    }, 0);
    this.ms.getExtractToCsv(this.ns.getCurrentUser(),'ACSER009',null,null,null,null,null,null,
           null,null,null,null,null,null,null,null,null,null,
           null,null,'S',this.taxType).subscribe(data => {
            // data['listAcser009']
            this.passData.tableData = data['listAcser009'];
            if(data['listAcser009'].length > 0) {
              this.periodFrom = data['listAcser009'][0].paramFromDate.split(' ')[0];
              this.periodTo = data['listAcser009'][0].paramToDate.split(' ')[0];
              this.extractUser = data['listAcser009'][0].extractUser;
              this.extractDate = data['listAcser009'][0].extractDate.split(' ')[0];
            }

            this.table.refreshTable();
           });
  }

}
