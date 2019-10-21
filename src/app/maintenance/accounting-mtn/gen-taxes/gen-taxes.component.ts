import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { PrintModalMtnAcctComponent } from '@app/_components/common/print-modal-mtn-acct/print-modal-mtn-acct.component';
import * as alasql from 'alasql';
import { finalize } from 'rxjs/operators';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';



@Component({
  selector: 'app-gen-taxes',
  templateUrl: './gen-taxes.component.html',
  styleUrls: ['./gen-taxes.component.css']
})
export class GenTaxesComponent implements OnInit {

  @ViewChild('gentax') table: CustEditableNonDatatableComponent;
  @ViewChild('gentaxhist') tableHist: CustEditableNonDatatableComponent;
  @ViewChild('gentaxrange') tableRange: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild('saveHist') conSaveHist: ConfirmSaveComponent;
   @ViewChild('saveRange') conSaveRange: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;
  @ViewChild(LovComponent) lovMdl: LovComponent;
  @ViewChild('mdl') modal : ModalComponent;
  @ViewChild('mdlHist') modalHist : ModalComponent;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any;
  infoHist:any;
  cancelFlag: boolean; 
  boolRange: boolean = true;
  boolPrint: boolean = false;
  boolRemarks : boolean = true;
  boolHistory: boolean = true;
  boolRemarksHist: boolean = true;
  boolSaveHist: boolean = true;
  lovRow: any ;
  indexRow: any;
  indexRowHist: any

  passLov: any = {
    selector: '',
    activeTag: '',
    hide: []
  }

  lovCheckbox: boolean = false;

