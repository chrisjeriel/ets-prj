import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-acct-or-entry',
  templateUrl: './acct-or-entry.component.html',
  styleUrls: ['./acct-or-entry.component.css']
})
export class AcctOrEntryComponent implements OnInit {

  passData: any = {
        tableData:[
          {
            payMode: 'Check',
            curr: 'PHP',
            currRate: 1,
            amount: 1642857.14,
            bank: 'Bank of the Philippine Islands',
            checkNo: 22786739,
            checkDate: new Date('2018-09-25'),
            checkClass: 'Local Clearing'
          }
        ],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Check No.','Check Date','Check Class'],
        magnifyingGlass: ['0','1','4','7'],
        dataTypes: ['select','select','percent','currency','select','number','date','select'],
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
