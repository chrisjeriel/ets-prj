import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router, NavigationExtras } from '@angular/router';
import { PrintModalMtnAcctComponent } from '@app/_components/common/print-modal-mtn-acct/print-modal-mtn-acct.component';

@Component({
  selector: 'app-acit-dcb-no',
  templateUrl: './acit-dcb-no.component.html',
  styleUrls: ['./acit-dcb-no.component.css']
})
export class AcitDcbNoComponent implements OnInit {
   
   @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
   @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
   @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
   @ViewChild(PrintModalMtnAcctComponent) printModal: PrintModalMtnAcctComponent;

   passData: any = {
      tableData: [],
      tHeader: ['DCB Date','DCB Year', 'DCB No.', 'DCB Status','Remarks', 'Auto'],
      dataTypes: ['date','year', 'number', 'select','text', 'checkbox'],
      nData: {
      	new: true,
      	dcbDate: '', 
      	dcbYear: '', 
      	dcbNo: '', 
      	dcbStatus: 'O', 
      	remarks: '', 
      	autoTag: 'N',
        createUser : this.ns.getCurrentUser(),
        createDate : '',
        updateUser : this.ns.getCurrentUser(),
        updateDate : '',
      },
      searchFlag: true,
      infoFlag: true,
      checkFlag: true,
      addFlag: true,
      deleteFlag: false,
      genericBtn:'Delete',
      paginateFlag: true,
      pageLength: 10,
      pageID: 1,
      uneditable: [false,true,true,true,false,true],
      widths: [115,80,90,160,600,80],
      opts: [
        {
          selector: 'dcbStatus',
          prev: ['Open','Temporarily Closed','Closed'],
          vals: ['O','T','C'],
        }
      ],
      keys: ['dcbDate', 'dcbYear', 'dcbNo', 'dcbStatus', 'remarks', 'autoTag'],
  };

  params = {
  	status:'',
    saveDCBNo:[],
    delDCBNo: [],
    createUser:'',
    createDate:'',
    updateUser:'',
    updateDate:''
  };

  dialogIcon : any;
  dialogMessage : any;
  cancelFlag: boolean = false;

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService,private router: Router) { }

  ngOnInit() {
    this.retrieveMtnDCB();
  }

  retrieveMtnDCB(){
    setTimeout(() => {this.table.loadingFlag = true;});
  	if(this.params.status !== 'O'){
  		this.passData.disableAdd = true;
      this.passData.disableGeneric = true;
  	}else{
  		this.passData.disableAdd = false;
      this.passData.disableGeneric = false;
  	}
  	this.maintenanceService.getMtnAcitDCBNo(null,null,null,this.params.status).subscribe((data:any) => {
  		this.passData.tableData = [];
  		for (var i = 0; i < data.dcbNoList.length; i++) {
  			this.passData.tableData.push(data.dcbNoList[i]);
  			this.passData.tableData[this.passData.tableData.length - 1].new = false;
        this.passData.tableData[this.passData.tableData.length - 1].uneditable = ['dcbDate', 'dcbYear', 'dcbNo', 'dcbStatus', 'autoTag'];
  		}
  		this.table.refreshTable();
      this.table.loadingFlag = false;
  	});
  }

  dcbUser(){
    this.router.navigate(['/mtn-dcb-user', {exitLink:'/mtn-acit-dcb-no'}], { skipLocationChange: true }); 
  }

  onRowClick(data){
    console.log(data)
    if(data!==null){
      this.params.createUser = data.createUser;
      this.params.createDate = this.ns.toDateTimeString(data.createDate);
      this.params.updateUser = data.updateUser;
      this.params.updateDate = this.ns.toDateTimeString(data.updateDate);
    }else{
      this.params.createUser = '';
      this.params.createDate = '';
      this.params.updateUser = '';
      this.params.updateDate = '';
    }
  }

  onClickSave(){
    this.confirm.confirmModal();
  }

  update(){
  	for (var i = 0; i < this.passData.tableData.length; i++) {
  		if(this.passData.tableData[i].new && this.passData.tableData[i].dcbDate !== ''){
  			this.passData.tableData[i].dcbYear = (this.ns.toDateTimeString(this.passData.tableData[i].dcbDate).split('T')[0]).split('-')[0];
  		}
  	}
  }

  prepareData(){
    this.params.saveDCBNo = [];
    this.params.delDCBNo = [];
    for (var i = 0; i < this.passData.tableData.length; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
        this.params.saveDCBNo.push(this.passData.tableData[i]);
        this.params.saveDCBNo[this.params.saveDCBNo.length - 1].dcbDate = this.ns.toDateTimeString(this.passData.tableData[i].dcbDate);
        this.params.saveDCBNo[this.params.saveDCBNo.length - 1].createDate = this.ns.toDateTimeString(0);
        this.params.saveDCBNo[this.params.saveDCBNo.length - 1].updateDate = this.ns.toDateTimeString(0);
      }

      if(this.passData.tableData[i].deleted){
        this.params.delDCBNo.push(this.passData.tableData[i]);
      }
    }
  }

  saveDCBNo(cancel?){
    this.cancelFlag = cancel !== undefined;
    this.prepareData();
    this.maintenanceService.saveMtnAcitDCBNo(this.params.delDCBNo,this.params.saveDCBNo).subscribe((data:any) =>  {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveMtnDCB();
      }
    });
  }

  deleteCurr(){
    if(this.table.indvSelect.okDelete == 'N'){
      this.dialogIcon = 'info';
      this.dialogMessage =  'The selected DCB No. cannot be deleted. This was already used in Acknowledgement Reciept/s.';
      this.successDiag.open();
    }else{
      this.table.indvSelect.deleted = true;
      this.table.selected  = [this.table.indvSelect]
      this.table.confirmDelete();
    }
  }

  onClickCancel(){
    this.cancelBtn.clickCancel();
  }

  print(){
    this.printModal.open();
  }
}
