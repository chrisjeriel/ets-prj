import { Component, OnInit, Input } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccJvInPolBalAgainstLoss, AgainstLoss } from '@app/_models';

@Component({
  selector: 'app-jv-offsetting-against-losses',
  templateUrl: './jv-offsetting-against-losses.component.html',
  styleUrls: ['./jv-offsetting-against-losses.component.css']
})
export class JvOffsettingAgainstLossesComponent implements OnInit {

  @Input() jvDetail:any;

  passData: any = {
    tableData: [], //this.accountingService.getAccJvInPolBalAgainstLoss(),
    tHeader: ['Due Date','Curr','Curr Rate','Premium','RI Comm','Charges','Net Due','Payments','Balance','Overdue Interest'],
    dataTypes: ['date','text','percent','currency','currency','currency','currency','currency','currency','currency'],
    nData: new AccJvInPolBalAgainstLoss(null,null,null,null,new Date(),new Date(),null,null,null,null,null,null,null,null,null,null),
    total:[null,null,'Total','premium','riComm','charges','netDue','payments','bal','overdueInt'],
    magnifyingGlass: ['soaNo','polNo','instNo'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: true,
    pagination: true,
    editFlag: false,
    pageLength: 5,
    //widths: [180,180,200,1,1,1,1,80,120,80,80,120,120,120,80,120],
    pageID: 2,
  };

  AgainstLossData: any = {
  	tableData: [],//this.accountingService.getClaimLosses(),
  	tHeader: ['Claim No', 'Hist No', 'Hist Category','Hist Type', 'Payment For', 'Insured', 'Ex-Gratia', 'Curr','Curr Rate', 'Reserve Amount','Paid Amount','Paid Amount (Php)'],
  	dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'checkbox', 'text', 'percent', 'currency', 'currency', 'currency'],
  	nData: new AgainstLoss(null,null,null,null,null,null,null,null,null,null,null),
    magnifyingGlass: ['claimNo'],
  	paginateFlag: true,
  	infoFlag: true,
  	pageID: 1,
  	checkFlag: true,
  	addFlag: true,
  	deleteFlag: true,
  	total: [null, null,null, null, null,null, null,null,'Total',null, 'amount', 'amountPhp'],
  	genericBtn: 'Save',
    widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
    pageLength: 5,
  }

  jvDetails: any = {
    cedingName: '',
  }


  constructor(private accountingService: AccountingService,private titleService: Title , private ns: NotesService, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
  }

  showCedingCompanyLOV() {
    $('#cedingCompany #modalBtn').trigger('click');
  }

  setCedingcompany(data){
    this.jvDetails.cedingName = data.cedingName;
    this.jvDetails.ceding = data.cedingId;
    this.ns.lovLoader(data.ev, 0);
  }
}
