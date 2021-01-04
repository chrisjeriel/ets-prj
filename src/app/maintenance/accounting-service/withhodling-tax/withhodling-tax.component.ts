import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { PrintModalMtnAcctComponent } from '@app/_components/common/print-modal-mtn-acct/print-modal-mtn-acct.component';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-withhodling-tax',
  templateUrl: './withhodling-tax.component.html',
  styleUrls: ['./withhodling-tax.component.css']
})
export class WithhodlingTaxComponent implements OnInit {
   
   @ViewChild('whTax') table: CustEditableNonDatatableComponent;
   @ViewChild('whTaxHist') whTaxHistTbl: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild('whTaxSave') confirm: ConfirmSaveComponent;
   @ViewChild('whTaxHistSave') confirmWhTax: ConfirmSaveComponent;
   @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
   @ViewChild('taxAmtHist') taxAmtHistMdl: ModalComponent;
   @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

   passData: any = {
      tableData: [],
      tHeader: ['WhTax ID','WhTax Code', 'Withholding Tax Name', 'WhTax Type','Rate', 'Default GL Account', 'GL Account Name', 'Creditable','Fixed','Active'],
      dataTypes: ['number','text', 'text', 'select','number','text', 'text', 'checkbox','checkbox','checkbox'],
      nData: {
        whtaxId : '',
        taxCd : '',
        taxName : '',
        taxType : '',
        taxRate : '',
        defaultAcitGl : '',
        defaultAcseGl : '',
        creditableTag : 'N',
        fixedTag : 'N',
        activeTag : 'N',
        createUser : this.ns.getCurrentUser(),
        createDate : '',
        updateUser : this.ns.getCurrentUser(),
        updateDate : '',
      },
      searchFlag: true,
      infoFlag: true,
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      paginateFlag: true,
      pageLength: 10,
      pageID: 1,
      opts: [{
              selector: 'taxType',
              prev: ['Corporate','Individual'],
              vals: ['C','I'],
             }
      ],
      uneditable: [true,false,false,false,false,false,false,false,false,false],
      widths: [60,70,390,115,75,110,90,65,50,67],
      keys: ['whtaxId', 'taxCd', 'taxName', 'taxType', 'taxRate', 'defaultAcitGl','defaultAcseGl', 'creditableTag','fixedTag', 'activeTag'],
  }

  passDataHistory: any = {
      tableData: [],
      tHeader: ['WhTax ID','WhTax Code', 'WhTax Type', 'Rate','Default GL', 'Creditable','Fixed','From','To','Updated By'],
      dataTypes: ['number','text', 'text', 'percent','text', 'checkbox','checkbox','date','date','text'],
      nData: {
        whtaxId :'',
        taxCd :'',
        taxType :'',
        defaultAcseGl :'',
        creditableTag :'',
        fixedTag :'',
        createUser:this.ns.getCurrentUser(),
        createDate:'',
        updateUser:this.ns.getCurrentUser(),
        updateDate:''
      },
      searchFlag: true,
      infoFlag: true,
      addFlag: false,
      deleteFlag: false,
      paginateFlag: true,
      pageLength: 10,
      pageID: 1,
      uneditable: [true,true,true,true,true,true,true,true,true,true],
      //widths: [85,100,305,310,165,50,50,50],
      keys: ['whtaxId', 'taxCd', 'taxTypeDesc', 'rate','defaultAcseGl', 'creditableTag', 'fixedTag', 'createDate','updateDate', 'updateUser'],
  };

  params = {
    remarks: '',
    createUser:'',
    createDate:'',
    updateUser:'',
    updateDate:'',
    delWhTax: [],
    saveWhTax: []
  };

  paramsHist = {
    remarks:'',
    saveWhTaxHist :[]
  };

