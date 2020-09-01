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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sl-type',
  templateUrl: './sl-type.component.html',
  styleUrls: ['./sl-type.component.css']
})
export class SlTypeComponent implements OnInit {
  
  @ViewChild('sltype') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;
  cancelFlag: boolean; 
  boolSLMain : boolean = true;

   passTable:any={
  	tableData:[],
  	widths:[1,100,420,1,1],
  	tHeader:['SL Type Code','SL Type Name','Remarks','Auto','Active'],
  	dataTypes:['number','text','text','checkbox','checkbox'],
  	tooltip:[],
  	uneditable:[true,false,false,true,false],
  	keys:['slTypeCd','slTypeName','remarks','autoTag','activeTag'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	nData:{
      slTypeCd: null,
      slTypeName : null,
      remarks : null,
      autoTag : 'N',
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
   	keys:['slTypeCd','slTypeName','remarks','activeTag'],
   }

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService,private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Subsidiary Ledger Type');
  	this.getMtnSlType();
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
    this.boolSLMain = data == null;
    this.passTable.disableGeneric = data == null;

    if (data === null) {
    	this.boolSLMain = true;
    } else {
    	if (data.autoTag === 'Y'){
    		this.passTable.disableGeneric = true;
    	} 
    	if (data.add === true){
    		this.boolSLMain = true;
    	} else {
    		this.boolSLMain = false;
    	}
    }
    
 }

  getMtnSlType(){
  	this.ms.getMtnSlType('').subscribe(a=>{
  		this.passTable.tableData = a['list'];
  		this.passTable.tableData.forEach(a=>{
	  			a.createDate = this.ns.toDateTimeString(a.createDate);
	  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
	  			a.uneditable = ['slTypeName'];		
	  	})
	    this.table.refreshTable();
        this.table.overlayLoader = false;
	  	this.passTable.distableGeneric = false;
    });
  }

  checkFields(){
      for(let check of this.passTable.tableData){
         if( check.slTypeName === null || check.slTypeName === ''
          ) {   
            return false;
          }
      }
       return true;
  }

  checkValidation(){
  	if(this.checkFields()){
  		let slTypeNames:string[] = this.passTable.tableData.map(a=>a.slTypeName);
            if(slTypeNames.some((a,i)=>slTypeNames.indexOf(a)!=i)){
              this.cancelFlag = false;
              this.dialogMessage = 'Unable to save the record. SL type name	 must be unique for every SL type.';
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
	       this.tblHighlightReq('#mtn-sl-type',this.passTable.dataTypes,[1]);
	   }
  }

  onClickSaveCancel(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
    if(this.cancelFlag){
  	   if (this.checkValidation()){
           this.save();
       }else {
           this.successDialog.open();
           this.tblHighlightReq('#mtn-sl-type',this.passTable.dataTypes,[1]);
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
    	this.ms.saveMtnSLType(params).subscribe(a=>{
	  		if(a['returnCode'] == -1){
	            this.dialogIcon = "success";
	            this.successDialog.open();
                this.table.overlayLoader = true;
	            this.getMtnSlType();
	            $('.ng-dirty').removeClass('ng-dirty');
	            this.boolSLMain = true;
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
	      this.getRecords(this.info.slTypeCd);
	   } else if (data[0].basedOn === 'all') {
	      this.getRecords();
	   }
  }

  getRecords(slTypeCd?){
     this.ms.getMtnSlType(slTypeCd).pipe(
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
    var filename = 'SubsidiaryLedgerType'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

    alasql('SELECT slTypeCd AS [SL Type Cd], slTypeName AS [SL TYPE Name], remarks AS Remarks ,autoTag AS [Auto Tag],activeTag AS Active INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);
  }

  onClickSLMain(){
    setTimeout(() => {
       this.router.navigate(['/mtn-sl', { slTypeCd: this.info.slTypeCd,slTypeName: this.info.slTypeName, from: 'mtn-sl-type'}], { skipLocationChange: true });
    },100); 
  }

}
