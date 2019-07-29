import { Title } from '@angular/platform-browser';
import { NotesService,AccountingService,MaintenanceService } from '@app/_services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccInvestments} from '@app/_models';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MtnBankComponent } from '@app/maintenance/mtn-bank/mtn-bank.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnAcctIntDurationComponent } from '@app/maintenance/mtn-acct-int-duration/mtn-acct-int-duration.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements OnInit {
  
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(MtnBankComponent) bankLOV: MtnBankComponent;
  @ViewChild(MtnAcctIntDurationComponent) durationLOV: MtnAcctIntDurationComponent;
  @ViewChild(ModalComponent) modal : ModalComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];

   passData: any = {
   	 tableData: [],
   	 tHeader: ["Investment Code","Bank","Certificate No.","Investment Type","Security","Status","Maturity Period","Duration Unit","Interest Rate","Date Purchased","Maturity Date","Curr","Curr Rate","Investment","Investment Income","Bank Charges","Withholding Tax","Maturity Value"],
   	 resizable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
   	 dataTypes: ['reqtext','select','reqtext','select','select','select','number','select','percent','date','date','select','percent','currency','currency','currency','currency','currency'],
   	 nData: {
          invtId   : null,
          invtCd   : null,
          bank     : null,
          certNo   : null,
          invtType : null,
          invtSecCd: null,
          invtStatus:'F',
          matPeriod: null,
          durUnit  : 'Days',
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
          uneditable : ['invtStatus']
        },
   	 total:[null,null,null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','matVal'],
     opts: [ {selector: 'invtType', prev: [], vals: []},
             {selector: 'invtSecCd', prev: [], vals: []},
             {selector: 'invtStatus', prev: [], vals: []},
             {selector: 'durUnit', prev: [], vals: []},
             {selector: 'currCd', prev: [], vals: []},
             {selector: 'bank', prev: [], vals: []},
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
     widths: [150,130,150,150,150,130,1,1,100,85,90,80,100,120,100,120,120],
     keys: ['invtCd','bank','certNo','invtType',
            'invtSecCd','invtStatus','matPeriod','durUnit','intRt','purDate',
            'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
            'whtaxAmt','matVal'],
   };

   searchParams: any[] = [];
   subscription: Subscription = new Subscription();

   invtRecord : any = {
      createUser    : null,
      createDate    : null,
      updateUser    : null,
      updateDate    : null,
    }

   selectedData : any;
   bankCd: any = '';
   bankName: any = '';
   duration: any = '';

    oldRecord    : any = {
      bankCd      : null,
      duration    : null
    }

    dialogIcon: string = '';
    dialogMessage: string = '';
    oldData:any[] =[];

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
                this.mtnService.getMtnBank('','','Y'),
                this.mtnService.getMtnInvtSecType('','Y'),
                this.mtnService.getMtnCurrency('','Y')).pipe(map(([investments, type, status, duration, bank,invtSecType, currency ]) => { return { investments, type, status, duration, bank, invtSecType, currency  }; }));

      this.subscription = sub$.subscribe(data => {
        console.log(data);
        
        var td = data['investments']['invtList'].sort((a, b) => b.createDate - a.createDate).map(a => { 
                                      a.createDate = this.ns.toDateTimeString(a.createDate).split('T')[0] + ' ' + this.ns.toDateTimeString(a.createDate).split('T')[1];
                                      a.updateDate = this.ns.toDateTimeString(a.updateDate).split('T')[0] + ' ' + this.ns.toDateTimeString(a.updateDate).split('T')[1];
                                      a.uneditable = ['invtStatus','matVal'];
                                   return a; });

        this.passData.tableData = td;
        this.passData.disableAdd = false;

        this.passData.opts[0].vals = data['type']['refCodeList'].map(a => a.code);
        this.passData.opts[0].prev = data['type']['refCodeList'].map(a => a.description);

        this.passData.opts[1].vals = data['invtSecType']['invSecTypeList'].map(a => a.invtSecCd);
        this.passData.opts[1].prev = data['invtSecType']['invSecTypeList'].map(a => a.secDesc);

        this.passData.opts[2].vals = data['status']['refCodeList'].map(a => a.code);
        this.passData.opts[2].prev = data['status']['refCodeList'].map(a => a.description);

        this.passData.opts[3].vals = data['duration']['refCodeList'].map(a => a.code);
        this.passData.opts[3].prev = data['duration']['refCodeList'].map(a => a.description);

        this.passData.opts[4].vals = data['currency']['currency'].map(a => a.currencyCd);
        this.passData.opts[4].prev = data['currency']['currency'].map(a => a.currencyCd);

        this.passData.opts[5].vals = data['bank']['bankList'].map(a => a.bankCd);
        this.passData.opts[5].prev = data['bank']['bankList'].map(a => a.shortName);

        this.table.refreshTable();
      });
  }

  onRowClick(data){
    console.log(data);

    if(data !== null){
      this.selectedData = data;
      this.invtRecord.createUser  = data.createUser;
      this.invtRecord.createDate  = data.createDate;
      this.invtRecord.updateUser  = data.updateUser;
      this.invtRecord.updateDate  = data.updateDate;

       if(this.selectedData.okDelete == 'N'){
           this.passData.disableGeneric = true;     
       }else{
           this.passData.disableGeneric = false;
       }
    } else {
      this.passData.disableGeneric    = true;
      this.invtRecord.createUser  = null;
      this.invtRecord.createDate  = null;
      this.invtRecord.updateUser  = null;
      this.invtRecord.updateDate  = null;
    }

  }

  showBankLOV(ev){
     this.bankLOV.modal.openNoClose();
  }

  setSelectedBank(data){
    console.log(data);
    this.bankCd = data.bankCd;
    this.bankName = data.shortName;
    this.ns.lovLoader(data.ev, 0);
  }

  checkCode(ev, field){
        if(field === 'Bank'){
            this.ns.lovLoader(ev, 1);
            this.bankLOV.checkCode(this.bankName,ev);
        } else if ( field === 'Duration'){
            this.ns.lovLoader(ev,1);
            this.durationLOV.checkCode(this.duration,ev);
        }
  }

  showDurationLOV(){
    this.durationLOV.modal.openNoClose();
  }

  setSelectedDuration(data){
    console.log(data);
    this.duration = data.code;
    this.ns.lovLoader(data.ev, 0);
  }

    update(data){
      for(var i= 0; i< this.passData.tableData.length; i++){

         if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted || this.passData.tableData[i].add){

             if(this.passData.tableData[i].matDate.length > 0 || this.passData.tableData[i].purDate.length > 0 || 
                this.passData.tableData[i].matPeriod.length > 0 ){

                 if(this.passData.tableData[i].matDate.length > 0 || this.passData.tableData[i].purDate.length > 0 && 
                    this.passData.tableData[i].matPeriod.length > 0) {

                     if(this.passData.tableData[i].matDate < this.passData.tableData[i].purDate){
                       this.dialogMessage="Maturity Date must be greater than Data Purchased";
                       this.dialogIcon = "error-message";
                       this.successDialog.open();
                       this.passData.tableData[i].matDate = null;
                       this.passData.tableData[i].matPeriod = null;
                      }else if(this.passData.tableData[i].durUnit === 'Days'){
                                 this.passData.tableData[i].matPeriod = this.computeMatPeriod(
                                                                        this.passData.tableData[i].matDate,
                                                                        this.passData.tableData[i].purDate,
                                                                        'Days');
                      } else if (this.passData.tableData[i].durUnit === 'Months'){
                                 this.passData.tableData[i].matPeriod = this.computeMatPeriod(
                                                                        this.passData.tableData[i].matDate,
                                                                        this.passData.tableData[i].purDate,
                                                                        'Months');
                      } else if (this.passData.tableData[i].durUnit === 'Years'){
                                 this.passData.tableData[i].matPeriod = this.computeMatPeriod(
                                                                        this.passData.tableData[i].matDate,
                                                                        this.passData.tableData[i].purDate,
                                                                        'Years');
                      } 
                }
          }  
      }
    }
     this.table.refreshTable();
  }


 
  computeMatPeriod(date1,date2,unit){
   var to_date = new Date(date1);
   var from_date = new Date(date2);

   var diffDays = Math.floor(Math.abs(<any>from_date - <any>to_date) / (1000*60*60*24));
   var diffMonths = (to_date.getFullYear()*12 + to_date.getMonth()) - (from_date.getFullYear()*12 + from_date.getMonth());
   
/*   var diff = Math.floor(date1.getTime() - date2.getTime());
   var day = 1000 * 60 * 60 * 24;
   var days = Math.floor(diff/day);
   var months = Math.floor(days/31);
   var years = Math.floor(months/12);

   console.log(days);
   console.log(differenceMonths)
 
  console.log(years);*/

   if(unit === 'Days'){
      return diffDays;
   } else if (unit === 'Months'){
      return diffMonths;
   } else if (unit === 'Years'){
     return null;
   }

  } 
  
  computeMatDate(date1,period){
    var today = new Date(date1);
    var newdate = new Date();
    var addDate = parseInt(period);



    return newdate.setDate(today.getDate()+ addDate);
  }





}
