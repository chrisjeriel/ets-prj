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
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnBankComponent } from '@app/maintenance/mtn-bank/mtn-bank.component';

@Component({
  selector: 'app-payee',
  templateUrl: './payee.component.html',
  styleUrls: ['./payee.component.css']
})
export class PayeeComponent implements OnInit {

  @ViewChild('payee') table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  @ViewChild('myForm') form:any;
  @ViewChild('passLOV') payeeLov: LovComponent;
  @ViewChild('bussTypeLov') bussTypeLov: LovComponent;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;
  @ViewChild('mdl') modal : ModalComponent;
  @ViewChild(MtnBankComponent) bankLov: MtnBankComponent;


  dialogIcon:string = '';
  dialogMessage: string = '';
  info:any ;
  cancelFlag: boolean; 
  payeeClassCd : any = '';
  payeeClassName : any = '';
  private sub: any;
  from: string;

  passLov: any = {
    selector: '',
    activeTag: '',
    hide: []
  }

  passBussTypeLov: any = {
    selector: '',
    activeTag: '',
    hide: []
  }

  allRecords:any = {
    tableData:[],
    keys:['payeeClassName','payeeNo','payeeName','bussTypeName','tin','contactNo','mailAddress','email','remarks','designation',
          'department','mailAddress2','permAddress','contactPerson1','contactPerson2','phoneNo','mobileNo','faxNo',
          'bank1','bankBranch1','bankAcctType1','bankAcctName1','bankAcctNo1',
          'bank2','bankBranch2','bankAcctType2','bankAcctName2','bankAcctNo2'
          ]
  }

  passTable:any={
  	tableData:[],
  	widths:[1,1,1,250,1,120,80,80,200,200],
  	tHeader:['Auto','Active','Payee No','Payee Name','Reference Code','Business Type','Tin','Contact No','Mailing Address','Email Address'],
  	dataTypes:['checkbox','checkbox','number','text','text','text','text','text','text','text'],
  	tooltip:[],
  	uneditable:[true,false,true,false,false,true,false,false,false,false],
  	keys:['autoTag','activeTag','payeeNo','payeeName','refCd','bussTypeName','tin','contactNo','mailAddress','email'],
    magnifyingGlass: [ "bussTypeName"],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
    pageID: 'mtnPayee',
  	nData:{
      showMG : 1,
      autoTag : 'N',
      activeTag : 'Y',
      payeeNo		: null,
      payeeName 	: null,
      refCd 	: null,
      bussTypeName : null,
      bussTypeCd : null,
      tin : null,
      contactNo : null,
      mailAddress : null,
      email : null,
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true,
    disableAdd:true
  }

  payee:any = {};
  boolPrint: boolean = true;
  boolOtherDet : boolean = true;
  payeeLOVRow : number;
  oldRecord : any ={
      tableData:[]
  };
  indexRow:any;
  bankAcctType: any[] = [];
  bank: any;
  lovType: any;


  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.form.control.markAsPristine();
    this.titleService.setTitle('Mtn | Payee');
    this.retrieveBankAcctType();

    this.sub = this.route.params.subscribe(params => {

      this.from = params['from'];
      if (this.from == "mtn-payee-class") {
        this.payeeClassCd = params['payeeClassCd'];
        this.payeeClassName = params['payeeClassName'];
        this.getMtnPayee(this.payeeClassCd);        
      }

    });

  }

   retrieveBankAcctType(){
    this.bankAcctType = [];
    this.ms.getRefCode('MTN_BANK_ACCT.ACCOUNT_TYPE').subscribe(a=>{
      this.bankAcctType =  a['refCodeList'];
      console.log(this.bankAcctType);
    });
  }

