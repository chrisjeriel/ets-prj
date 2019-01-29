import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-acct-or-listings',
  templateUrl: './acct-or-listings.component.html',
  styleUrls: ['./acct-or-listings.component.css']
})
export class AcctOrListingsComponent implements OnInit {

  passData: any = {
    tableData: [
    ['1','BPI/MS INSURANCE CORPORATION',new Date('2018-10-1'),'Inward Policy Balances','New','Representing payment for premium of policy CAR-2018-00001-99-0001-000',1642857.14],
    ['2','PNBGEN',new Date('2018-10-1'),'Inward Policy Balances','New','Representing payment for premium of policy CAR-2018-00001-99-0001-000',200000],
    ['3','Charter Ping An',new Date('2018-10-3'),'Claim Recovery','Printed','Representing claim recovery payment for Claim No. CAR-2018-000001',100000],
    ['4','AXA',new Date('2018-10-4'),'QSOA','Printed','Representing payment for the Quarterly Statement of Accounts balances of BPI/MS for the 3rd Quarter',1000000],
    ['5','Allied Bankers',new Date('2018-10-4'),'QSOA','New','Representing payment for the Quarterly Statement of Accounts balances of BPI/MS for the 3rd Quarter',710716.12],
    ['6','Malayan',new Date('2018-10-5'),'Inward Policy Balances','New','Representing payment for premium of policy CAR-2018-00001-99-0001-000',756929],
    ['7','New India',new Date('2018-10-7'),'Claim Recovery','New','Representing claim recovery payment for Claim No. CAR-2018-000001',30000],
    ['8','BPI/MS INSURANCE CORPORATION',new Date('2018-10-7'),'Claim Recovery','Printed','Representing claim recovery payment for Claim No. CAR-2018-000001',10000],
    ['9','UCPBGEN',new Date('2018-10-7'),'QSOA','Printed','Representing payment for the Quarterly Statement of Accounts balances of BPI/MS for the 3rd Quarter',230000],
    ['10','FGIC',new Date('2018-10-7'),'Inward Policy Balances','New','Representing payment for premium of policy CAR-2018-00001-99-0001-000',1500000],
    ],
    tHeader: ['O.R. No.','Payor','OR Date','Payment Type','Status','Particulars','Amount'],
    dataTypes: ['sequence-6','text','date','text','text','text','currency'],
    resizable: [false,true,false,true,false,true,true],
    filters: [
        {
          key: 'orNo',
          title: 'O.R. No.',
          dataType: 'text'
        },
        {
          key: 'payor',
          title: 'Payor',
          dataType: 'text'
        },
        {
          key: 'orDate',
          title: 'OR Date',
          dataType: 'date'
        },
        {
          key: 'paymentType',
          title: 'Payment Type',
          dataType: 'text'
        },
        {
          key: 'status',
          title: 'Status',
          dataType: 'text'
        },
        {
          key: 'particulars',
          title: 'Particulars',
          dataType: 'text'
        },
        {
          key: 'amount',
          title: 'Amount',
          dataType: 'text'
        }
    ],
    pageLength: 10,
    pageStatus: true,
    pagination: true,
    addFlag: true,
    editFlag: true,
    pageID: 1,
    btnDisabled: true
  }

  constructor(private router: Router, private titleService: Title) { }

  ngOnInit() {
  }

  toGenerateORAdd() {
    this.router.navigate(['/accounting-service', { action: 'add' }], { skipLocationChange: true });
  }
}