  passTableRange: any={
  	tableData:[],
  	widths:[1,1,1,1],
  	tHeader:['Minimum Value','Maximum Value','Tax Rate','Tax Amount'],
  	dataTypes:['currency','currency','percent','currency'],
  	keys:['minVal','maxVal','taxRate','amount'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:false,
  	pageID : 'genTaxRange',
  	nData:{
      rangeNo : null,
  		maxVal : null,
  		minVal : null,
  		taxRate : null,
      rate : null,
  		amount : null },
	disableSort : true,
	disableGeneric: true
  }

  passTableHist: any={
    tableData:[],
    tHeaderWithColspan : [],
    widths:[1,1,1,80,80,100,1,100,100,1],
    tHeader:['Tax ID','Tax Code','Charge Type', 'Rate','Amount','Default GL Account','Fixed','From','To','Updated By'],
    dataTypes:['number','text','select','percent','currency','text','checkbox','date','date','text'],
    uneditable:[true,true,true,true,true,true,true,true,true,true],
    keys:['taxId','taxCd','chargeType','taxRate','amount','defaultGLBankAcctCd','fixedTag','effDateTo','effDateFrom','updateUser'],
    addFlag: false,
    paginateFlag:true, 
    pageLength: 10,
    infoFlag:true,
    searchFlag:true,
    pageID : 'genTaxHist',
    opts: [{
              selector: 'chargeType',
              prev: ['Rate','Amount','Range'],
              vals: ['R','A','G'],
          }]

  }

  allRecords:any = {
    tableData:[],
    keys:['taxId','taxCd','taxName','chargeType','taxRate','amount','defaultGLBankAcctCd','defaultGLBankAcctName','fixedTag','activeTag'],
   }


  passTable:any={
  	tableData:[],
  	widths:[1,1,150,1,80,80,1,200,1,1],
  	tHeader:['Tax ID','Tax Code','Tax Name','Charge Type', 'Rate','Amount','Default GL Account','GL Account Name','Fixed','Active'],
  	dataTypes:['number','text','text','select','percent','currency','text','text','checkbox','checkbox'],
  	tooltip:[],
  	uneditable:[true,false,false,false,false,false,true,true,false,false],
  	keys:['taxId','taxCd','taxName','chargeType','taxRate','amount','defaultGLBankAcctCd','defaultGLBankAcctName','fixedTag','activeTag'],
  	magnifyingGlass: [ "defaultGLBankAcctCd"],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	pageID : 'genTax',
  	nData:{
  	  showMG : 1,
      taxId: null,
      taxCd : null,
      taxName : null,
      chargeType : null,
      taxRate : null,
      amount : null,
      defaultAcitGl : null,
      glAcctId : null,
      defaultGLBankAcctCd : null,
      defaultGLBankAcctName : null,
      fixedTag : 'Y',
      activeTag : 'Y',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true,
    opts: [{
	            selector: 'chargeType',
	            prev: ['Rate','Amount','Range'],
	            vals: ['R','A','G'],
        	}]
  } 

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
  	 this.titleService.setTitle('Mtn | General Taxes');
  	 setTimeout(a=>this.table.refreshTable(),0);
  	 this.getMtnDGenTax();
     this.passTableHist.tHeaderWithColspan.push({ header: "", span: 7 },
         { header: "Effectivity Date", span: 2 },{ header: "", span: 1 });
  }

  getMtnDGenTax(){
  	this.ms.getMtnGenTax().subscribe(a=>{
  		this.passTable.tableData = a['genTaxList'];
  		this.passTable.tableData.forEach(a=>{
	  			a.createDate = this.ns.toDateTimeString(a.createDate);
	  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
				a.showMG = 1;
	  	})
	    this.table.refreshTable();
        this.table.overlayLoader = false;
	  	this.passTable.distableGeneric = false;
    });
  }

  onTableClick(data){
  	console.log(data);

    for (var i = this.passTable.tableData.length - 1; i >= 0; i--) {
            if(data == this.passTable.tableData[i]){
                this.indexRow = i;
                break;
            }
    }

  	if (data === null){
  	  this.info = null;
  	  this.passTable.disableGeneric = true;
  	  this.boolRange = true;
      this.boolRemarks = true;
      this.boolHistory = true;
  	} else {
      this.info = data;
      this.boolRange = true;
  	  this.passTable.disableGeneric = false;
      this.boolRemarks = false;

  	  if (data.chargeType === 'G'){
  	  	this.boolRange = false;
  	  } 

      if (data.add === true){
        this.boolHistory = true;
        this.boolRange = true;
      }else {
        this.boolHistory = false;
      }
  	}
  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'Deleting this record is not allowed. This was already used in some accounting records.';
  		this.successDialog.open();
  	}else{
  		this.table.selected  = [this.table.indvSelect]
  		this.table.confirmDelete();
      this.boolRange = true;
      this.boolRemarks = true;
      this.boolHistory = true;
  		$('#cust-table-container').addClass('ng-dirty');
  	}
  }

  clickLOV(data){
  	this.lovRow = null;

  	 if(data.key=='defaultGLBankAcctCd'){
  	 	this.passLov.selector = 'acseChartAcct';
	    this.passLov.params = {};
	    this.lovMdl.openLOV();
        data.tableData = this.passTable.tableData;
        this.lovRow = data.index;
     }
  }

  setSelectedData(data){
    let selected = data.data;
    this.passTable.tableData[this.lovRow].glAcctId = selected.glAcctId;
    this.passTable.tableData[this.lovRow].defaultAcseGl = selected.glAcctId;
    this.passTable.tableData[this.lovRow].defaultGLBankAcctCd = selected.shortCode;
    this.passTable.tableData[this.lovRow].defaultGLBankAcctName = selected.longDesc;
    this.passTable.tableData[this.lovRow].edited = true;
    $('#cust-table-container').addClass('ng-dirty');
  }


  update(data){
  	 for(var i= 0; i< this.passTable.tableData.length; i++){
  	 	 if(this.passTable.tableData[i].edited || this.passTable.tableData[i].add){
  	 	   if (data.key === 'chargeType'){

               if(this.passTable.tableData[i].chargeType === 'R')
                  this.passTable.tableData[i].amount = null;
                  this.boolRange = true;
               }

               if (this.passTable.tableData[i].chargeType === 'A'){
               	  this.passTable.tableData[i].taxRate = null;
                  this.boolRange = true;
               }
               
               if (this.passTable.tableData[i].chargeType === 'G'){
                 
                 /*if(this.passTable.tableData[i].add === true){
                    this.boolRange = true;
                 }*/

                  this.boolRange = true;
               	  this.passTable.tableData[i].amount = null;
               	  this.passTable.tableData[i].taxRate = null;
               }
           }
	  	 }
  	 }

