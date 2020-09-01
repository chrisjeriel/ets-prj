import { Component, OnInit, Input,  Output, EventEmitter, AfterViewInit } from '@angular/core';
import { PaymentForAdvances } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';

@Component({
  selector: 'app-ar-paymentfor-advances',
  templateUrl: './ar-paymentfor-advances.component.html',
  styleUrls: ['./ar-paymentfor-advances.component.css']
})
export class ArPaymentforAdvancesComponent implements OnInit, AfterViewInit {

  @Input() record: any;
  @Output() emitCreateUpdate: EventEmitter<any> = new EventEmitter();

  pmmscData: any;

  constructor(private accountingService: AccountingService, private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.ms.getMtnCompany(1).subscribe( //101 is company Id of PMMSC (may need to be changed into dynamic)
       (data:any)=>{
         this.pmmscData = data.companyListing[0];
       }
    );
  }

  ngAfterViewInit(){
    setTimeout(()=>{this.emitCreateUpdate.emit(this.record);},0);
  }

}
