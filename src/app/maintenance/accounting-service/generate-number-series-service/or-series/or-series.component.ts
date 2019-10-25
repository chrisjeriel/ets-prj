import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

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
    createUser: this.ns.getCurrentUser(),
    createDate: this.ns.toDateTimeString(0),
    updateUser: this.ns.getCurrentUser(),
    updateDate: this.ns.toDateTimeString(0)
  };

  dialogMessage: string = "";
  dialogIcon: string = "";
  maxORSeries: number = 0;
  cancelFlag:boolean;
  
  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.retrieveMaxTran();
  }

  retrieveOrSeries(){
    this.table.loadingFlag = true;
    this.maintenanceService.getAcseOrSeries(this.params.orType,this.params.orFrom,this.params.orTo).subscribe((data:any) => {
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
    if(this.checkField()){
      this.dialogMessage = "Please Check Field Values!";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else if(this.params.orFrom <= this.maxORSeries){
      this.dialogMessage = "Existing number series was already created for the specified transaction numbers " + this.params.orFrom + " to " + this.params.orTo + ".Please adjust your From-To range values.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else {
      this.confirm.confirmModal();
    }
  }

  checkField() :boolean{
    if(this.params.orType.length !== 0 &&
       this.params.orTo.length !== 0 &&
       this.params.orFrom.length !== 0
      ){
      return false;
    }else{
      return true;
    }
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
      }
    });
  }

  retrieveMaxTran(){
    this.maintenanceService.getAcseMaxTranSeries('OR',this.params.orType).subscribe((data:any) => {
      console.log(data)
      this.maxORSeries = data.maxTranNo.tranNo;
    });
  }
}
