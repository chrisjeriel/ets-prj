import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.css']
})
export class JournalVoucherComponent implements OnInit {
   private routeData: any;

   passDataJVListing: any = {
        tableData: [{'jvNo':'2019','jvDate':new Date(),'particulars':'Test Particulars','jvType':'Adjustments of Inward Policy Balances','jvRefNo':'2019-000000001','preparedBy':'EARL','jvStatus':'In progress','amount':'10000000000'}],
        tHeader: ["JV No", "JV Date","Particulars","JV Type", "JV Ref. No.", "Prepared By","JV Status","Amount"],
        dataTypes: ['text','date','text','text','text','text','text','currency',],
         filters: [
        {
          key: 'jvNo',
          title: 'J.V. No.',
          dataType: 'text'
        },
        {
          key: 'jvDate',
          title: 'JV Date',
          dataType: 'date'
        },
        {
          key: 'particulars',
          title: 'Particulars',
          dataType: 'text'
        },
        {
          key: 'jvType',
          title: 'J.V Type',
          dataType: 'text'
        },
        {
          key: 'jvRefNo',
          title: 'J.V Ref No',
          dataType: 'text'
        },
        {
          key: 'preparedBy',
          title: 'Prepared By',
          dataType: 'text'
        },
        {
          key: 'jvStatus',
          title: 'J.V Status',
          dataType: 'text'
        },
        {
          key: 'amount',
          title: 'Amount',
          dataType: 'text'
        }
    ],
        addFlag:true,
        editFlag:true,
        //totalFlag:true,
        pageLength: 10,
        pageStatus: true,
        pagination: true,
        keys:['jvNo','jvDate','particulars','jvType','jvRefNo','preparedBy','jvStatus','amount']
    };

  constructor(private accountingService: AccountingService,private router: Router, private titleService: Title) { }

  ngOnInit() {
     this.titleService.setTitle("Acct-IT | Journal Voucher");
  }

  onClickAdd(event){
      this.router.navigate(['/generate-jv']); 
  }

  onClickEdit(event){
      this.router.navigate(['/generate-jv']); 
  }

  toGenerateAREdit(event) {
    this.router.navigateByUrl('/generate-jv');
  }

  onRowClick(data){
      this.routeData = data;
      if(data.jvStatus == 'Printed' || data.jvStatus == 'Cancelled'){
        this.passDataJVListing.btnDisabled = true;
      }else{
        this.passDataJVListing.btnDisabled = false;
      }
    //console.log(this.accountingService.getPaytRequestsList());
  }
}
