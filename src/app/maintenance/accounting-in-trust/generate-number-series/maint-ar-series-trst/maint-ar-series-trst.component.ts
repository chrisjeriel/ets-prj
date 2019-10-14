import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-maint-ar-series-trst',
  templateUrl: './maint-ar-series-trst.component.html',
  styleUrls: ['./maint-ar-series-trst.component.css']
})
export class MaintArSeriesTrstComponent implements OnInit {
  
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
      tableData: [],
      tHeader: ['AR No', 'Tran ID', 'Used','Created By', 'Date Created', 'Last Update By', 'Last Update'],
      dataTypes: ['text', 'number', 'checkbox','text','date', 'text', 'date'],
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 15,
      pageID: 1,
      uneditable: [true,true,true,true,true,true,true],
      keys: ['arNo', 'tranId', 'usedTag', 'createUser', 'createDate','updateUser', 'updateDate'],
  }

  params : any = {
    arFrom: '',
    arTo:'',
    createUser: this.ns.getCurrentUser(),
    createDate: this.ns.toDateTimeString(0),
    updateUser: this.ns.getCurrentUser(),
    updateDate: this.ns.toDateTimeString(0)
  }

  dialogMessage: string = "";
  dialogIcon: string = "";
  maxARSeries: number = 0;
  cancelFlag:boolean;

  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.retrieveMaxSeries();
  }

  retrieveARSeries(){
    this.table.loadingFlag = true;
    this.maintenanceService.getArSeries(this.params.arFrom,this.params.arTo).subscribe((data:any) => {
      this.passData.tableData = [];
      for (var i = 0; i < data.arSeries.length; i++) {
        this.passData.tableData.push(data.arSeries[i]);
      }
      this.table.refreshTable();
      this.table.loadingFlag = false;
    });
  }

  onClickGenerate(){
    if(this.params.arFrom <= this.maxARSeries){
      this.dialogMessage = "Existing number series was already created for the specified transaction numbers " + this.params.arFrom + " to " + this.params.arTo + ".Please adjust your From-To range values.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  generateAR(cancel?){
    this.maintenanceService.generateARSeries(this.params).subscribe((data:any) => {
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

  retrieveMaxSeries(){
    this.maintenanceService.getMaxTranSeries('AR').subscribe((data:any) =>{
      this.maxARSeries = data.maxTranNo.tranNo;
    });
  }

}
