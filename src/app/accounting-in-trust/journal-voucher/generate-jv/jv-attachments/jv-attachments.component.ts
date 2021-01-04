import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService, UploadService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-jv-attachments',
  templateUrl: './jv-attachments.component.html',
  styleUrls: ['./jv-attachments.component.css']
})
export class JvAttachmentsComponent implements OnInit {
  
  @Input() jvData: any;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(LovComponent) lov: LovComponent;

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
  }

  savedData: any[];
  deletedData: any[];

  cancelFlag: boolean;
  dialogMessage: string = "";
  dialogIcon: string = "";
  jvDetails : any;
  readOnly:boolean = false;

  filesList: any [] = [];

  constructor(private notes: NotesService, private upload: UploadService, private as: AccountingService,private ns: NotesService) { }

  ngOnInit() {
  	//this.passData.tableData = this.accountingService.getAttachmentInfo();
    this.jvDetails = this.jvData;
    this.jvDetails.jvDate = this.ns.toDateTimeString(this.jvDetails.jvDate);
    this.jvDetails.refnoDate = this.jvDetails.refnoDate === "" ? "":this.ns.toDateTimeString(this.jvDetails.refnoDate);
    if(this.jvDetails.statusType != 'N'){
      this.passData.addFlag = false;
      this.passData.deleteFlag = false;
      this.passData.uneditable = [true,true,true];
      this.readOnly = true;
    }
    this.retrieveAttachements();
  }

  retrieveAttachements(){
    this.as.getAcitAttachments(this.jvDetails.tranId).subscribe((data: any) =>{
        console.log(data);
        this.passData.tableData = [];
        if(data.acitAttachmentsList !== null){
            for(var i of data.acitAttachmentsList){
                i.fileNameServer = this.notes.toDateTimeString(i.createDate).match(/\d+/g).join('') + i.fileName;
                this.passData.tableData.push(i);
            }
        }
        this.table.refreshTable();
        this.table.onRowClick(null,this.passData.tableData[0]);
    });
  }

  saveData(cancelFlag?){

      this.cancelFlag = cancelFlag !== undefined;  

      this.savedData = [];
      this.deletedData = [];
      for (var i = 0 ; this.passData.tableData.length > i; i++) {
        if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
            this.savedData.push(this.passData.tableData[i]);
            this.savedData[this.savedData.length-1].tranId = this.jvDetails.tranId;
            this.savedData[this.savedData.length-1].createDate = this.notes.toDateTimeString(0);
            this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
            this.savedData[this.savedData.length-1].updateDate = this.notes.toDateTimeString(0);
            this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        }
        else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
           this.deletedData.push(this.passData.tableData[i]);
           this.deletedData[this.deletedData.length-1].tranId = this.jvDetails.tranId;
           this.deletedData[this.deletedData.length-1].createDate = this.notes.toDateTimeString(0);
           this.deletedData[this.deletedData.length-1].updateDate = this.notes.toDateTimeString(0);
        }

      }
      let params: any = {
        saveAttachmentsList: this.savedData,
        delAttachmentsList: this.deletedData
      }
      this.as.saveAcitAttachments(params).subscribe((data: any) => {
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
      this.cancelBtn.clickCancel();
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

  //get the emitted files from the table
  uploads(event){
    this.filesList = event;
  }

  checkFields(){
    for(let check of this.passData.tableData){
      if(check.description === null || check.description === undefined || check.description.length === 0){
        return false;
      }
    }
    return true;
  }

  pad(str, field) {
    if(str === '' || str == null){
      return '';
    }else{
      if(field === 'arNo'){
        return String(str).padStart(6, '0');
      }else if(field === 'dcbSeqNo'){
        return String(str).padStart(3, '0');
      }
    }
  }

  onRowClick(data){
    if(data != null){
      this.jvDetails.createDate = this.notes.toDateTimeString(data.createDate);
      this.jvDetails.updateDate = this.notes.toDateTimeString(data.updateDate);
      this.jvDetails.createUser = data.createUser;
      this.jvDetails.updateUser = data.updateUser;
    }else{
      this.jvDetails.createDate = '';
      this.jvDetails.updateDate = '';
      this.jvDetails.createUser = '';
      this.jvDetails.updateUser = '';
    }
  }
}