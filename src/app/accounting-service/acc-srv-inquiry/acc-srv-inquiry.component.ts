import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbTabChangeEvent,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AccSrvInquiry, TaxDetails, WTaxDetails} from '@app/_models';
import { AccountingService } from '@app/_services';

@Component({
  selector: 'app-acc-srv-inquiry',
  templateUrl: './acc-srv-inquiry.component.html',
  styleUrls: ['./acc-srv-inquiry.component.css']
})
export class AccSrvInquiryComponent implements OnInit {

    passData: any = {
    tHeader: [
        "Tran Type","Ref No.", "Tran Date","Payee/Payor", "Particulars", "Edited By",
        "Date Edited","Reason","Status","Amount"
    ],
    resizable: [
            true,true, true, true, true, true,
            true,true,true,true
    ],
    dataTypes: [
            "text","text", "date", "text","text","text",
            "date","text","text","currency"
    ],
    total:[null,null,null,null,null,null,null,null,'Total','amount'],
    magnifyingGlass: [],
    options: [],
    opts: [],
    nData: {},
    checkFlag: false,
    selectFlag: false,
    addFlag: false, 
    editFlag: false,
    deleteFlag: false,
    infoFlag: true,
    searchFlag: true,
    pageLength: 20,
/*    widths: [60,100,100,150,200,150,100,'auto',60,150],*/
    pagination: true,
    pageStatus: true,
    printBtn: false,
    filters: [
            {
                key: 'tranType',
                title: 'Tran Type',
                dataType: 'text'
            },
            {
                key: 'refNo',
                title: 'Ref. No.',
                dataType: 'text'
            },
            {
                key: 'tranDate',
                title: 'Tran Date',
                dataType: 'date'
            },
            {
                key: 'payee',
                title: 'Payee/Payor',
                dataType: 'text'
            },
            {
                key: 'particulars',
                title: 'Particulars',
                dataType: 'text'
            },
            {
                key: 'editedBy',
                title: 'Edited By',
                dataType: 'text'
            },
            {
                key: 'dateEdited',
                title: 'Date Edited',
                dataType: 'date'
            },
            {
                key: 'reason',
                title: 'Reason',
                dataType: 'text'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
            {
                key: 'amount',
                title: 'Amount',
                dataType: 'text'
            },     
        ],
  };

  passOldVatData: any = {
    tableData: [],
    tHeader: ['VAT Type','BIR RLF Purchase Type','Payor','Base Amount', 'VAT AMount'],
    resizable: [true, true, true, true, true],
    dataTypes: ['text','text','text','currency','currency'],
    nData: new TaxDetails(null,null,null,null,null),
    total:[null,null,null,'Total','vatAmt'],
    checkFlag: false,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,]
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 3,
    widths:[150,200,'auto',150,150],
    genericBtn: 'Save'
  };

  passNewVatData: any = {
    tableData: [],
    tHeader: ['VAT Type','BIR RLF Purchase Type','Payor','Base Amount', 'VAT AMount'],
    resizable: [true, true, true, true, true],
    dataTypes: ['text','text','text','currency','currency'],
    nData: new TaxDetails(null,null,null,null,null),
    total:[null,null,null,'Total','vatAmt'],
    checkFlag: false,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 3,
    widths:[150,200,'auto',150,150],
    genericBtn: 'Save'
  };

  passDataOldWTax: any = {
    tableData: [],
    tHeader: ['Bill Tax Code','Description', 'WTax Rate','Payor','Base Amount', 'WTax AMount'],
    resizable: [true, true, true, true, true , true],
    dataTypes: ['text','text','percent','text','currency','currency'],
    nData: new WTaxDetails(null,null,null,null,null,null),
    total:[null,null,null,null,'Total','wTaxAmt'],
    checkFlag: false,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 3,
    widths:[80,'auto',100,'auto',150,150],
    genericBtn: 'Save'
  };

  passDataNewWTax: any = {
    tableData: [],
    tHeader: ['Bill Tax Code','Description', 'WTax Rate','Payor','Base Amount', 'WTax AMount'],
    resizable: [true, true, true, true, true , true],
    dataTypes: ['text','text','percent','text','currency','currency'],
    nData: new WTaxDetails(null,null,null,null,null,null),
    total:[null,null,null,null,'Total','wTaxAmt'],
    checkFlag: false,
    addFlag: true,
    deleteFlag: true,
    infoFlag: true,
    paginateFlag: true,
    searchFlag: false,
    pagination: true,
    pageStatus: true,
    selectFlag: false,
    editFlag: false,
    pageLength: 3,
    widths:[80,'auto',100,'auto',150,150],
    genericBtn: 'Save'
  };

  constructor(private titleService: Title, private router: Router, private accountingService: AccountingService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc-Srv | Inquiry") ;
    this.passData.tableData = this.accountingService.getAccSrvInquiry();
    this.passOldVatData.tableData = this.accountingService.getTaxDetails();
    this.passNewVatData.tableData = this.accountingService.getTaxDetails();
    this.passDataOldWTax.tableData = this.accountingService.getWTaxDetails();
    this.passDataNewWTax.tableData = this.accountingService.getWTaxDetails();
  }

   onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('');
    }
  }

  showEditTaxDetails(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  } 

}
