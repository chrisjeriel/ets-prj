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
   
   passDataJVListing: any = {
        tableData: this.accountingService.getJVListing(),
        tHeader: ["JV No", "JV Date","Particulars","JV Type", "JV Ref. No.", "Prepared By","JV Status","Amount"],
        dataTypes: ['text','date','text','text','text','text','text','currency',],
        addFlag:true,
        editFlag:true,
        //totalFlag:true,
        pageLength: 10,
        pageStatus: true,
        pagination: true,
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

}
