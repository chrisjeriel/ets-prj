import { Component, OnInit } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AgainstNegativeTreaty, AccJvInPolBalAgainstLoss, AccJvOutAccOffset} from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-jv-overdue-accounts-against-treaty',
  templateUrl: './jv-overdue-accounts-against-treaty.component.html',
  styleUrls: ['./jv-overdue-accounts-against-treaty.component.css']
})
export class JvOverdueAccountsAgainstTreatyComponent implements OnInit {
  
  passData: any = {
    tableData: this.accountingService.getAgainstNegativeTreaty(),
    tHeader: ['Quarter Ending','Currency', 'Currency Rate', 'Amount','Amount(PHP)'],
    resizable: [true, true, true, true, true,true, true, true],
    dataTypes: ['date','text','percent','currency','currency'],
    nData: new AgainstNegativeTreaty(new Date(),null,null,null,null),
    total:[null,null,'Total','amount','amountPhp'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    saveBtn: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 10,
    genericBtn: 'Save',
    opts: [],
    widths: [203,1,1,'auto','auto'],

  };

  passDataOffsetting: any = {
    tableData: this.accountingService.getAccJvOutAccOffset(),
    tHeader: ['SOA No','Policy No.','Co. Ref No.','Inst No.','Eff Date','Due Date','No. of Days Overdue','Curr','Curr Rate','Premium','RI Comm','Charges','Net Due','Payments','Balance',"Overdue Interest"],
    resizable: [true, true, true, true, true, true, true, true, true,true,true,true,true,true,true,true],
    dataTypes: ['text','text','text','number','date','date','number','text','percent','currency','percent','percent','currency','currency','currency','percent'],
    nData: new AccJvOutAccOffset(null,null,null,null,new Date(),new Date(),null,null,null,null,null,null,null,null,null,null),
    total:[null,null,null,null,null,null,null,null,'Total','premium','riComm','charges','netDue','payments','bal','overdueInt'],
/*    magnifyingGlass: ['soaNo','instNo'],*/
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    saveBtn: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 10,
    genericBtn: 'Save',
    widths: [185,185,185,1,1,1,1,1,85,120,85,85,120,120,120,120]
  };
  constructor(private accountingService: AccountingService,private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {
  }

  ShowModal() {
      $('#ViewOverdue > #modalBtn').trigger('click');
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

}
