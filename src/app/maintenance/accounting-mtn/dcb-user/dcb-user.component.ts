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
  selector: 'app-dcb-user',
  templateUrl: './dcb-user.component.html',
  styleUrls: ['./dcb-user.component.css']
})
export class DcbUserComponent implements OnInit {
  
  @ViewChild('dcbuser') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;
  bankLOVRow : number;
  acctType: any;
  bankORCd:any;
  bankARCd:any;
  cancelFlag: boolean; 

   allRecords:any = {
    tableData:[],
    keys:['dcbUserCd','userId','printableName','validFrom','validTo','arBankName','arBankAcctNo','orBankName','orBankAcctNo','activeTag'],
   }

  passTable:any={
  	tableData:[],
  	widths:[1,80,200,1,1,1,1,1,1,1],
  	tHeader:['Code','User ID','Printable Name','Valid From', 'Valid To','Default AR Bank','Default AR Bank Account No.','Default OR Bank','Default OR Bank Account','Active'],
  	dataTypes:['number','text','text','date','date','text','text','text','text','checkbox'],
  	tooltip:[],
  	uneditable:[true,true,true,false,false,true,true,true,true,false],
  	keys:['dcbUserCd','userId','printableName','validFrom','validTo','arBankName','arBankAcctNo','orBankName','orBankAcctNo','activeTag'],
  	magnifyingGlass: [ "userId", "arBankName", "arBankAcctNo","orBankName","orBankAcctNo"],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	pageID : 'dcbUser',
  	nData:{
  	  showMG : 1,
      dcbUserCd: null,
      userId : null,
      printableName : null,
      validFrom : null,
      validTo : null,
      defaultArBank : null,
      defaultArBankAcct : null,
      defaultOrBank : null,
      defaultOrBankAcct : null,
      activeTag : 'Y',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true
  } 

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
  	 this.titleService.setTitle('Mtn | DCB User');
  	 this.getMtnDCBUser();
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

   getMtnDCBUser(){
  	this.ms.getMtnDCBUser().subscribe(a=>{
  		this.passTable.tableData = a['dcbUserList'];
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

  clickLOV(data){
  	this.bankLOVRow = null;
  	this.acctType = null;
  	this.bankARCd = null;
  	this.bankORCd = null;

  	 if(data.key=='arBankName'){
        $('#bankLOV #modalBtn').trigger('click');
        data.tableData = this.passTable.tableData;
        this.bankLOVRow = data.index;
        this.acctType = 'AR';
     } else if (data.key=='orBankName'){
     	$('#bankLOV #modalBtn').trigger('click');
     	data.tableData = this.passTable.tableData;
        this.bankLOVRow = data.index;
        this.acctType = 'OR';
     } else if (data.key == 'arBankAcctNo'){
     	if (data.data.defaultArBank === null){
     		this.dialogIcon = 'info';
	  		this.dialogMessage =  'Please choose a Bank before picking a bank account.';
	  		this.successDialog.open();
     	} else {
     		$('#bankAcctARLOV #modalBtn').trigger('click');
	        data.tableData = this.passTable.tableData;
	        this.bankLOVRow = data.index;
	        this.acctType = 'AR';
	        this.bankARCd = data.data.defaultArBank;
     	}
     } else if (data.key == 'orBankAcctNo'){
     	if (data.data.defaultOrBank === null){
     		this.dialogIcon = 'info';
	  		this.dialogMessage =  'Please choose a Bank before picking a bank account.';
	  		this.successDialog.open();
     	} else {
     		$('#bankAcctORLOV #modalBtn').trigger('click');
	        data.tableData = this.passTable.tableData;
	        this.bankLOVRow = data.index;
	        this.acctType = 'OR';
	        this.bankORCd = data.data.defaultOrBank;
     	}
    } else if (data.key == 'userId'){
       		$('#mtnUsers #modalBtn').trigger('click');
	        data.tableData = this.passTable.tableData;
	        this.bankLOVRow = data.index;
    }
  }

  selectedMtnUsers(data){
  	if(data === null){
  	 this.passTable.tableData[this.bankLOVRow].userId = null;
  	 this.passTable.tableData[this.bankLOVRow].printableName = null;
  	} else {
  	 this.passTable.tableData[this.bankLOVRow].userId = data.userId;
  	 this.passTable.tableData[this.bankLOVRow].printableName = data.userName;
  	}
  	 
  }

  selectedBankLOV(data){
  	 if (this.acctType === 'AR'){
  	 	if(data === null){
  	 	  this.passTable.tableData[this.bankLOVRow].arBankName = null;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultArBank = null;
  	 	  this.passTable.tableData[this.bankLOVRow].arBankAcctNo = null;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultArBankAcct = null;
  	 	}else {
  	 	  this.passTable.tableData[this.bankLOVRow].arBankName = data.shortName;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultArBank = data.bankCd;
  	 	  this.passTable.tableData[this.bankLOVRow].arBankAcctNo = null;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultArBankAcct = null;
  	 	}
  	 } else if (this.acctType === 'OR'){
  	 	 if(data === null){
  	 	  this.passTable.tableData[this.bankLOVRow].orBankName = null;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultOrBank = null;
  	 	  this.passTable.tableData[this.bankLOVRow].orBankAcctNo = null;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultOrBankAcct = null;
  	 	}else {
  	 	  this.passTable.tableData[this.bankLOVRow].orBankName = data.shortName;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultOrBank = data.bankCd;
  	 	  this.passTable.tableData[this.bankLOVRow].orBankAcctNo = null;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultOrBankAcct = null;
  	 	}
  	 }
  	 this.passTable.tableData[this.bankLOVRow].edited = true;
     $('#cust-table-container').addClass('ng-dirty');
  }


  selectedBankAcctORLOV(data){
  	console.log(data);
  	 if(data === null){
  	 	  this.passTable.tableData[this.bankLOVRow].orBankAcctNo = null;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultOrBankAcct = null;
  	 	}else {
  	 	  this.passTable.tableData[this.bankLOVRow].orBankAcctNo = data.accountNo;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultOrBankAcct = data.bankAcctCd;
  	 	}
  	 this.passTable.tableData[this.bankLOVRow].edited = true;
     $('#cust-table-container').addClass('ng-dirty');
  }
  
  selectedBankAcctARLOV(data){
  	if(data === null){
  	 	  this.passTable.tableData[this.bankLOVRow].arBankAcctNo = null;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultArBankAcct = null;
  	 	}else {
  	 	  this.passTable.tableData[this.bankLOVRow].arBankAcctNo = data.accountNo;
  	 	  this.passTable.tableData[this.bankLOVRow].defaultArBankAcct = data.bankAcctCd;
  	}
  	 this.passTable.tableData[this.bankLOVRow].edited = true;
     $('#cust-table-container').addClass('ng-dirty');
  }

  checkFields(){
      for(let check of this.passTable.tableData){
         if( check.userId === null || check.userId === '' ||
             check.printableName === null || check.printableName === '' ||
             check.validFrom === null || check.validFrom === '' 
          ) {   
            return false;
          }   
      }
       return true;
   }

  tblHighlightReq(el, dataTypes, reqInd) {
    setTimeout(() => {
      $(el).find('tbody').children().each(function() {
        $(this).children().each(function(i) {
          if(reqInd.includes(i)) {
            var val;
            if(dataTypes[i] == 'date' || dataTypes[i] == 'time' || dataTypes[i] === 'number') {
              val = $(this).find('input').val();
              highlight($(this), val);
            } else if ( dataTypes[i] == 'text'){
              if($(this).find('.align-middle.uneditable.ng-star-inserted').length === 1){
	              val = $(this).find('span').text();
	              highlight($(this), val);
             }
            }
          }
        });
      });

      function highlight(td, val) {
        td.css('background', typeof val == 'undefined' ? 'transparent' : val == '' || val == null ? '#fffacd85' : 'transparent');
      }
    }, 0);
  }

  checkValidation(){
      if(this.checkFields()){
          return true;
     }else{
          this.dialogMessage="Please check field values.";
          this.dialogIcon = "error";
          return false;
     }
  }

  onClickSave(cancelFlag?){
   if (this.checkValidation()){
        this.conSave.confirmModal();
   }else {
       this.successDialog.open();
       this.tblHighlightReq('#mtn-dcbuser',this.passTable.dataTypes,[1,2,3]);
   }
  }

  onClickSaveCancel(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
    if(this.cancelFlag){
  	   if (this.checkValidation()){
           this.save();
       }else {
           this.successDialog.open();
           this.tblHighlightReq('#mtn-dcbuser',this.passTable.dataTypes,[1,2,3]);
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
  		a.remarks = null;
  		if (a.validTo === null || a.validTo === ''){
  		} else {
  			a.validTo = this.ns.toDateTimeString(a.validTo);
  		}
  		if (a.validFrom === null || a.validFrom === ''){
  		} else {
  			a.validFrom = this.ns.toDateTimeString(a.validFrom);
  		}
  	});
  	params.delList = this.passTable.tableData.filter(a=>a.deleted);
   
    if(params.saveList.length === 0 && params.delList.length === 0 ){    
          this.conSave.showBool = false;
          this.dialogIcon = "success";
          this.successDialog.open();
          $('.ng-dirty').removeClass('ng-dirty');
    }else {
    	console.log(params);
    	this.ms.saveMtnDcbUser(params).subscribe(a=>{
	  		if(a['returnCode'] == -1){
	  			this.form.control.markAsPristine();
	            this.dialogIcon = "success";
	            this.successDialog.open();
	            this.table.overlayLoader = true;
	            this.getMtnDCBUser();
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

  printPreview(data) {
    //added by Totz during merge to remove error; See line dcb-user.component.html(43,43)
     console.log(data);
     this.allRecords.tableData = [];
     if(data[0].basedOn === 'curr'){
      this.getRecords(this.info.userId);
	 } else if (data[0].basedOn === 'all') {
	  this.getRecords();
	 }
  }

  getRecords(userId?){
     this.ms.getMtnDCBUser(userId).pipe(finalize(() => this.finalGetRecords())).subscribe(a=>{
	        this.allRecords.tableData = a['dcbUserList'];
	        this.allRecords.tableData.forEach(a=>{
		          if (a.validTo === null){
		            a.validTo = '';
		          }else {
		            a.validTo = this.ns.toDateTimeString(a.validTo);
		          };

		          if (a.validFrom === null){
		            a.validFrom = '';
		          }else {
		            a.validFrom = this.ns.toDateTimeString(a.validFrom);
		          };

        });
     });
  }



  finalGetRecords(){
  	this.export(this.allRecords.tableData);
  }

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
    var filename = 'DCBUsers'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

     alasql.fn.datetime = function(dateStr) {
        for(var prop in dateStr) {
           if (dateStr.hasOwnProperty(prop)) {
              var newdate = new Date(dateStr);
              return newdate.toLocaleString();
           } else {
              var date = "";
              return date;
           }
        } 
      };

      alasql.fn.nvl = function(text) {
        if (text === null){
        	return '';
        } else {
        	return text;
        }
      };


    alasql('SELECT dcbUserCd AS [Dcb Code],userId AS [User Id],printableName AS [Printable Name],datetime(validFrom) AS [Valid From], datetime(validTo) AS [Valid To], nvl(arBankName) AS [AR Bank Name], nvl(arBankAcctNo) AS [AR Bank Account], nvl(orBankName) AS [OR Bank Name], nvl(orBankAcctNo) AS [OR Bank Account],activeTag AS [Active Tag]   INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);	  
  }
 

}