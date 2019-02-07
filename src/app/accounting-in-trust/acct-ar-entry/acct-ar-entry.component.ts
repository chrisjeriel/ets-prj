import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-acct-ar-entry',
  templateUrl: './acct-ar-entry.component.html',
  styleUrls: ['./acct-ar-entry.component.css']
})
export class AcctArEntryComponent implements OnInit {

  passData: any = {
        tableData:[
          {
            payMode: 'Check',
            curr: 'PHP',
            currRate: 1,
            amount: 1642857.14,
            bank: 'Bank of the Philippine Islands',
            bankAccNo: '345-676345-9',
            checkNo: 22786739,
            checkDate: new Date('2018-09-25'),
            checkClass: 'Local Clearing'
          }
        ],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check No.','Check Date','Check Class'],
        magnifyingGlass: ['0','1','4','7'],
        dataTypes: ['select','select','percent','currency','select','text','number','date','select'],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 5,
        widths: [],
        pageID: 1,
        opts:[
          {
            selector: 'payMode',
            vals: ['Bank Transfer','Cash','Check','Credit Memo']
          },
          {
            selector: 'curr',
            vals: ['EUR','PHP','USD']
          },
          {
            selector: 'bank',
            vals: ['Banco De Oro','Bank of the Philippine Islands','Philippine National Bank']
          },
          {
            selector: 'checkClass',
            vals: ['Local Clearing','Manager\'s Check','On-Us']
          },
        ]
    };

  @Input() record: any = {
                   arNo: null,
                   payor: null,
                   arDate: null,
                   paymentType: null,
                   status: null,
                   particulars: null,
                   amount: null
                 };
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.onChange.emit({ type: this.record.paymentType });
  }

  tabController(event) {
  	this.onChange.emit({ type: this.record.paymentType });
  }

}
