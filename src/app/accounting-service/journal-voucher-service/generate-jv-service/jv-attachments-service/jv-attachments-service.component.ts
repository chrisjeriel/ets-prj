import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AttachmentInfo} from '@app/_models';
import { AccountingService, NotesService, UploadService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-jv-attachments-service',
  templateUrl: './jv-attachments-service.component.html',
  styleUrls: ['./jv-attachments-service.component.css']
})
export class JvAttachmentsServiceComponent implements OnInit {
  
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lov: LovComponent;
  @Input() jvType: string = "";
  @Input() jvData: any;

  passData: any = {
      tableData: [],
      tHeader: ['File Name', 'Description', 'Actions'],
      dataTypes: ['string', 'string'],
      nData: {tranId: '', fileNo: '', fileName: '', description: ''},
      checkFlag: true,
      addFlag: true,
      deleteFlag: true,
      searchFlag: true,
      infoFlag: true,
      paginateFlag: true,
      pageLength: 10,
      uneditable: [true, false],
      keys: ['fileName', 'description'],
      widths: [463, 606, 1]
  };

  jvDetails : any = {
     jvNo: '', 
     jvYear: '', 
     jvDate: '', 
     jvType: '',
     jvStatus: '',
     refnoDate: '',
     refnoTranId: '',
     currCd: '',
     currRate: '',
     jvAmt: '',
     localAmt: ''
  };

  dialogMessage: string = "";
  dialogIcon: string = "";
  cancelFlag: boolean;
  savedData: any[];
  deletedData: any[];
  filesList: any [] = [];
  createUser: any;
  createDate: any;
  updateUser: any;
  updateDate: any;

  constructor(private accountingService: AccountingService,private ns: NotesService, private upload: UploadService) { }

  ngOnInit() {
    this.jvDetails = this.jvData;
    this.retrieveAttachements();
  }

  retrieveAttachements(){
    this.accountingService.getAcseAttachments(this.jvDetails.tranId).subscribe((data: any) =>{
        console.log(data);
        this.passData.tableData = [];
        if(data.acseAttachmentsList !== null){
            for(var i of data.acseAttachmentsList){
                i.fileNameServer = this.ns.toDateTimeString(i.createDate).match(/\d+/g).join('') + i.fileName;
                this.passData.tableData.push(i);
            }
        }
        this.table.refreshTable();
        this.table.onRowClick(null,this.passData.tableData[0]);
    });
  }

  onClickSave(){
    if(this.checkFields()){
      this.confirm.confirmModal();
    }else{
      this.dialogMessage="";
      this.dialogIcon = "error";
      this.successDiag.open();
    }
  }

  checkFields(){
    for(let check of this.passData.tableData){
      if(check.description === null || check.description === undefined || check.description.length === 0){
        return false;
      }
    }
    return true;
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;  

    this.savedData = [];
    this.deletedData = [];
    for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
          this.savedData.push(this.passData.tableData[i]);
          this.savedData[this.savedData.length-1].tranId = this.jvDetails.tranId;
          this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
          this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
          this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
      }
      else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
         this.deletedData.push(this.passData.tableData[i]);
         this.deletedData[this.deletedData.length-1].tranId = this.jvDetails.tranId;
         this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
      }

    }
    let params: any = {
      saveAttachmentsList: this.savedData,
      delAttachmentsList: this.deletedData
    }

    this.accountingService.saveAcseAttachments(params).subscribe((data: any) => {
      console.log(data);
      if(data.returnCode === 0){
          this.dialogMessage="The system has encountered an unspecified error.";
          this.dialogIcon = "error";
          this.successDiag.open();
      }else{
          this.dialogMessage="";
          this.dialogIcon = "";
          if(data.uploadDate != null){
            this.uploadMethod(data.uploadDate);
          }
          if(this.deletedData.length !== 0){
            this.deleteFileMethod();
          }
          this.successDiag.open();
          this.retrieveAttachements();
      }
    });
  }

  uploadMethod(date){
    //upload
    for(let files of this.filesList){
      if (files.length == 0) {
        console.log("No file selected!");
        return

      }
      let file: File = files[0];
      //var newFile = new File([file], date + file.name, {type: file.type});

      this.upload.uploadFile(file, date)
        .subscribe(
          event => {
            console.log('nandato kore');
            if (event.type == HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(`File is ${percentDone}% loaded.`);
            } else if (event instanceof HttpResponse) {
              console.log('File is completely loaded!');
            }
          },
          (err) => {
            console.log("Upload Error:", err);
          }, () => {
            console.log("Upload done");
          }
        )
      }
      //clear filelist array after upload
      this.table.filesToUpload = [];
      this.table.refreshTable();
  }

  deleteFileMethod(){
    let deleteFile = this.deletedData;
    for(var i of deleteFile){
      console.log(i.fileNameServer);
      this.upload.deleteFile(i.fileNameServer).subscribe(
          data =>{
            console.log(data);
          },
          error =>{
            console.log('Error: '+ error);
          },
          () =>{
            console.log('Successfully deleted');
          }
        );
    }
  }

  cancel(){
    this.cancelBtn.onClickCancel();
  }

  onRowClick(data){
    console.log(data)
    if(data !== null){
      this.createUser = data.createUser;
      this.createDate = this.ns.toDateTimeString(data.createDate);
      this.updateUser = data.updateUser;
      this.updateDate = this.ns.toDateTimeString(data.updateDate);
    }else{
      this.createUser = '';
      this.createDate = '';
      this.updateUser = '';
      this.updateDate = '';
    }
    
  }
}
