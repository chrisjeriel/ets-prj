import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-jv-series',
  templateUrl: './jv-series.component.html',
  styleUrls: ['./jv-series.component.css']
})
export class JvSeriesComponent implements OnInit {
   
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('jvModal') jvModal: ModalComponent;
  @ViewChild('jvErrorModal') jvErrorModal: ModalComponent;

  passData: any = {
      tableData: [],
      tHeader: ['JV Year','JV No', 'Tran ID', 'Used','Created By', 'Date Created', 'Last Update By', 'Last Update'],
      dataTypes: ['year','text', 'number', 'checkbox','text','date', 'text', 'date'],
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 15,
      pageID: 1,
      uneditable: [true,true,true,true,true,true,true,true],
      keys: ['jvYear', 'jvNo', 'tranId', 'usedTag', 'createUser', 'createDate','updateUser', 'updateDate'],
  }

  params : any = {
    jvFrom: '',
    jvTo:'',
    jvYear: '',
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

  retrieveJV(){
    this.table.loadingFlag = true;
    this.maintenanceService.getAcseJvSeries(this.params.jvYear,this.params.jvFrom,this.params.jvTo).subscribe((data:any) => {
      console.log(data);
      this.passData.tableData = [];
      for (var i = 0; i < data.jvSeries.length; i++) {
        this.passData.tableData.push(data.jvSeries[i]);
      }
      this.table.refreshTable();
      this.table.loadingFlag = false;
    });
  }

  onClickGenerate(){
    if(this.params.jvFrom >= this.params.jvTo){
      this.dialogMessage = "Jv From must not be greater or equal to jv to.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.maintenanceService.getAcseMaxTranSeries('JV',this.params.jvFrom,this.params.jvTo,this.params.jvYear).subscribe((data:any) => {
        console.log(data)
        this.okGenerate = data.allowGenerate.allowGenerate;

        if(this.okGenerate == 'N'){
          this.jvErrorModal.openNoClose();
        }else{
          this.jvModal.openNoClose();
        }
      });
    }
  }

  checkField() :boolean{
    return this.params.jvFrom == '' || this.params.jvTo == '' || this.params.jvYear == '';
  }

  generateJV(cancel?){
    this.maintenanceService.generateAcseJVSeries(this.params).subscribe((data:any) => {
      if(data['returnCode'] != -1) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      }else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.retrieveJV();
      }
    });
  }
}