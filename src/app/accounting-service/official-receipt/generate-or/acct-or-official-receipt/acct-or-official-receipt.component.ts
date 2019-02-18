import { Component, OnInit, Input } from '@angular/core';
import { AccountingService } from '@app/_services';
import { Title } from  '@angular/platform-browser';
import { OfficialReceipt,AccORSerFeeLoc } from '@app/_models';

@Component({
  selector: 'app-acct-or-official-receipt',
  templateUrl: './acct-or-official-receipt.component.html',
  styleUrls: ['./acct-or-official-receipt.component.css']
})
export class AcctOrOfficialReceiptComponent implements OnInit {
  passDataOfficialReceipt : any = {
    tableData: this.accountingService.getOfficialReceipt(),
    tHeader : ["Item","Curr","Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text","text","percent","currency","currency"],
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    checkFlag: true,
    infoFlag: true,
    pageLength: 10,
    paginateFlag: true,
    total: [null,null,'Total','amount','amountPHP'],
    nData: new OfficialReceipt(null,null,null,null,null),
    widths: ['auto',1,100,'auto','auto']
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

  @Input() paymentType: string = "type";

  constructor(private accountingService: AccountingService, private titleService: Title) { }
  
  ngOnInit() {
  	this.titleService.setTitle("Acct-Srvc | OR Details");
  	if(this.paymentType == null){
      this.paymentType = "";
    }
  
    console.log(this.paymentType);
 }

}
