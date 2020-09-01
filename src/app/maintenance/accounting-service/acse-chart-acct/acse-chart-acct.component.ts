import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { PrintModalMtnAcctComponent } from '@app/_components/common/print-modal-mtn-acct/print-modal-mtn-acct.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-acse-chart-acct',
  templateUrl: './acse-chart-acct.component.html',
  styleUrls: ['./acse-chart-acct.component.css']
})
export class AcseChartAcctComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild('slTypeLov') lov: LovComponent;
  @ViewChild('acctCodeLov') accCodelov: LovComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

  chartOfAccounts: any = {
    tableData: [],
    tHeader: ['Acct ID','Type','Acct||Category','Control||Acct','Sub1','Sub2','Sub3','Short Description','Long Description','Short Code','SL Type','Dr/Cr||Normal','Post Tag','Active'],
    dataTypes: ['number','req-select2','number','number','number','number','number','text','text','text','lovInput','select','select','checkbox'],
    keys: ['glAcctId','glAcctCategory','glAcctCategory','glAcctControl','glAcctSub1','glAcctSub2','glAcctSub3','shortDesc','longDesc','shortCode','slTypeName','drCrTag','postTag','activeTag'],
    uneditable: [true,false,true,false,false,false,false,false,false,true,false,false,false,false],
    uneditableKeys: ['glAcctCategory','glAcctControl','glAcctSub1','glAcctSub2','glAcctSub3','shortCode'],
    widths: ['1','auto','1','1','1','1','1','auto','auto','90','100','55','132','1'],
    nData: {
      showMG: 1,
      newRec: 1,
      glAcctId: '',
      glAcctCategory: '',
      glAcctControl: 0,
      glAcctSub1: 0,
      glAcctSub2: 0,
      glAcctSub3: 0,
      shortDesc: '',
      longDesc: '',
      shortCode: '',
      slTypeName: '',
      drCrTag: '',
      postTag: '',
      activeTag: 'Y'
    },
    pageLength: 10,
    paginateFlag: true,
    infoFlag: true,
    addFlag: true,
    searchFlag: true,
    genericBtn: 'Delete',
    disableGeneric: true,
    magnifyingGlass: ['slTypeName'],
    opts: [
    {
      selector: 'drCrTag',
      prev: ['Dr','Cr'],
      vals: ['D','C'],
    },
    {
      selector: 'postTag',
      prev: [],
      vals: [],
    }],
    limit: {
      glAcctControl: 2,
      glAcctSub1: 2,
      glAcctSub2: 2,
      glAcctSub3: 2
    }
  };

  searchParams = {
    glAcctCategory :'',
    glAcctControl:'',
    glAcctSub1:'',
    glAcctSub2:'',
    glAcctSub3:''
  };

  params = {
    remarks:'',
    saveAcseChartAcct: [],
    deleteAcseChartAcct: []
  };

  passLov: any = {
    selector:'',
    params:{}
  };

  printParams = {
    glAcctId:'',
  }

  selected: any = null;
  row: any = null;
  dialogIcon:string = '';
  dialogMessage: string = '';
  cancel: boolean = false;
  remarksFlag: boolean = false;

  subscription: Subscription = new Subscription();

  constructor(private titleService: Title, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
  	this.titleService.setTitle("Mtn | Chart of Accounts");
  	this.getMtnAcseChartAcct({});
  }

  getMtnAcseChartAcct(params){
    setTimeout(() => {this.table.loadingFlag = true});
  	var sub$ = forkJoin(this.ms.getMtnAcseChartAcct(params),
  	                    this.ms.getRefCode('MTN_ACSE_CHART_ACCT.GL_ACCT_CATEGORY'),
                        this.ms.getRefCode('MTN_ACSE_CHART_ACCT.POST_TAG')).pipe(map(([chartAcct, ref, postTagRef]) => { return { chartAcct, ref, postTagRef} }));

  	this.subscription.add(sub$.subscribe(data => {
  		this.chartOfAccounts.opts.forEach( a=> {
  		  if(a.selector == 'glAcctCategory'){
  		    a.prev = [];
  		    a.vals = [];
  		  }

        if(a.selector == 'postTag'){
          a.prev = data['postTagRef']['refCodeList'].map(a => a.description);
          a.vals = data['postTagRef']['refCodeList'].map(a => a.code);
        }
  		});

  		this.chartOfAccounts.opts.push({selector: 'glAcctCategory',prev: data['ref']['refCodeList'].map(a => a.description), vals : data['ref']['refCodeList'].map(a => a.code)});
  		this.chartOfAccounts.tableData = [];
  		this.chartOfAccounts.tableData = data['chartAcct']['list'].sort((a, b) => a.glAcctId - b.glAcctId)
  		                                                          .map(a => {
  		                                                            a.createDate = this.ns.toDateTimeString(a.createDate);
  		                                                            a.updateDate = this.ns.toDateTimeString(a.updateDate);
  		                                                            a.showMG = 1;
  		                                                            return a;
  		                                                          });

  		this.table.loadingFlag = false;
  		this.table.refreshTable();
  		this.table.onRowClick(null, this.chartOfAccounts.tableData[0]);
  	}));
  }

  onClickSearch(){
    this.getMtnAcseChartAcct(this.searchParams);
  }

  clearAccCode(){
    this.searchParams.glAcctControl = '';
    this.searchParams.glAcctSub1 = '';
    this.searchParams.glAcctSub2 = '';
    this.searchParams.glAcctSub3 = '';
  }

  onRowClick(data){
  	console.log(data)
  	if(data!==null){
  	  this.selected = data;
  	  this.params.remarks = data.remarks;
  	  this.remarksFlag = false;
  	  this.chartOfAccounts.disableGeneric = false;
      this.printParams.glAcctId = data.glAcctId;
  	}else{
  	  this.chartOfAccounts.disableGeneric = true;
  	  this.selected = null;
  	  this.params.remarks = '';
  	  this.remarksFlag = true;
      this.printParams.glAcctId = '';
  	}
  }l

  onClickDelete(ev) {
    console.log(ev)
    if(ev.okDelete == 'N'){
        this.dialogMessage = "Deleting this record is not allowed. This was already used in some accounting records.";
        this.dialogIcon = "error-message";
        this.successDialog.open();
    }else{
      this.table.selected = [this.table.indvSelect];
      this.table.confirmDelete();
    }
  }

  updateShortCode(data) {
    data.forEach(a => {
      if(a.edited && !a.deleted) {
        var chk = 0;
        var temp = [Number(a.glAcctCategory), Number(a.glAcctControl), Number(a.glAcctSub1), Number(a.glAcctSub2), Number(a.glAcctSub3)];

        if(temp.includes(0)) {
          for(var z = 0; z < temp.length; z++) {
            if(z != temp.length-1 && temp[z] == 0 && temp[z+1] > 0) {
              chk = 1;
              break;
            }
          }
        }

        a.shortCode = chk == 1 ? '' : temp.filter(x => x != 0).map((y, i) => { return i == 0 ? y : String(y).padStart(2, '0'); }).join('-');
      }
    });
  }

  showSLTypeLOV(data) {
    this.row = data.data;
    this.passLov.selector = 'slType';

    this.lov.openLOV();
  }

  setSLType(data) {
    this.row.slTypeCd = data.data.slTypeCd;
    this.row.slTypeName = data.data.slTypeName;
    this.row.edited = true;
    this.table.markAsDirty();
  }

  showAccCode(){
    this.passLov.selector = 'acseChartAcct';
    this.passLov.params = {glAcctCategory: this.searchParams.glAcctCategory};
    this.accCodelov.openLOV();
  }

  setAcctCode(data){
    this.searchParams.glAcctCategory = data.data.glAcctCategory;
    this.searchParams.glAcctControl = data.data.glAcctControl;
    this.searchParams.glAcctSub1 = data.data.glAcctSub1;
    this.searchParams.glAcctSub2 = data.data.glAcctSub2;
    this.searchParams.glAcctSub3 = data.data.glAcctSub3;
  }

  onClickSave() {
    var td = this.chartOfAccounts.tableData;

    function x(a) {
      return a === null || a === '';
    }

    for(let d of td) {
      if(d.edited && !d.deleted && (x(d.glAcctCategory) || x(d.glAcctControl) || x(d.glAcctSub1)
        || x(d.glAcctSub2) || x(d.glAcctSub3) || x(d.shortDesc) || x(d.longDesc) || x(d.drCrTag)
          || x(d.postTag) || x(d.shortCode))) {
        this.dialogIcon = 'error';
        this.successDialog.open();

        this.cancel = false;
        return;
      }
    }

    if(!this.cancel) {
      this.confirmSave.confirmModal();  
    } else {
      this.save(false);
    }
  }

   save(cancel?) {
    this.cancel = cancel !== undefined;

    if(this.cancel && cancel) {
      this.onClickSave();
      return;
    }

   
      this.params.saveAcseChartAcct = [];
      this.params.deleteAcseChartAcct = [];

    var td = this.chartOfAccounts.tableData;

    td.forEach(a => {
      if(a.edited && !a.deleted) {
        a.createUser = this.ns.getCurrentUser();
        a.createDate = this.ns.toDateTimeString(0);
        a.updateUser = this.ns.getCurrentUser();
        a.updateDate = this.ns.toDateTimeString(0);

        this.params.saveAcseChartAcct.push(a);
      } else if(a.deleted) {
        this.params.deleteAcseChartAcct.push(a);
      }
    });

    console.log(this.params);
    this.ms.saveAcseChartAcct(this.params).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDialog.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDialog.open();
        this.table.markAsPristine();
        this.getMtnAcseChartAcct({});
      }
    });
    //DITO PO NAHINTO ANG LAHAT, BYE MAINTENANCE, HELLO CV, I'M OUT
  }

  print(){
    this.printModal.open();
  }

  printPreview(data) {
  	this.chartOfAccounts.tableData = [];
    if(data[0].basedOn === 'curr'){
     this.getRecords(this.printParams);
    } else if (data[0].basedOn === 'all') {
     this.getRecords({});
    }
  }

  getRecords(printParams?){
    this.ms.getMtnAcseChartAcct(printParams).pipe(finalize(() => this.finalGetRecords())).subscribe((data:any)=>{
      this.chartOfAccounts.tableData = data.list;
      this.chartOfAccounts.tableData.forEach(a => {
        if(a.slTypeName === null){
          a.slTypeName = '';
        }

        if(a.drCrTag === 'D'){
          a.drCrTag = 'Debit';
        }else{
          a.drCrTag = 'Credit';
        }

        if(a.postTag === 'S'){
          a.postTag = 'Summary'
        }

        if(a.postTag === 'D'){
          a.postTag = 'Detailed'
        }
      });
    });
  }

   finalGetRecords(selection?){
    this.export(this.chartOfAccounts.tableData);
  };

  export(record?){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'AcseChartAcct'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.nvl = function(text) {
        if (text === null){
          return '';
        } else {
          return text;
        }
      };
    
    alasql('SELECT glAcctId AS [Acct ID], glAcctCategory AS [Type], glAcctCategoryDesc AS [Acct Category], glAcctControl AS [Control Acct], glAcctSub1 AS [Sub1], glAcctSub2 AS [Sub2], glAcctSub3 AS [Sub3], shortDesc AS [Short Description], longDesc AS [Long Description], shortCode AS [Short Code], slTypeName AS [SL Type], drCrTag AS [Dr/Cr Normal], postTag AS [Post Tag], activeTag AS [Active] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);    
  }
}
