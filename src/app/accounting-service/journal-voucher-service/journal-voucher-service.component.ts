import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal-voucher-service',
  templateUrl: './journal-voucher-service.component.html',
  styleUrls: ['./journal-voucher-service.component.css']
})
export class JournalVoucherServiceComponent implements OnInit {
private routeData: any;
type: string="";
status: string="";

   passDataJVListing: any = {
        tableData: this.accountingService.getJVListing(),
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
    };

  constructor(private accountingService: AccountingService,private router: Router, private titleService: Title) { }

  ngOnInit() {
     this.titleService.setTitle("Acct-Service | Journal Voucher");
  }

  onClickAdd(event){
    this.router.navigate(['/generate-jv-service'], { skipLocationChange: true }); 
  }

  onClickEdit(event){
    this.router.navigate(['/generate-jv-service',
      {jvType: this.type} 
      ], { skipLocationChange: true });
  }

  toGenerateAREdit(event) {
    if(this.status == 'Printed' ||this.status == 'Cancelled'){
       this.router.navigate(['/journal-voucher-service'], { skipLocationChange: true });
    }else {
       this.router.navigate(['/generate-jv-service',
          {jvType: this.type} 
          ], { skipLocationChange: true });
    }
  }

  onRowClick(data){
      this.type = data.jvType;
      this.status = data.jvStatus;
      this.routeData = data;
      if(data.jvStatus == 'Printed' || data.jvStatus == 'Cancelled'){
        this.passDataJVListing.btnDisabled = true;
      }else{
        this.passDataJVListing.btnDisabled = false;
      }

  }

}
