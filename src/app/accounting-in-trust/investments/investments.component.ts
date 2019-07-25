import { Title } from '@angular/platform-browser';
import { NotesService,AccountingService,MaintenanceService } from '@app/_services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccInvestments} from '@app/_models';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

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
   	 tableData: [],
   	 tHeader: ["Investment Code","Bank","Certificate No.","Investment Type","Security","Status","Maturity Period","Duration Unit","Interest Rate","Date Purchased","Maturity Date","Curr","Curr Rate","Investment","Investment Income","Bank Charges","Withholding Tax","Maturity Value"],
   	 resizable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
   	 dataTypes: ['reqtext','reqtext','reqtext','select','select','select','number','select','percent','date','date','select','percent','currency','currency','currency','currency','currency'],
   	 nData: {
          invtId   : null,
          invtCd   : null,
          bank     : null,
          certNo   : null,
          invtType : null,
          invtSecCd: null,
          invtStatus:null,
          matPeriod: null,
          durUnit  : null,
          intRt    : null,
          purDate  : null,
          matDate  : null,
          cucurrCd : null,
          currRate : null,
          invtAmt  : null,
          incomeAmt: null,
          bankCharge: null,
          whtaxAmt : null,
          matVal   : null,
          createUser: this.ns.getCurrentUser(),
          createDate: this.ns.toDateTimeString(0),
          updateUser: this.ns.getCurrentUser(),
          updateDate: this.ns.toDateTimeString(0),
        },
   	 total:[null,null,null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','matVal'],
     opts: [ {selector: 'invtType', prev: [], vals: []},
             {selector: 'invtSecCd', prev: [], vals: []},
             {selector: 'invtStatus', prev: [], vals: []},
             {selector: 'durUnit', prev: [], vals: []},
             {selector: 'currCd', prev: [], vals: []},
       /*{ selector: "durUnit", vals: ["Years","Months","Weeks","Days"] },
       { selector: "investmentType", vals: ["Time Deposit","Treatsury"] },
       { selector: "status", vals: ["Matured","Outstanding"] },
       { selector: "curr", vals: ["PHP","USD","EUR","YEN"] }*/

     ],
     filters: [
       {
            key: 'invtCd',
            title:'Investment Code',
            dataType: 'text'
       },
       {
            key: 'bank',
            title:'Bank',
            dataType: 'text'
       },
       {
            key: 'invtType',
            title:'Inv. Type',
            dataType: 'text'
       },
       {
            key: 'invtStatus',
            title:'Status',
            dataType: 'text'
       },
       {
            key: 'matPeriod',
            title:'MaturityPeriod',
            dataType: 'text'
       },
       {
            key: 'durUnit',
            title:'Duration Unit',
            dataType: 'text'
       },
       {
            key: 'purDate',
            title:'Date Purchased',
            dataType: 'date'
       },
       {
            key: 'currCd',
            title:'Currency',
            dataType: 'text'
       },
     ],
   	 addFlag: true,
     disableAdd : true,
     searchFlag: true,
     infoFlag: true,
     paginateFlag: true,
     pageStatus: true,
     pagination: true,
     genericBtn: 'Delete',
     disableGeneric : true,
     pageLength: 15,
     widths: [190,190,120,120,80,85,1,1,1,85,90,120,120,120,120,120,120],
     keys: ['invtCd','bank','certNo','invtType',
            'invtSecCd','invtStatus','matPeriod','durUnit','intRt','purDate',
            'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
            'whtaxAmt','matVal'],
   };

   searchParams: any[] = [];
   subscription: Subscription = new Subscription();

  constructor(private accountingService: AccountingService,private titleService: Title,private router: Router,private ns: NotesService, private mtnService: MaintenanceService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Investments");
    this.retrieveInvestmentsList();
  	//this.passData.tableData = this.accountingService.getAccInvestments();
    //this.passData.opts.push({ selector: "bank", vals: ["BPI", "RCBC", "BDO"] });
    //this.passData.opts.push({ selector: "durUnit", vals: ["Years","Months","Weeks","Days"] });

  }

  onTabChange($event: NgbTabChangeEvent) {return ;
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 
  
  }

  retrieveInvestmentsList(){
      var sub$ = forkJoin(this.accountingService.getAccInvestments(this.searchParams),
                this.mtnService.getRefCode('ACIT_INVESTMENTS.INVT_TYPE'),
                this.mtnService.getRefCode('ACIT_INVESTMENTS.INVT_STATUS'),
                this.mtnService.getRefCode('ACIT_INVESTMENTS.DURATION_UNIT'),
                this.mtnService.getMtnCurrency('','Y')).pipe(map(([investments, type, status, duration, currency ]) => { return { investments, type, status, duration, currency  }; }));

      this.subscription = sub$.subscribe(data => {
        console.log(data);
        
        var td = data['investments']['invtList'].sort((a, b) => b.createDate - a.createDate).map(a => { 
                                      a.createDate = this.ns.toDateTimeString(a.createDate);
                                      a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                   return a; });

        this.passData.tableData = td;
        this.passData.disableAdd = false;
        this.passData.disableGeneric = false;

        this.passData.opts[0].vals = data['type']['refCodeList'].map(a => a.code);
        this.passData.opts[0].prev = data['type']['refCodeList'].map(a => a.description);

        this.passData.opts[2].vals = data['status']['refCodeList'].map(a => a.code);
        this.passData.opts[2].prev = data['status']['refCodeList'].map(a => a.description);

        this.passData.opts[3].vals = data['duration']['refCodeList'].map(a => a.code);
        this.passData.opts[3].prev = data['duration']['refCodeList'].map(a => a.description);

        this.passData.opts[4].vals = data['currency']['currency'].map(a => a.currencyCd);
        this.passData.opts[4].prev = data['currency']['currency'].map(a => a.currencyCd);

        this.table.refreshTable();

      });

     

    /*this.accountingService.getAccInvestments(this.searchParams)
        .subscribe((val:any) =>
        {
            this.passData.tableData = val['invtList']
              .map(i => {

                   i.createDate = this.ns.toDateTimeString(i.createDate);
                   i.updateDate = this.ns.toDateTimeString(i.updateDate);
                   return i;
            }); 
            this.table.refreshTable();

            if(this.passData.opts[0].vals.length === 0 && this.passData.opts[0].prev.length === 0){
            this.mtnService.getRefCode('ACIT_INVESTMENTS.INVT_TYPE').subscribe((data: any) =>{
                for(var ref of data.refCodeList){
                  this.passData.opts[0].vals.push(ref.code);
                  this.passData.opts[0].prev.push(ref.description);
                }
                this.table.refreshTable();
            });
          }

        } 
    );  */
  }

  formatDate(date){
       var dt = new Date(date);
       return (dt.getMonth()+1) + '-' + dt.getDate() + '-' + dt.getFullYear(); 
  }
}
