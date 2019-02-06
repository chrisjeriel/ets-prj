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
            bankAccNo: '345-676345-9',
            checkNo: 22786739,
            checkDate: new Date('2018-09-25'),
            checkClass: 'Local Clearing'
          }
        ],
        tHeader: ['Pay Mode','Curr','Curr Rate','Amount','Bank','Bank Account No.','Check No.','Check Date','Check Class'],
        magnifyingGlass: ['payMode','curr','bank','checkClass'],
        dataTypes: ['text','text','percent','currency','text','number','number','date','text'],
        paginateFlag: true,
        infoFlag: true,
        pageLength: 5,
        widths: ['auto',50,80,'auto',200,1,100,1,'auto'],
        pageID: 1,
        // opts:[
        //   {
        //     selector: 'payMode',
        //     vals: ['Bank Transfer','Cash','Check','Credit Memo']
        //   },
        //   {
        //     selector: 'curr',
        //     vals: ['EUR','PHP','USD']
        //   },
        //   {
        //     selector: 'bank',
        //     vals: ['Banco De Oro','Bank of the Philippine Islands','Philippine National Bank']
        //   },
        //   {
        //     selector: 'checkClass',
        //     vals: ['Local Clearing','Manager\'s Check','On-Us']
        //   },
        // ]
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
