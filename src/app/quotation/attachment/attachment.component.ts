import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService, NotesService, UploadService } from '@app/_services';
import { AttachmentInfo } from '../../_models/Attachment';
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


@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
  providers: [NgbDropdownConfig]
})

export class AttachmentComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('main') successDiag: SucessDialogComponent;

  /* dtOptions: DataTables.Settings = {};*/
  tableData: any[] = [];
  tHeader: any[] = [];
  options: any[] = [];
  dataTypes: any[] = [];
  opts: any[] = [];
  checkFlag;
  selectFlag;
  addFlag;
  editFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  searchFlag;
  checkboxFlag;
  columnId;
  pageLength;
  editedData: any[] = [];
  nData: AttachmentInfo = new AttachmentInfo(null, null);
  test: boolean = false;
  attachmentInfoData: AttachmentInfo[] = [];
  private attachmentInfo: AttachmentInfo;
  successMessage:string = environment.successMessage;

  attachmentData: any;
  // passData: any = {
  //   tableData: [],
  //   tHeader: [],
  //   magnifyingGlass: [],
  //   options: [],
  //   dataTypes: [],
  //   opts: [],
  //   nData: {
  //     createDate: [0,0,0],
  //     createUser: "PCPR",
  //     description: null,
  //     fileName: null,
  //     fileNo: null,
  //     updateDate: [0,0,0],
  //     updateUser: "PCPR"
  //   },
  //   checkFlag: true,
  //   selectFlag: false,
  //   addFlag: true,
  //   editFlag: false,
  //   deleteFlag: true,
  //   paginateFlag: true,
  //   infoFlag: true,
  //   searchFlag: true,
  //   checkboxFlag: true,
  //   pageLength: 10,
  //   widths: [],
  //   uneditable: [true,false,false],
  //   keys:['fileName','description']
  // };

  passData : any = {
    tableData: [],
    tHeader: ['File Name', 'Description', 'Action'],
    nData : new AttachmentInfo(null,null),
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 10,
    widths: [],
    uneditable: [true,false,false],
    dataTypes: ['text', 'text'],
    keys:['fileName','description']
  };

  attachmentReq:any;
  loading:boolean;

  savedData: any[];
  deletedData: any[];
  sub:any;
  quotationNo: string;
  quoteId: string;
  @Input() quotationInfo: any = {};
  quoteNo: string = '';  
  @Input() inquiryFlag: boolean = false;
  dialogMessage:string = "";
  dialogIcon: string = "";
  cancelFlag:boolean;
  counter:number;

  filesList: any[] = [];

  constructor(config: NgbDropdownConfig,
    private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute,private modalService: NgbModal,private ns : NotesService,
     private location: Location, private router: Router, private upload: UploadService ) {

    config.placement = 'bottom-right';
    config.autoClose = false;
  }

  ngOnInit(): void {

    this.titleService.setTitle("Quo | Attachment");

    //neco
        if(this.inquiryFlag){
          this.passData.opts = [];
          this.passData.uneditable = [];
          this.passData.magnifyingGlass = [];
          this.passData.addFlag = false;
          this.passData.deleteFlag = false;
          this.passData.checkFlag = false;
          this.passData.uneditable=[true,true,true,true,true,]
          for(var count = 0; count < this.passData.tHeader.length; count++){
            this.passData.uneditable.push(true);
          }
        }
        //neco end

  this.quotationNo = this.quotationInfo.quotationNo;
  this.quoteNo = this.quotationNo.split(/[-]/g)[0]
  for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
    if(i !== 4){
     this.quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
    }else{
      this.quoteNo += '-' + this.quotationNo.split(/[-]/g)[i];
    }

  } 
    this.getAttachment();
  }

  getAttachment(){
    this.passData.tableData = [];
    this.quotationService.getAttachment(null, this.quoteNo)
      .subscribe(data => {
        this.quoteId = data['quotation'][0].quoteId;
        this.attachmentData =  data['quotation'][0].attachmentsList;
        //this.passData.tableData = this.attachmentData;
        for(var i of this.attachmentData){
          i.fileNameServer = this.ns.toDateTimeString(i.updateDate).match(/\d+/g).join('') + i.fileName;
          this.passData.tableData.push(i);
        }
        this.table.refreshTable();
        console.log(JSON.stringify(this.attachmentData) + " >>>> this.attachmentData");
      });
  }

 onSaveAttachment(cancelFlag?){
   this.counter = 0;
   this.dialogIcon = '';
   this.dialogMessage = '';
   this.cancelFlag = cancelFlag !== undefined;
   this.savedData = [];
   this.deletedData = [];
   for (var i = 0 ; this.passData.tableData.length > i; i++) {
     if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
         this.savedData.push(this.passData.tableData[i]);
         this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
         this.savedData[this.savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
         this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
         this.savedData[this.savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
     }
     else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
        this.deletedData.push(this.passData.tableData[i]);
        this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
        this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
     }

   }

   let params: any = {
     deleteAttachmentsList: this.deletedData,
     saveAttachmentsList: this.savedData,
     quoteId: this.quoteId
   }

   this.quotationService.saveQuoteAttachment(JSON.stringify(params))
     .subscribe((data: any) => {
       console.log(data);
       if(data.returnCode === 0){
         this.dialogIcon = 'error';
         this.successDiag.open();
       }else{
         this.dialogIcon = 'success';
         this.successDiag.open();
         if(data.uploadDate != null){
           this.uploadMethod(data.uploadDate);
         }
         if(this.deletedData.length !== 0){
           this.deleteFileMethod();
         }
         this.getAttachment();
       }
       this.loading = false;
     });

  
/*>>>>>>> 461f752f32c09197d725373c176be5a6d657dcff*/
 
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
       $('#confirm-save #modalBtn2').trigger('click');
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
        if(check.description === null || check.description === undefined || check.description.length === 0 ||
           check.fileName === null || check.fileName === null || check.fileName.length === 0){
          return false;
        }
      }
      return true;
    }
}
