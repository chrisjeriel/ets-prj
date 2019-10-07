import { Component, OnInit, Input } from '@angular/core';
import { AccountingService } from '@app/_services';
import { ORPrevAmountDetails , ORPrevAccEntries , ORPreVATDetails , ORPreCreditableWTaxDetails } from '@app/_models';

@Component({
  selector: 'app-or-preview',
  templateUrl: './or-preview.component.html',
  styleUrls: ['./or-preview.component.css']
})
export class OrPreviewComponent implements OnInit {
  
   /*passDataAmountDetails: any = {
  	tableData: [],
    tHeader: ["Item No", "Gen Type", "Detail", "Original Amount", "Currency","Currency Rate","Local Amount"],
    dataTypes: ["text", "text", "text", "currency", "text","percent","currency"],
    resizable: [true, true, true, true, true, true, true],
    nData: new ORPrevAmountDetails(null,null,null,null,null,null,null),
    total:[null,null,'TOTAL',null,null,null,'localAmount'],
    checkFlag: true,
    addFlag: true,
    deleteFlag: true,
    genericBtn: 'Save',
    pageLength: 10,
    widths: [70,70,'auto',160,60,160,160],
    paginateFlag:true,
    infoFlag:true
  }*/

  @Input() paymentType: string = "";
  @Input() record: any = {};
  createUpdate: any;

   acctEntriesData: any = {
  	tableData: [],
    tHeader: ['Account Code','Account Name','SL Type','SL Name','Local Debit','Local Credit','Debit','Credit'],
    uneditable:[true,true,true,true,true,true,false,false],
    keys:['glShortCd','glShortDesc','slTypeName','slName','debitAmt','creditAmt','foreignDebitAmt','foreignCreditAmt'],
    dataTypes: ['text','text','text','text','currency','currency','currency','currency'],
    nData: {
        tranId: '',
        entryId: '',
        glAcctId: '',
        glShortCd: '',
        glShortDesc:'',
        slTypeCd: '',
        slTypeName: '',
        slCd: '',
        slName: '',
        creditAmt: 0,
        debitAmt: 0,
        foreignDebitAmt: 0,
        foreignCreditAmt: 0,
        autoTag: '',
        createUser: '',
        createDate: '',
        updateUser: '',
        updateDate: '',
        showMG:1,
        edited: true
      },
    addFlag: true,
    deleteFlag: true,
    editFlag: false,
    pageLength: 10,
    widths: [105,240,125,170,120,120,120,120],
    checkFlag: true,
    magnifyingGlass: ['glShortCd','slTypeName','slName'],
    total: [null,null,null,'TOTAL DEBIT AND CREDIT','debitAmt', 'creditAmt','foreignDebitAmt','foreignCreditAmt']
  }

   genTaxData: any = {
    tableData: [],
    tHeader: ['#', 'Gen Type', 'Tax Code', 'Description', 'BIR RLF Purchase Type', 'Tax Rate', 'Payor', 'Base Amount', 'Tax Amount'],
    dataTypes: ['number', 'text', 'text', 'text', 'text', 'percent', 'text', 'currency', 'currency'],
    //opts: [{ selector: "vatType", vals: ["Output", "Input"] }],
	  nData: {
            tranId: '',
            taxType: 'G',
            taxSeqNo: '',
            taxCd: '',
            genType: 'M',
            taxName: '',
            purchaseType: '',
            taxRate: '',
            payor: '',
            baseAmt: 0,
            taxAmt: 0,
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
    },
    keys: ['taxSeqNo', 'genType', 'taxCd', 'taxName', 'purchaseType', 'taxRate', 'payor', 'baseAmt', 'taxAmt'],
    pageID: 'genTax',
    addFlag: true,
    deleteFlag: true,
    total: [null,null,null,null, null, null, 'Total', 'baseAmt', 'taxAmt'],
    pageLength:5,
    widths: [1,1,50,150,'auto',100,200,150,150],
    paginateFlag:true,
    infoFlag:true,
    checkFlag: true
  }

  whTaxData: any = {
   tableData: [],
    tHeader: ['#', 'Gen Type', 'BIR Tax Code', 'Description', 'WTax Rate', 'Payor','Base Amount', 'WTax Amount'],
    dataTypes: ['text', 'text', 'text', 'text', 'percent','text', 'currency', 'currency'],
    // opts:[
    //   {
    //     selector: 'birTaxCode',
    //     vals: ['WC002', 'WC010', 'WC020'],
    //   }
    // ],
    nData: {
            tranId: '',
            taxType: 'W',
            taxSeqNo: '',
            taxCd: '',
            genType: 'M',
            taxName: '',
            purchaseType: '',
            taxRate: '',
            payor: '',
            baseAmt: 0,
            taxAmt: 0,
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: ''
    },
    keys: ['taxSeqNo', 'genType', 'taxCd', 'taxName', 'taxRate', 'payor', 'baseAmt', 'taxAmt'],
    pageID: 'whTax',
    addFlag: true,
    deleteFlag: true,
    pageLength:5,
    total: [null,null,null,null, null, 'Total', 'baseAmt', 'taxAmt'],
    widths: [1,1,50,200,100,200,150,150],
    paginateFlag:true,
    infoFlag:true,
    checkFlag: true
  }

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
    if(this.paymentType == null){
          this.paymentType = "";
    }

  	/*this.passDataAmountDetails.tableData = this.accountingService.getORPrevAmountDetails();
  	this.passDataAccountingEntries.tableData = this.accountingService.getORPrevAccEntries();
  	this.passDataAccountingVATTaxDetails.tableData = this.accountingService.getORPrevTaxDetails();
  	this.passDataAccountingCreditableTaxDetails.tableData = this.accountingService.getORPrevCredWTaxDetails();*/
  }

}
