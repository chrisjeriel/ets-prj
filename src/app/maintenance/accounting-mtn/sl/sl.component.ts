import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { PrintModalMtnAcctComponent } from '@app/_components/common/print-modal-mtn-acct/print-modal-mtn-acct.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import * as alasql from 'alasql';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sl',
  templateUrl: './sl.component.html',
  styleUrls: ['./sl.component.css']
})
export class SlComponent implements OnInit {

  @ViewChild('sl') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(LovComponent) slLov: LovComponent;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

  sl:any = {};
  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;
  cancelFlag: boolean; 
  slTypeCd : any = '';
  slTypeName : any = '';
  private sub: any;
  from: string;

  passLov: any = {
    selector: '',
    activeTag: '',
    hide: []
  }

  passTable:any={
  	tableData:[],
  	widths:[1,100,420,1,1],
  	tHeader:['SL Code','SL Name','Remarks','Auto','Active'],
  	dataTypes:['text','text','text','checkbox','checkbox'],
  	tooltip:[],
  	uneditable:[true,false,false,true,false],
  	keys:['slCd','slName','remarks','autoTag','activeTag'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	nData:{
      slCd		: null,
      slName 	: null,
      remarks 	: null,
      autoTag 	: 'N',
      activeTag : 'Y',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true,
    disableAdd:true,
  }

   allRecords:any = {
    tableData:[],
   	keys:['slCd','slName','slTypeCd','slTypeName','remarks','autoTag','activeTag']
   }



  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService,private route: ActivatedRoute) { }

  ngOnInit() {
  	this.form.control.markAsPristine();
  	this.titleService.setTitle('Mtn | Subsidiary Ledger');

    this.sub = this.route.params.subscribe(params => {

      this.from = params['from'];
      if (this.from == "mtn-sl-type") {
        this.slTypeCd = params['slTypeCd'];
        this.slTypeName = params['slTypeName'];
        this.getMtnSl(this.slTypeCd);        
      }

    });

  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'Deleting this record is not allowed. This was already used in some accounting records.';
  		this.successDialog.open();
  	}else{
  		this.table.selected  = [this.table.indvSelect]
  		this.table.confirmDelete();
      $('#cust-table-container').addClass('ng-dirty');
  	}
  }

   onClickCancel(){
  	this.cnclBtn.clickCancel();
  }

  onTableClick(data){
    console.log(data);
    this.info = data;
    this.passTable.disableGeneric = data == null;

    if (data === null) {
    } else {
    	if (data.autoTag === 'Y'){
    		this.passTable.disableGeneric = true;
    	} 
    } 
 }

 getMtnSl(slTypeCd){
 	this.passTable.disableGeneric = true;
    if(slTypeCd =='' || slTypeCd == undefined ){
    	this.passTable.disableGeneric = true;
    	this.passTable.disableAdd = true;
      this.passTable.tableData = [];
      this.table.refreshTable();
      this.table.overlayLoader = false;
    }else{
      let  slParams:any = {};
      slParams.slTypeCd = slTypeCd;
      console.log(slParams);
	  	this.ms.getMtnSL(slParams).subscribe(a=>{
	  		this.passTable.tableData = a['list'];
        console.log(a['list']);
	  		this.passTable.tableData.forEach(a=>{
	  			a.createDate = this.ns.toDateTimeString(a.createDate);
	  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
	  		})
	  		this.table.refreshTable();
        this.table.overlayLoader = false;
	  		this.passTable.disableGeneric = true;
    		this.passTable.disableAdd = false;
	  	})
	  }
 }

