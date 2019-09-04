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
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

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
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];

   passData: any = {
   	 tableData: [],
     tHeaderWithColspan : [],
   	 tHeader: ["Investment Code","Bank","Certificate No.","Investment Type","Security","Status","Maturity Period","Duration Unit","Interest Rate","Date Purchased","Maturity Date","Curr","Curr Rate","Investment","Investment Income","Bank Charges","Withholding Tax","Maturity Value","Pre-Termination Tag","Termination Date","Amortize Unit","Price (Cost)", "Eff%"],
   	 resizable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
   	 dataTypes: ['reqtext','select','reqtext','select','select','select','number','select','percent','date','date','select','percent','currency','currency','currency','currency','currency','checkbox','date','select','currency','percent'],
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
          slCd      :'',
          amortized: null,
          priceCost: null,
          uneditable : ['invtStatus','currRate','priceCost','invtCd'],
          currSeqNo: null,
          preTerminatedTag: null,
          termDate: null,
          amortEff: null
        },
   	 total:[null,null,null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','matVal',null,null,null,'priceCost', null],
     opts: [ {selector: 'invtType', prev: [], vals: []},
             {selector: 'invtSecCd', prev: [], vals: []},
             {selector: 'invtStatus', prev: [], vals: []},
             {selector: 'durUnit', prev: [], vals: []},
             {selector: 'currCd', prev: [], vals: []},
             {selector: 'bank', prev: [], vals: []},
             {selector : 'amortized', prev: [], vals: []},
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
     widths: [130,130,150,150,150,130,1,1,1,100,85,90,80,110,110,110,110,110,1,100,120,110,90],
     keys: ['invtCd','bank','certNo','invtType',
            'invtSecCd','invtStatus','matPeriod','durUnit','intRt','purDate',
            'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
            'whtaxAmt','matVal','preTerminatedTag','termDate','amortized','priceCost', 'amortEff']
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
    cancelFlag: boolean;
    acitInvtReq  : any = { 
                "delAcitInvestments": [],
                "saveAcitInvestments"  : []}
    deleteBool : boolean;
    deletedData:any[] =[];
    resultCancel : boolean;
    statusList: any[] =[]; 
    statusCd: any = '';
    matDateTo: any = '';
    matDateFrom: any = '';
    disableBtn: boolean = true;

  constructor(private accountingService: AccountingService,private titleService: Title,private router: Router,private ns: NotesService, private mtnService: MaintenanceService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Investments");
    this.retrieveInvestmentsList(this.searchParams);
    this.getWTaxRate();
    this.oldData = this.passData.tableData;

    this.passData.tHeaderWithColspan.push({ header: "", span: 20 },
         { header: "Amortization", span: 3 });
    }

  onTabChange($event: NgbTabChangeEvent) {return ;
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 
  
  }

  retrieveInvestmentsList(search?){
      var sub$ = forkJoin(this.accountingService.getAccInvestments(search),
                this.mtnService.getRefCode('ACIT_INVESTMENTS.INVT_TYPE'),
                this.mtnService.getRefCode('ACIT_INVESTMENTS.INVT_STATUS'),
                this.mtnService.getRefCode('ACIT_INVESTMENTS.DURATION_UNIT'),
                this.mtnService.getRefCode('ACIT_INVESTMENTS.AMORTIZED'),
                this.mtnService.getMtnBank('','','Y'),
                this.mtnService.getMtnInvtSecType('','Y'),
                this.mtnService.getMtnCurrency('','Y')).pipe(map(([investments, type, status, duration,amortized,bank,invtSecType,currency ]) => { return { investments, type, status, duration,amortized,bank, invtSecType, currency  }; }));

      this.subscription = sub$.subscribe(data => {
        
        var td = data['investments']['invtList'].sort((a, b) => b.createDate - a.createDate).map(a => { 
                                      
                                      a.matDate = this.ns.toDateTimeString(a.matDate);
                                      a.purDate = this.ns.toDateTimeString(a.purDate);
                                      a.createDate = this.ns.toDateTimeString(a.createDate);
                                      a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                      a.edited = false;
                                      var res = a.invtCd.split("-");
                                      a.currSeqNo = parseInt(res[4]);
                                         
                                      if (a.invtStatus === 'F'){
                                        a.uneditable = ['invtCd','invtStatus','matVal','currRate'];
                                      } else if(a.invtStatus === 'M' || a.invtStatus === 'O'){
                                        a.uneditable = ['invtCd','invtStatus','matVal','currRate','invtAmt'];
                                      } else {
                                        a.uneditable = ['invtCd','bank','certNo','invtType',
                                                        'invtSecCd','invtStatus','amortized','matPeriod','durUnit','intRt','purDate',
                                                        'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
                                                        'whtaxAmt','matVal','preTerminatedTag','termDate','amortEff','priceCost'];
                                      }

                                      if (a.amortized === null || a.amortized === "") {
                                         a.amortEff = null;
                                      } else {
                                        this.disableBtn = false;
                                      }

                                      if (a.preTerminatedTag === 'Y'){
                                        a.termDate = this.ns.toDateTimeString(a.termDate);
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

        this.passData.opts[6].vals = data['amortized']['refCodeList'].map(a => a.code);
        this.passData.opts[6].prev = data['amortized']['refCodeList'].map(a => a.description);

        this.passData.opts[6].vals.push("");
        this.passData.opts[6].prev.push(null);

        this.statusList = data['status']['refCodeList'];
        this.statusList.push({code: "", description: "All"});

        this.table.refreshTable();
      });
  }

  onClickSearch(){

     if(this.matDateTo < this.matDateFrom){
        this.dialogMessage="To Date must be greater than From Date";
        this.dialogIcon = "error-message";
        this.successDialog.open();
     }else {
        this.bankName === null   || this.bankName === undefined ?'':this.bankName;
        this.duration === null || this.duration === undefined?'':this.duration;
        this.statusCd === null || this.statusCd === undefined ?'':this.statusCd;
        this.matDateFrom === null || this.matDateFrom === undefined ?'':this.matDateFrom;
        this.matDateTo === null || this.matDateTo === undefined ?'':this.matDateTo;
        this.passData.tableData = [];
        this.table.overlayLoader = true;

        console.log(this.matDateTo);
       this.searchParams = [ {key: "bank", search: this.bankName },
                             {key: "durUnit", search: this.duration },
                             {key: "invtStatus", search: this.statusCd + '%'},
                             {key: "matDateFrom", search: this.matDateFrom },
                             {key: "matDateTo", search: this.matDateTo },
                             ]; 
       this.retrieveInvestmentsList(this.searchParams);
     }

  }

  searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.retrieveInvestmentsList();
        this.selectedData = {};
        this.passData.btnDisabled = true;
  }

  onRowClick(data){
    if(data !== null){
      this.selectedData = data;
      console.log(this.selectedData);
      this.invtRecord.createUser  = data.createUser;
      this.invtRecord.createDate  = this.ns.toDateTimeString(data.createDate).split('T')[0] + ' ' + this.ns.toDateTimeString(data.createDate).split('T')[1];
      this.invtRecord.updateUser  = data.updateUser;
      this.invtRecord.updateDate  = this.ns.toDateTimeString(data.updateDate).split('T')[0] + ' ' + this.ns.toDateTimeString(data.updateDate).split('T')[1];

       if(this.selectedData.okDelete == 'N'){
           this.passData.disableGeneric = true;     
       }else{
           this.passData.disableGeneric = false;
       }   
   
    } else {
      this.passData.disableGeneric    = true;
      this.disableBtn = true;
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

  checkItemCurrency(currencyCd?){
    var maxPHP = 0;
    var maxUSD = 0;
    var maxUKP = 0;
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var year = currentTime.getFullYear();

    for(var i= 0; i< this.passData.tableData.length; i++){
      
      if(this.passData.tableData[i].currCd === 'PHP'){
        
        if (this.passData.tableData[i].invtCd !== null){
           var res = this.passData.tableData[i].invtCd.split("-");
           if (year === parseInt(res[0]) && this.passData.tableData[i].currCd === res[3]){
                 if(maxPHP < parseInt(res[4])){
                    maxPHP = parseInt(res[4]);
                 }; 
           }
        }

      } else if (this.passData.tableData[i].currCd === 'USD'){

        if (this.passData.tableData[i].invtCd !== null){
          var res = this.passData.tableData[i].invtCd.split("-");

          if (year === parseInt(res[0]) && this.passData.tableData[i].currCd === res[3]){
            if(maxUSD < parseInt(res[4])){
                maxUSD = parseInt(res[4]);
            };
          }
          
        }
      }  else if (this.passData.tableData[i].currCd === 'UKP'){
        
        if (this.passData.tableData[i].invtCd !== null){
          var res = this.passData.tableData[i].invtCd.split("-");

          if (year === parseInt(res[0]) && this.passData.tableData[i].currCd === res[3]){
            if(maxUKP < parseInt(res[4])){
                maxUKP = parseInt(res[4]);
            };
          }
          
        }
    }
  }
        if( currencyCd === 'PHP'){
           return maxPHP;
           console.log(maxPHP);
        }else if ( currencyCd === 'USD'){
           return maxUSD;
           console.log(maxUSD);
        } else if ( currencyCd === 'UKP'){
           return maxUKP;
           console.log(maxUKP);
        }   
  }    

  removeUneditable(key?, array?){
    var index = array.indexOf(key);
    if (index !== -1) array.splice(index,1);
  }

  update(data){
      for(var i= 0; i< this.passData.tableData.length; i++){

         if(this.passData.tableData[i].edited || this.passData.tableData[i].add){

          //LOGIC-FUNCTIONALITIES
           if (data.key === 'durUnit'){
              if(this.passData.tableData[i].matDate !== null || this.passData.tableData[i].matDate !== ''   ||
                this.passData.tableData[i].purDate !== null || this.passData.tableData[i].purDate !== ''){
                  this.passData.tableData[i].matPeriod = null;
               }
           }

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

                     console.log(rate);

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
                       
                       if (this.passData.tableData[i].invtCd === null){
                         var maxPHP = this.checkItemCurrency('PHP');
                         this.passData.tableData[i].currSeqNo = maxPHP + 1;
                         this.passData.tableData[i].invtCd = this.generateInvtCd(null,this.passData.tableData[i].invtType, this.passData.tableData[i].currCd, this.passData.tableData[i].currSeqNo);
                       } else {
                         var res = this.passData.tableData[i].invtCd.split("-");
                         if (this.passData.tableData[i].currCd !== res[3]){
                           var maxPHP = this.checkItemCurrency('PHP');
                           this.passData.tableData[i].currSeqNo = maxPHP + 1;
                           this.passData.tableData[i].invtCd = this.generateInvtCd(this.passData.tableData[i].invtCd,this.passData.tableData[i].invtType, this.passData.tableData[i].currCd, this.passData.tableData[i].currSeqNo);
                         } else {
                            this.passData.tableData[i].invtCd = this.generateInvtCd(this.passData.tableData[i].invtCd,this.passData.tableData[i].invtType, this.passData.tableData[i].currCd, parseInt(res[4]));
                         }
                       }  
                     } else if (this.passData.tableData[i].currCd === 'UKP'){
                       var currRt = this.getCurrencyRt('UKP');
                       this.passData.tableData[i].currRate = currRt;
                       var maxUKP = this.checkItemCurrency('UKP');
                       this.passData.tableData[i].currSeqNo = maxUKP + 1;
                        if (this.passData.tableData[i].invtCd === null){
                         this.passData.tableData[i].invtCd = this.generateInvtCd(null,this.passData.tableData[i].invtType, this.passData.tableData[i].currCd, this.passData.tableData[i].currSeqNo);
                        } else {
                         this.passData.tableData[i].invtCd = this.generateInvtCd(this.passData.tableData[i].invtCd,this.passData.tableData[i].invtType, this.passData.tableData[i].currCd, this.passData.tableData[i].currSeqNo);
                        }  
                     } else if (this.passData.tableData[i].currCd === 'USD'){
                       var currRt = this.getCurrencyRt('USD');
                       this.passData.tableData[i].currRate = currRt;
     
                       if (this.passData.tableData[i].invtCd === null){
                         var maxUSD = this.checkItemCurrency('USD');
                         this.passData.tableData[i].currSeqNo = maxUSD + 1;
                         this.passData.tableData[i].invtCd = this.generateInvtCd(null,this.passData.tableData[i].invtType, this.passData.tableData[i].currCd, this.passData.tableData[i].currSeqNo);
                       } else {
                         var res = this.passData.tableData[i].invtCd.split("-");
                           if (this.passData.tableData[i].currCd !== res[3]){
                             var maxUSD = this.checkItemCurrency('USD');
                             this.passData.tableData[i].currSeqNo = maxUSD + 1;
                             this.passData.tableData[i].invtCd = this.generateInvtCd(this.passData.tableData[i].invtCd,this.passData.tableData[i].invtType, this.passData.tableData[i].currCd, this.passData.tableData[i].currSeqNo);
                           } else {
                              this.passData.tableData[i].invtCd = this.generateInvtCd(this.passData.tableData[i].invtCd,this.passData.tableData[i].invtType, this.passData.tableData[i].currCd, parseInt(res[4]));
                           }
                       }  
                     }

                
                 } else if (data.key === 'invtType'){
                   if (this.passData.tableData[i].invtCd !== null){
                     var res = this.passData.tableData[i].invtCd.split("-");
                     this.passData.tableData[i].invtCd = this.generateInvtCd(this.passData.tableData[i].invtCd,this.passData.tableData[i].  invtType, this.passData.tableData[i].currCd, parseInt(res[4]));
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
      date =  this.ns.toDateTimeString(this.computeDate(tblmatDate, -(tblPeriod), unit));  
    } else {
      date =  this.ns.toDateTimeString(this.computeDate(tblpurDate, tblPeriod, unit));
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
        if( check.bank === null || check.bank === '' ||
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

        if (check.preTerminatedTag === 'Y' && this.isEmptyObject(check.termDate) ){
              return false;
        } else if ( check.preTerminatedTag === 'N' && !this.isEmptyObject(check.termDate)){
              return false;          
        }

        if ( !this.isEmptyObject(check.amortized)){
           console.log(check.priceCost + '-' + check.amortEff);
           if ( Number.isNaN(check.priceCost) || Number.isNaN(check.amortEff) ||
                check.priceCost === undefined || check.amortEff === undefined ) {
               return false;
           } 
        }
                                                                                                                                                                                                                                         
    }
      return true;
  }

 
  generateInvtCd(invtCd?,invtType?,currCd?,currSeqNo?){
    var currentTime = new Date();
    var invTtype;
    var invtCode;

    if (invtType === '1'){
        invTtype =  'LT';
    } else {
        invTtype =  'ST';
    }  

     if (invtCd === null){
       var month = currentTime.getMonth() + 1;
       var code = currentTime.getFullYear() + '-' + month.toString().padStart(2,'0');
       var currSeq = parseInt(currSeqNo);
       invtCode = code + '-' + invTtype + '-' + currCd + '-' + currSeq.toString().padStart(3,'0');
       console.log(invtCode);
     } else {
       var res = invtCd.split("-");
       var year = currentTime.getFullYear();
       var month = currentTime.getMonth() + 1;
       var code = res[0] + '-' + res[1];
       var currSeq = parseInt(currSeqNo);

       if(currCd === res[3]){
         invtCode = code + '-' + invTtype + '-' + currCd + '-' + res[4];
       } else {

         if( res[0] === year){
           invtCode = code + '-' + invTtype + '-' + currCd + '-' + currSeq.toString().padStart(3,'0');
         } else {
           invtCode = year + '-' + month.toString().padStart(2,'0') + '-' + invTtype + '-' + currCd + '-' + currSeq.toString().padStart(3,'0');
         }
         
       }

       console.log(invtCode);
     }

     return invtCode;

  }


  saveDataInvt(cancelFlag?){
     this.cancelFlag = cancelFlag !== undefined;   
     console.log(this.cancelFlag);

    this.acitInvtReq.delAcitInvestments = [];
    this.acitInvtReq.saveAcitInvestments = [];
    this.acitInvtReq.saveAcitInvestments = this.passData.tableData.filter(a=>a.edited && !a.deleted);
    this.acitInvtReq.saveAcitInvestments.forEach(a=> { var currentTime = new Date();
                                                      
                                                       a.updateUser = this.ns.getCurrentUser(),
                                                       a.updateDate = this.ns.toDateTimeString(0);
                                                       a.whtaxAmt = a.whtaxAmt;
                                                       a.matVal = a.matVal;
                                                       a.bankCharge = a.bankCharge;
                                                       a.incomeAmt = a.incomeAmt;
                                                       a.intRt = a.intRt;
                                                       a.invtAmt = a.invtAmt;
                                                       a.invtCd = a.invtCd;

                                                       if (new Date(a.matDate) <= currentTime){
                                                         console.log("mat reached");
                                                         if(a.invtStatus === 'O'){
                                                           a.invtStatus = 'M';
                                                         }
                                                       
                                                       } else {
                                                          console.log("mat not reached");
                                                         if(a.invtStatus === 'M'){
                                                           a.invtStatus = 'O';
                                                         }
                                                       }
                                                      

                                                        if (a.preTerminatedTag === 'Y'){
                                                            a.termDate = this.ns.toDateTimeString(a.termDate);
                                                        }else {
                                                            a.preTerminatedTag = 'N';
                                                            a.termDate = null;
                                                        }

                                                        if (a.amortized === null || a.amortized === ""){
                                                            a.priceCost = null;
                                                            a.amortEff = null;
                                                        }
                                                      }
                                                  );
   this.acitInvtReq.delAcitInvestments = this.deletedData; 
    
     if(this.acitInvtReq.saveAcitInvestments.length === 0 && this.acitInvtReq.delAcitInvestments.length === 0  ){     
              this.confirmSave.showBool = false;
              this.dialogIcon = "success";
              this.successDialog.open();
            } else {
              this.confirmSave.showBool = true;
              this.passData.disableGeneric = true;
              console.log(JSON.stringify(this.acitInvtReq));
              this.saveAcitInvt(this.acitInvtReq,cancelFlag);     
      }  

  }

  saveAcitInvt(obj,cancelFlag?){
    this.deletedData = [];
    console.log(obj);
      this.accountingService.saveAcitInvt(obj).pipe(
           finalize(() => this.cancel(this.resultCancel))
           )
        .subscribe(data => {
              if(data['returnCode'] == -1){
                  this.dialogIcon = "success";
                  this.successDialog.open();
                  this.resultCancel = true;
              }else{
                  this.dialogIcon = "error";
                  this.successDialog.open();
                  this.resultCancel = false;
              }       
    });

  }

  cancel(obj?){
   if (this.cancelFlag === true && obj === false){
     this.cancelFlag = false;
   }else if (obj === true){
     this.passData.tableData = [];
     this.searchParams = [];
     this.retrieveInvestmentsList(this.searchParams);
   }
  }

  clear(){
      this.passData.disableGeneric    = true;
      this.invtRecord.createUser  = null;
      this.invtRecord.createDate  = null;
      this.invtRecord.updateUser  = null;
      this.invtRecord.updateDate  = null;
  }

  onClickDelete(){
    if (this.selectedData.add){
          this.deleteBool = false;
          this.table.indvSelect.deleted = true;
          this.table.selected  = [this.table.indvSelect];
          this.table.confirmDelete();
     }else {
        this.deleteBool = true;
        this.table.indvSelect.deleted = true;
        this.table.selected  = [this.table.indvSelect]
        this.table.confirmDelete();
     }
  }

  onClickDelInvt(obj : boolean){
    this.acitInvtReq.saveAcitInvestments = [];
    this.acitInvtReq.delAcitInvestments = [];
    this.passData.disableGeneric = true;
      
      if(obj){
            this.deletedData.push({
                    "invtId": this.selectedData.invtId
                     });
            this.acitInvtReq.delAcitInvestments = this.deletedData;     
      } 
  }

}
