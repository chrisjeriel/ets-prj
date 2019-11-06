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
  selector: 'app-acct-attachment',
  templateUrl: './acct-attachment.component.html',
  styleUrls: ['./acct-attachment.component.css']
})
export class AcctAttachmentComponent implements OnInit {
  
   

  @Input() record: any;
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
      widths: ['auto', 'auto', 1]
  }

  savedData: any[];
  deletedData: any[];

  cancelFlag: boolean;
  dialogMessage: string = "";
  dialogIcon: string = "";

  filesList: any [] = [];
  @Input() inquiryFlag: boolean; // added by ENGEL;

  constructor(private notes: NotesService, private upload: UploadService, private as: AccountingService) {
  }

  ngOnInit() {
    console.log(this.record);
    // if(this.record.from.toLowerCase() == 'ar'){
    //   if(this.record.orStatDesc.toUpperCase() != 'NEW'){
    //     this.passData.uneditable = [true, true, true];
    //     this.passData.addFlag = false;
    //     this.passData.deleteFlag =  false;
    //     this.passData.checkFlag = false;
    //     this.passData.magnifyingGlass = [];
    //   }
    // }else if(this.record.from.toLowerCase() == 'cv'){
    //   if(this.record.cvStatusDesc.toUpperCase() != 'NEW'){
    //     this.passData.uneditable = [true, true, true];
    //     this.passData.addFlag = false;
    //     this.passData.deleteFlag =  false;
    //     this.passData.checkFlag = false;
    //     this.passData.magnifyingGlass = [];
    //   }
    // }
    this.retrieveARAttachment();
  }

  retrieveARAttachment(){
      if(this.record.from.toLowerCase() == 'cv'){
        this.record.cvAmt = Number(String(this.record.cvAmt).replace(/\,/g,'')); 
        this.record.localAmt = Number(String(this.record.localAmt).replace(/\,/g,''));
      }

      if(this.record.from.toLowerCase() == 'jv'){
        this.record.jvDate = this.notes.toDateTimeString(this.record.jvDate);
        this.record.refnoDate = this.record.refnoDate === "" ? "":this.notes.toDateTimeString(this.record.refnoDate);
      }

      this.as.getAcseAttachments(this.record.tranId).subscribe((data: any) =>{
          console.log(data);
          this.passData.tableData = [];
          if(data.acseAttachmentsList !== null){
              for(var i of data.acseAttachmentsList){
                  //i.fileNameServer = this.notes.toDateTimeString(i.createDate).match(/\d+/g).join('') + i.fileName;
                  i.fileNameServer = i.fileName;
                  i.module = 'acct-service';
                  i.refId = this.record.tranId;
                  this.passData.tableData.push(i);
              }
          }
          this.table.refreshTable();
          this.table.onRowClick(null,this.passData.tableData[0]);
          
          var a = false;
          if(this.record.from.toLowerCase() == 'or'){
            a = (this.record.orStatDesc.toUpperCase() != 'NEW' || this.inquiryFlag)?true:false;
          }else if(this.record.from.toLowerCase() == 'cv'){
            a = (this.record.cvStatus.toUpperCase() != 'N' && this.record.cvStatus.toUpperCase() != 'F')?true:false;
          }else if(this.record.from.toLowerCase() == 'jv'){
            a = (this.record.statusType.toUpperCase() != 'N');
          }

          if(a){
            this.passData.uneditable = [true, true, true];
            this.passData.addFlag = false;
            this.passData.deleteFlag =  false;
            this.passData.checkFlag = false;
            this.passData.magnifyingGlass = [];
          }
      });
  }


  saveData(cancelFlag?){

      this.cancelFlag = cancelFlag !== undefined;  

      this.savedData = [];
      this.deletedData = [];
      for (var i = 0 ; this.passData.tableData.length > i; i++) {
        if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
            this.savedData.push(this.passData.tableData[i]);
            this.savedData[this.savedData.length-1].tranId = this.record.tranId;
            this.savedData[this.savedData.length-1].createDate = this.notes.toDateTimeString(0);
            this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
            this.savedData[this.savedData.length-1].updateDate = this.notes.toDateTimeString(0);
            this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        }
        else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
           this.deletedData.push(this.passData.tableData[i]);
           this.deletedData[this.deletedData.length-1].tranId = this.record.tranId;
           this.deletedData[this.deletedData.length-1].createDate = this.notes.toDateTimeString(0);
           this.deletedData[this.deletedData.length-1].updateDate = this.notes.toDateTimeString(0);
        }

      }
      let params: any = {
        saveAttachmentsList: this.savedData,
        delAttachmentsList: this.deletedData
      }
      this.as.saveAcseAttachments(params).subscribe((data: any) => {
        console.log(data);
        if(data.returnCode === 0){
            this.cancelFlag = false;
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
            this.retrieveARAttachment();
            this.table.markAsPristine();
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

      this.upload.uploadFile(file, date, 'acct-service', this.record.tranId)
        .subscribe(
          event => {
            console.log('nandato kore');
            if (event.type == HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(`File is ${percentDone}% loaded.`);
            } else if (event instanceof HttpResponse) {
              console.log('File is completely loaded!');
            }
            console.log(event);
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
      this.upload.deleteFile(i.fileNameServer, 'acct-service', this.record.tranId).subscribe(
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
    this.filesList = this.filesList.filter(a=>{return this.passData.tableData.map(a=>{return a.fileName}).includes(a[0].name)});

    if(!this.checkFields()){
      this.dialogMessage="";
      this.dialogIcon = "error";
      this.successDiag.open();
    }else if(this.checkFileSize().length !== 0){
      this.dialogMessage= this.checkFileSize()+" exceeded the maximum file upload size.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else if(this.checkFileNameLength()){
      this.dialogMessage= "File name exceeded the maximum 250 characters";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.confirm.confirmModal();
    }
  }

  onClickSaveCancel(){
    this.filesList = this.filesList.filter(a=>{return this.passData.tableData.map(a=>{return a.fileName}).includes(a[0].name)});

    if(!this.checkFields()){
      this.dialogMessage="";
      this.dialogIcon = "error";
      this.successDiag.open();
    }else if(this.checkFileSize().length !== 0){
      this.dialogMessage= this.checkFileSize()+" exceeded the maximum file upload size.";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else if(this.checkFileNameLength()){
      this.dialogMessage= "File name exceeded the maximum 250 characters";
      this.dialogIcon = "error-message";
      this.successDiag.open();
    }else{
      this.saveData('cancel');
    }
  }

  //get the emitted files from the table
  uploads(event){
    this.filesList = event;
    console.log(event);
  }

  checkFields(){
    for(let check of this.passData.tableData){
      if(check.description === null || check.description === undefined || check.description.length === 0){
        return false;
      }
    }
    return true;
  }

  checkFileSize(){
    for(let files of this.filesList){
      console.log(files[0].size);
      if(files[0].size > 26214400){ //check if a file exceeded 25MB
        return files[0].name;
      }
    }
    return '';
  }

  checkFileNameLength(){
    for(var i of this.passData.tableData){
      if(i.fileName.length > 250){
        return true;
      }
    }
    return false;
  }

  pad(str, field) {
    if(str === '' || str == null){
      return '';
    }else{
      if(field === 'orNo'){
        return String(str).padStart(this.record.orNoDigits, '0');
      }else if(field === 'dcbSeqNo'){
        return String(str).padStart(3, '0');
      }
    }
  }

  onRowClick(data){
    if(data != null){
      this.record.createDate = this.notes.toDateTimeString(data.createDate);
      this.record.updateDate = this.notes.toDateTimeString(data.updateDate);
      this.record.createUser = data.createUser;
      this.record.updateUser = data.updateUser;
    }else{
      this.record.createDate = '';
      this.record.updateDate = '';
      this.record.createUser = '';
      this.record.updateUser = '';
    }
  }

}
