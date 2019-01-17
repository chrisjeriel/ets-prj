import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../../../_services';
import { CVListing } from '@app/_models'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cv-entry',
  templateUrl: './cv-entry.component.html',
  styleUrls: ['./cv-entry.component.css']
})
export class CvEntryComponent implements OnInit {
  
  passDataCheckDetails: any = {
        tableData: this.accountingService.getCheckDetails(),
        tHeader: ["Bank", "Account No", "Check Date", "Check No", "Check Class","Curr","Amount"],
        dataTypes: ['text','text','date','sequence-8','text','text','currency',],
        uneditable:[true,true,false,true,false,true,true],
        addFlag:true,
        editFlag:true,
        //totalFlag:true,
        pageLength: 10,
        infoFlag: true,
        paginateFlag: true,
    };

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
  }

}
