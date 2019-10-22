import { AccountingService } from '@app/_services';
import { Title } from  '@angular/platform-browser';
import { OfficialReceipt,AccORSerFeeLoc } from '@app/_models';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-acct-or-official-receipt',
  templateUrl: './acct-or-official-receipt.component.html',
  styleUrls: ['./acct-or-official-receipt.component.css']
})
export class AcctOrOfficialReceiptComponent implements OnInit {
  passDataOfficialReceipt : any = {
    tableData: [],
    tHeader : ["Item","Reference No","Curr","Curr Rate","Amount","Amount(PHP)"],
    dataTypes: ["text","text","text","percent","currency","currency"],
    addFlag: true,
    deleteFlag: true,
    checkFlag: true,
    infoFlag: true,
    pageLength: 10,
    paginateFlag: true,
    total: [null,null,null,'Total','currAmt','localAmt'],
    uneditable: [false,false,true,true,false,false],
    nData: {
        tranId: '',
        billId: '',
        itemNo: '',
        itemName: '',
        currCd: '',
        currRate: '',
        currAmt: 0,
        localAmt: 0,
        refNo: '',
        remarks: '',
        createUser: '',
        createDate: '',
        updateUser: '',
        updateDate: ''
    },
    keys: ['itemName', 'refNo', 'currCd', 'currRate', 'currAmt', 'localAmt'],
    widths: ['auto',120,1,100,120,120]
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

  @Input() paymentType: string = "";
  @Input() record: any = {};
  @ViewChild(NgbTabset) tabset: any;
  createUpdate: any;

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
 
 onTabChange($event: NgbTabChangeEvent) {

   if($('.ng-dirty.ng-touched:not([type="search"]):not(.exclude)').length != 0){
     console.log('here 3');
     $event.preventDefault();
     const subject = new Subject<boolean>();
     const modal = this.modalService.open(ConfirmLeaveComponent,{
         centered: true, 
         backdrop: 'static', 
         windowClass : 'modal-size'
     });
     modal.componentInstance.subject = subject;

     subject.subscribe(a=>{
       if(a){
         console.log('here 4');
         $('.ng-dirty').removeClass('ng-dirty');
         this.tabset.select($event.nextId);
       }
     })
   
   }
 }

}
