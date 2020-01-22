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
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})

export class BankComponent implements OnInit {
  @ViewChild('banktable') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;
  @ViewChild('myForm') form:any;

  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any = {
  	createUser : '',
  	createDate : '',
  	updateUser : '',
  	updateDate : '',
  }
  passTable:any={
  	tableData:[],
  	widths:[1,200,'auto','auto',1],
  	tHeader:['Bank Code','Bank Short Name','Bank Complete Name','Remarks','Active'],
  	dataTypes:['number','text','text','text','checkbox'],
  	uneditable:[true,false,false,false,false],
  	keys:['bankCd','shortName','officialName','remarks','activeTag'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true,
  	infoFlag:true,
  	searchFlag:true,
  	pageLength: 10,
  	nData:{
  	  bankCd:'',
  	  shortName:'',
  	  officialName:'',
      activeTag: 'Y',
      remarks: '',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true
  }
  cancelFlag:boolean;

   allRecords:any = {
    tableData:[],
    keys:['bankCd','shortName','officialName','remarks']
  }

  boolBankMain : boolean = true;

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService,private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Mtn | Bank');
  	this.getBank();
  }

  getBank(){
    this.passTable.disableGeneric = true;
  	this.ms.getMtnBank('','').subscribe(a=>{
      console.log(a);
  		this.passTable.tableData = a['bankList'];
  		this.passTable.tableData.forEach(a=>{
  			a.createDate = this.ns.toDateTimeString(a.createDate);
  			a.updateDate = this.ns.toDateTimeString(a.updateDate);
  		})
  		this.table.refreshTable();
  	})
  }

  delete(){
  	if(this.table.indvSelect.okDelete == 'N'){
  		this.dialogIcon = 'info';
  		this.dialogMessage =  'Deleting this record is not allowed. This was already used in some accounting records.';
  		this.successDialog.open();
  	}else{
  		this.table.indvSelect.deleted = true;
  		this.table.selected  = [this.table.indvSelect]
  		this.table.confirmDelete();
      $('#cust-table-container').addClass('ng-dirty');
  	}
  }

  save(can?){
  	this.cancelFlag = can !== undefined;
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
  	this.ms.saveMtnBank(params).subscribe(a=>{
  		if(a['returnCode'] == -1){
            this.dialogIcon = "success";
            this.successDialog.open();
            this.getBank();
            $('.ng-dirty').removeClass('ng-dirty');
            //this.form.control.markAsPristine();
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	});
  }

  onClickSave(){
   if (this.checkValidation()){
        this.conSave.confirmModal();
   }else {
        this.successDialog.open();
        this.tblHighlightReq('#mtn-bank',this.passTable.dataTypes,[1,2]);
   }
  }

  onClickCancel(){
  	this.cnclBtn.clickCancel();
  }

  onTableClick(data){
    this.info = data;
    this.boolBankMain = data == null;
    this.passTable.disableGeneric = data == null;
    console.log(data);
  }

  print(){
    this.printModal.open();
  }

  printPreview(data){
   this.allRecords.tableData = [];
   if(data[0].basedOn === 'curr'){
      this.getRecords(this.info.bankCd);
   } else if (data[0].basedOn === 'all') {
      this.getRecords(null);
   }
  }

  getRecords(bank?){
     this.ms.getMtnBank(bank).pipe(
           finalize(() => this.finalGetRecords() )
           ).subscribe(a=>{
      this.allRecords.tableData = a['bankList'];
        this.allRecords.tableData.forEach(a=>{
          if (a.remarks === null){
            a.remarks = '';
          }

        });
     });
  }

  finalGetRecords(selection?){
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
    var filename = 'Bank'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

    alasql('SELECT bankCd AS [Bank Code],shortName AS [Bank Short Name], officialName AS [Bank Official Name], remarks AS [Remarks] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);
  }

   onClickBankMain(){
    setTimeout(() => {
       this.router.navigate(['/mtn-bank-acct', { bankCd: this.info.bankCd,shortName: this.info.shortName,officialName: this.info.officialName, from: 'mtn-bank'}], { skipLocationChange: true });
    },100); 
  }

  tblHighlightReq(el, dataTypes, reqInd) {
    setTimeout(() => {
      $(el).find('tbody').children().each(function() {
        $(this).children().each(function(i) {
          if(reqInd.includes(i)) {
            var val;
            if(dataTypes[i] == 'text' || dataTypes[i] == 'date' || dataTypes[i] == 'time') {
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


   checkFields(){
   
      for(let check of this.passTable.tableData){
         if( check.shortName === null || check.shortName === '' ||
             check.officialName === null || check.officialName === ''
          ) {   
            return false;
          }
      }
       return true;
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



}
