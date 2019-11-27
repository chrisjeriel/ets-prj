import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService, ClaimsService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { MtnClmHistoryLovComponent } from '@app/maintenance/mtn-clm-history-lov/mtn-clm-history-lov.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { QuarterEndingLovComponent } from '@app/maintenance/quarter-ending-lov/quarter-ending-lov.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-acc-s-request-details',
  templateUrl: './acc-s-request-details.component.html',
  styleUrls: ['./acc-s-request-details.component.css'],
  providers: [DatePipe]
})
export class AccSRequestDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('cvTbl') cvTbl             : CustEditableNonDatatableComponent;
  @ViewChild('pcvTbl') pcvTbl           : CustEditableNonDatatableComponent;
  @ViewChild('dieminsTbl') dieminsTbl   : CustEditableNonDatatableComponent;
  @ViewChild('can') can                 : CancelButtonComponent;
  @ViewChild('con') con                 : ConfirmSaveComponent;
  @ViewChild('suc') suc                 : SucessDialogComponent;
  @ViewChild('lov') lov                 : LovComponent;
  //Added by Neco 11/20/2019
  @ViewChild('taxAlloc') taxAllocMdl : ModalComponent;
  @ViewChild('genTaxTbl') genTaxTbl: CustEditableNonDatatableComponent;
  @ViewChild('whTaxTbl') whTaxTbl: CustEditableNonDatatableComponent;
  @ViewChild('taxAllocCancel') taxCancelBtn : CancelButtonComponent;
  //End 11/20/2019

  @Input() rowData : any = {
    reqId : ''
  };

  cvData: any = {
    tableData     : [],
    tHeader       : ['Item', 'Reference No.', 'Description', 'Curr', 'Curr Rate', 'Amount', 'Amount(PHP)'],
    dataTypes     : ['text', 'text', 'text', 'text', 'percent', 'currency', 'currency'],
    nData: {
      itemName  : '',
      refNo     : '',
      remarks   : '',
      currCd    : '',
      currRate  : '',
      currAmt   : 0,
      localAmt  : 0,
      newRec    : 1,
      taxAllocation: []
    },
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'cvDataTbl',
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [false,false,false,true,true,false,true],
    total         : [null, null, null, null,'Total', 'currAmt', 'localAmt'],
    widths        : ['auto','auto','auto','auto','auto','auto','auto'],
    keys          : ['itemName','refNo','remarks','currCd','currRate','currAmt','localAmt']
  };

  pcvData: any = {
    tableData     : [],
    tHeader       : ['GL Account Code', 'GL Account Name', 'Reference No.', 'Description', 'Curr', 'Curr Rate', 'Amount', 'Amount(PHP)'],
    dataTypes     : ['text','text', 'text', 'text', 'text', 'percent', 'currency', 'currency'],
    magnifyingGlass : ['acctCd'],
    nData: {
      glAcctId  : '',
      acctCd    : '',
      itemName  : '',
      refNo     : '',
      remarks   : '',
      currCd    : '',
      currRate  : '',
      currAmt   : 0,
      localAmt  : 0,
      newRec    : 1,
      showMG    : 1,
      taxAllocation: []
    },
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'pcvDataTbl',
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [true,true,false,false,true,true,false,true],
    total         : [null,null, null, null, null,'Total', 'currAmt', 'localAmt'],
    widths        : ['auto',300,'auto','auto',1,'auto','auto','auto'],
    keys          : ['acctCd','itemName','refNo','remarks','currCd','currRate','currAmt','localAmt']
  };

  diemInsData: any = {
    tableData       : [],
    tHeader         : ['Board Member','Directors\' Fee Type','Curr','Curr Rate','Amount','Amount(PHP)'],
    dataTypes       : ['text','req-select','text','percent','currency','currency'],
    magnifyingGlass : ['directorName'],
    nData: {
      directorName  : '',
      feeType       : '',
      feeTypeDesc   : '',
      currCd        : '',
      currRate      : '',
      feeAmt        : 0,
      localAmt      : 0,
      newRec        : 1,
      showMG        : 1
    },
    opts: [
      {selector   : 'feeTypeDesc',  prev : [], vals: []},
    ],
    paginateFlag  : true,
    infoFlag      : true,
    pageID        : 'diemInsData',
    checkFlag     : true,
    addFlag       : true,
    deleteFlag    : true,
    uneditable    : [true,false,true,true,false,true],
    total         : [null, null, null,'Total', 'currAmt', 'localAmt'],
    widths        : ['auto','auto',1,'auto','auto','auto'],
    keys          : ['directorName','feeTypeDesc','currCd','currRate','feeAmt','localAmt']
  };

  //Added by NECO 11/19/2019
  passDataGenTax : any = {
        tableData: [],
        tHeader : ["Tax Code","Description","Rate","Amount"],
        dataTypes: ["text","text","percent","currency"],
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        pageLength: 5,
        //uneditable: [false,false,true,true,false,true],
        magnifyingGlass: ['taxCd'],
        nData: {
            reqId: '',
            itemNo: '',
            genType: 'M',
            taxType: 'G', //for General Tax, Tax Type
            taxCd: '',
            taxName: '',
            taxRate: '',
            taxAmt: 0,
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: '',
            showMG: 1
        },
        keys: ['taxCd', 'taxName', 'taxRate', 'taxAmt'],
        widths: [1,150,120,120],
        uneditable: [true,true,true,true],
        pageID: 'genTaxTbl'
      }

  passDataWhTax : any = {
        tableData: [],
        tHeader : ["Tax Code","Description","Rate","Amount"],
        dataTypes: ["text","text","percent","currency"],
        addFlag: true,
        deleteFlag: true,
        checkFlag: true,
        pageLength: 5,
        //uneditable: [false,false,true,true,false,true],
        magnifyingGlass: ['taxCd'],
        nData: {
            reqId: '',
            itemNo: '',
            genType: 'M',
            taxType: 'W', //for Witholding Tax, Tax Type
            taxCd: '',
            taxName: '',
            taxRate: '',
            taxAmt: 0,
            createUser: '',
            createDate: '',
            updateUser: '',
            updateDate: '',
            showMG: 1
        },
        keys: ['taxCd', 'taxName', 'taxRate', 'taxAmt'],
        widths: [1,150,120,120],
        uneditable: [true,true,true,true],
        pageID: 'whTaxTbl'
      }

    disableTaxBtn: boolean = true;
    genTaxIndex: number;
    whTaxIndex: number;
    deletedTaxData: any = [];
    subTax: Subscription;
  //END 11/19/2019

  tranTypeList       : any;
  cancelFlag         : boolean;
  dialogIcon         : string;
  dialogMessage      : string;
  warnMsg            : string = '';
  recPrqTrans        : any;
  requestData        : any;
  recPerDiem         : any;
  dfType             : any;
  lovRow             : any;
  selectedTblData    : any = {};
  private sub        : any;

  passData : any = {
    selector   : '',
    payeeNo    : '',
    hide       : [],
    params     : {}
  };

  params : any =  {
    savePrqTrans     : [],
    deletePrqTrans   : [],
    delCvItemTaxes   : [],
    savePerDiem      : [],
    deletePerDiem    : []
  };

  constructor(private acctService: AccountingService, private mtnService : MaintenanceService, private ns : NotesService, 
              private clmService: ClaimsService, public modalService: NgbModal, private dp: DatePipe,private decPipe: DecimalPipe) {
  }

  ngOnInit() {
    //Added by Neco 11/20/2019
    this.mtnService.getCedingCompany(this.rowData.payeeCd).subscribe((data:any)=>{ //Check if current payee is vatable
      if(data.cedingCompany.length == 0){
        this.rowData.vatTag = 3;
      }else{
        this.rowData.vatTag = data.cedingCompany[0].vatTag;
      }
      this.addDefaultTaxes();
    });
    //END 11/20/2019
    this.getPaytReqPrqTrans();
  }

  ngOnDestroy(){
    if(this.subTax !== undefined){
      this.subTax.unsubscribe();
    }
  }

  //Added by Neco 11/20/2019
  addDefaultTaxes(){
     var sub$ = forkJoin(this.mtnService.getAcseDefTax('PRQ',this.rowData.tranTypeCd),
                        this.mtnService.getAcseDefWhTax('PRQ',this.rowData.tranTypeCd)).pipe(map(([defTax, defWhTax]) => { return { defTax, defWhTax }; }));
     this.subTax = sub$.subscribe(
       (forkData:any)=>{
         let defTax = forkData.defTax;
         let defWhTax = forkData.defWhTax;
         for(var i of defTax.defTax){
           console.log(i.fixedAmount);
           if(!this.cvData.nData.taxAllocation.map(a=>{return a.taxCd}).includes(i.taxCd)){
             this.cvData.nData.taxAllocation.push({
               reqId: this.rowData.reqId,
               itemNo: '',
               taxSeqNo: '',
               genType: 'A',
               taxType: 'G', //for General Tax, Tax Type
               taxCd: i.taxCd,
               taxName: i.taxDesc,
               taxRate: i.taxRate,
               taxAmt: i.fixedAmount !== null ? i.fixedAmount : 1,
               createUser: '',
               createDate: '',
               updateUser: '',
               updateDate: '',
               showMG: 0
             });
             this.pcvData.nData.taxAllocation.push({
               reqId: this.rowData.reqId,
               itemNo: '',
               taxSeqNo: '',
               genType: 'A',
               taxType: 'G', //for General Tax, Tax Type
               taxCd: i.taxCd,
               taxName: i.taxDesc,
               taxRate: i.taxRate,
               taxAmt: i.fixedAmount !== null ? i.fixedAmount : 1,
               createUser: '',
               createDate: '',
               updateUser: '',
               updateDate: '',
               showMG: 0
             });
           }
         }
         for(var j of defWhTax.defWhTax){
           this.cvData.nData.taxAllocation.push({
             reqId: this.rowData.reqId,
             itemNo: '',
             taxSeqNo: '',
             genType: 'A',
             taxType: 'W', //for Withholding Tax, Tax Type
             taxCd: j.taxCd,
             taxName: j.taxDesc,
             taxRate: j.taxRate,
             taxAmt: 0,
             createUser: '',
             createDate: '',
             updateUser: '',
             updateDate: '',
             showMG: 0
           });
           this.pcvData.nData.taxAllocation.push({
             reqId: this.rowData.reqId,
             itemNo: '',
             taxSeqNo: '',
             genType: 'A',
             taxType: 'W', //for Withholding Tax, Tax Type
             taxCd: j.taxCd,
             taxName: j.taxDesc,
             taxRate: j.taxRate,
             taxAmt: 0,
             createUser: '',
             createDate: '',
             updateUser: '',
             updateDate: '',
             showMG: 0
           });
         }
         console.log(this.pcvData.nData.taxAllocation);
         this.cvData.nData.taxAllocation = this.cvData.nData.taxAllocation.filter(a=>{
                                                 if(this.rowData.vatTag == 3 || this.rowData.vatTag == 2){
                                                    return a;
                                                 }else{
                                                   return a.taxCd !== 'VAT';
                                                 }
                                             });
         this.pcvData.nData.taxAllocation = this.pcvData.nData.taxAllocation.filter(a=>{
                                                 if(this.rowData.vatTag == 3 || this.rowData.vatTag == 2){
                                                    return a;
                                                 }else{
                                                   return a.taxCd !== 'VAT';
                                                 }
                                             });
         console.log(this.pcvData.nData.taxAllocation);
       }
     );

  }
  //END 11/20/2019

  getPaytReqPrqTrans(){
    var subRes = forkJoin(this.acctService.getAcsePaytReq(this.rowData.reqId),this.acctService.getAcsePrqTrans(this.rowData.reqId,''),
                         this.acctService.getAcsePerDiem(this.rowData.reqId),this.mtnService.getMtnGlSubDepNo('DF'))
                 .pipe(map(([pr,prq,pd,df]) => { return { pr, prq, pd, df }; }));
    subRes.subscribe(data => {
      this.requestData = data['pr']['acsePaytReq'].map(e => { e.createDate = this.ns.toDateTimeString(e.createDate); e.updateDate = this.ns.toDateTimeString(e.updateDate);
                                               e.preparedDate = this.ns.toDateTimeString(e.preparedDate); e.reqDate = this.ns.toDateTimeString(e.reqDate);
                                               e.approvedDate = this.ns.toDateTimeString(e.approvedDate); return e; })[0];
      this.recPrqTrans = data['prq']['acsePrqTrans'];
      this.recPerDiem  = data['pd']['acsePerDiem'];
      this.dfType       = data['df']['glSubDepNoList']; 

      console.log(this.requestData);
      console.log(this.recPrqTrans);
      console.log(this.recPerDiem);

      if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 5){
        this.cvData.tableData = [];
        (this.requestData.reqStatus != 'F' && this.requestData.reqStatus != 'N')?this.removeAddDelBtn(this.cvData):'';
        this.cvData.tableData = this.recPrqTrans;
        setTimeout(() => {
          this.cvTbl.refreshTable();
          if(this.cvData.checkFlag){
            this.cvTbl.onRowClick(null, this.cvData.tableData.filter(a=>{return a.itemName == this.selectedTblData.itemName}).length == 0 ? null :
                              this.cvData.tableData.filter(a=>{return a.itemName == this.selectedTblData.itemName})[0] );
          }
        },0);
        
      }else if(this.requestData.tranTypeCd == 2){
        this.pcvData.tableData = [];
        (this.requestData.reqStatus != 'F' && this.requestData.reqStatus != 'N')?this.removeAddDelBtn(this.pcvData):'';
        this.pcvData.tableData = this.recPrqTrans;
        setTimeout(() => {
          this.pcvTbl.refreshTable();
          if(this.pcvData.checkFlag){
            this.pcvTbl.onRowClick(null, this.pcvData.tableData.filter(a=>{return a.itemName == this.selectedTblData.itemName}).length == 0 ? null :
                              this.pcvData.tableData.filter(a=>{return a.itemName == this.selectedTblData.itemName})[0] );
          }
        },0);
        
      }else if(this.requestData.tranTypeCd == 6 || this.requestData.tranTypeCd == 7){
        this.diemInsData.tableData = [];
        this.diemInsData.tableData = this.recPerDiem.map(e => { e.showMG = 1; return e;});
        this.diemInsData.opts[0].vals = this.dfType.map(e => e.depNo);
        this.diemInsData.opts[0].prev = this.dfType.map(e => e.description);

        setTimeout(() => {
          this.dieminsTbl.refreshTable();
          if(this.diemInsData.checkFlag){
            this.dieminsTbl.onRowClick(null, this.diemInsData.tableData.filter(a=>{return a.directorName == this.selectedTblData.directorName}).length == 0 ? null :
                              this.diemInsData.tableData.filter(a=>{return a.directorName == this.selectedTblData.directorName})[0] );
          }
        },0);
      }
    });
  }

  validateData(tranTypeCd,e){
    var x = [];
    if(tranTypeCd == 2){
      x.push((e.glAcctId == '')?true:false);
    }else if(tranTypeCd == 6){
      x.push((e.directorName == '' || e.directorName == null || e.feeTypeDesc == '' || e.feeTypeDesc == null || e.feeAmt == '' || e.feeAmt == null || isNaN(e.feeAmt) || e.feeAmt == 0)?true:'');
    }else if(tranTypeCd == 7){

    }
    if(tranTypeCd != 6 && tranTypeCd != 7){
      x.push((e.itemName == '' || e.itemName == null || e.currAmt == '' || e.currAmt == null || isNaN(e.currAmt) || e.currAmt == 0)?true:'');
    }

    x.push((e.currCd == '' || e.currCd == null || e.currRate == '' || e.currRate == null)?true:false);
    return x.some(e => e == true)?true:false;
  }

  onClickSave(cancelFlag?){ 
    this.cancelFlag = cancelFlag !== undefined;
    this.dialogIcon = '';
    this.dialogMessage = '';
    this.params.savePrqTrans = [];
    this.params.delCvItemTaxes = [];
    this.params.savePerDiem = [];

    var isEmpty = 0;
    var tbl = [];

    if(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 5){
      tbl = this.cvData.tableData;
    }else if(this.requestData.tranTypeCd == 2){
      tbl = this.pcvData.tableData;
    }else if(this.requestData.tranTypeCd == 6 || this.requestData.tranTypeCd == 7){
      tbl = this.diemInsData.tableData;
    }

    tbl.forEach(e => {
      e.reqId    = this.rowData.reqId;
      console.log(this.validateData(this.requestData.tranTypeCd,e));
      if(this.validateData(this.requestData.tranTypeCd,e)){
        if(!e.deleted){
          isEmpty = 1;
          e.fromCancel = false;
        }else{
          this.params.deletePrqTrans.push(e);
          this.params.delCvItemTaxes.push(e.taxAllocation);
        }
      }else{
        e.fromCancel = true;
        if(e.edited && !e.deleted){
          e.createUser    = (e.createUser == '' || e.createUser == undefined)?this.ns.getCurrentUser():e.createUser;
          e.createDate    = (e.createDate == '' || e.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(e.createDate);
          e.tranTypeCd    = (e.tranTypeCd == '' || e.tranTypeCd == null)?this.requestData.tranTypeCd:e.tranTypeCd;
          e.updateUser    = this.ns.getCurrentUser();
          e.updateDate    = this.ns.toDateTimeString(0);
          e.feeType       = (e.newRec == 1)?e.feeTypeDesc:e.feeType;
          if(this.requestData.tranTypeCd != 6 && this.requestData.tranTypeCd != 7){
            this.params.delCvItemTaxes =  e.taxAllocation.filter(a=>{return a.deleted});
            e.taxAllocation = e.taxAllocation.filter(a=>{return a.edited && !a.deleted});
          }
          this.params.savePerDiem.push(e);
          this.params.savePrqTrans.push(e);
        }else if(e.edited && e.deleted){ 
          this.params.deletePrqTrans.push(e);
          this.params.deletePerDiem.push(e);
          this.params.delCvItemTaxes.push(e.taxAllocation);
        }

      }
      this.params.reqId = this.rowData.reqId;
      this.params.createUser = this.ns.getCurrentUser();
      this.params.updateUser = this.ns.getCurrentUser();
      this.params.tranTypeCd = this.requestData.tranTypeCd;
    });

    console.log(this.params.savePerDiem);
    console.log(this.params.savePrqTrans);

    if(isEmpty == 1){
      this.dialogIcon = 'error';
      this.suc.open();
      this.params.savePrqTrans = [];
      this.params.savePerDiem  = [];
    }else{
      var emp = false;
      if(this.requestData.tranTypeCd == 6 || this.requestData.tranTypeCd == 7){
        if(this.params.savePerDiem.length == 0 && this.params.deletePerDiem.length == 0){
          this.dieminsTbl.markAsPristine();
          emp = true;
        }else{
          emp = false;
        }
      }else{
        if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
          (this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 5)?this.cvTbl.markAsPristine():this.pcvTbl.markAsPristine();
          this.cvData.tableData = this.cvData.tableData.filter(e => e.itemName != '');
          emp = true;
        }else{
          emp = false;
        }
      }

      if(emp){
        this.con.confirmModal();
        this.params.savePrqTrans   = [];
        this.params.deletePrqTrans = [];
        this.params.savePerDiem   = [];
        this.params.deletePerDiem = [];
      }else{
        this.params.delCvItemTaxes = this.params.delCvItemTaxes.flat();
        if(this.cancelFlag == true){
          this.con.showLoading(true);
          setTimeout(() => { try{this.con.onClickYes();}catch(e){}},500);
        }else{
          this.con.confirmModal();
        }
      }

        // if(this.params.savePrqTrans.length == 0 && this.params.deletePrqTrans.length == 0){
        //   (this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 5)?this.cvTbl.markAsPristine():this.pcvTbl.markAsPristine();
        //   this.con.confirmModal();
        //   this.params.savePrqTrans   = [];
        //   this.params.deletePrqTrans = [];
        //   this.cvData.tableData = this.cvData.tableData.filter(e => e.itemName != '');
        // }else{
        //   this.params.delCvItemTaxes = this.params.delCvItemTaxes.flat();
        //   if(this.cancelFlag == true){
        //     this.con.showLoading(true);
        //     setTimeout(() => { try{this.con.onClickYes();}catch(e){}},500);
        //   }else{
        //     this.con.confirmModal();
        //   }
        // }
    }
  }

  onSave(){
    console.log(this.params);
    if(this.requestData.tranTypeCd == 6){
      this.acctService.saveAcsePerDiem(JSON.stringify(this.params))
      .subscribe(data => {
        console.log(data);
        if(data['returnCode'] == -1){
          this.getPaytReqPrqTrans();
          this.dieminsTbl.markAsPristine();
        }else{
          this.dialogIcon = 'error';
        }
        this.suc.open();
        this.params.savePerDiem = [];
        this.params.deletePerDiem = [];
      });
    }else{
      this.acctService.saveAcsePrqTrans(JSON.stringify(this.params))
      .subscribe(data => {
        console.log(data);
        if(data['returnCode'] == -1){
          this.getPaytReqPrqTrans();
          this.genTaxTbl.markAsPristine();
          this.whTaxTbl.markAsPristine();
          if(this.cvTbl !== undefined){
            this.cvTbl.markAsPristine();
          }else{
            this.pcvTbl.markAsPristine();
          }
        }else{
          this.dialogIcon = 'error';
        }
        this.suc.open();
        this.params.savePrqTrans  = [];
        this.params.deletePrqTrans  = [];
        //(this.requestData.tranTypeCd == 1 || this.requestData.tranTypeCd == 5)?this.cvTbl.markAsPristine():this.pcvTbl.markAsPristine();
      });
    }
  }

  showLOV(event, from){
    console.log(event);
    this.lovRow = event;
    if(from.toUpperCase() == 'PCVDATA'){
      this.passData.selector = 'acseChartAcct';
      this.lov.openLOV();
    }else if(from.toUpperCase() == 'DIEMINSDATA'){
      this.passData.selector = 'sl';
      this.passData.params.slTypeCd = 8;
      this.lov.openLOV();
    }
    //Added by Neco 11/20/2019
    else if(from.toUpperCase() == 'GENTAX'){
        this.passData.activeTag = 'Y';
        this.passData.selector = 'mtnGenTax';
        this.passData.hide = this.passDataGenTax.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
        if((this.rowData.vatTag == 1 && !this.passData.hide.includes('VAT'))){ //if Payee is VAT EXEMPT, hide VAT in LOV
          this.passData.hide.push('VAT')
        }
        console.log(this.passData.hide);
        this.genTaxIndex = event.index;
        this.lov.openLOV();
    }else if(from.toUpperCase() == 'WHTAX'){
        this.passData.activeTag = 'Y';
        this.passData.selector = 'mtnWhTax';
        this.passData.hide = this.passDataWhTax.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.taxCd});
        console.log(this.passData.hide);
        this.whTaxIndex = event.index;
        this.lov.openLOV();
    }
    //END 11/20/2019
  }

  //Added by Neco 11/20/2019
  openTaxAllocation(){
    this.taxAllocMdl.openNoClose();
  }

  confirmLeaveTaxAlloc(){
    if(this.genTaxTbl.form.first.dirty || this.whTaxTbl.form.first.dirty){
      return true;
    }
    return false;
  }
  //END 11/20/2019

  setData(data){
    console.log(data);
    console.log(data['data']);
    console.log(this.lovRow.index);
    console.log( this.diemInsData.tableData[this.lovRow.index]);
      if(data.selector.toUpperCase() == 'SL'){
        var rec = data['data'];

        let firstRow = data.data.pop();
        this.lovRow.directorName = firstRow.slName;
        this.lovRow.directorId = firstRow.slCd;

        this.diemInsData.tableData = this.diemInsData.tableData.filter(a=>a.directorId != '');
        for(let row of data.data) {
          this.diemInsData.tableData.push(JSON.parse(JSON.stringify(this.diemInsData.nData)));
          this.diemInsData.tableData[this.diemInsData.tableData.length - 1].directorName = row.slName;
          this.diemInsData.tableData[this.diemInsData.tableData.length - 1].directorId = row.slCd;
        }
        // rec.forEach(e => {
        //   this.diemInsData.tableData.push(e);
        // });
        // console.log(this.diemInsData.tableData);
        // this.diemInsData.tableData = this.diemInsData.tableData.filter(e => e.directorName != '').map((e,i) => {
        //   //if(e.newRec == 1){
        //     e.directorName = e.slName;
        //     e.directorId   = e.slCd;
        //     e.createDate = '';
        //     e.createUser = ''; 
        //     e.updateUser = ''; 
        //     e.showMG     = 1;
        //  // }
        //   e.checked = false;
        //   return e;
        // });
        this.dieminsTbl.refreshTable();
        console.log(this.diemInsData.tableData);
        // this.dieminsTbl.onRowClick(null, this.diemInsData.tableData.filter(a=>{return a.directorName == this.selectedTblData.directorName}).length == 0 ? null :
        //                   this.diemInsData.tableData.filter(a=>{return a.directorName == this.selectedTblData.directorName})[0] );
        this.dieminsTbl.markAsDirty();
        this.onDataChange('diemins');
      }else{
        //Added by NECO 11/20/2019
        if(data.selector.toUpperCase() != 'ACSECHARTACCT'){
            let selected = data.data;
            if(selected[0].taxId !== undefined){ //set values to general taxes table
              console.log(selected);
              this.passDataGenTax.tableData = this.passDataGenTax.tableData.filter(a=>a.showMG!=1);
              for(var i = 0; i < selected.length; i++){
                this.passDataGenTax.tableData.push(JSON.parse(JSON.stringify(this.passDataGenTax.nData)));
                this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxCd = selected[i].taxCd; 
                this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxName = selected[i].taxName; 
                this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxRate = selected[i].taxRate;
                //this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxAmt = selected[i].amount;
                if(selected[i].taxRate == null || (selected[i].taxRate !== null && selected[i].taxRate == 0)){ //if fixed tax
                  this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxAmt = selected[i].amount;
                }else{ //else if rated tax
                  this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].taxAmt = (selected[i].taxRate/100) * this.selectedTblData.localAmt;
                }
                this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].reqId = this.rowData.reqId;
                this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].edited = true;
                this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].showMG = 0;
                this.passDataGenTax.tableData[this.passDataGenTax.tableData.length - 1].uneditable = ['taxCd'];
              }
              this.genTaxTbl.refreshTable();
            }else if(selected[0].whTaxId !== undefined){ //set values to withholding taxes table
              console.log(selected);
              this.passDataWhTax.tableData = this.passDataWhTax.tableData.filter(a=>a.showMG!=1);
              for(var i = 0; i < selected.length; i++){
                this.passDataWhTax.tableData.push(JSON.parse(JSON.stringify(this.passDataWhTax.nData)));
                this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxCd = selected[i].taxCd; 
                this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxName = selected[i].taxName; 
                this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxRate = selected[i].taxRate;
                this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].taxAmt = (selected[i].taxRate/100) * this.selectedTblData.localAmt; //placeholder
                this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].reqId = this.rowData.reqId;
                this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].edited = true;
                this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].showMG = 0;
                this.passDataWhTax.tableData[this.passDataWhTax.tableData.length - 1].uneditable = ['taxCd'];
              }
              this.whTaxTbl.refreshTable();
            }
            this.selectedTblData.edited = true;
            this.selectedTblData.taxAllocation = this.passDataGenTax.tableData.concat(this.passDataWhTax.tableData);
        }else if(data.selector.toUpperCase() == 'ACSECHARTACCT'){
        //END 11/20/2019
          var rec = data['data'];
          rec.forEach(e => {
            (this.pcvData.tableData.some(e2 => e2.glAcctId != e.glAcctId))?this.pcvData.tableData.push(e):'';
          });
          this.pcvData.tableData = this.pcvData.tableData.filter(e => e.glAcctId != '').map(e => {
            if(e.newRec == 1){  
              e.acctCd = e.shortCode; 
              e.itemName = e.shortDesc;
              e.taxAllocation = this.pcvData.nData.taxAllocation;
              e.createDate = '';
              e.createUser = ''; 
              e.updateUser = ''; 
            }
            e.checked=false;
            return e;
          });
          console.log(this.pcvData.tableData);
          this.pcvTbl.refreshTable();
          this.pcvTbl.onRowClick(null, this.pcvData.tableData.filter(a=>{return a.itemName == this.selectedTblData.itemName}).length == 0 ? null :
                            this.pcvData.tableData.filter(a=>{return a.itemName == this.selectedTblData.itemName})[0] );
          this.pcvTbl.markAsDirty();
          this.onDataChange('pcv');
        }
      }
      
    //}
  }

  removeAddDelBtn(tbl){
    tbl.addFlag = false;
    tbl.deleteFlag = false;
    tbl.checkFlag = this.requestData.tranTypeCd == 4 ? true : false;
    tbl.uneditable = tbl.uneditable.map(e => e = true);
  }


  checkCancel(){
    if(this.cancelFlag){
      this.can.onNo();
    }else{
      this.suc.modal.modalRef.close();
    }
  }

  cancel(){
    this.can.clickCancel();
  }

  onDataChange(from){
    var tbl;
    if(from.toLowerCase() == 'cv'){
      tbl = this.cvData.tableData;
    }else if(from.toLowerCase() == 'pcv'){
      tbl = this.pcvData.tableData;
    }else if(from.toLowerCase() == 'diemins'){
      tbl = this.diemInsData.tableData;
    }
    console.log(tbl);
    tbl.map(e => {
      e.currCd = this.requestData.currCd;
      e.currRate = this.requestData.currRate;
      (this.requestData.tranTypeCd == 6)?e.currAmt=e.feeAmt:'';
      e.localAmt = (!isNaN(e.currAmt))?Number(e.currAmt)*Number(e.currRate):0;
      if(this.requestData.tranTypeCd != 6 && this.requestData.tranTypeCd != 7){
        for(var j of e.taxAllocation){
          if(j.taxCd == 'VAT' && this.rowData.vatTag == 2){ //if Payee is ZERO VAT
              j.taxAmt = 0;
            }else if(j.taxRate !== null && j.taxRate !== 0){
              j.taxAmt = e.localAmt * (j.taxRate / 100);
            }
          j.edited = true;
        }
      }
      return e;
    });
    // tbl.forEach(e => {
      
    // });

  }

  onRowClick(event){
    console.log(event);
    this.selectedTblData = event;
    if(event != null){
      this.selectedTblData.createDate = this.ns.toDateTimeString(event.createDate);
      this.selectedTblData.updateDate = this.ns.toDateTimeString(event.updateDate);
      if(this.requestData.tranTypeCd != 6 && this.requestData.tranTypeCd != 7){
        //Added by Neco 11/20/2019
        this.disableTaxBtn = false;
        this.passDataGenTax.nData.reqId = event.reqId;
        this.passDataGenTax.nData.itemNo = event.itemNo;
        this.passDataWhTax.nData.reqId = event.reqId;
        this.passDataWhTax.nData.itemNo = event.itemNo;
        this.passDataGenTax.tableData = event.taxAllocation.filter(a=>{return a.taxType == 'G'});
        this.passDataWhTax.tableData = event.taxAllocation.filter(a=>{return a.taxType == 'W'});
        this.genTaxTbl.refreshTable();
        this.whTaxTbl.refreshTable();
      }  
    }else{
      this.disableTaxBtn = true;
    }
    //END 11/20/2019
  }

  onTabChange($event: NgbTabChangeEvent) {
    // if($event.nextId.toUpperCase() == 'UNCOLTABID'){
    //   this.activeUnColTab = true;
    //   this.activeOthTab = false;
    // }else if($event.nextId.toUpperCase() == 'OTHTABID') {
    //   this.activeOthTab = true;
    //   this.activeUnColTab = false;
    // }else{
    //   this.activeOthTab = false;
    //   this.activeUnColTab = false;
    // }
    this.getPaytReqPrqTrans();
  }



}
