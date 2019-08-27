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

@Component({
  selector: 'app-maint-chart-trst-acct',
  templateUrl: './maint-chart-trst-acct.component.html',
  styleUrls: ['./maint-chart-trst-acct.component.css']
})
export class MaintChartTrstAcctComponent implements OnInit, OnDestroy {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lov: LovComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

  chartOfAccounts: any = {
    tableData: [],
    tHeader: ['Acct ID','Type','Acct||Category','Control||Acct','Sub1','Sub2','Sub3','Short Description','Long Description','Short Code','SL Type','Dr/Cr||Normal','Post Tag','Active'],
    dataTypes: ['number','req-select2','number','number','number','number','number','text','text','text','lovInput','select','select','checkbox'],
    keys: ['glAcctId','glAcctCategory','glAcctCategory','glAcctControl','glAcctSub1','glAcctSub2','glAcctSub3','shortDesc','longDesc','shortCode','slTypeName','drCrTag','postTag','activeTag'],
    uneditable: [true,false,true,false,false,false,false,false,false,true,false,false,false,false],
    uneditableKeys: ['glAcctCategory','glAcctControl','glAcctSub1','glAcctSub2','glAcctSub3','shortCode'],
    widths: ['1','auto','1','1','1','1','1','auto','auto','95','100','55','95','1'],
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
    opts: [{
      selector: 'glAcctCategory',
      prev: [],
      vals: [],
    },
    {
      selector: 'drCrTag',
      prev: ['Dr','Cr'],
      vals: ['D','C'],
    },
    {
      selector: 'postTag',
      prev: ['Summary','Detail'],
      vals: ['S','D'],
    }],
    limit: {
      glAcctControl: 2,
      glAcctSub1: 2,
      glAcctSub2: 2,
      glAcctSub3: 2
    }
  };

  passLov: any = {
    selector:'',
    params:{}
  }

  selected: any = null;
  row: any = null;
  dialogIcon:string = '';
  dialogMessage: string = '';
  cancel: boolean = false;

  subscription: Subscription = new Subscription();

  constructor(private titleService: Title, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle("Mtn | Chart of Accounts");
    this.getMtnAcitChartAcct({});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getMtnAcitChartAcct(params) {
    var sub$ = forkJoin(this.ms.getMtnAcitChartAcct(params),
                        this.ms.getRefCode('MTN_ACIT_CHART_ACCT.GL_ACCT_CATEGORY')).pipe(map(([chartAcct, ref]) => { return { chartAcct, ref} }));

    this.subscription.add(sub$.subscribe(data => {
      this.chartOfAccounts.opts[0].prev = data['ref']['refCodeList'].map(a => a.description);
      this.chartOfAccounts.opts[0].vals = data['ref']['refCodeList'].map(a => a.code);

      this.chartOfAccounts.tableData = data['chartAcct']['list'].sort((a, b) => a.glAcctId - b.glAcctId)
                                                                .map(a => {
                                                                  a.createDate = this.ns.toDateTimeString(a.createDate);
                                                                  a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                                                  a.showMG = 1;
                                                                  return a;
                                                                });
      this.table.refreshTable();
      this.table.onRowClick(null, this.chartOfAccounts.tableData[0]);
    }));
  }

  onRowClick(data) {
    this.selected = data;
    this.chartOfAccounts.disableGeneric = this.selected == null || this.selected == '';
  }

  onClickDelete(ev) {
    if(ev != undefined) {
      this.table.confirmDelete();
    } else {
      this.table.indvSelect.edited = true;
      this.table.indvSelect.deleted = true;
      this.table.refreshTable();
    }
  }

  showSLTypeLOV(data) {
    this.row = data.data;
    this.passLov.selector = 'slType';

    this.lov.openLOV();
  }

  setSLType(data) {
    this.row.slTypeCd = data.data.slTypeCd;
    this.row.slTypeName = data.data.slTypeName;
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

    var params = {
      saveAcitChartAcct: [],
      deleteAcitChartAcct: []
    }

    var td = this.chartOfAccounts.tableData;

    td.forEach(a => {
      if(a.edited && !a.deleted) {
        a.createUser = this.ns.getCurrentUser();
        a.createDate = this.ns.toDateTimeString(0);
        a.updateUser = this.ns.getCurrentUser();
        a.updateDate = this.ns.toDateTimeString(0);

        params.saveAcitChartAcct.push(a);
      } else if(a.deleted) {
        params.deleteAcitChartAcct.push(a);
      }
    });

    console.log(params);
    //DITO PO NAHINTO ANG LAHAT, BYE MAINTENANCE, HELLO CV, I'M OUT
  }
}