  checkCode(ev){
    $('.ng-dirty').removeClass('ng-dirty');
    this.passTable.tableData = [];
    this.info = [];
    this.boolPrint = false;
    this.boolOtherDet = true;
    this.table.refreshTable();
    this.ns.lovLoader(ev, 1);
    this.table.overlayLoader = true;
    if (this.payeeClassCd === null || this.payeeClassCd === ''){
      this.ns.lovLoader(ev, 0);
      this.clear();
    }else{
       this.payeeLov.checkCode('payeeClass','','','','','','',this.payeeClassCd,ev);
    }
 
    /*this.bankLov.checkCode(this.bank.bankCd,ev);*/
  }

  clickLov(){
    this.lovType = 'payeeClass';
    this.passLov.selector = 'payeeClass';
    this.passLov.params = {};
    this.payeeLov.openLOV();
  }

  clickTblLOV(data){
    console.log(data);
    this.lovType = 'bussTypeName';
    this.payeeLOVRow = null;

     if(data.key=='bussTypeName'){
        this.passLov.selector = 'mtnBussType';
        this.passLov.params = {};
        this.payeeLov.openLOV();
        this.payeeLOVRow = data.index;
     }
  }

  clear(){
     this.payeeClassCd = null;
     this.payeeClassName = null;
     this.passTable.disableAdd = true;
     this.passTable.disableGeneric = true;
     this.passTable.tableData = [];
     this.boolPrint = true;
     this.table.refreshTable();
  }

  setSelectedData(data){
    if(this.lovType === 'payeeClass'){
      if(data.data === null){
        this.ns.lovLoader(data.ev, 0);
        this.clear();
      } else {
        let selected = data.data;
          this.payeeClassCd = selected.payeeClassCd;
          this.payeeClassName = selected.payeeClassName;

          if(this.payeeClassCd === '' || this.payeeClassCd === undefined || this.payeeClassCd === null ){
            this.ns.lovLoader(data.ev, 0);
            this.clear();
          }else {
            this.ns.lovLoader(data.ev, 0);
            this.payee = selected;
            this.table.overlayLoader = true;
            this.passTable.disableGeneric = true;
            this.getMtnPayee(this.payeeClassCd);
          }
      }

    }else if (this.lovType === 'bussTypeName'){
        if(data === null){
             this.passTable.tableData[this.payeeLOVRow].bussTypeName = null;
             this.passTable.tableData[this.payeeLOVRow].bussTypeCd = null;
        }else {
             this.passTable.tableData[this.payeeLOVRow].bussTypeName = data.data.bussTypeName;
             this.passTable.tableData[this.payeeLOVRow].bussTypeCd = data.data.bussTypeCd;
             this.passTable.tableData[this.payeeLOVRow].edited = true;
        }
    }   
  }

  delete(){
    if(this.table.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'Deleting this record is not allowed. This was already used in some accounting records.';
      this.successDialog.open();
    }else{
      this.boolOtherDet = true;
      this.table.selected  = [this.table.indvSelect]
      this.table.confirmDelete();
       $('#cust-table-container').addClass('ng-dirty');
    }
  }

