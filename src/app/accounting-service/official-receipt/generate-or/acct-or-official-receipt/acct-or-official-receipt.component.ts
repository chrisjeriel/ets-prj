import { Component, OnInit, Input } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from  '@angular/platform-browser';
import { OfficialReceipt,AccORSerFeeLoc } from '@app/_models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-acct-or-official-receipt',
  templateUrl: './acct-or-official-receipt.component.html',
  styleUrls: ['./acct-or-official-receipt.component.css']
})
export class AcctOrOfficialReceiptComponent implements OnInit {
  passDataOfficialReceipt : any = {
    tableData: this.accountingService.getOfficialReceipt(),
    tHeader : ["Item","Reference No","Payor","Curr","Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text","text","text","text","percent","currency","currency"],
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    checkFlag: true,
    infoFlag: true,
    pageLength: 10,
    paginateFlag: true,
    total: [null,null,null,null,'Total','amount','amountPHP'],
    nData: new OfficialReceipt(null,null,null,null,null,null,null),
    widths: ['auto',120,'auto',1,100,120,120]
  }

  passDataServiceFeeLocal: any = {
		tableData:this.accountingService.getAccORSerFeeLoc(),
		tHeader: ['Ceding Company','Quarter Ending','Curr','Curr Rate','Amount','Amount(PHP)'],
		widths:['auto',1,1,100,100,100],
		nData: new AccORSerFeeLoc(null,null,null,null,null,null),
		total:[null,null,null,'Total','amount','amountPHP'],
		dataTypes: ['text','date','text','percent','currency','currency'],
		addFlag:true,
		deleteFlag: true,
		genericBtn: 'Save',
		checkFlag: true,
		infoFlag:true,
		paginateFlag: true,
		magnifyingGlass:['cedingCompany']
  }
  passDataServiceFeeMunichRe: any = {
		tableData:this.accountingService.getAccORSerFeeMunichRe(),
		tHeader: ['Ceding Company','Quarter Ending','Curr','Curr Rate','Amount','Amount(PHP)'],
		widths:['auto',1,1,100,100,100],
		nData: new AccORSerFeeLoc(null,null,null,null,null,null),
		total:[null,null,null,'Total','amount','amountPHP'],
		dataTypes: ['text','date','text','percent','currency','currency'],
		addFlag:true,
		deleteFlag: true,
		genericBtn: 'Save',
		checkFlag: true,
		infoFlag:true,
		paginateFlag: true,
		magnifyingGlass:['cedingCompany']
	}


  passDataGenTax:any = {
    pageLength:5,
    tHeader: ['Tax Code','Description','Rate','Amount'],
    dataTypes:['text','text','currency','currency'],
    widths:[1,190,1,120],
    tableData: [
      ['EVAT','Expanded Value Added Tax',12,null],
      ['EGT','Local Government Tax',2,null],
      ['FST','Fire Service Tax',null,100],
      ['SERV','Service',10,null]
    ],
    checkFlag: true
  }

  passDataWithholding:any = {
    pageLength:5,
    tHeader: ['Tax Code','Description','Rate','Amount'],
    dataTypes:['text','text','currency','currency'],
    widths:[1,190,1,120],
    tableData: [
      ['WC120','EWT- prime contractors/sub-contractors',2,null],
      ['WC010','EWT- professional/talent fees paid to individual',10,null],
      ['WC100','EWT- rentals : real/personal properties',5,null],
      ['WC140','EWT- gross commission or service fees of custom insurance stock real estate',10,null],
      ['WC158','EWT- Income payments made by top 10,000 private corporations to their',1,null]
    ],
    checkFlag: true
  }

  @Input() paymentType: string = "type";

  constructor(private accountingService: AccountingService, private titleService: Title,public modalService: NgbModal) { }
  
  ngOnInit() {
  	this.titleService.setTitle("Acct-Srvc | OR Details");
  	if(this.paymentType == null){
      this.paymentType = "";
    }
  }
  
 openTaxAllocation(){
   $('#taxAlloc #modalBtn').trigger('click');
 }

}
