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


@Component({
  selector: 'app-invt-sec-type',
  templateUrl: './invt-sec-type.component.html',
  styleUrls: ['./invt-sec-type.component.css']
})
export class InvtSecTypeComponent implements OnInit {
  @ViewChild('invtsectype') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;

  passTable:any={
  	tableData:[],
  	widths:[1,200,300,1],
  	tHeader:['Code','Security','Remarks','Active'],
  	dataTypes:['text','text','text','checkbox'],
  	tooltip:[],
  	uneditable:[true,false,false,false],
  	keys:['invtSecCd','secDesc','remarks','activeTag'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	nData:{
      invtSecCd: null,
      secDesc : null,
      remarks : null,
      activeTag : 'Y',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true
  } 

  allRecords:any = {
    tableData:[],
   	keys:['invtSecCd','secDesc','remarks','activeTag'],
   }

   cancelFlag: boolean; 


  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Investment Security Type');
  	this.getInvtSecType();
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
  }

   getInvtSecType(){
  	this.ms.getMtnInvtSecType().subscribe(a=>{
  		this.passTable.tableData = a['invSecTypeList'];
  		this.passTable.tableData.forEach(a=>{
	  			a.createDate = this.ns.toDateTimeString(a.createDate);
	  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
	  			a.uneditable = ['invtSecCd'];
	  	})
	    this.table.refreshTable();
        this.table.overlayLoader = false;
	  	this.passTable.distableGeneric = false;
    });
  
  }

  checkFields(){
      for(let check of this.passTable.tableData){
         if( check.secDesc === null || check.secDesc === '' 
          ) {   
            return false;
          }   
      }
       return true;
  }

  checkValidation(){
  	if(this.checkFields()){
        let secDescs:string[] = this.passTable.tableData.map(a=>a.secDesc);
            if(secDescs.some((a,i)=>secDescs.indexOf(a)!=i)){
              this.cancelFlag = false;
              this.dialogMessage = 'Unable to save the record. Security must be unique for every investment security type.';
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
	       this.tblHighlightReq('#mtn-invtsectype',this.passTable.dataTypes,[1]);
	   }
  }

  onClickSaveCancel(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
    if(this.cancelFlag){
  	   if (this.checkValidation()){
           this.save();
       }else {
           this.successDialog.open();
           this.tblHighlightReq('#mtn-invtsectype',this.passTable.dataTypes,[1]);
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
  		a.updateDate = this.ns.toDateTimeString(0)
  	});
  	params.delList = this.passTable.tableData.filter(a=>a.deleted);
   
    if(params.saveList.length === 0 && params.delList.length === 0 ){    
          this.conSave.showBool = false;
          this.dialogIcon = "success";
          this.successDialog.open();
           $('.ng-dirty').removeClass('ng-dirty');
    }else {
    	console.log(params);
    	this.ms.saveMtnInvSecType(params).subscribe(a=>{
	  		if(a['returnCode'] == -1){
	            this.dialogIcon = "success";
	            this.successDialog.open();
                this.table.overlayLoader = true;
	            this.getInvtSecType();
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
	      this.getRecords(this.info.invtSecCd);
	   } else if (data[0].basedOn === 'all') {
	      this.getRecords();
	   }
  }

  getRecords(invtSecCd?){
     this.ms.getMtnInvtSecType(invtSecCd).pipe(
           finalize(() => this.finalGetRecords() )
           ).subscribe(a=>{
      this.allRecords.tableData = a['invSecTypeList'];
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
    var filename = 'InvestmentSecurityType'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

    alasql('SELECT invtSecCd AS [Code], secDesc AS [Security], remarks AS Remarks ,activeTag AS Active INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);
  }









}