  getMtnPayee(payeeClassCd){
    this.passTable.disableGeneric = true;
    if(payeeClassCd ===''){
      this.passTable.distableGeneric = true;
      this.passTable.disableAdd = true;
    }else{
      this.ms.getMtnPayee('',payeeClassCd).subscribe(a=>{
        this.passTable.tableData = a['payeeList'];
        this.passTable.tableData.forEach(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
          a.showMG = 1;
         /* if (a.okDelete === 'N'){
            a.uneditable = ['accountNo','accountName','currCd'];
          }*/

        })
        this.table.refreshTable();
        this.table.overlayLoader = false;
        this.passTable.distableGeneric = false;
        this.passTable.disableAdd = false;
        this.boolPrint = false;
        this.boolOtherDet = true;
      })
    }
  }

  onClickCancel(){
    this.cnclBtn.clickCancel();
  }

  onTableClick(data){
    for (var i = this.passTable.tableData.length - 1; i >= 0; i--) {
            if(data == this.passTable.tableData[i]){
                this.indexRow = i;
                break;
            }
    }
    this.info = data;
    this.passTable.disableGeneric = data == null;
    this.boolOtherDet = data == null;

    if (data === null) {
    } else {
      if (data.autoTag === 'Y'){
        this.passTable.disableGeneric = true;
      } 
    } 
 }

 onOtherDetails(){
   this.modal.openNoClose();
   this.oldRecord = JSON.parse(JSON.stringify(this.table.indvSelect));
 }

  onClickSave(cancelFlag?){
     if (this.checkValidation()){
        this.conSave.confirmModal();
     }else {
         this.successDialog.open();
         this.tblHighlightReq('#mtn-payee',this.passTable.dataTypes,[3,5]);
     }
  }

  checkFields(){
      for(let check of this.passTable.tableData){
         if( 
             check.payeeName === null || check.payeeName === '' ||
             check.bussTypeCd === null ||  check.bussTypeCd === ''
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

  tblHighlightReq(el, dataTypes, reqInd) {
    setTimeout(() => {
      $(el).find('tbody').children().each(function() {
        $(this).children().each(function(i) {
          if(reqInd.includes(i)) {
            var val;
            if(dataTypes[i] == 'text') {
              if($(this).find('.align-middle.uneditable').length === 1){
                 val = $(this).find('span').text();
                 highlight($(this), val);
              } else{
                 val = $(this).find('input').val();
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

onClickSaveCancel(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    if(this.cancelFlag){
       if (this.checkValidation()){
           this.save();

       }else {
           this.successDialog.open();
           this.tblHighlightReq('#mtn-payee',this.passTable.dataTypes,[3,5]);
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
      a.slTypeCd   = this.payeeClassCd;
      a.payeeClassCd = this.payeeClassCd;
    });
    params.delList = this.passTable.tableData.filter(a=>a.deleted);
   
    if(params.saveList.length === 0 && params.delList.length === 0 ){    
          this.conSave.showBool = false;
          this.dialogIcon = "success";
          this.successDialog.open();
           $('.ng-dirty').removeClass('ng-dirty');
    }else {
      console.log(JSON.stringify(params));
      this.ms.saveMtnPayee(params).subscribe(a=>{
        if(a['returnCode'] == -1){
              this.dialogIcon = "success";
              this.successDialog.open();
              this.table.overlayLoader = true;
              this.passTable.disableGeneric = true;
              this.getMtnPayee(this.payeeClassCd);              
              $('.ng-dirty').removeClass('ng-dirty');

          }else{
              this.dialogIcon = "error";
              this.successDialog.open();
          }
      });
    }
  }

  cancelOtherDetails(){
    console.log(this.oldRecord);
     this.passTable.tableData[this.indexRow].designation = this.oldRecord.designation;
     this.passTable.tableData[this.indexRow].department = this.oldRecord.department;
     this.passTable.tableData[this.indexRow].mailAddress2 = this.oldRecord.mailAddress2;
     this.passTable.tableData[this.indexRow].permAddress = this.oldRecord.permAddress;
     this.passTable.tableData[this.indexRow].contactPerson1 = this.oldRecord.contactPerson1;
     this.passTable.tableData[this.indexRow].contactPerson2 = this.oldRecord.contactPerson2;
     this.passTable.tableData[this.indexRow].phoneNo = this.oldRecord.phoneNo;
     this.passTable.tableData[this.indexRow].mobileNo = this.oldRecord.mobileNo;
     this.passTable.tableData[this.indexRow].faxNo = this.oldRecord.faxNo;
     this.passTable.tableData[this.indexRow].bankCd1 = this.oldRecord.bankCd1;
     this.passTable.tableData[this.indexRow].bankBranch1 = this.oldRecord.bankBranch1;
     this.passTable.tableData[this.indexRow].bankAcctType1 = this.oldRecord.bankAcctType1;
     this.passTable.tableData[this.indexRow].bankAcctName1 = this.oldRecord.bankAcctName1;
     this.passTable.tableData[this.indexRow].bankAcctNo1 = this.oldRecord.bankAcctNo1;
     this.passTable.tableData[this.indexRow].bankCd2 = this.oldRecord.bankCd2;
     this.passTable.tableData[this.indexRow].bankBranch2 = this.oldRecord.bankBranch2;
     this.passTable.tableData[this.indexRow].bankAcctType2 = this.oldRecord.bankAcctType2;
     this.passTable.tableData[this.indexRow].bankAcctName2 = this.oldRecord.bankAcctName2;
     this.passTable.tableData[this.indexRow].bankAcctNo2 = this.oldRecord.bankAcctNo2;
  }

  saveOtherDetails(){
     this.passTable.tableData[this.indexRow].edited = true;
     $('#cust-table-container').addClass('ng-dirty');
  }

  setSelectedBank(data){
    console.log(data);
   if(this.bank === 'bank1'){
     if (data === null){
       this.info.bank1 = null;
       this.passTable.tableData[this.indexRow].bankCd1 = null;
     } else {
       this.info.bank1 = data.shortName;
       this.passTable.tableData[this.indexRow].bankCd1 = data.bankCd;
     }
   } else if (this.bank === 'bank2') {
      if (data === null){
       this.info.bank2 = null;
       this.passTable.tableData[this.indexRow].bankCd2 = null;
     } else {
       this.info.bank2 = data.shortName;
       this.passTable.tableData[this.indexRow].bankCd2 = data.bankCd;
     }
   }

  }

  checkBankCode(ev){
    if (this.bank === 'bank1'){
      this.bankLov.checkCode(this.info.bank1,ev);
    } else if (this.bank === 'bank2'){
      this.bankLov.checkCode(this.info.bank2,ev);
    }
    
  }

  print(){
    this.printModal.open();
  }

  printPreview(data){
   this.allRecords.tableData = [];
   if(data[0].basedOn === 'curr'){
      this.getRecords(this.payeeClassCd);
   } else if (data[0].basedOn === 'all') {
      this.getRecords(null);
   }
  }


  getRecords(payeeClassCd?){
      this.ms.getMtnPayee('',payeeClassCd).pipe(
           finalize(() => this.finalGetRecords())).subscribe(a=>{
        this.allRecords.tableData = a['payeeList'];
        this.allRecords.tableData.forEach(a=>{
          a.createDate = this.ns.toDateTimeString(a.createDate);
          a.updateDate = this.ns.toDateTimeString(a.updateDate);
      
        })
      });
  }

   finalGetRecords(selection?){
     console.log(this.allRecords.tableData);
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
    var filename = 'Payee'+currDate+'.xls'
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

    alasql('SELECT payeeClassName AS [Payee Class Name],payeeNo AS [Payee No], payeeName AS [Payee Name], bussTypeName AS [Bussiness Type Name], nvl(tin) AS [Tin No],nvl(contactNo) AS [Contact No], nvl(mailAddress) AS [Mail Address], nvl(email) AS [Email], nvl(remarks) AS [Remarks], nvl(designation) AS [Designation], nvl(department) AS [Department], nvl(mailAddress2) AS [Alternative Address], nvl(permAddress) AS [Permanent Address], nvl(contactPerson1) AS [Contact Person 1], nvl(contactPerson2) AS [Contact Person 2], nvl(phoneNo) AS [Phone No], nvl(mobileNo) AS [Mobile No], nvl(faxNo) AS [Fax No],nvl(bank1) AS [Bank 1], nvl(bankBranch1) AS [Bank Branch 1], nvl(bankAcctType1) AS [Bank Account Type 1], nvl(bankAcctName1) AS [Bank Account Name 1], nvl(bankAcctNo1) AS [Bank Account No. 1],nvl(bank2) AS [Bank 2], nvl(bankBranch2) AS [Bank Branch 2], nvl(bankAcctType2) AS [Bank Account Type 2], nvl(bankAcctName2) AS [Bank Account Name 2], nvl(bankAcctNo2) AS [Bank Account No. 2] INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,record]);
  }


}