  onChangeRemarks(){
     this.passTable.tableData[this.indexRow].edited = true;
     $('#cust-table-container').addClass('ng-dirty');
   }

 onClickRange(){
 	 this.modal.openNoClose();
   this.tableRange.overlayLoader = true;
   this.getMtnGenTaxRange(this.info.taxId);
 }

 deleteRange(){
  	this.tableRange.selected  = [this.tableRange.indvSelect]
  	this.tableRange.confirmDelete();
    $('#cust-table-container').addClass('ng-dirty');
 }

 onTableRangeClick(data){
   console.log(data);
 	if (data === null){
  	  this.passTableRange.disableGeneric = true;
  	} else {
  	  this.passTableRange.disableGeneric = false;
  	}
 }

  onClickCancel(){
    this.cnclBtn.clickCancel();
  }

  onClickSave(cancelFlag?){
     if (this.checkValidation()){
        this.conSave.confirmModal();
     }else {
         this.successDialog.open();
         this.tblHighlightReq('#mtn-gentax',this.passTable.dataTypes,[1,2,3]);
     }
  }

   checkFields(){
      for(let check of this.passTable.tableData){
         if( 
             check.taxCd === null || check.taxCd === '' ||
             check.taxName === null || check.taxName === '' ||
             check.chargeType === null || check.chargeType === '' 
          ) {   
            return false;
          }   
      }
       return true;
   }

   checkValidation(){
      if(this.checkFields()){
        let taxCds:string[] = this.passTable.tableData.map(a=>a.taxCd);
            if(taxCds.some((a,i)=>taxCds.indexOf(a)!=i)){
              this.cancelFlag = false;
              this.dialogMessage = 'Unable to save the record. Tax Code must be unique for every record.';
              this.dialogIcon = 'error-message';
              return false;
            } else {
              return true;
            }

     }else{
          this.dialogMessage="Please check field values.";
          this.dialogIcon = "error";
          return false;
       }
  }

  tblHighlightReq(el, dataTypes, reqInd) {
    setTimeout(() => {
      $(el).find('tbody').children().each(function() {
        $(this).children().each(function(i) {
          if(reqInd.includes(i)) {
            var val;
            if(dataTypes[i] == 'text' || dataTypes[i] == 'date' || dataTypes[i] == 'time' || dataTypes[i] == 'currency') {
              val = $(this).find('input').val();
              highlight($(this), val);
            } else if(dataTypes[i] == 'select') {
              val = $(this).find('select').val();    
              highlight($(this), val);
            }else if(dataTypes[i] == 'number') {
              val = isNaN(Number($(this).find('input').val())) ? null : $(this).find('input').val();
            }
          }
        });
      });

      function highlight(td, val) {
        td.css('background', typeof val == 'undefined' ? 'transparent' : val == '' || val == null ? '#fffacd85' : 'transparent');
      }
      }, 0);

   }

  onClickSaveCancel(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    if(this.cancelFlag){
       if (this.checkValidation()){
           this.save();
       }else {
           this.successDialog.open();
           this.tblHighlightReq('#mtn-gentax',this.passTable.dataTypes,[1,2,3]);
       }
    }else {
      this.save();
    }
  }