  dialogIcon : any;
  dialogMessage : any;
  cancelFlag: boolean = false;
  whTaxId: any;
  remarksFlag: boolean = true;
  historyFlag: boolean = false;
  remarksHistFlag: boolean = false;

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.retrieveWhtax();
  }

  retrieveWhtax(){
    this.maintenanceService.getWhTax(null,null,null).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      for (var i = 0; i < data.whtax.length; i++) {
        this.passData.tableData.push(data.whtax[i]);
      }
      this.table.refreshTable();
    });
  }

  onRowClick(data){
    console.log(data)
    if(data !== null){
      this.whTaxId = data.whtaxId;
      this.params.remarks = data.remarks;
      this.params.createUser = data.createUser;
      this.params.createDate = this.ns.toDateTimeString(data.createDate);
      this.params.updateUser = data.updateUser;
      this.params.updateDate = this.ns.toDateTimeString(data.updateDate);
      this.remarksFlag = false;
      this.historyFlag = false;
    }else{
      this.whTaxId = null;
      this.params.remarks = '';
      this.params.createUser = '';
      this.params.createDate = '';
      this.params.updateUser = '';
      this.params.updateDate = '';
      this.historyFlag = true;
      this.remarksFlag = true;
    }
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  prepareData(){
    this.params.saveWhTax = [];
    this.params.delWhTax = [];

    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        console.log(this.passData.tableData[i])
        this.params.saveWhTax.push(this.passData.tableData[i]);
        this.params.saveWhTax[this.params.saveWhTax.length - 1].createDate = this.ns.toDateTimeString(0);
        this.params.saveWhTax[this.params.saveWhTax.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[i].deleted){
        this.params.delWhTax.push(this.passData.tableData[i]);
      }
    }
  }

  saveMtnWhTax(cancel?){
    this.cancelFlag = cancel !== undefined;
    this.prepareData();
    console.log(this.params)
    this.maintenanceService.saveWhTax(this.params).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.historyFlag = true;
        this.retrieveWhtax();
      }
    });
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  onClickHistory(){
    this.taxAmtHistMdl.openNoClose();
    this.retrieveHist();
  }

  retrieveHist(){
    this.whTaxHistTbl.loadingFlag = true;
    this.maintenanceService.getAcseWhtaxHist(this.whTaxId,null).subscribe((data:any) => {
      this.passDataHistory.tableData = [];
      for (var i = 0; i < data.whTaxHist.length; i++) {
        this.passDataHistory.tableData.push(data.whTaxHist[i]);
      }
      this.whTaxHistTbl.loadingFlag = false;
      this.whTaxHistTbl.onRowClick(null,this.passDataHistory.tableData[0]);
      this.whTaxHistTbl.refreshTable();
    });  
  }

  saveWhTaxHist(){
    this.paramsHist.saveWhTaxHist = [];

    for (var i = 0; i < this.passDataHistory.tableData.length; i++) {
      if(this.passDataHistory.tableData[i].edited && !this.passDataHistory.tableData[i].deleted){
        this.paramsHist.saveWhTaxHist.push(this.passDataHistory.tableData[i]);
        this.paramsHist.saveWhTaxHist[this.paramsHist.saveWhTaxHist.length - 1].createDate = this.ns.toDateTimeString(0);
        this.paramsHist.saveWhTaxHist[this.paramsHist.saveWhTaxHist.length - 1].updateDate = this.ns.toDateTimeString(0);
      }
    }

    this.maintenanceService.saveAcseWhtaxHist(this.paramsHist).subscribe((data:any)=>{
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveHist();
      }
    })
  }

  whTaxHistClick(data){
    console.log(data)
    if(data !== null){
      this.paramsHist.remarks = data.remarks;
      this.remarksHistFlag = false;
    }else{
      this.paramsHist.remarks = '';
      this.remarksHistFlag = true;
    }
  }

  onClickWhTaxHist(){
    this.confirmWhTax.confirmModal();
  }

  print(){
    this.printModal.open();
  }

  printPreview(data){
    console.log(data);
    this.passData.tableData = [];
    if(data[0].basedOn === 'curr'){
     this.getRecords(this.whTaxId);
    } else if (data[0].basedOn === 'all') {
     this.getRecords();
    }
  }

  getRecords(whtaxId?){
    this.maintenanceService.getWhTax(whtaxId,null,null).pipe(finalize(() => this.finalGetRecords())).subscribe((data:any)=>{
      this.passData.tableData = data.whtax;
      console.log(this.passData.tableData)
      this.passData.tableData.forEach(a => {
        if(a.defaultAcitGl === null){
          a.defaultAcitGl = '';
        }
        if(a.defaultAcseGl === null){
          a.defaultAcseGl = '';
        }
        if(a.taxType === 'I'){
          a.taxType = 'Individual';
        }

        if(a.taxType === 'C'){
          a.taxType = 'Corporate';
        }
      });
    });
  }

   finalGetRecords(selection?){
    //console.log(this.allRecords.tableData);
    this.export(this.passData.tableData);
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
    var filename = 'WithholdingTax'+currDate+'.xls'
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
    
    alasql('SELECT whtaxId AS [WhTax ID],taxCd AS [WhTax Code],taxName AS [Withholding Tax Name],taxType AS [WhTax Type],taxRate AS [Rate],defaultAcitGl AS [Default GL Account],defaultAcseGl AS [GL Account Name],creditableTag AS [Creditable],fixedTag AS [Fixed],activeTag AS [Active] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);    
  }


}