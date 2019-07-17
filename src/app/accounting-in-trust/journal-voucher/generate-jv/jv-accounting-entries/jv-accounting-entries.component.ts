import { Component, OnInit, Input } from '@angular/core';
import { JVAccountingEntries } from '@app/_models'
import { AccountingService, NotesService } from '@app/_services'

@Component({
  selector: 'app-jv-accounting-entries',
  templateUrl: './jv-accounting-entries.component.html',
  styleUrls: ['./jv-accounting-entries.component.css']
})
export class JvAccountingEntriesComponent implements OnInit {

   accEntriesData: any = {
    tableData: this.accountingService.getJVAccountingEntry(),
    tHeader: ['Account Code', 'Account Name', 'SL Type', 'SL Name', 'Debit', 'Credit'],
    dataTypes: ['text', 'text', 'text', 'text', 'currency', 'currency'],
    magnifyingGlass: ['accountCode','slType','slName'],
    nData: new JVAccountingEntries(null, null, null, null, null, null),
    paginateFlag: true,
    infoFlag: true,
    checkFlag: true,
    pageID: 2,
    addFlag: true,
    deleteFlag: true,
    total: [null, null, null, 'Total', null, null]
  }
  
  @Input() jvData:any;

    jvDetails : any = {
       jvNo: '', 
       jvYear: '', 
       jvDate: '', 
       jvType: '',
       jvStatus: '',
       refnoDate: '',
       refnoTranId: '',
       currCd: '',
       currRate: '',
       jvAmt: '',
       localAmt: ''
    }

  
  constructor(private accountingService: AccountingService, private ns: NotesService) { }

  ngOnInit() {
    this.retrieveJVDetails();
  }

  retrieveJVDetails(){
    console.log(this.jvData)
    this.jvDetails = this.jvData;
    this.jvDetails.jvDate = this.ns.toDateTimeString(this.jvDetails.jvDate);
    this.jvDetails.refnoDate = this.ns.toDateTimeString(this.jvDetails.refnoDate);
  }
}
