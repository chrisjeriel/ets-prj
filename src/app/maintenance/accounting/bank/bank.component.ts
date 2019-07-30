import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})

export class BankComponent implements OnInit {
@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(ConfirmSaveComponent) conSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cnclBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
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
      activeTag: "Y",
      remarks: '',
      createUser: this.ns.getCurrentUser(),
      createDate: this.ns.toDateTimeString(0),
      updateUser: this.ns.getCurrentUser(),
      updateDate: this.ns.toDateTimeString(0),
  	},
    disableGeneric: true
  }
  cancelFlag:boolean;

  constructor(private titleService: Title,private ns:NotesService,private ms:MaintenanceService) { }

  ngOnInit() {
    this.titleService.setTitle('Mtn | Bank');
  	this.getBank();
  }

  getBank(){
    this.passTable.disableGeneric = true;
  	this.ms.getMtnBank('','').subscribe(a=>{
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
        }else{
            this.dialogIcon = "error";
            this.successDialog.open();
        }
  	});
  }

  onClickSave(){
  	this.conSave.confirmModal();
  }

  onClickCancel(){
  	this.cnclBtn.clickCancel();
  }

  onTableClick(data){
    this.info = data;
    this.passTable.disableGeneric = data == null;
  }


}
