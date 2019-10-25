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
  @ViewChild(LovComponent) slLov: LovComponent;
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
  	uneditable:[true,false,true,false,false,false,false,false,false,false],
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


  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService,private route: ActivatedRoute) { }

  ngOnInit() {
  }

}
