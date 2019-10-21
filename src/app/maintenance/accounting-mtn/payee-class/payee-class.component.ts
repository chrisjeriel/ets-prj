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
  selector: 'app-payee-class',
  templateUrl: './payee-class.component.html',
  styleUrls: ['./payee-class.component.css']
})
export class PayeeClassComponent implements OnInit {
  
  @ViewChild('payeeclass') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;
  cancelFlag: boolean; 

  passTable:any={
  	tableData:[],
  	widths:[1,100,420,80,1,1,1,1],
  	tHeader:['Payee Class Code','Payee Class Name','Remarks','Master Payee Class','SL','Sl Type Code','Auto','Active'],
  	dataTypes:['text','text','text','number','checkbox','number','checkbox','checkbox'],
  	tooltip:[],
  	uneditable:[true,false,false,false,false,false,false,false],
  	keys:['payeeClassCd','payeeClassName','remarks','masterPayeeClass','slTag','slTypeCd','autoTag','activeTag'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	nData:{
      payeeClassCd: null,
      payeeClassName : null,
      remarks : null,
      masterPayeeClass : null,
      slTag : 'N',
      slTypeCd : null,
      autoTag : 'N',
      activeTag : 'Y',
      uneditable : ["slTypeCd"],
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true
  }

  allRecords:any = {
    tableData:[],
   	keys:['payeeClassCd','payeeClassName','remarks','masterPayeeClass','slTag','slTypeCd','autoTag','activeTag'],
   } 

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
  	this.titleService.setTitle('Mtn | Payee Class');
  	this.getPayeeClass();
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

    if (data.autoTag === 'Y'){
    	this.passTable.disableGeneric = true;
    }
  }

  getPayeeClass(){
  	this.ms.getMtnPayeeClass().subscribe(a=>{
  		this.passTable.tableData = a['payeeClassList'];
  		this.passTable.tableData.forEach(a=>{
	  			a.createDate = this.ns.toDateTimeString(a.createDate);
	  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
	  			
	  			if (a.slTag === 'Y'){
                    a.uneditable = ['payeeClassName','slTag','slTypeCd'];
                } else {
                    a.uneditable = ['payeeClassName','slTypeCd'];
                }
	  	})
	    this.table.refreshTable();
        this.table.overlayLoader = false;
	  	this.passTable.distableGeneric = false;
    });
  }

  checkFields(){
      for(let check of this.passTable.tableData){
         if( check.payeeClassName === null || check.payeeClassName === ''
          ) {   
            return false;
          }

          if (check.slTag === 'Y'){
          	if (this.isEmptyObject(check.slTypeCd)){
          		return false;
          		this.tblHighlightReq('#mtn-payee-class',this.passTable.dataTypes,[6]);
          	}
          }

      }
       return true;
  }

   isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

   checkValidation(){
  	if(this.checkFields()){
  		var slTypeCds: any = [];
  		this.passTable.tableData.forEach(a=>{
	  		if (a.slTag === 'Y'){
	  			slTypeCds.push(a.slTypeCd);
	  		}
  		});

		if(slTypeCds.some((a,i)=>slTypeCds.indexOf(a)!=i)){
		        this.cancelFlag = false;
		        this.dialogMessage = 'Unable to save the record. SL Type CDs must be unique for every payee class';
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

  update(data){
  	 for(var i= 0; i< this.passTable.tableData.length; i++){
  	 	 if(this.passTable.tableData[i].edited || this.passTable.tableData[i].add){
  	 	   if (data.key === 'slTag'){
  	 	   	this.passTable.tableData[i].slTypeCd = null;
  	 	   	var index = this.passTable.tableData[i].uneditable.indexOf('slTypeCd');
  	 	   	 if (this.passTable.tableData[i].slTag === 'Y'){
  	 	   	   	 	   	 	delete this.passTable.tableData[i].uneditable[index];
  	 	   	 } else if (this.passTable.tableData[i].slTag === 'N') {
  	 	   	 	delete this.passTable.tableData[i].uneditable[index];
  	 	   	 	this.passTable.tableData[i].slTag === 'N';
  	 	   	 	this.passTable.tableData[i].uneditable.push('slTypeCd');
  	 	   	 }
         	
           }
	  	 }
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
	       this.tblHighlightReq('#mtn-payee-class',this.passTable.dataTypes,[1]);
	   }
  }

  onClickSaveCancel(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
    if(this.cancelFlag){
  	   if (this.checkValidation()){
           this.save();
       }else {
           this.successDialog.open();
           this.tblHighlightReq('#mtn-payee-class',this.passTable.dataTypes,[1]);
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
    	this.ms.saveMtnPayeeClass(params).subscribe(a=>{
	  		if(a['returnCode'] == -1){
	            this.dialogIcon = "success";
	            this.successDialog.open();
                this.table.overlayLoader = true;
	            this.getPayeeClass();
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
	      this.getRecords(this.info.payeeClassCd);
	   } else if (data[0].basedOn === 'all') {
	      this.getRecords();
	   }
  }

  getRecords(payeeClassCd?){
     this.ms.getMtnPayeeClass(payeeClassCd).pipe(
           finalize(() => this.finalGetRecords() )
           ).subscribe(a=>{
      this.allRecords.tableData = a['payeeClassList'];
        this.allRecords.tableData.forEach(a=>{
          if (a.remarks === null){
            a.remarks = '';
          }

          if (a.masterPayeeClass === null){
            a.masterPayeeClass = '';
          }

          if (a.slTypeName === null){
            a.slTypeName = '';
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
    var filename = 'PayeeClass'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

    alasql('SELECT payeeClassCd AS [Payee Class Cd], payeeClassName AS [Payee Class Name], remarks AS Remarks , masterPayeeClass AS [Master Payee Class],slTag AS [SL Tag],slTypeName AS [SL Type Name],autoTag AS [Auto Tag],activeTag AS Active INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);
  }


}
