import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AccountingItLossReserveDepositAr } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';

@Component({
  selector: 'app-ar-loss-reserve-deposit',
  templateUrl: './ar-loss-reserve-deposit.component.html',
  styleUrls: ['./ar-loss-reserve-deposit.component.css']
})
export class ArLossReserveDepositComponent implements OnInit, AfterViewInit {

  @Input() record: any;
  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();

  lossReserveDepositData: any = {
    tableData: this.accountingService.getAccountingItLossReserveDepositAR(),
    tHeader: ['Ceding Company', 'Membership Date', 'Curr', 'Curr Rate', 'Amount', 'Amount (PHP)'],
    dataTypes: ['text', 'date', 'text', 'percent', 'currency', 'currency'],
    nData: new AccountingItLossReserveDepositAr(null, null, null, null, null, null),
    magnifyingGlass: ['cedingCompany'],
    paginateFlag: true,
    infoFlag: true,
    pageID: 4,
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    genericBtn: 'Save',
    total: [null, null,  null, 'Total', 'amount', 'amountPhp'],
    widths: ['auto',1,1,2,150,150],
  }

  payorData: any;


  constructor(private accountingService: AccountingService, private ms: MaintenanceService, public ns: NotesService) { }

  ngOnInit() {
    this.ms.getCedingCompany(this.record.cedingId).subscribe(
      (data:any)=>{
        data.cedingCompany[0].cedingRepresentative = data.cedingCompany[0].cedingRepresentative.filter(a=>{return a.defaultTag === 'Y'});
        this.payorData = data.cedingCompany[0];
        this.payorData.business = this.record.bussTypeName;
      }
    );
    
  }

  ngAfterViewInit(){
    setTimeout(()=>{this.emitCreateUpdate.emit(this.record);},0);
  }

}
