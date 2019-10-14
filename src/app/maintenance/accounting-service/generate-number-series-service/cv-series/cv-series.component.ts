import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-cv-series',
  templateUrl: './cv-series.component.html',
  styleUrls: ['./cv-series.component.css']
})
export class CvSeriesComponent implements OnInit {
  
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

  passData: any = {
      tableData: [],
      tHeader: ['CV Year','CV No', 'Tran ID', 'Used','Created By', 'Date Created', 'Last Update By', 'Last Update'],
      dataTypes: ['year','text', 'number', 'checkbox','text','date', 'text', 'date'],
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 15,
      pageID: 1,
      uneditable: [true,true,true,true,true,true,true,true],
      keys: ['cvYear', 'cvNo', 'tranId', 'usedTag', 'createUser', 'createDate','updateUser', 'updateDate'],
  };

  params : any = {
    cvFrom: '',
    cvTo:'',
    cvYear: '',
    createUser: this.ns.getCurrentUser(),
    createDate: this.ns.toDateTimeString(0),
    updateUser: this.ns.getCurrentUser(),
    updateDate: this.ns.toDateTimeString(0)
  }
  
  dialogMessage: string = "";
  dialogIcon: string = "";
  maxCVSeries: number = 0;
  cancelFlag:boolean;
  
  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.retrieveMaxTran();
  }

  retrieveCV(){
    this.table.loadingFlag = true;
    this.maintenanceService.getAcseCvSeries(this.params.cvYear,this.params.cvFrom, this.params.cvTo).subscribe((data:any) => {
      console.log(data);
      this.passData.tableData = [];
      for (var i = 0; i < data.cvSeries.length; i++) {
        this.passData.tableData.push(data.cvSeries[i]);
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
    }else if(this.params.cvFrom <= this.maxCVSeries){
      this.dialogMessage = "Existing number series was already created for the specified transaction numbers " + this.params.cvFrom + " to " + this.params.cvTo + ".Please adjust your From-To range values.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  checkField() :boolean{
    if(this.params.cvYear.length !== 0 &&
       this.params.cvTo.length !== 0 &&
       this.params.cvFrom.length !== 0
      ){
      return false;
    }else{
      return true;
    }
  }

  generateCV(cancel?){
    this.maintenanceService.generateAcseCVSeries(this.params).subscribe((data:any) => {
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
    this.maintenanceService.getAcseMaxTranSeries('CV',null).subscribe((data:any) => {
      console.log(data)
      this.maxCVSeries = data.maxTranNo.tranNo;
    });
  }
}
