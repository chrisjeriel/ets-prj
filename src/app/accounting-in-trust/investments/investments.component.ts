
import { Title } from '@angular/platform-browser';
import { NotesService,AccountingService } from '@app/_services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccInvestments} from '@app/_models';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';


@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements OnInit {
  
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];

   passData: any = {
   	 tableData: [
        /*{
          bank: 'BPI',
          certificateNo: 'BPI 1',
          investmentType: 'Time Deposit',
          status: 'Matured',
          maturityPeriod: 5,
          durUnit: 'Years',
          interestRate: 8.875,
          datePurchased: new Date('2013-10-20'),
          maturityDate: new Date('2018-10-20'),
          curr: 'PHP',
          currRate: 1,
          investment: 14000000,
          investmentIncome: 4112500,
          bankCharges: 18112.50,
          withholdingTax: 82250,
          maturityValue: 18112500
        },
        {
          bank: 'RCBC',
          certificateNo: 'RCBC 1',
          investmentType: 'Treatsury',
          status: 'Outstanding',
          maturityPeriod: 35,
          durUnit: 'Days',
          interestRate: 1.5,
          datePurchased: new Date('2018-09-26'),
          maturityDate: new Date('2018-10-31'),
          curr: 'PHP',
          currRate: 1,
          investment: 10000000,
          investmentIncome: 150000,
          bankCharges: 10150,
          withholdingTax: 3000,
          maturityValue: 10150000
        }*/
      ],
   	 tHeader: ["Investment Code","Bank","Certificate No.","Investment Type","Status","Maturity Period","Duration Unit","Interest Rate","Date Purchased","Maturity Date","Curr","Curr Rate","Investment","Investment Income","Bank Charges","Withholding Tax","Maturity Value"],
   	 resizable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
   	 dataTypes: ['reqtext','reqtext','reqtext','select','select','number','select','percent','date','date','select','percent','currency','currency','currency','currency','currency'],
   	 nData: {
          invesmentCd : null,
          bank: null,
          certificateNo: null,
          investmentType: null,
          maturityPeriod: null,
          status:null,
          durUnit: null,
          interestRate: null,
          datePurchased: null,
          maturityDate: null,
          curr: null,
          currRate: null,
          investment: null,
          investmentIncome: null,
          bankCharges: null,
          withholdingTax: null,
          maturityValue: null,
          createUser: this.ns.getCurrentUser(),
          createDate: this.ns.toDateTimeString(0),
          updateUser: this.ns.getCurrentUser(),
          updateDate: this.ns.toDateTimeString(0),
        },
   	 total:[null,null,null,null,null,null,null,null,null,null,null,'Total','investment','investmentIncome','bankCharges','withholdingTax','maturityValue'],
     opts: [
       { selector: "durUnit", vals: ["Years","Months","Weeks","Days"] },
       { selector: "investmentType", vals: ["Time Deposit","Treatsury"] },
       { selector: "status", vals: ["Matured","Outstanding"] },
       { selector: "curr", vals: ["PHP","USD","EUR","YEN"] }
     ],
     filters: [
       {
            key: 'bank',
            title:'Bank',
            dataType: 'text'
       },
       {
            key: 'investmentType',
            title:'Inv. Type',
            dataType: 'text'
       },
       {
            key: 'status',
            title:'Status',
            dataType: 'text'
       },
       {
            key: 'maturityPeriod',
            title:'MaturityPeriod',
            dataType: 'text'
       },
       {
            key: 'durUnit',
            title:'Duration Unit',
            dataType: 'text'
       },
       {
            key: 'datePurchased',
            title:'Date Purchased',
            dataType: 'date'
       },
       {
            key: 'curr',
            title:'Currency',
            dataType: 'text'
       },
     ],
   	 addFlag: true,
     searchFlag: true,
     infoFlag: true,
     paginateFlag: true,
     pageStatus: true,
     pagination: true,
     genericBtn: 'Delete',
     pageLength: 10,
     widths: [190,190,120,120,80,85,1,1,1,85,90,120,120,120,120,120,120],
   };

  constructor(private accountingService: AccountingService,private titleService: Title,private router: Router,private ns: NotesService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Investments");
  	//this.passData.tableData = this.accountingService.getAccInvestments();
    //this.passData.opts.push({ selector: "bank", vals: ["BPI", "RCBC", "BDO"] });
    //this.passData.opts.push({ selector: "durUnit", vals: ["Years","Months","Weeks","Days"] });

  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 
  
  }


}
