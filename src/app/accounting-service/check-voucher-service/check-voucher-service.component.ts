import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../_services';
import { CVListing } from '@app/_models'
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-voucher',
  templateUrl: './check-voucher-service.component.html',
  styleUrls: ['./check-voucher-service.component.css']
})
export class CheckVoucherServiceComponent implements OnInit {

  private routeData: any;

  passDataCVListing: any = {
        tableData: this.accountingService.getCVListing(),
        tHeader: ["CV No", "Payee", "CV Date", "Status","Particulars","Amount"],
        dataTypes: ['text','text','date','text','text','currency',],
        filters: [
        {
          key: 'cvNo',
          title: 'C.V. No.',
          dataType: 'text'
        },
        {
          key: 'payee',
          title: 'Payee',
          dataType: 'text'
        },
        {
          key: 'cvDate',
          title: 'CV Date',
          dataType: 'date'
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
        addFlag:true,
        editFlag:true,
        //totalFlag:true,
        pageLength: 10,
        pageStatus: true,
        pagination: true,
    };

  constructor(private accountingService: AccountingService, private titleService: Title, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Check Voucher");
  }

  onClickAdd(event){
    this.router.navigate(['/generate-cv-service'], {skipLocationChange: true}); 
  }

  onClickEdit(event){
    this.router.navigate(['/generate-cv-service'], {skipLocationChange: true}); 
  }

  toGenerateAREdit(event) {
    this.router.navigate(['/generate-cv-service'], {skipLocationChange: true});
  }

  onRowClick(data){
      this.routeData = data;
      if(data.status == 'Printed' || data.status == 'Cancelled'){
        this.passDataCVListing.btnDisabled = true;
      }else{
        this.passDataCVListing.btnDisabled = false;
      }
  }

}
