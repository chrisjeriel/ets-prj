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
  @ViewChild('amortizationMdl') amortizationMdl : ModalComponent;
  @ViewChild('amortization') amortTable: CustEditableNonDatatableComponent;

  tableData: any[] = [];	
  tHeader: any[] = [];
  dataTypes: any[] = [];

   passAmortData: any = {
     tableData : [],
      tHeader: ["Start Date","End Date","Amort Days","Coupon Days","Coupon","Eff%","Amort","CV","Daily"],
      dataTypes:["date","date","number","number","currency","currency","currency","currency","currency"],
      total: [null,null,null,null,null,'TOTAL','amortAmt',null,null],
      keys: ['startDate', 'endDate', 'amortDays', 'couponDays', 'coupon','effAmt','amortAmt','amortInvtAmt','amortDailyAmt'],
      pageLength: 15,
      uneditable: [true,true,true,true,true,true,true,true,true],
      widths:[1,1,90,90,120,120,120,120,120],
      paginateFlag: true,
      infoFlag: true,
      disableSort : true,
      pageStatus: true,
      pagination: true,
      pageID: '1'
   };

   passData: any = {
   	 tableData: [],
     tHeaderWithColspan : [],
   	 tHeader: ["Investment Code","Bank","Certificate No.","Investment Type","Security","Status","Maturity Period","Duration Unit","Interest Rate","Date Purchased","Maturity Date","Curr","Curr Rate","Investment","Investment Income","Bank Charges","Withholding Tax","Maturity Value","Pre-Termination Tag","Termination Date","Partial Pull-Out","Pull-out Date","Pulled-out Amount","Amortize Unit","Eff%","Price (Cost)"],
   	 resizable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
   	 dataTypes: ['text','select','text','select','select','select','number','select','percent','date','date','select','percent','currency','currency','currency','currency','currency','checkbox','date','checkbox','date','currency','select','percent','currency'],
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
          currSeq  : null,
          currCd : null,
          currRate : null,
          invtAmt  : null,
          incomeAmt: null,
          bankCharge: 0,
          whtaxAmt : null,
          matVal   : null,
          createUser: this.ns.getCurrentUser(),
          createDate: this.ns.toDateTimeString(0),
          updateUser: this.ns.getCurrentUser(),
          updateDate: this.ns.toDateTimeString(0),
          slCd      :'',
          amortized: null,
          priceCost: null,
          uneditable : ['invtStatus','currRate','priceCost','invtCd','preTerminatedTag','termDate','partialPullOutTag','partialPullOutDate','partialPullOutAmt'],
          preTerminatedTag: null,
          termDate: null,
          amortEff: null
        },
   	 total:[null,null,null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','matVal',null,null,null,null,null,null,null,'priceCost'],
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
     widths: [130,130,150,150,150,130,1,1,100,100,85,90,80,110,110,110,110,110,1,100,1,100,110,120,90,110],
     keys: ['invtCd','bank','certNo','invtType',
            'invtSecCd','invtStatus','matPeriod','durUnit','intRt','purDate',
            'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
            'whtaxAmt','matVal','preTerminatedTag','termDate','partialPullOutTag','partialPullOutDate','partialPullOutAmt','amortized','amortEff','priceCost']
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
    matDateTo: any = '';z
    matDateFrom: any = '';
    disableBtn: boolean = true;
    maxphp: any = 0;
    maxusd: any = 0;
    maxukp: any = 0;
    errorAmort: any;

  constructor(private accountingService: AccountingService,private titleService: Title,private router: Router,private ns: NotesService, private mtnService: MaintenanceService) { }

  ngOnInit() {
  	this.titleService.setTitle("Acct-IT | Investments");
    this.selectedData = [];
    this.retrieveInvestmentsList(this.searchParams);
    this.getWTaxRate();
    this.oldData = this.passData.tableData;

    this.passData.tHeaderWithColspan.push({ header: "", span: 18 },
         { header: "Pre-Termination", span: 2 },
         { header: "Partial Pull-Out", span: 3 },
         { header: "Amortization", span: 3 });
    }


  onTabChange($event: NgbTabChangeEvent) {
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
                                      a.termDate = this.ns.toDateTimeString(a.termDate);
                                      a.partialPullOutDate = this.ns.toDateTimeString(a.partialPullOutDate);
                                      a.edited = false;
                                      a.currRate =  a.currRate;
                                      var res = a.invtCd.split("-");
                                      a.currSeq = parseInt(res[4]);
                                         
                                      if (a.invtStatus === 'F'){
                                        a.uneditable = ['invtCd','invtStatus','matVal','currRate','priceCost','partialPullOutTag','partialPullOutDate','partialPullOutAmt','preTerminatedTag','termDate'];
                                      }/* else if(a.invtStatus === 'M') { 

                                        if(a.preTerminatedTag == 'Y'){
                                          a.uneditable = ['invtCd','bank','certNo','invtType',
                                                        'invtSecCd','invtStatus','amortized','matPeriod','durUnit','intRt','purDate',
                                                        'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
                                                        'whtaxAmt','matVal','preTerminatedTag','termDate',
                                                        'partialPullOutTag','partialPullOutDate','partialPullOutAmt',
                                                        'amortEff','priceCost'];
                                        }else if (a.partialPullOutTag == 'Y') {
                                          a.uneditable = ['invtCd','invtStatus','matPeriod','durUnit','intRt','purDate',
                                                        'matDate','currCd','matVal','currRate','invtAmt','amortized','amortEff','priceCost','preTerminatedTag','termDate',
                                                        'partialPullOutTag','partialPullOutDate','partialPullOutAmt'];
                                        }else {
                                          a.uneditable = ['invtCd','invtStatus','matVal','currRate','invtAmt','amortized','amortEff','priceCost','preTerminatedTag','termDate','partialPullOutTag','partialPullOutDate','partialPullOutAmt'];
                                        }

                                        
                                      } */else if(a.invtStatus === 'O'){

                                          if (a.preTerminatedTag === 'N' && a.partialPullOutTag === 'N'){
                                             if (a.amortized === null || a.amortized === ""){
                                               a.uneditable = ['invtCd','invtStatus','matVal','currRate','invtAmt','amortized','amortEff','priceCost'];
                                             }else {
                                               a.uneditable = ['invtCd','invtStatus','matPeriod','durUnit','intRt','purDate',
                                                        'matDate','currCd','matVal','currRate','invtAmt','amortized','amortEff','priceCost','preTerminatedTag','termDate',
                                                        'partialPullOutTag','partialPullOutDate','partialPullOutAmt'];
                                             }
                                          }else {

                                               a.uneditable = ['invtCd','bank','certNo','invtType',
                                                        'invtSecCd','invtStatus','amortized','matPeriod','durUnit','intRt','purDate',
                                                        'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
                                                        'whtaxAmt','matVal','preTerminatedTag','termDate',
                                                        'partialPullOutTag','partialPullOutDate','partialPullOutAmt',
                                                        'amortEff','priceCost'];
                                          }
                                      } else {
                                        a.uneditable = ['invtCd','bank','certNo','invtType',
                                                        'invtSecCd','invtStatus','amortized','matPeriod','durUnit','intRt','purDate',
                                                        'matDate','currCd','currRate','invtAmt','incomeAmt','bankCharge',
                                                        'whtaxAmt','matVal','preTerminatedTag','termDate',
                                                        'partialPullOutTag','partialPullOutDate','partialPullOutAmt',
                                                        'amortEff','priceCost'];
                                      }

                                      if (a.amortized === null || a.amortized === "") {
                                         a.amortEff = null;
                                      } 

                                      if (a.preTerminatedTag === 'Y'){
                                        a.termDate = this.ns.toDateTimeString(a.termDate);
                                      }
                                      
                                      var currentTime = new Date();
                                      var year = currentTime.getFullYear();
                                      var res = a.invtCd.split("-");

                                      if(a.currCd === 'PHP'){
                                        if (year === parseInt(res[0]) && a.currCd === res[3]){
                                               if(this.maxphp < parseInt(res[4])){
                                                  this.maxphp = parseInt(res[4]);
                                               }; 
                                         }
                                      } else if (a.currCd === 'USD'){
                                        if (year === parseInt(res[0]) && a.currCd === res[3]){
                                               if(this.maxusd < parseInt(res[4])){
                                                  this.maxusd = parseInt(res[4]);
                                               }; 
                                         }
                                      } else if (a.currCd === 'UKP'){
                                        if (year === parseInt(res[0]) && a.currCd === res[3]){
                                               if(this.maxukp < parseInt(res[4])){
                                                  this.maxukp = parseInt(res[4]);
                                               }; 
                                         }
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
        
        this.table.overlayLoader = false;
        this.disableBtn = true;
        this.table.refreshTable();
         $('.ng-dirty').removeClass('ng-dirty');
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
      this.invtRecord.createUser  = data.createUser;
      this.invtRecord.createDate  = this.ns.toDateTimeString(data.createDate).split('T')[0] + ' ' + this.ns.toDateTimeString(data.createDate).split('T')[1];
      this.invtRecord.updateUser  = data.updateUser;
      this.invtRecord.updateDate  = this.ns.toDateTimeString(data.updateDate).split('T')[0] + ' ' + this.ns.toDateTimeString(data.updateDate).split('T')[1];

       if(this.selectedData.okDelete == 'N'){
           this.passData.disableGeneric = true;     
       }else{
           this.passData.disableGeneric = false;
       }


       if(this.selectedData.amortized !== null){
         this.disableBtn = false;
         this.selectedData.amortizedDesc = this.getAmortizedDesc(data.amortized);
         this.selectedData.priceCost = data.priceCost;
       }else {
         this.disableBtn = true;
       }
       console.log(this.selectedData);
   
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
    var maxPHP = this.maxphp;
    var maxUSD = this.maxusd;
    var maxUKP = this.maxukp;
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var year = currentTime.getFullYear();
    
    for(var i= 0; i< this.passData.tableData.length; i++){
      
     if (this.passData.tableData[i].invtCd !== null){
      var res = this.passData.tableData[i].invtCd.split("-");
      
      if(this.passData.tableData[i].currCd === 'PHP'){
           if (year === parseInt(res[0]) && this.passData.tableData[i].currCd === res[3]){
                if(maxPHP < parseInt(res[4])){
                        maxPHP = parseInt(res[4]);
                } else {
                        maxPHP = this.maxphp;
                }; 
               }
      } else if (this.passData.tableData[i].currCd === 'USD'){
          if (year === parseInt(res[0]) && this.passData.tableData[i].currCd === res[3]){
               console.log(parseInt(res[4]) + ' ' + this.maxusd );
                if(maxUSD < parseInt(res[4])){
                       maxUSD = parseInt(res[4]);
                } else {
                       maxUSD = this.maxusd;
                };
          }
         
      }  else if (this.passData.tableData[i].currCd === 'UKP'){
          if (year === parseInt(res[0]) && this.passData.tableData[i].currCd === res[3]){
                if(maxUKP < parseInt(res[4])){
                       maxUKP = parseInt(res[4]);
                }  else {
                       maxUKP = this.maxukp;
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

uneditableItems(array, item, mode){
  if (mode === 'delete'){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        }
    }
  }else if (mode === 'add'){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        } else {
           array.push(item);
            break;
        }  
    }
  }
    
}

 changeCurr(data) {
     var  currRate,
          currSeq,
          invtCd;
                    
                    if (data.currCd === 'PHP'){
                       var currRt = this.getCurrencyRt('PHP');
                        currRate = currRt;
                       
                       if (data.invtCd === null){
                          currSeq = null;
                          invtCd = this.generateInvtCd(null,data.invtType, data.currCd, data.currSeq);
                       } else {
                         var res = data.invtCd.split("-");
                         if (data.currCd !== res[3]){
                            currSeq = null;
                            invtCd = this.generateInvtCd(data.invtCd,data.invtType, data.currCd, null);
                         } else {
                            currSeq = parseInt(res[4]);
                            invtCd = this.generateInvtCd(data.invtCd,data.invtType, data.currCd, parseInt(res[4]));
                         }
                       }  
                     } else if (data.currCd === 'UKP'){
                       var currRt = this.getCurrencyRt('UKP');
                        currRate = currRt;
                      
                        if (data.invtCd === null){
                           currSeq = null;
                           invtCd = this.generateInvtCd(null,data.invtType, data.currCd, data.currSeq);
                        } else {
                          var res = data.invtCd.split("-");
                            if (data.currCd !== res[3]){
                               currSeq = null;
                               invtCd = this.generateInvtCd(data.invtCd,data.invtType, data.currCd, null);
                            }else {
                               currSeq = parseInt(res[4]);
                               invtCd = this.generateInvtCd(data.invtCd,data.invtType, data.currCd, parseInt(res[4]));
                            }
                        }  
                     } else if (data.currCd === 'USD'){
                       var currRt = this.getCurrencyRt('USD');
                        currRate = currRt;
     
                       if (data.invtCd === null){
                          currSeq = null;
                          invtCd = this.generateInvtCd(null,data.invtType, data.currCd, data.currSeq);
                       } else {
                         var res = data.invtCd.split("-");
                           if (data.currCd !== res[3]){
                              currSeq = null;
                              invtCd = this.generateInvtCd(data.invtCd,data.invtType, data.currCd, null);
                           } else { 
                              currSeq = parseInt(res[4]);
                              invtCd = this.generateInvtCd(data.invtCd,data.invtType, data.currCd, parseInt(res[4]));
                           }
                       }  
                     }
                     
    return {
        currRate: currRate, 
        currSeq: currSeq,
        invtCd : invtCd
    }; 
 }

changePurDate(data){
       var matPeriod,
           purDate,
           matDate,
           error;
        if(this.isEmptyObject(data.purDate) && data.matDate !== null && data.matDate !== ''){
                       matPeriod = data.matPeriod;
                       matDate = data.matDate;
                       purDate = null;
                       error = false;
                     }else if(data.matDate <= data.purDate && 
                              !this.isEmptyObject(data.matDate) &&
                              !this.isEmptyObject(data.purDate)) { 
                       matPeriod = null;
                       matDate = data.matDate;
                       purDate = null;
                       error = true;
                     }else if (this.isEmptyObject(data.matPeriod) && data.matDate !== null){
                       var matPeriod = this.getMaturationPeriod(data.durUnit,data.purDate,data.matDate);
                       var array = this.getDuration(data.purDate,data.matDate,matPeriod,data.durUnit);
                       matPeriod = matPeriod;
                       purDate = array[0];
                       matDate = array[1];
                       error = false;
                     }else if(this.isEmptyObject(data.matDate) && data.matPeriod !== null){
                        var array = this.getDuration(data.purDate,data.matDate,data.matPeriod,data.durUnit);
                        purDate = array[0];
                        matDate = array[1];
                     }else if (data.matPeriod !== null && data.matDate !== null) {
                       var matPeriod = this.getMaturationPeriod(data.durUnit,data.purDate,data.matDate);
                       var array = this.getDuration(data.purDate,data.matDate,matPeriod,data.durUnit);
                       matPeriod = matPeriod;
                       purDate = array[0];
                       matDate = array[1];
                       error = false;
                     }       
     return {
        matPeriod: matPeriod, 
        purDate: purDate,
        matDate : matDate,
        error : error
    }; 
    
}

changeMatDate(data){
       var matPeriod,
           purDate,
           matDate,
           error;

        if(this.isEmptyObject(data.matDate) && data.purDate !== null && data.purDate !== ''){
                       matPeriod = null;
                       purDate = data.purDate;
                       matDate = null;
                       error = false;
                     }else if(data.matDate <= data.purDate && 
                              !this.isEmptyObject(data.matDate) &&
                              !this.isEmptyObject(data.purDate)) { 
                       matPeriod = null;
                       matDate = data.matDate;
                       purDate = null;
                       error = true;
                     } else if (this.isEmptyObject(data.matPeriod) && data.purDate !== null && data.purDate !== ''){
                       var matPeriod = this.getMaturationPeriod(data.durUnit,data.purDate,data.matDate);
                       var array = this.getDuration(data.purDate,data.matDate,matPeriod,data.durUnit);
                       matPeriod = matPeriod;
                       purDate = array[0];
                       matDate = array[1];
                       error = false;
                     }else if(this.isEmptyObject(data.purDate) && data.matPeriod !== null && data.matPeriod !== ''){
                        var array = this.getDuration(data.purDate,data.matDate,data.matPeriod,data.durUnit);
                        purDate = array[0];
                        matDate = array[1];
                     }else if (data.matPeriod !== null && data.purDate !== null && data.matDate !== null ) {
                       var matPeriod = this.getMaturationPeriod(data.durUnit,data.purDate,data.matDate);
                       var array = this.getDuration(data.purDate,data.matDate,matPeriod,data.durUnit);
                       matPeriod = matPeriod;
                       purDate = array[0];
                       matDate = array[1];
                       error = false;
                     }       
     return {
        matPeriod: matPeriod, 
        purDate: purDate,
        matDate : matDate,
        error : error
    }; 
    
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

              if(this.passData.tableData[i].invtStatus === 'F'){
                 this.passData.tableData[i].priceCost = null;
                 this.passData.tableData[i].amortEff = null;
              }

           }else if(data.key === 'amortized'){
             this.passData.tableData[i].priceCost = null;
             this.disableBtn = true;
           }else if(data.key === 'amortEff'){
             this.passData.tableData[i].priceCost = null;
           }else if (data.key === 'invtAmt' || data.key === 'intRt' ){
            
            if(this.passData.tableData[i].invtStatus === 'F'){
               this.passData.tableData[i].priceCost = null;
               this.passData.tableData[i].amortEff = null;
            }

           }else if(data.key === 'preTerminatedTag'){
             if (this.passData.tableData[i].preTerminatedTag === 'N'){
                this.passData.tableData[i].termDate = null;
             }
             if(this.passData.tableData[i].invtStatus === 'O'){
               if (this.passData.tableData[i].preTerminatedTag === 'Y'){
                 var n = this.passData.tableData[i].uneditable.includes('partialPullOutTag') &&
                         this.passData.tableData[i].uneditable.includes('partialPullOutDate') &&
                         this.passData.tableData[i].uneditable.includes('partialPullOutAmt');
                 if(n){
                   this.removeUneditable('partialPullOutTag',this.passData.tableData[i].uneditable);
                   this.removeUneditable('partialPullOutDate',this.passData.tableData[i].uneditable);
                   this.removeUneditable('partialPullOutAmt',this.passData.tableData[i].uneditable);
                 }
                 this.passData.tableData[i].partialPullOutDate = null;
                 this.passData.tableData[i].partialPullOutAmt = null;
                 this.passData.tableData[i].uneditable.push('partialPullOutTag','partialPullOutDate','partialPullOutAmt');
               }else if (this.passData.tableData[i].preTerminatedTag === 'N'){
                 this.removeUneditable('partialPullOutTag',this.passData.tableData[i].uneditable);
                 this.removeUneditable('partialPullOutDate',this.passData.tableData[i].uneditable);
                 this.removeUneditable('partialPullOutAmt',this.passData.tableData[i].uneditable);
               }
             }
           }else if(data.key === 'partialPullOutTag'){
             if (this.passData.tableData[i].partialPullOutTag === 'N'){
                this.passData.tableData[i].partialPullOutDate = null;
                this.passData.tableData[i].partialPullOutAmt = null;
             }

             if(this.passData.tableData[i].invtStatus === 'O'){
               if (this.passData.tableData[i].partialPullOutTag === 'Y'){
                 var n = this.passData.tableData[i].uneditable.includes('preTerminatedTag') &&
                         this.passData.tableData[i].uneditable.includes('termDate');
                 if(n){
                   this.removeUneditable('preTerminatedTag',this.passData.tableData[i].uneditable);
                   this.removeUneditable('termDate',this.passData.tableData[i].uneditable);
                 }
                 this.passData.tableData[i].termDate = null;
                 this.passData.tableData[i].uneditable.push('preTerminatedTag','termDate');
               }else if (this.passData.tableData[i].partialPullOutTag === 'N'){
                 this.removeUneditable('preTerminatedTag',this.passData.tableData[i].uneditable);
                 this.removeUneditable('termDate',this.passData.tableData[i].uneditable);
               }
             }
           }else if(data.key === 'termDate'){
          
             if (this.passData.tableData[i].termDate > this.passData.tableData[i].matDate || 
                 this.passData.tableData[i].termDate < this.passData.tableData[i].purDate ){
                 this.dialogMessage="Pre-termination Date must in between Date Purchased and Maturity Date";
                 this.dialogIcon = "error-message";
                 this.successDialog.open();
                 this.passData.tableData[i].termDate = null;
             }else {
                if( new Date(this.passData.tableData[i].termDate) > new Date(this.ns.toDateTimeString(0))){
                 this.dialogMessage="Pre-termination Date must not be greater than current date.";
                 this.dialogIcon = "error-message";
                 this.successDialog.open();
                 this.passData.tableData[i].termDate = null;
                }
             }
           }else if(data.key === 'partialPullOutDate'){
             if (this.passData.tableData[i].partialPullOutDate > this.passData.tableData[i].matDate || 
                 this.passData.tableData[i].partialPullOutDate < this.passData.tableData[i].purDate ){
                 this.dialogMessage="Partial Pull-Out Date must in between Date Purchased and Maturity Date";
                 this.dialogIcon = "error-message";
                 this.successDialog.open();
                 this.passData.tableData[i].partialPullOutDate = null;
             }
           }else if(data.key === 'partialPullOutAmt'){
             if (this.passData.tableData[i].partialPullOutAmt > this.passData.tableData[i].invtAmt){
                 this.dialogMessage="Partial Pull-Out Amount must not be greater than Investment Amount.";
                 this.dialogIcon = "error-message";
                 this.successDialog.open();
                 this.passData.tableData[i].partialPullOutAmt = null;
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
                          console.log(time)
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
                 this.passData.tableData[i].incomeAmt = Math.round(invtIncome * 100)/100;

                 if(invtIncome === null){
                 }else {
                   console.log(this.wtaxRate);
                   var taxRate = parseFloat(this.wtaxRate) / 100,
                       
                       withHTaxAmt = invtIncome * taxRate,
                       bankCharges = (this.passData.tableData[i].bankCharge === null || this.passData.tableData[i].bankCharge === '' ) ? null : this.passData.tableData[i].bankCharge,
                       matVal;

                       if(Number.isNaN(bankCharges)){
                         matVal = this.passData.tableData[i].invtAmt + this.passData.tableData[i].incomeAmt - this.passData.tableData[i].whtaxAmt;
                       } else {
                         matVal = this.passData.tableData[i].invtAmt + this.passData.tableData[i].incomeAmt - this.passData.tableData[i].bankCharge - this.passData.tableData[i].whtaxAmt;
                       }

                       this.passData.tableData[i].whtaxAmt = Math.round(withHTaxAmt * 100);
                       this.passData.tableData[i].matVal = matVal;
                 }
               } 

           //LOGIC - DATES
                 if(data.key === 'matPeriod'){
                   if(this.passData.tableData[i].invtStatus === 'F'){
                      this.passData.tableData[i].priceCost = null;
                      this.passData.tableData[i].amortEff = null;
                    }
                  var array = this.getDuration(this.passData.tableData[i].purDate,this.passData.tableData[i].matDate,this.passData.tableData[i].matPeriod,this.passData.tableData[i].durUnit);
                  console.log(array);
                  this.passData.tableData[i].purDate = array[0];
                  this.passData.tableData[i].matDate = array[1];

                 }else if(data.key === 'currCd'){
                   var result = this.changeCurr(this.passData.tableData[i]);
                   console.log(result);
                   this.passData.tableData[i].currRate = result.currRate;
                   this.passData.tableData[i].currSeq = result.currSeq;
                   this.passData.tableData[i].invtCd = result.invtCd;
                 } else if (data.key === 'invtType'){
                   if (this.passData.tableData[i].invtCd !== null){
                     var res = this.passData.tableData[i].invtCd.split("-");
                     this.passData.tableData[i].invtCd = this.generateInvtCd(this.passData.tableData[i].invtCd,this.passData.tableData[i].  invtType, this.passData.tableData[i].currCd, parseInt(res[4]));
                   }                   
                 }else if(data.key === 'purDate'){
                    
                    if(this.passData.tableData[i].invtStatus === 'F'){
                         this.passData.tableData[i].priceCost = null;
                         this.passData.tableData[i].amortEff = null;
                    }
                    var resultPurDate = this.changePurDate(this.passData.tableData[i]);
                    console.log(resultPurDate);

                    if (resultPurDate.error){
                       this.dialogMessage="Maturity Date must be greater than Date Purchased";
                       this.dialogIcon = "error-message";
                       this.successDialog.open();
                    }
                   this.passData.tableData[i].matPeriod = resultPurDate.matPeriod;
                   this.passData.tableData[i].purDate = resultPurDate.purDate;
                   this.passData.tableData[i].matDate = resultPurDate.matDate;
                 }else if(data.key === 'matDate'){
                      if(this.passData.tableData[i].invtStatus === 'F'){
                         this.passData.tableData[i].priceCost = null;
                         this.passData.tableData[i].amortEff = null;
                       }

                    var resultPurDate = this.changeMatDate(this.passData.tableData[i]);
                    console.log(resultPurDate);

                    if (resultPurDate.error){
                       this.dialogMessage="Maturity Date must be greater than Date Purchased";
                       this.dialogIcon = "error-message";
                       this.successDialog.open();
                    }
                   this.passData.tableData[i].matPeriod = resultPurDate.matPeriod;
                   this.passData.tableData[i].purDate = resultPurDate.purDate;
                   this.passData.tableData[i].matDate = resultPurDate.matDate;
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
      this.errorAmort = '';
      console.log(this.checkFields());
      if(this.checkFields()){
         //this.confirmSave.confirmModal();
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
        if (this.errorAmort === 'Error Amort'){
          this.dialogMessage='Maturity period must be at least a year';
          this.dialogIcon = "error-message";
          this.successDialog.open();
        }else {
          this.dialogMessage="Please check field values.";
          this.dialogIcon = "error";
          this.successDialog.open();
        }
      }
  }

 
  checkFields(){
    for(let check of this.passData.tableData){
       console.log(check);
        if( check.bank === null || check.bank === '' ||
            check.invtType === null || check.invtType === '' ||
            check.invtSecCd === null || check.invtSecCd === '' ||
            check.matPeriod === null || check.matPeriod === '' ||  isNaN(check.matPeriod) ||
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


        if (check.partialPullOutTag === 'Y' && this.isEmptyObject(check.partialPullOutDate)){
           return false;
        }else if (check.partialPullOutTag === 'Y' && !this.isEmptyObject(check.partialPullOutDate)) {
         
          if(Number.isNaN(check.partialPullOutAmt) || check.partialPullOutAmt === null){
            return false;
          }
        } else if (check.partialPullOutTag === 'N' && !this.isEmptyObject(check.partialPullOutDate)){
          return false;
        }

      
        if ( !this.isEmptyObject(check.amortized)){
           console.log(check.priceCost + '-' + check.amortEff);
           if ( Number.isNaN(check.amortEff) ||
                check.amortEff === undefined ||
                check.amortEff === null) {
               return false;
           } else {
             if (check.durUnit === 'Months' ){
               console.log((check.matPeriod % 12));
               if ( (check.matPeriod % 12) !== 0) {
                this.errorAmort = 'Error Amort';
                return false;
               }
             } else if (check.durUnit === 'Years'){
               if ( (check.matPeriod % 1) !== 0) {
                this.errorAmort = 'Error Amort';
                return false;
                }
             } else if (check.durUnit === 'Days'){
               if ( (check.matPeriod % 365) !== 0) {
                this.errorAmort = 'Error Amort';
                return false;
               }
             }
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
       invtCode = code + '-' + invTtype + '-' + currCd;
     } else {
       var res = invtCd.split("-");
       var year = currentTime.getFullYear();
       var month = currentTime.getMonth() + 1;
       var code = res[0] + '-' + res[1];
       var currSeq = parseInt(currSeqNo);

       if(currCd === res[3]){
         invtCode = code + '-' + invTtype + '-' + currCd + '-' + res[4];
       } else {
         invtCode = year + '-' + month.toString().padStart(2,'0') + '-' + invTtype + '-' + currCd;   
       }

       console.log(invtCode);
       var invtCodeArr = invtCode.split("-");
       if (invtCodeArr[4] === 'undefined'){
         invtCode = invtCodeArr[0] + '-' + invtCodeArr[1] + '-' + invtCodeArr[2] + '-' + invtCodeArr[3];
       }
    }
    return invtCode;
  }


  saveDataInvt(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;   
    console.log(this.cancelFlag);
    this.acitInvtReq.delAcitInvestments = [];
    this.acitInvtReq.saveAcitInvestments = [];

    let tempSaveAcitInvestments = [];
    tempSaveAcitInvestments = this.passData.tableData.filter(a=>a.edited && !a.deleted);
    console.log(tempSaveAcitInvestments.length);

    this.acitInvtReq.saveAcitInvestments = tempSaveAcitInvestments;

    tempSaveAcitInvestments.map(a => { 

                                 var rate = parseFloat(a.intRt)/100,
                                     time,
                                     matPer,
                                     bankCharges,
                                     matVal,
                                     principal;

                                 if (a.preTerminatedTag === 'Y'){
                                   principal = parseFloat(a.invtAmt);
                                   matPer = this.getMaturationPeriod('Days',a.purDate,a.termDate);                     
                                   time = parseFloat(matPer)/360;
                                 }else if (a.partialPullOutTag === 'Y') {
                                   principal = a.invtAmt - a.partialPullOutAmt;
                                   matPer = a.matPeriod;                    
                                   if(a.durUnit === 'Days'){
                                     time = parseFloat(matPer)/360;
                                   } else if (a.durUnit === 'Months'){
                                     time = parseFloat(matPer)/12;
                                   } else if (a.durUnit === 'Years'){
                                     time = parseFloat(matPer);
                                   }

                                 }
                                
                                     var invtIncome = principal * rate * time; 
                                     var taxRate = parseFloat(this.wtaxRate) / 100;
                                     var withHTaxAmt = invtIncome * taxRate;
                                     var res = a.invtCd.split("-");

                      
                                       if(Number.isNaN(a.bankCharge)){
                                         matVal = principal + invtIncome - withHTaxAmt;
                                       } else {
                                         matVal = principal + invtIncome - a.bankCharge - withHTaxAmt;
                                       }
            
                                  if (a.preTerminatedTag === 'Y'){
                                      this.acitInvtReq.saveAcitInvestments.push({
                                        invtId: null, 
                                        invtCd: res[0] + '-' + res[1] + '-' + res[2] + '-' + res[3],
                                        bank : a.bank,
                                        certNo : a.certNo,
                                        purDate : a.purDate,
                                        matDate : a.termDate,
                                        preTerminatedTag : 'N',
                                        termDate : null,
                                        invtType : a.invtType,
                                        invtSecCd : a.invtSecCd,
                                        invtStatus : a.invtStatus,
                                        durUnit : 'Days',
                                        currCd : a.currCd,
                                        currRate : a.currRate,
                                        currSeq : null,
                                        intRt : a.intRt,
                                        createUser: this.ns.getCurrentUser(),
                                        createDate: this.ns.toDateTimeString(0),
                                        updateUser: this.ns.getCurrentUser(),
                                        updateDate: this.ns.toDateTimeString(0),
                                        slCd : a.slCd,
                                        amortized : null,
                                        priceCost : null,
                                        amortEff : null,
                                        matPeriod : matPer,
                                        invtAmt : a.invtAmt,
                                        bankCharge : a.bankCharge,
                                        incomeAmt : invtIncome,
                                        whtaxAmt : withHTaxAmt,
                                        matVal : matVal,
                                        refInvtId : a.invtId
                                      });
                                   }

                                   if(a.partialPullOutTag === 'Y'){

                                      this.acitInvtReq.saveAcitInvestments.push({
                                        invtId: null, 
                                        invtCd: res[0] + '-' + res[1] + '-' + res[2] + '-' + res[3],
                                        bank : a.bank,
                                        certNo : a.certNo,
                                        purDate : a.purDate,
                                        matDate : a.matDate,
                                        preTerminatedTag : 'N',
                                        termDate : null,
                                        invtType : a.invtType,
                                        invtSecCd : a.invtSecCd,
                                        invtStatus : 'F',
                                        durUnit : a.durUnit,
                                        currCd : a.currCd,
                                        currRate : a.currRate,
                                        currSeq : null,
                                        intRt : a.intRt,
                                        createUser: this.ns.getCurrentUser(),
                                        createDate: this.ns.toDateTimeString(0),
                                        updateUser: this.ns.getCurrentUser(),
                                        updateDate: this.ns.toDateTimeString(0),
                                        slCd : a.slCd,
                                        amortized : null,
                                        priceCost : null,
                                        amortEff : null,
                                        partialPullOutTag : 'N',
                                        partialPullOutDate : null,
                                        partialPullOutAmt : null,
                                        matPeriod : matPer,
                                        invtAmt : principal,
                                        bankCharge : a.bankCharge,
                                        incomeAmt : invtIncome,
                                        whtaxAmt : withHTaxAmt,
                                        matVal : matVal,
                                        refInvtId : a.invtId
                                      });
                                   }

                                   return a; });  

    console.log(this.acitInvtReq.saveAcitInvestments);

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

                                                       if (isNaN(a.currSeq)){
                                                         a.currSeq = null;
                                                       }
                                                       
                                                       a.currSeq = a.currSeq;

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


                                                        if (a.partialPullOutTag === 'Y' && a.invtStatus === 'O'){
                                                            a.invtStatus = 'M'; 
                                                        }

                                                        if (a.amortized === null || a.amortized === ""){
                                                            a.priceCost = null;
                                                            a.amortEff = null;
                                                        }else {
                                                            var frequency,
                                                               eff = a.amortEff,
                                                               cpn = a.intRt,
                                                               parVal = a.invtAmt,
                                                               matPeriod = null,
                                                               noOfPeriods;

                                                           if(a.durUnit === 'Months'){
                                                             matPeriod = a.matPeriod / 12;
                                                           } else if (a.durUnit === 'Days'){
                                                             matPeriod = a.matPeriod / 365;
                                                           } else {
                                                             matPeriod = a.matPeriod
                                                           }


                                                           if(a.amortized === 'M'){
                                                              frequency = 12;                                                               
                                                           } else if (a.amortized === 'Q'){
                                                              frequency = 4;
                                                           } else if (a.amortized === 'S'){
                                                              frequency = 2;
                                                           } else if (a.amortized === 'Y') {
                                                              frequency = 1;
                                                           }


                                                           noOfPeriods = frequency * matPeriod;
                                                           a.parCost = this.computeAmortization(frequency,eff/100,cpn/100,parVal,matPeriod,noOfPeriods).toFixed(2);

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

   computeAmortization(frequency?,eff?,cpn?,parVal?,matPeriod?,noOfPeriods?){
    var investment = (cpn/frequency) * parVal;
    var pvParDivisor = (1 + (eff/frequency));
    var pvPar = parVal / Math.pow(pvParDivisor,noOfPeriods);
    var pvCoupon = (1 - Math.pow(pvParDivisor,-noOfPeriods)) / (eff/frequency);
    var parCost = (investment * pvCoupon) + pvPar  ;  
    return parCost;
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
     this.table.overlayLoader = true;
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
        $('#cust-table-container').addClass('ng-dirty');
     }
  }

  onClickDelInvt(obj : boolean){
    this.acitInvtReq.saveAcitInvestments = [];
    this.acitInvtReq.delAcitInvestments = [];
    this.passData.disableGeneric = true;
      
      if(obj){
            this.deletedData.push({
                    "invtId": this.selectedData.invtId,
                    "refInvtId" : this.selectedData.refInvtId,
                    "updateUser" : this.ns.getCurrentUser(),
                     });
            this.acitInvtReq.delAcitInvestments = this.deletedData;     
      } 
  }

  onCLickAmortized(){
    console.log(this.selectedData);
   if (this.selectedData.add === true || this.selectedData.priceCost === null || this.selectedData.priceCost === "" ){
     this.dialogIcon = "error-message";
     this.dialogMessage = "Amortization is not yet computed."
     this.successDialog.open();
   }else {
       this.amortizationMdl.openNoClose();
       this.retrieveAmortizationList();
       this.amortTable.overlayLoader = true
     
     
   }
  
  }

  retrieveAmortizationList(){
     this.passAmortData.tableData = [];
      this.accountingService.getAMortizationList(this.selectedData.invtId).subscribe(data => {
        console.log(data);
        this.passAmortData.tableData.push({startDate: null, endDate: null,amortDays : null,couponDays: null,
                                          coupon : null,effAmt: null,amortAmt: null,amortInvtAmt: this.selectedData.priceCost,amortDailyAmt: null});
        data['acitAmortizeList'].map(a => { 
                                   
                                      a.starDate = this.ns.toDateTimeString(a.starDate);
                                      a.endDate = this.ns.toDateTimeString(a.endDate);
                                      this.passAmortData.tableData.push({startDate: a.startDate, endDate: a.endDate,amortDays : a.amortDays,couponDays: a.couponDays,
                                          coupon : a.coupon,effAmt: a.effAmt,amortAmt: a.amortAmt,amortInvtAmt: a.amortInvtAmt,amortDailyAmt: a.amortDailyAmt});
                                      
                                      
                                   return a; });  
        this.amortTable.overlayLoader = true;
        this.amortTable.refreshTable();
      });
  }

  getAmortizedDesc(obj?){
    var result;
    if (obj === "M"){
      result = 'Monthly';
    } else if ( obj === "Q"){
      result = 'Quarterly';
    } else if (obj === "S"){
      result = 'Semi-Annual';
    } else if (obj === "Y") {
      result = 'Yearly';
    }
    return result;
  }

 

}


