import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acct-ar-listings',
  templateUrl: './acct-ar-listings.component.html',
  styleUrls: ['./acct-ar-listings.component.css']
})
export class AcctArListingsComponent implements OnInit {

  passData: any = {
    tableData: [
    ['000001','BPI/MS INSURANCE CORPORATION',new Date('2018-10-1'),'Inward Policy Balances','New','Representing payment for premium of policy CAR-2018-00001-99-0001-000',1642857.14],
    ['000002','PNBGEN',new Date('2018-10-1'),'Inward Policy Balances','New','Representing payment for premium of policy CAR-2018-00001-99-0001-000',200000],
    ['000003','Charter Ping An',new Date('2018-10-3'),'Claim Recovery','Printed','Representing claim recovery payment for Claim No. CAR-2018-000001',100000],
    ['000004','AXA',new Date('2018-10-4'),'QSOA','Printed','Representing payment for the Quarterly Statement of Accounts balances of BPI/MS for the 3rd Quarter',1000000],
    ['000005','Allied Bankers',new Date('2018-10-4'),'QSOA','New','Representing payment for the Quarterly Statement of Accounts balances of BPI/MS for the 3rd Quarter',710716.12],
    ['000006','Malayan',new Date('2018-10-5'),'Inward Policy Balances','New','Representing payment for premium of policy CAR-2018-00001-99-0001-000',756929],
    ['000007','New India',new Date('2018-10-7'),'Claim Recovery','New','Representing claim recovery payment for Claim No. CAR-2018-000001',30000],
    ['000008','BPI/MS INSURANCE CORPORATION',new Date('2018-10-7'),'Claim Recovery','Printed','Representing claim recovery payment for Claim No. CAR-2018-000001',10000],
    ['000009','UCPBGEN',new Date('2018-10-7'),'QSOA','Printed','Representing payment for the Quarterly Statement of Accounts balances of BPI/MS for the 3rd Quarter',230000],
    ['000010','FGIC',new Date('2018-10-7'),'Inward Policy Balances','New','Representing payment for premium of policy CAR-2018-00001-99-0001-000',1500000],
    ],
    tHeader: ['A.R. No.','Payor','AR Date','Payment Type','Status','Particulars','Amount'],
    dataTypes: ['text','text','date','text','text','text','currency'],
    resizable: [false,true,false,true,false,true,true],
    filters: [
        {
          key: 'arNo',
          title: 'A.R. No.',
          dataType: 'text'
        },
        {
          key: 'payor',
          title: 'Payor',
          dataType: 'text'
        },
        {
          key: 'arDate',
          title: 'AR Date',
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
    pageID: 1
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  toGenerateARAdd() {
  	this.router.navigate(['/accounting-in-trust', { action: 'add' }], { skipLocationChange: true });
  }

  toGenerateAREdit(event) {
    var selectedRow = event.target.closest('tr').children;

    var record = {
      arNo: selectedRow[0].innerText,
      payor: selectedRow[1].innerText,
      arDate: selectedRow[2].innerText,
      paymentType: selectedRow[3].innerText,
      status: selectedRow[4].innerText,
      particulars: selectedRow[5].innerText,
      amount: selectedRow[6].innerText
    }

    this.router.navigate(['/accounting-in-trust', { slctd: JSON.stringify(record), action: 'edit' }], { skipLocationChange: true });
  }
}