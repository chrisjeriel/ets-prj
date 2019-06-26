import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ClaimsService, NotesService, UploadService } from '@app/_services';
import { AttachmentInfo } from '@app/_models/Attachment';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';


@Component({
  selector: 'app-claims-attachment',
  templateUrl: './claims-attachment.component.html',
  styleUrls: ['./claims-attachment.component.css']
})
export class ClaimsAttachmentComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('main') successDiag: SucessDialogComponent;
  @ViewChild("confirmSave") confirmDialog: ConfirmSaveComponent;
  @ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;

  passData: any = {
  	    tableData: [],
        tHeader: ['File Name', 'Description', 'Actions'],
        dataTypes: ['string', 'string'],
        nData:{
          fileName        : null,
          description     : null,
          "createUser"    : this.notes.getCurrentUser(),
          "createDate"    : this.notes.toDateTimeString(0),
          "updateUser"    : this.notes.getCurrentUser(),
          "updateDate"    : this.notes.toDateTimeString(0)
         },
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
  };

  attachRecord : any = {
      createUser    : null,
      createDate    : null,
      updateUser    : null,
      updateDate    : null,
  }


  claimId: string = '1';
  claimNo: string = 'CAR-2020-00001';
  attachmentData: any;
  filesList: any [] = [];
  dialogMessage: string = "";
  dialogIcon: string = "";
  cancelFlag: boolean;
  savedData: any[];
  deletedData: any[];

  attachmentInfo  : any = { 
                "claimId" : this.claimId,
                "deleteClaimsAttachments": [],
                "saveClaimsAttachments"  : []}


  constructor(config: NgbDropdownConfig,
              private claimsService: ClaimsService, 
              private titleService: Title, 
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private notes : NotesService,
              private location: Location, 
              private router: Router,
              private upload: UploadService) { 
              config.placement = 'bottom-right';
              config.autoClose = false;
  }

  ngOnInit() {
    this.titleService.setTitle("Clm | Attachment");
    this.getAttachment();
  }

  getAttachment(){
    this.claimsService.getAttachment(null, this.claimNo)
      .subscribe(data => {
        console.log(data);
        this.passData.tableData = [];
         if(data['claimsAttachmentList'] !== null){
                  console.log(data['claimsAttachmentList']);
            var records = data['claimsAttachmentList'];
            for(let rec of records){
              this.passData.tableData.push({
                                            fileNameServer  : this.notes.toDateTimeString(rec.updateDate).match(/\d+/g).join('') + rec.fileName,
                                            fileName        : rec.fileName,
                                            fileNo          : rec.fileNo,
                                            description     : rec.description,
                                            createUser      : rec.createUser,
                                            createDate      : this.notes.toDateTimeString(rec.createDate),
                                            updateUser      : rec.updateUser,
                                            updateDate      : this.notes.toDateTimeString(rec.updateDate),
                                           });
            }
         } 
        this.table.refreshTable();
      });
  }

  uploads(event){
      this.filesList = event;
  }

  uploadMethod(date){
      //upload
      for(let files of this.filesList){
        if (files.length == 0) {
          console.log("No file selected!");
          return

        }
        let file: File = files[0];
        var newFile = new File([file], date + file.name, {type: file.type});

        console.log(newFile)
        this.upload.uploadFile(newFile)
          .subscribe(
            event => {
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

  cancel(){
        this.cancelBtn.clickCancel();
  }

  checkFields(){
      for(let check of this.passData.tableData){
        if(check.description === null || check.description === undefined || check.description.length === 0){
          return false;
        }
      }
      return true;
  }

  onClickSave(){
      if(this.checkFields()){
       $('#confirm-save #modalBtn2').trigger('click');
      }else{
        this.dialogMessage="Please fill up required fields.";
        this.dialogIcon = "info";
        $('#attchmntMdl > #successModalBtn').trigger('click');
      }
  }

  onSaveAttachment(cancelFlag?){
     this.cancelFlag = cancelFlag !== undefined;  

     this.savedData = [];
     this.deletedData = [];
     this.savedData = this.passData.tableData.filter(a=>a.edited && !a.deleted);
     this.savedData.forEach(a=>a.updateDate = this.notes.toDateTimeString(0));
     this.savedData.forEach(a=>a.updateUser = JSON.parse(window.localStorage.currentUser).username);
     this.deletedData = this.passData.tableData.filter(a=>a.edited && a.deleted);
     this.deletedData.forEach(a=>a.createDate = this.notes.toDateTimeString(0));
     this.deletedData.forEach(a=>a.updateDate = this.notes.toDateTimeString(0));
   
     this.attachmentInfo.deleteClaimsAttachments = this.deletedData;
     this.attachmentInfo.saveClaimsAttachments = this.savedData;

            if(this.attachmentInfo.saveClaimsAttachments.length === 0 && this.attachmentInfo.deleteClaimsAttachments.length === 0  ){     
              this.confirmDialog.showBool = false;
              this.dialogIcon = "success";
              this.successDialog.open();
            } else {
              this.confirmDialog.showBool = true;
              this.attachRecord = [];
              this.saveAttachment();   
            }
  }

  saveAttachment(){
      this.claimsService.saveClaimAttachment(this.attachmentInfo).subscribe((data: any) => {
            console.log(data);
            if(data['returnCode'] === 0){
                this.dialogMessage="The system has encountered an unspecified error.";
                this.dialogIcon = "error-message";
                $('#attchmntMdl > #successModalBtn').trigger('click');
            }else{
                this.dialogIcon = "success";
                if(data.uploadDate != null){
                  this.uploadMethod(data.uploadDate);
                }
                if(this.deletedData.length !== 0){
                  this.deleteFileMethod();
                }
                $('#attchmntMdl > #successModalBtn').trigger('click');
                this.getAttachment();
            }
      });         
  }

  deleteFileMethod(){
      let deleteFile = this.deletedData;
      console.log(this.deletedData);
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

   onRowClick(event){
    if(event !== null){
      this.attachRecord.createUser  = event.createUser;
      this.attachRecord.createDate  = event.createDate;
      this.attachRecord.updateUser  = event.updateUser;
      this.attachRecord.updateDate  = event.updateDate;
    } else {
      this.attachRecord = [];
    }
  }

}
