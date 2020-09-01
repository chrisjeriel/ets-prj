import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';


@Component({
  selector: 'app-invoice-series',
  templateUrl: './invoice-series.component.html',
  styleUrls: ['./invoice-series.component.css']
})
export class InvoiceSeriesComponent implements OnInit {

 
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('invoiceModal') invoiceModal: ModalComponent;
  @ViewChild('invoiceErrorModal') invoiceErrorModal: ModalComponent;

  passData: any = {
      tableData: [],
      tHeader: ['Invoice No', 'Invoice ID', 'Used','Created By', 'Date Created', 'Last Update By', 'Last Update'],
      dataTypes: ['text', 'number', 'checkbox','text','date', 'text', 'date'],
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 15,
      pageID: 1,
      uneditable: [true,true,true,true,true,true,true],
      keys: ['invoiceNo', 'invoiceId', 'usedTag', 'createUser', 'createDate','updateUser', 'updateDate'],
  }

  params : any = {
    invoiceFrom: '',
    invoiceTo:'',
    createUser: this.ns.getCurrentUser(),
    createDate: this.ns.toDateTimeString(0),
    updateUser: this.ns.getCurrentUser(),
    updateDate: this.ns.toDateTimeString(0)
  }

  dialogMessage: string = "";
  dialogIcon: string = "";
  okGenerate: any = '';
  cancelFlag:boolean;

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  }


  retrieveInvoice(){
    this.table.loadingFlag = true;
    this.maintenanceService.getMtnAcseInvSeries(this.params.invoiceFrom,this.params.invoiceTo,null,null).subscribe((data:any) => {
      console.log(data);
      this.passData.tableData = [];
      for (var i = 0; i < data.invSeries.length; i++) {
        this.passData.tableData.push(data.invSeries[i]);
      }
      this.table.refreshTable();
      this.table.loadingFlag = false;
    });
  }

  onClickGenerate(){
    if(parseInt(this.params.invoiceFrom) >= (parseInt(this.params.invoiceTo))){
      this.dialogMessage = "Invoice From must not be greater or equal to Invoice to.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
    	this.maintenanceService.getMtnAcseInvSeries(this.params.invoiceFrom,this.params.invoiceTo,null,null).subscribe((data:any) => {
		      if(data.invSeries.length === 0){
		      	this.invoiceModal.openNoClose();
		     }else {
		     	this.invoiceErrorModal.openNoClose();
		     };

   		});
    }
  }

  checkField() :boolean{
    return this.params.invoiceFrom == '' || this.params.invoiceTo == '';
  }

  generateInvoice(cancel?){
    this.maintenanceService.generateAcseInvoiceSeries(this.params).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveInvoice();
      }
    });
  }

}
