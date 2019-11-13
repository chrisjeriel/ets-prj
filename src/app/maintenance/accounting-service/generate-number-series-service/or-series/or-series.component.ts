import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-or-series',
  templateUrl: './or-series.component.html',
  styleUrls: ['./or-series.component.css']
})
export class OrSeriesComponent implements OnInit {
  
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('orModal') orModal: ModalComponent;
  @ViewChild('orErrorModal') orErrorModal: ModalComponent;

  passData: any = {
      tableData: [],
      tHeader: ['OR Type','OR No', 'Tran ID', 'Used','Created By', 'Date Created', 'Last Update By', 'Last Update'],
      dataTypes: ['text','text', 'number', 'checkbox','text','date', 'text', 'date'],
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 15,
      pageID: 1,
      uneditable: [true,true,true,true,true,true,true,true],
      keys: ['orType','orNo', 'tranId', 'usedTag', 'createUser', 'createDate','updateUser', 'updateDate'],
  }

  params : any = {
    orType: 'VAT',
    orFrom: '',
    orTo:'',
    usedTag: '',
    rowNum: '',
    createUser: this.ns.getCurrentUser(),
    createDate: this.ns.toDateTimeString(0),
    updateUser: this.ns.getCurrentUser(),
    updateDate: this.ns.toDateTimeString(0)
  };

  dialogMessage: string = "";
  dialogIcon: string = "";
  okGenerate: any = '';
  cancelFlag:boolean;
  
  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
  }

  retrieveOrSeries(){
    this.table.loadingFlag = true;
    this.maintenanceService.getAcseOrSeries(this.params.orType,this.params.orFrom,this.params.orTo,this.params.usedTag,this.params.rowNum).subscribe((data:any) => {
      console.log(data);
      this.passData.tableData = [];
      for (var i = 0; i < data.orSeries.length; i++) {
        this.passData.tableData.push(data.orSeries[i]);
      }
      this.table.refreshTable();
      this.table.loadingFlag = false;
    });
  }

  onClickGenerate(){
    if(this.params.orFrom >= this.params.orTo){
      this.dialogMessage = "Or From must not be greater or equal to Or to.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.maintenanceService.getAcseMaxTranSeries('OR',this.params.orFrom,this.params.orTo,null,this.params.orType).subscribe((data:any) => {
        console.log(data)
        this.okGenerate = data.allowGenerate.allowGenerate;
        if(this.okGenerate == 'N'){
          this.orErrorModal.openNoClose();
        }else{
          this.orModal.openNoClose();
        }
      });
    }
  }

  checkField() :boolean{
      return this.params.orType == '' || this.params.orTo == '' || this.params.orFrom == '';
  }

  generateOR(cancel?){
    this.maintenanceService.generateORSeries(this.params).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveOrSeries();
      }
    });
  }
}