  save(){
    let params: any = {
      saveList:[],
      delList:[]
    }
    params.saveList = this.passTable.tableData.filter(a=>a.edited && !a.deleted);
    params.saveList.forEach(a=>{
      a.updateUser = this.ns.getCurrentUser();
      a.updateDate = this.ns.toDateTimeString(0);
      a.glAcctId   = a.defaultAcseGl;
    });
    params.delList = this.passTable.tableData.filter(a=>a.deleted);
   
    if(params.saveList.length === 0 && params.delList.length === 0 ){    
          this.conSave.showBool = false;
          this.dialogIcon = "success";
          this.successDialog.open();
          $('.ng-dirty').removeClass('ng-dirty');
    }else {
      console.log(params);
      this.ms.saveMtnGenTax(params).subscribe(a=>{
        if(a['returnCode'] == -1){
          this.form.control.markAsPristine();
              this.dialogIcon = "success";
              this.successDialog.open();
              this.table.overlayLoader = true;
              this.getMtnDGenTax();
              $('.ng-dirty').removeClass('ng-dirty');
              this.boolRange = true;
              this.boolRemarks = true;
              this.boolHistory = true;
              this.passTable.disableGeneric = true;
              this.info = null;
          }else{
              this.dialogIcon = "error";
              this.successDialog.open();
          }
      });
    }
    
  }

  onClickHistory(){
    this.modalHist.openNoClose();
    this.boolRemarksHist = true;
    this.boolSaveHist = true;
    this.tableHist.overlayLoader = true;
    this.getMtnGenTaxHist(this.info.taxId);
  }
  

