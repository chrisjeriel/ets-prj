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

  passTable:any={
  	tableData:[],
  	widths:[1,1,100,1,1,1,1,1,1,1],
  	tHeader:['Code','User ID','Printable Name','Valid From', 'Valid To','Default AR Bank','Default AR Bank Account No.','Default OR Bank Account','Active'],
  	dataTypes:['number','text','text','date','date','text','text','text','text','checkbox'],
  	tooltip:[],
  	uneditable:[true,true,true,false,false,false,false,false,false,true],
  	keys:['dcbUserCd','userId','printableName','validFrom','validTo','arBankName','arBankAcctNo','orBankName','orBankAcctNo','activeTag'],
  	addFlag: true,
  	genericBtn:'Delete',
  	paginateFlag:true, 
  	pageLength: 10,
  	infoFlag:true,
  	searchFlag:true,
  	nData:{
      dcbUserCd: null,
      userId : null,
      printableName : null,
      validFrom : null,
      validTo : null,
      arBankName : null,
      arBankAcctNo : null,
      orBankName : null,
      orBankAcctNo : null,
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
  }

}
