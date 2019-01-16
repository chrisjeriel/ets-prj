import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../_services';
import { CVListing } from '@app/_models'
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-voucher',
  templateUrl: './check-voucher.component.html',
  styleUrls: ['./check-voucher.component.css']
})
export class CheckVoucherComponent implements OnInit {

  passDataCVListing: any = {
        tableData: this.accountingService.getCVListing(),
        tHeader: ["CV Year", "CV No", "Payee", "CV Date", "Status","Particulars","Amount"],
        dataTypes: ['year','number','text',,'date','text','text','currency',],
        addFlag:true,
        editFlag:true,
        //totalFlag:true,
        pageLength: 10,
        pageStatus: true,
        pagination: true,
    };

  constructor(private accountingService: AccountingService, private titleService: Title, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Acc In Trust | Check Voucher");
  }

  onClickAdd(event){
      this.router.navigate(['/generate-cv']); 
  }

  onClickEdit(event){
      this.router.navigate(['/generate-cv']); 
  }

}
