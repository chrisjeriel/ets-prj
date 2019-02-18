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
    ['VAT','1','AFP GENERAL INSURANCE CORP.',new Date('2018-10-1'),'Official Receipt','New','Representing payment for 09/15/2018 transactions',1642857.14],
    ['VAT','2','ALLIEDBANKERS INSURANCE CORP.',new Date('2018-10-1'),'Official Receipt Service Fee Local','New','Service fee for the quarter ending 09/30/2018',200000],
    ['VAT','3','BLUE CROSS INSURANCE, INC.',new Date('2018-10-3'),'Official Receipt','Printed','Representing payment for 09/15/2018 transactions',100000],
    ['VAT','4','BF GENERAL INSURANCE CO., INC.',new Date('2018-10-4'),'Official Receipt','Printed','Representing payment for 09/15/2018 transactions',1000000],
    ['Non-VAT','5','CCC INSURANCE CORPORATION',new Date('2018-10-4'),'Official Receipt','New','Representing payment for 09/15/2018 transactions',710716.12],
    ['VAT','6','CIBELES INSURANCE CORP.',new Date('2018-10-5'),'Official Receipt Service Fee Local','New','Service fee for the quarter ending 09/30/2018',756929],
    ['VAT','7','COMMONWEALTH INSURANCE CO.',new Date('2018-10-7'),'Official Receipt Service Fee Local','New','Service fee for the quarter ending 09/30/2018',30000],
    ['VAT','8','CICI GENERAL INSURANCE CORP.',new Date('2018-10-7'),'Official Receipt Service Fee Local','Printed','Service fee for the quarter ending 09/30/2018',10000],
    ['VAT','9','DEVELOPMENT INSURANCE AND SURETY CORP.',new Date('2018-10-7'),'Official Receipt Service Fee Local','Printed','Service fee for the quarter ending 09/30/2018',230000],
    ['VAT','10','DOMESTIC INS. CO. OF THE PHIL.',new Date('2018-10-7'),'Official Receipt Service Fee Local','New','Service fee for the quarter ending 09/30/2018',1500000],
    ],
    tHeader: ['O.R. Type','O.R. No.','Payor','OR Date','Payment Type','Status','Particulars','Amount'],
    dataTypes: ['text','sequence-6','text','date','text','text','text','currency'],
    resizable: [false,false,true,false,true,false,true,true],
    filters: [
        {
          key: 'orType',
          title: 'O.R. Type',
          dataType: 'text'
        },
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

  record: any = {
      arNo: null,
      payor: null,
      arDate: null,
      paymentType: null,
      status: null,
      particulars: null,
      amount: null
    }

  constructor(private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-Service | Official Receipt");
  }

  toGenerateORAdd() {
    this.router.navigate(['/accounting-service', { action: 'add' }], { skipLocationChange: true });
    
  }

  toGenerateOREdit(event) {
    var selectedRow = event.target.closest('tr').children;

    this.record = {
      arNo: selectedRow[0].innerText,
      payor: selectedRow[1].innerText,
      arDate: selectedRow[2].innerText,
      paymentType: selectedRow[3].innerText.trim(),
      status: selectedRow[4].innerText,
      particulars: selectedRow[5].innerText,
      amount: selectedRow[6].innerText
    }

    this.router.navigate(['/accounting-service', { slctd: JSON.stringify(this.record), action: 'edit' }], { skipLocationChange: true });
  }
  
  onRowClick(data){
      if(data[4] == 'Printed'){
        this.passData.btnDisabled = true;
      }else{
        this.passData.btnDisabled = false;
      }
  }
}