 checkCode(ev){
    $('.ng-dirty').removeClass('ng-dirty');
    this.passTable.tableData = [];
    this.table.refreshTable();
    this.ns.lovLoader(ev, 1);
    this.table.overlayLoader = true;
    this.slLov.checkCode('slType','','','','','',ev,this.slTypeCd);
}

clickLov(){
  this.passLov.selector = 'slType';
  this.passLov.params = {};
  this.slLov.openLOV();
}

setSelectedSLType(data){
  if(data.data === null){
    this.ns.lovLoader(data.ev, 0);
    this.slTypeCd = null;
    this.slTypeName = null;
    this.passTable.disableAdd = true;
    this.passTable.disableGeneric = true;
    this.passTable.tableData = [];
    this.table.refreshTable();
  } else {
    let selected = data.data;
    this.slTypeCd = selected.slTypeCd;
    this.slTypeName = selected.slTypeName;
    this.ns.lovLoader(data.ev, 0);
    this.sl = selected;
    this.table.overlayLoader = true;
    this.passTable.disableGeneric = true;
    this.getMtnSl(this.slTypeCd);
  }
  
}

checkFields(){
      for(let check of this.passTable.tableData){
         if( check.slName === null || check.slName === ''
          ) {   
            return false;
          }
      }
       return true;
}

checkValidation(){
    if(this.checkFields()){
      let slNames:string[] = this.passTable.tableData.map(a=>a.slName);
            if(slNames.some((a,i)=>slNames.indexOf(a)!=i)){
              this.cancelFlag = false;
              this.dialogMessage = 'Unable to save the record. SL name must be unique for every SL Code.';
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
            if(dataTypes[i] == 'text' || dataTypes[i] == 'date' || dataTypes[i] == 'time' || dataTypes[i] === 'number') {
              val = $(this).find('input').val();
              highlight($(this), val);
            }
          }
        });
      });

      function highlight(td, val) {
        td.css('background', typeof val == 'undefined' ? 'transparent' : val == '' || val == null ? '#fffacd85' : 'transparent');
      }
    }, 0);
  }

onClickSave(cancelFlag?){
     if (this.checkValidation()){
          this.conSave.confirmModal();
     }else {
         this.successDialog.open();
         this.tblHighlightReq('#mtn-sl',this.passTable.dataTypes,[1]);
     }
}

onClickSaveCancel(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    if(this.cancelFlag){
       if (this.checkValidation()){
           this.save();
       }else {
           this.successDialog.open();
           this.tblHighlightReq('#mtn-sl',this.passTable.dataTypes,[1]);
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
      a.slTypeCd   = this.slTypeCd;
    });
    params.delList = this.passTable.tableData.filter(a=>a.deleted);
   
    if(params.saveList.length === 0 && params.delList.length === 0 ){    
          this.conSave.showBool = false;
          this.dialogIcon = "success";
          this.successDialog.open();
           $('.ng-dirty').removeClass('ng-dirty');
    }else {
      console.log(params);
      this.ms.saveMtnSL(params).subscribe(a=>{
        if(a['returnCode'] == -1){
              this.dialogIcon = "success";
              this.successDialog.open();
              this.table.overlayLoader = true;
              this.passTable.disableGeneric = true;
              this.getMtnSl(this.slTypeCd);              
              $('.ng-dirty').removeClass('ng-dirty');

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

  printPreview(data){
   console.log(data);
   this.allRecords.tableData = [];
     if(data[0].basedOn === 'curr'){
        this.getRecords(this.slTypeCd);
     } else if (data[0].basedOn === 'all') {
        this.getRecords();
     }
  }

  getRecords(slTypeCd?){
     let  slParams:any = {};
     slParams.slTypeCd = slTypeCd;

     this.ms.getMtnSL(slParams).pipe(
           finalize(() => this.finalGetRecords() )
           ).subscribe(a=>{
      this.allRecords.tableData = a['list'];
        this.allRecords.tableData.forEach(a=>{
          if (a.remarks === null){
            a.remarks = '';
          }
        });
     });
 }

 finalGetRecords(){
    this.export(this.allRecords.tableData);
  };

  export(record?){
        //do something
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'SubsidiaryLedger'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

    alasql('SELECT slTypeCd AS [ SL Type], slTypeName AS [SL Type Name],slCd AS [SL Cd], slName AS [SL Name], remarks AS Remarks ,autoTag AS [Auto Tag],activeTag AS Active INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);
  }

}