   getMtnGenTaxHist(taxId?){
    this.passTableHist.tableData = [];
    this.ms.getMtnGenTaxHist(taxId).subscribe(a=>{
      this.passTableHist.tableData = a['genTaxList'];
      this.passTableHist.tableData.forEach(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.effDateTo = this.ns.toDateTimeString(a.effDateTo);
          a.effDateFrom = this.ns.toDateTimeString(a.effDateFrom);
      })   
      this.tableHist.refreshTable();
      this.tableHist.overlayLoader = false;
    });
  }

   onTableHistClick(data){
    console.log(data);
    for (var i = this.passTableHist.tableData.length - 1; i >= 0; i--) {
            if(data == this.passTableHist.tableData[i]){
                this.indexRowHist = i;
                break;
            }
    }

    if (data === null){
      this.infoHist = null;
      this.boolRemarksHist = true;
      this.boolSaveHist = true;
    } else {
      this.infoHist = data;
      this.boolRemarksHist = false;
      this.boolSaveHist = false;
    }

   }

   saveGenTaxHist(){
      this.conSaveHist.confirmModal();
   }

   onChangeRemarksHist(){
     this.passTableHist.tableData[this.indexRowHist].edited = true;
     $('#cust-table-container').addClass('ng-dirty');
   }

   onClickSaveHist(){
     let params: any = {
      saveList:[]
     }
    params.saveList = this.passTableHist.tableData.filter(a=>a.edited && !a.deleted);
    params.saveList.forEach(a=>{
      a.updateUser = this.ns.getCurrentUser();
      a.updateDate = this.ns.toDateTimeString(0);
    });

    if(params.saveList.length === 0){    
          this.conSaveHist.showBool = false;
          this.dialogIcon = "success";
          this.successDialog.open();
          $('.ng-dirty').removeClass('ng-dirty');
    }else {
       console.log(params);
       this.ms.saveMtnGenTaxHist(params).subscribe(a=>{
        if(a['returnCode'] == -1){
          this.form.control.markAsPristine();
              this.dialogIcon = "success";
              this.successDialog.open();
              this.tableHist.overlayLoader = true;
              this.getMtnGenTaxHist(this.info.taxId);
              $('.ng-dirty').removeClass('ng-dirty');
              this.infoHist = null;
              this.boolRemarksHist = true;
              this.boolSaveHist = true;
          }else{
              this.dialogIcon = "error";
              this.successDialog.open();
          }
      });
    }

   }

  print(){
    this.printModal.open();
  }

  printPreview(data) {
    //added by Totz during merge to remove error; See line dcb-user.component.html(43,43)
     console.log(data);
     this.allRecords.tableData = [];
     if(data[0].basedOn === 'curr'){
      this.getRecords(this.info.taxCd);
   } else if (data[0].basedOn === 'all') {
    this.getRecords();
   }
  }

  currency(currency) {
       var parts = parseFloat(currency).toFixed(2).split(".");
       var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (parts[1] ? "." + parts[1] : "");
       return num;     
  }

  getRecords(taxCd?){
     this.ms.getMtnGenTax(taxCd).pipe(
           finalize(() => this.finalGetRecords() )
           ).subscribe(a=>{
        this.allRecords.tableData = a['genTaxList'];

          this.allRecords.tableData.forEach(a=>{
              if (a.chargeType === 'R'){
                a.chargeType = 'Rate';
              }else if (a.chargeType === 'A') {
                a.chargeType = 'Amount';
              }else if(a.chargeType === 'G'){
                a.chargeType = 'Range';
              };

              if(a.amount === null){
                a.amount = '';
              }else {
                a.amount = this.currency(a.amount);
              }
        });
      });
  }
  
  finalGetRecords(selection?){
    console.log(this.allRecords.tableData);
    this.export(this.allRecords.tableData);
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
    var filename = 'General Taxes'+currDate+'.xls'
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
    
    alasql('SELECT taxId AS [Tax Id],taxCd AS [Tax Cd],chargeType AS [Charge Type],nvl(taxRate) AS [Rate],amount AS [Amount],nvl(defaultGLBankAcctCd) AS [Default Gl Account], nvl(defaultGLBankAcctName) AS [GL Account Name] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);    

  }
 
  saveGenTaxRange(){
     if(this.checkRangeFields()){
        this.conSaveRange.confirmModal();
     }else{
        this.dialogMessage="Please check field values.";
        this.dialogIcon = "error";
        this.successDialog.open();
        this.tblHighlightReq('#mtn-gentax-range',this.passTableRange.dataTypes,[0,1]);
     }
   
  }

  checkRangeFields(){
      for(let check of this.passTableRange.tableData){
         if( 
             check.maxVal === null || check.maxVal === '' || isNaN(check.maxVal) ||
             check.minVal === null || check.minVal === '' || isNaN(check.minVal) ||
             parseInt(check.maxVal) < parseInt(check.minVal)
          ) {   
            return false;
          }   
      }
       return true;
   }

  onClickSaveRange(){

    let params: any = {
      saveList:[],
      delList:[]
    }
    params.saveList = this.passTableRange.tableData.filter(a=>a.edited && !a.deleted);
    params.saveList.forEach(a=>{
      a.taxId = this.info.taxId;
      a.rate = a.taxRate;
      a.updateUser = this.ns.getCurrentUser();
      a.updateDate = this.ns.toDateTimeString(0);
    });
    params.delList = this.passTableRange.tableData.filter(a=>a.deleted);
   
    if(params.saveList.length === 0 && params.delList.length === 0 ){    
          this.conSaveRange.showBool = false;
          this.dialogIcon = "success";
          this.successDialog.open();
          $('.ng-dirty').removeClass('ng-dirty');
    }else {
      console.log(params);
      this.tableRange.overlayLoader = true;
      this.ms.saveMtnGenTaxRange(params).subscribe(a=>{
        if(a['returnCode'] == -1){
          this.form.control.markAsPristine();
              this.dialogIcon = "success";
              this.successDialog.open();
              this.tableRange.overlayLoader = true
              this.getMtnGenTaxRange(this.info.taxId);
              $('.ng-dirty').removeClass('ng-dirty');
              this.passTableRange.disableGeneric = true;
          }else{
              this.dialogIcon = "error";
              this.successDialog.open();
          }
      });
    }
  }

  getMtnGenTaxRange(taxId?){
    this.passTableRange.tableData = [];
    this.ms.getMtnGenTaxRange(taxId).subscribe(a=>{
      this.passTableRange.tableData = a['genTaxListRange'];
      this.passTableRange.tableData.forEach(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
      })   
      this.tableRange.refreshTable();
      this.tableRange.overlayLoader = false;
    });
  }
  
}
