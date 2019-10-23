import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

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
  @ViewChild('cvModal') cvModal: ModalComponent;
  @ViewChild('cvErrorModal') cvErrorModal: ModalComponent;

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
  okGenerate: any = '';
  cancelFlag:boolean;
  
  constructor(private maintenanceService: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
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
    if(this.params.cvFrom >= this.params.cvTo){
      this.dialogMessage = "Cv From must not be greater or equal to Cv to.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.maintenanceService.getAcseMaxTranSeries('CV',this.params.cvFrom,this.params.cvTo,this.params.cvYear).subscribe((data:any) => {
        console.log(data)
        this.okGenerate = data.allowGenerate.allowGenerate;

        if(this.okGenerate == 'N'){
          this.cvErrorModal.openNoClose();
        }else{
          this.cvModal.openNoClose();
        }
      });
     }
  }

  checkField() :boolean{
    return this.params.cvFrom == '' || this.params.cvTo == '' || this.params.cvYear == '';
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
        this.retrieveCV();
      }
    });
  }
}
