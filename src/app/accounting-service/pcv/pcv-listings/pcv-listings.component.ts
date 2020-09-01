import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pcv-listings',
  templateUrl: './pcv-listings.component.html',
  styleUrls: ['./pcv-listings.component.css']
})
export class PcvListingsComponent implements OnInit {

  passData: any = {
    tableData: [
    	['2018-00001','Christian Lumen', 'Liquidation','New', new Date(2018,0,11),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, true],
    	['2018-00002','Christian Lumen', 'Liquidation','New', new Date(2018,0,11),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, false],
    	['2018-00003','Christian Lumen', 'Liquidation','New', new Date(2018,0,11),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, true],
    	['2018-00004','Camilo Ibanez', 'Liquidation','New', new Date(2018,0,11),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, false],
    	['2018-00005','Camilo Ibanez', 'Liquidation','New', new Date(2018,0,11),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, false],
    	['2018-00006','Camilo Ibanez', 'Liquidation','New', new Date(2018,1,12),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, true],
    	['2018-00007','Chie Reyes', 'Liquidation','New', new Date(2018,1,28),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, true],
    	['2018-00008','Chie Reyes', 'Liquidation','New', new Date(2018,2,12),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, true],
    	['2018-00009','Chie Reyes', 'Liquidation','New', new Date(2018,8,4),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, false],
    	['2018-00010','Chie Reyes', 'Liquidation','New', new Date(2018,10,23),'Cash advance for inspection of Car Risk in Pasig', 'PHP', 1000, false],
    ]
    ,
    tHeader: ['PCV No.','Payee','PCV Type','Status','PCV Date','Purpose','Curr', 'Amount', 'Replenishment Flag'],
    dataTypes: ['text', 'text', 'text', 'text', 'date', 'text', 'text', 'currency', 'checkbox'],
    filters: [
        {
          key: 'orNo',
          title: 'PCV No.',
          dataType: 'text'
        },
        {
          key: 'payor',
          title: 'Payee',
          dataType: 'text'
        },
        {
          key: 'orDate',
          title: 'PCV Type',
          dataType: 'date'
        },
        {
          key: 'paymentType',
          title: 'Status',
          dataType: 'text'
        },
        {
          key: 'status',
          title: 'PCV Date',
          dataType: 'text'
        },
        {
          key: 'particulars',
          title: 'Purpose',
          dataType: 'text'
        },
        {
          key: 'particulars',
          title: 'Curr',
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
      pcvNo: null,
      payee: null,
      pcvType: null,
      status: null,
      pcvDate: null,
      purpose: null,
      curr: null,
      amount: null,
      repFlag: null
    }

  constructor(private router: Router, private titleService: Title) { }

  ngOnInit() {
  }

  toGenerateORAdd() {
    this.router.navigate(['/accounting-service-pcv', { action: 'add' }], { skipLocationChange: true });
  }

  toGenerateOREdit(event) {
    var selectedRow = event.target.closest('tr').children;
    console.log(event);
    this.record = {
      pcvNo: selectedRow[0].innerText,
      payee: selectedRow[1].innerText,
      pcvType: selectedRow[2].innerText,
      status: selectedRow[3].innerText,
      pcvDate: selectedRow[4].innerText,
      purpose: selectedRow[5].innerText,
      curr: selectedRow[6].innerText,
      amount: selectedRow[7].innerText,
      repFlag: $(selectedRow[8]).find('input')[0].checked
    }

    this.router.navigate(['/accounting-service-pcv', { slctd: JSON.stringify(this.record), action: 'edit' }], { skipLocationChange: true });
  }
  
  onRowClick(data){
      if(data[4] == 'Printed'){
        this.passData.btnDisabled = true;
      }else{
        this.passData.btnDisabled = false;
      }
  }
}
