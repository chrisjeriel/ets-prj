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
  @ViewChild(LovComponent) payeeLov: LovComponent;
  @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

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

  passTable:any={
  	tableData:[],
  	widths:[1,1,1,250,1,1,80,80,200,200],
  	tHeader:['Auto','Active','Payee No','Payee Name','Reference Code','Business Type','Tin','Contact No','Mailing Address','Email Address'],
  	dataTypes:['checkbox','checkbox','number','text','text','text','text','text','text','text'],
  	tooltip:[],
  	uneditable:[true,false,true,false,true,false,false,false,false,false],
  	keys:['autoTag','activeTag','payeeNo','payeeName','refCd','bussTypeName','tin','contactNo','mailAddress','email'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	nData:{
      autoTag : 'N',
      activeTag : 'Y',
      payeeNo		: null,
      payeeName 	: null,
      refCd 	: null,
      bussTypeName : null,
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
    disableAdd:true,
  }

  payee:any = {};
  boolPrint: boolean = true;


  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.form.control.markAsPristine();
    this.titleService.setTitle('Mtn | Payee');
  }

  checkCode(ev){
    $('.ng-dirty').removeClass('ng-dirty');
    this.passTable.tableData = [];
    this.boolPrint = false;
    this.table.refreshTable();
    this.ns.lovLoader(ev, 1);
    this.table.overlayLoader = true;
    this.payeeLov.checkCode('payeeClass','','','','','','',this.payeeClassCd,ev);
    /*this.bankLov.checkCode(this.bank.bankCd,ev);*/
  }

  clickLov(){
    this.passLov.selector = 'payeeClass';
    this.passLov.params = {};
    this.payeeLov.openLOV();
  }

  setSelectedPayeeType(data){
  
   if(data.data === null){
    this.ns.lovLoader(data.ev, 0);
    this.payeeClassCd = null;
    this.payeeClassName = null;
    this.passTable.disableAdd = true;
    this.passTable.disableGeneric = true;
    this.passTable.tableData = [];
    this.table.refreshTable();
  } else {
    let selected = data.data;
      this.payeeClassCd = selected.payeeClassCd;
      this.payeeClassName = selected.payeeClassName;

      if(this.payeeClassCd === '' || this.payeeClassCd === undefined || this.payeeClassCd === null ){
        this.ns.lovLoader(data.ev, 0);
        this.payeeClassCd = null;
        this.payeeClassName = null;
        this.passTable.disableAdd = true;
        this.passTable.disableGeneric = true;
        this.passTable.tableData = [];
        this.table.refreshTable();
      }else {
        this.ns.lovLoader(data.ev, 0);
        this.payee = selected;
        this.table.overlayLoader = true;
        this.passTable.disableGeneric = true;
        this.getMtnPayee(this.payeeClassCd);
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
         /* if (a.okDelete === 'N'){
            a.uneditable = ['accountNo','accountName','currCd'];
          }*/

        })
        this.table.refreshTable();
        this.table.overlayLoader = false;
        this.passTable.distableGeneric = false;
        this.passTable.disableAdd = false;
        this.boolPrint = false;
      })
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




}
