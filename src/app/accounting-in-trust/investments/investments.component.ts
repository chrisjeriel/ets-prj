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
import { finalize } from 'rxjs/operators';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';

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
    @ViewChild("confirmSave") confirmSave: ConfirmSaveComponent;

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
          invtType : '2',
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
          uneditable : ['invtStatus','currRate']
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
     widths: [130,130,150,150,150,130,1,1,100,85,90,80,100,120,100,120,130],
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
    currencyData: any[] = [];
    wtaxRate: any;

  constructor(private accountingService: AccountingService,private titleService: Title,private router: Router,private ns: NotesService, private mtnService: MaintenanceService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Investments");
    this.retrieveInvestmentsList();
    this.getWTaxRate();
    this.oldData = this.passData.tableData;
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
                                      a.matDate = this.ns.toDateTimeString(a.matDate).split('T')[0] + ' ' + this.ns.toDateTimeString(a.matDate).split('T')[1];
                                      a.purDate = this.ns.toDateTimeString(a.purDate).split('T')[0] + ' ' + this.ns.toDateTimeString(a.purDate).split('T')[1];
                                      a.createDate = this.ns.toDateTimeString(a.createDate).split('T')[0] + ' ' + this.ns.toDateTimeString(a.createDate).split('T')[1];
                                      a.updateDate = this.ns.toDateTimeString(a.updateDate).split('T')[0] + ' ' + this.ns.toDateTimeString(a.updateDate).split('T')[1];
                                      if (a.invtStatus === 'F'){
                                        a.uneditable = ['invtStatus','matVal','currRate'];
                                      } else if(a.invtStatus === 'M' || a.invtStatus === 'O'){
                                        a.uneditable = ['invtStatus','matVal','currRate','invtAmt'];
                                      } else {
                                        a.uneditable = ['invtCd','bank','certNo','invtType',
                                                        'invtSecCd','invtStatus','matPeriod','durUnit','intRt','purDate',
                                                        'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
                                                        'whtaxAmt','matVal'];
                                      }
                                      
                                   return a; });

        this.passData.tableData = td;
        this.passData.disableAdd = false;
        this.currencyData = data['currency']['currency'];

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
    this.duration = data.code;
    this.ns.lovLoader(data.ev, 0);
  }


  update(data){
      for(var i= 0; i< this.passData.tableData.length; i++){

         if(this.passData.tableData[i].edited || this.passData.tableData[i].add){

           //LOGIC-COMPUTATION
               if (this.passData.tableData[i].durUnit !== null || this.passData.tableData[i].durUnit !== ''   && 
                   this.passData.tableData[i].intRt !== null || this.passData.tableData[i].intRt !== '' &&
                   this.passData.tableData[i].matPeriod !== null || this.passData.tableData[i].matPeriod !== ''  && 
                   this.passData.tableData[i].invtAmt !== null &&  this.passData.tableData[i].invtAmt !== '' 
                   ){


                  var principal = parseFloat(this.passData.tableData[i].invtAmt),
                     rate = parseFloat(this.passData.tableData[i].intRt)/100,
                     time,
                     matPeriod;

                       if(this.passData.tableData[i].durUnit === 'Days'){
                         if(data.key === 'matPeriod'){
                           matPeriod = this.passData.tableData[i].matPeriod
                         }else {
                           matPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);                     
                         }  
                          time = parseFloat(matPeriod)/360;
                       } else if (this.passData.tableData[i].durUnit === 'Months'){
                         if(data.key === 'matPeriod'){
                           matPeriod = this.passData.tableData[i].matPeriod
                         }else {
                           matPeriod = this.getMaturationPeriod('Months',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);                     
                         }
                         time = parseFloat(matPeriod)/12;
                       } else if (this.passData.tableData[i].durUnit === 'Years'){
                         if(data.key === 'matPeriod'){
                           matPeriod = this.passData.tableData[i].matPeriod
                         }else {
                           matPeriod = this.getMaturationPeriod('Years',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);                     
                         }
                         time = parseFloat(matPeriod);
                       }


                 var invtIncome = principal * rate * time;
                 this.passData.tableData[i].incomeAmt = invtIncome;

                 if(invtIncome === null){
                 }else {
                   var taxRate = parseFloat(this.wtaxRate) / 100,
                       withHTaxAmt = invtIncome * taxRate,
                       bankCharges = (this.passData.tableData[i].bankCharge === null || this.passData.tableData[i].bankCharge === '' ) ? null : this.passData.tableData[i].bankCharge,
                       matVal;

                       if(Number.isNaN(bankCharges)){
                         matVal = principal + invtIncome - withHTaxAmt;
                       } else {
                         matVal = principal + invtIncome - bankCharges - withHTaxAmt;
                       }

                       this.passData.tableData[i].whtaxAmt = withHTaxAmt;
                       this.passData.tableData[i].matVal = matVal;
                 }
               } 


               
           //LOGIC - DATES
                 if(data.key === 'matPeriod'){
                       if(this.passData.tableData[i].durUnit === 'Days'){
                         var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Days');
                         this.passData.tableData[i].purDate = array[0];
                         this.passData.tableData[i].matDate = array[1];
                       } else if (this.passData.tableData[i].durUnit === 'Months'){
                         var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Months');
                         this.passData.tableData[i].purDate = array[0];
                         this.passData.tableData[i].matDate = array[1];
                       } else if (this.passData.tableData[i].durUnit === 'Years'){
                         var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Years');
                         this.passData.tableData[i].purDate = array[0];
                         this.passData.tableData[i].matDate = array[1];
                       }
                 }else if(data.key === 'currCd'){
                     if (this.passData.tableData[i].currCd === 'PHP'){
                       var currRt = this.getCurrencyRt('PHP');
                       this.passData.tableData[i].currRate = currRt;
                     } else if (this.passData.tableData[i].currCd === 'UKP'){
                       var currRt = this.getCurrencyRt('UKP');
                       this.passData.tableData[i].currRate = currRt;
                     } else if (this.passData.tableData[i].currCd === 'USD'){
                       var currRt = this.getCurrencyRt('USD');
                       this.passData.tableData[i].currRate = currRt;
                     }
                 }else if(data.key === 'purDate'){
                     if(this.isEmptyObject(this.passData.tableData[i].purDate) && this.passData.tableData[i].matDate !== null && this.passData.tableData[i].matDate !== ''){
                       this.passData.tableData[i].matPeriod = null;
                     }else if(this.passData.tableData[i].matDate <= this.passData.tableData[i].purDate && 
                              !this.isEmptyObject(this.passData.tableData[i].matDate) &&
                              !this.isEmptyObject(this.passData.tableData[i].purDate)) { 
                       this.dialogMessage="Maturity Date must be greater than Date Purchased";
                       this.dialogIcon = "error-message";
                       this.successDialog.open();
                       this.passData.tableData[i].matPeriod = null;
                       this.passData.tableData[i].purDate = null;
                     }else if (this.isEmptyObject(this.passData.tableData[i].matPeriod) && this.passData.tableData[i].matDate !== null){
                       if(this.passData.tableData[i].durUnit === 'Days'){
                         var matPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                         this.passData.tableData[i].matPeriod = matPeriod;
                       } else if (this.passData.tableData[i].durUnit === 'Months'){
                         var matPeriod = this.getMaturationPeriod('Months',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                         this.passData.tableData[i].matPeriod = matPeriod;
                       } else if (this.passData.tableData[i].durUnit === 'Years'){
                         var matPeriod = this.getMaturationPeriod('Years',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                             if(matPeriod === 0){
                               this.passData.tableData[i].durUnit = 'Days';
                               var newmatPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                               this.passData.tableData[i].matPeriod = newmatPeriod;
                             } else {
                                this.passData.tableData[i].matPeriod = matPeriod;
                             }
                       }
                     }else if(this.isEmptyObject(this.passData.tableData[i].matDate) && this.passData.tableData[i].matPeriod !== null){
                         if(this.passData.tableData[i].durUnit === 'Days'){
                           var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Days');
                           this.passData.tableData[i].purDate = array[0];
                           this.passData.tableData[i].matDate = array[1];
                         } else if (this.passData.tableData[i].durUnit === 'Months'){
                           var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Months');
                           this.passData.tableData[i].purDate = array[0];
                           this.passData.tableData[i].matDate = array[1];
                         } else if (this.passData.tableData[i].durUnit === 'Years'){
                           var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Years');
                           this.passData.tableData[i].purDate = array[0];
                           this.passData.tableData[i].matDate = array[1];
                         }
                     }else if (this.passData.tableData[i].matPeriod !== null && this.passData.tableData[i].matDate !== null) {
                         if(this.passData.tableData[i].durUnit === 'Days'){
                         var matPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                         this.passData.tableData[i].matPeriod = matPeriod;
                         } else if (this.passData.tableData[i].durUnit === 'Months'){
                           var matPeriod = this.getMaturationPeriod('Months',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                           this.passData.tableData[i].matPeriod = matPeriod;
                         } else if (this.passData.tableData[i].durUnit === 'Years'){
                           var matPeriod = this.getMaturationPeriod('Years',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                             if(matPeriod === 0){
                               this.passData.tableData[i].durUnit = 'Days';
                               var newmatPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                               this.passData.tableData[i].matPeriod = newmatPeriod;
                             } else {
                                this.passData.tableData[i].matPeriod = matPeriod;
                             }
                         }
                     } 
                 }else if(data.key === 'matDate'){
                       if(this.isEmptyObject(this.passData.tableData[i].matDate) && this.passData.tableData[i].purDate !== null && this.passData.tableData[i].purDate !== ''){
                         this.passData.tableData[i].matPeriod = null;
                       }else if(this.passData.tableData[i].matDate <= this.passData.tableData[i].purDate && 
                            !this.isEmptyObject(this.passData.tableData[i].matDate) &&
                            !this.isEmptyObject(this.passData.tableData[i].purDate)) {
                            this.dialogMessage="Maturity Date must be greater than Date Purchased";
                            this.dialogIcon = "error-message";
                            this.successDialog.open();
                            this.passData.tableData[i].matPeriod = null;
                            this.passData.tableData[i].matDate = null;
                      } else if (this.isEmptyObject(this.passData.tableData[i].matPeriod) && this.passData.tableData[i].purDate !== null && this.passData.tableData[i].purDate !== ''){
                         if(this.passData.tableData[i].durUnit === 'Days'){
                           var matPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                           this.passData.tableData[i].matPeriod = matPeriod;
                         } else if (this.passData.tableData[i].durUnit === 'Months'){
                           var matPeriod = this.getMaturationPeriod('Months',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                           this.passData.tableData[i].matPeriod = matPeriod;
                         } else if (this.passData.tableData[i].durUnit === 'Years'){
                           var matPeriod = this.getMaturationPeriod('Years',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                             if(matPeriod === 0){
                               this.passData.tableData[i].durUnit = 'Days';
                               var newmatPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                               this.passData.tableData[i].matPeriod = newmatPeriod;
                             } else {
                                this.passData.tableData[i].matPeriod = matPeriod;
                             }
                         }
                     } else if(this.isEmptyObject(this.passData.tableData[i].purDate) && this.passData.tableData[i].matPeriod !== null && this.passData.tableData[i].matPeriod !== ''){
                         if(this.passData.tableData[i].durUnit === 'Days'){
                           var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Days');
                           this.passData.tableData[i].purDate = array[0];
                           this.passData.tableData[i].matDate = array[1];
                         } else if (this.passData.tableData[i].durUnit === 'Months'){
                           var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Months');
                           this.passData.tableData[i].purDate = array[0];
                           this.passData.tableData[i].matDate = array[1];
                         } else if (this.passData.tableData[i].durUnit === 'Years'){
                           var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,'Years');
                           this.passData.tableData[i].purDate = array[0];
                           this.passData.tableData[i].matDate = array[1];
                         }
                     } else if (this.passData.tableData[i].matPeriod !== null && this.passData.tableData[i].purDate !== null && this.passData.tableData[i].matDate !== null ) {
                         if(this.passData.tableData[i].durUnit === 'Days'){
                         var matPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                         this.passData.tableData[i].matPeriod = matPeriod;
                         } else if (this.passData.tableData[i].durUnit === 'Months'){
                           var matPeriod = this.getMaturationPeriod('Months',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                           this.passData.tableData[i].matPeriod = matPeriod;
                         } else if (this.passData.tableData[i].durUnit === 'Years'){ 
                           var matPeriod = this.getMaturationPeriod('Years',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                           if(matPeriod === 0){
                             this.passData.tableData[i].durUnit = 'Days';
                             var newmatPeriod = this.getMaturationPeriod('Days',this.passData.tableData[i].purDate,this.passData.tableData[i].matDate);
                             this.passData.tableData[i].matPeriod = newmatPeriod;
                           } else {
                              this.passData.tableData[i].matPeriod = matPeriod;
                           }
                         }
                     } 
                }         
      }
    }
  }

  getWTaxRate(){
    var wtaxRt;
    this.mtnService.getMtnParameters('N','INVT_WHTAX_RT').pipe(
           finalize(() => this.wtaxRate = wtaxRt)
           ).subscribe(data => {
      wtaxRt = data['parameters'][0].paramValueN;
    });

  }

 
  computeMatPeriod(date1,date2,unit){
   var to_date = new Date(date1);
   var from_date = new Date(date2);

   var diffDays = Math.floor(Math.abs(<any>from_date - <any>to_date) / (1000*60*60*24));
   var diffMonths = (to_date.getFullYear()*12 + to_date.getMonth()) - (from_date.getFullYear()*12 + from_date.getMonth());
   var diffYears = (to_date.getFullYear()) - (from_date.getFullYear());

   if(unit === 'Days'){
      return diffDays;
   } else if (unit === 'Months'){
      return diffMonths;
   } else if (unit === 'Years'){
     return diffYears;
   }

  } 
  
  computeDate(date1,period,unit){
    var today = new Date(date1),
     d = today.getDate(),
     m = today.getMonth(),
     y = today.getFullYear();
    var addDate = parseInt(period);

   if(unit === 'Days'){
      return today.setDate(today.getDate()+ addDate);
   } else if (unit === 'Months'){
     return today.setMonth(today.getMonth() + addDate);
   } else if (unit === 'Years'){
      return today.setFullYear(today.getFullYear() + addDate);
   }
    
  }

  getMaturationPeriod(unit,tblpurDate,tblmatDate){
    var matPeriod;
    matPeriod = this.computeMatPeriod(tblmatDate,
                                      tblpurDate,
                                      unit);
    return matPeriod;
  }

  getDuration(tblpurDate,tblmatDate,tblPeriod,unit){
    var array;
    if (this.isEmptyObject(tblpurDate) && !this.isEmptyObject(tblmatDate)){ 
        var date = this.getDate(tblpurDate,tblmatDate,tblPeriod,unit);
        tblpurDate = date; 
        tblmatDate = tblmatDate;
    } else if(this.isEmptyObject(tblmatDate) && !this.isEmptyObject(tblpurDate)) {
        var date = this.getDate(tblpurDate,tblmatDate,tblPeriod,unit);
        tblmatDate = date;
        tblpurDate = tblpurDate;
    } else if (!this.isEmptyObject(tblmatDate) && !this.isEmptyObject(tblpurDate)){
        var date = this.getDate(tblpurDate,tblmatDate,tblPeriod,unit);
        tblmatDate = date;
        tblpurDate = tblpurDate;
    } else {
        tblmatDate = null;
        tblpurDate = null;
    }
    return array = [tblpurDate,tblmatDate];
  }

  getDate(tblpurDate,tblmatDate,tblPeriod,unit){
    var date;
    if (this.isEmptyObject(tblpurDate)){ 
      date = this.ns.toDateTimeString(this.computeDate(tblmatDate, -(tblPeriod), unit));  
    } else {
      date = this.ns.toDateTimeString(this.computeDate(tblpurDate, tblPeriod, unit));
    }
    return date; 
  }

  getCurrencyRt(currUnit){
    var currRt;
    for (var i = 0; i < this.currencyData.length; i++) {
        if( this.currencyData[i].currencyCd === currUnit){
              currRt = this.currencyData[i].currencyRt;
         } 
    }
    return currRt;
  }


  addDays (date, daysToAdd) {
    var _24HoursInMilliseconds = 86400000;
    return new Date(date.getTime() + daysToAdd * _24HoursInMilliseconds);
  };

   isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

  onClickSave(){
    console.log(this.checkFields());
      if(this.checkFields()){
        let invtCds:string[] = this.passData.tableData.map(a=>a.invtCd);
          if(invtCds.some((a,i)=>invtCds.indexOf(a)!=i)){
            this.dialogMessage = 'Unable to save the record. Investment Code must be unique.';
            this.dialogIcon = 'error-message';
            this.successDialog.open();
            return;
          } else {
                this.confirmSave.confirmModal();
          }
      }else{
        this.dialogMessage="Please check field values.";
        this.dialogIcon = "error";
        this.successDialog.open();
      }
  }

  checkFields(){
    for(let check of this.passData.tableData){
        if( check.invtCd === null || check.invtCd === '' ||
            check.bank === null || check.bank === '' ||
            check.invtType === null || check.invtType === '' ||
            check.invtSecCd === null || check.invtSecCd === '' ||
            check.matPeriod === null || check.matPeriod === '' ||
            check.intRt === null || check.intRt === '' ||
            check.purDate === null || check.purDate === '' ||
            check.matDate === null || check.matDate === '' ||
            check.currCd === null || check.currCd === '' ||
            check.invtAmt === null || check.invtAmt === '' ||
            check.incomeAmt === null || check.incomeAmt === '' ||
            check.bankCharge === null || check.bankCharge === '' ||
            check.whtaxAmt === null || check.whtaxAmt === '' ||
            check.matVal === null || check.matVal === '' 
          ) {   
            return false;
          } 
    }
      return true;
  }
}
