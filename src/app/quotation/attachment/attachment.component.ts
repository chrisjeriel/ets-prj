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


@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
  providers: [NgbDropdownConfig]
})

export class AttachmentComponent implements OnInit {
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

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
    /*this.tHeader.push("File Name");
    this.tHeader.push("Description");
    this.tHeader.push("Actions");*/
    // this.options.push("");
    // this.options.push("Q - Quotation");
    // this.options.push("P - Policy");
    // this.options.push("C - Claim");
    // this.options.push("A - Accounting");
    // this.dataTypes.push("text");
    // this.dataTypes.push("text");
    // this.dataTypes.push("select1");
    // this.dataTypes.push("text");
    /*this.tableData = this.quotationService.getAttachment();*/

    // this.passData.tHeader.push("File Name");
    // this.passData.tHeader.push("Description");
    // this.passData.tHeader.push("Actions");

    //neco
        if(this.inquiryFlag){
          this.passData.tHeader.pop();
          this.passData.opts = [];
          this.passData.uneditable = [];
          this.passData.magnifyingGlass = [];
          this.passData.addFlag = false;
          this.passData.deleteFlag = false;
          for(var count = 0; count < this.passData.tHeader.length; count++){
            this.passData.uneditable.push(true);
          }
        }
        //neco end

    /*let arrayData = [];
    this.quotationService.getAttachment().subscribe((data: any) => {
      for (var i = 0; i <  data.quotation.length ; i++) {
        arrayData.push(new AttachmentInfo(data.quotation[i].attachment.fileName, data.quotation[i].attachment.description));
      }
     });
    this.passData.tableData = arrayData;
*/
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
    this.quotationService.getAttachment(null, this.quoteNo)
      .subscribe(data => {
        this.quoteId = data['quotation'][0].quoteId;
        this.attachmentData =  data['quotation'][0].attachmentsList;
        this.passData.tableData = this.attachmentData;
        this.table.refreshTable();
        console.log(JSON.stringify(this.attachmentData) + " >>>> this.attachmentData");
        //console.log(this.attachmentData[0].fileName + " >> file name");
      });
  }

 onSaveAttachment(cancelFlag?){
   this.counter = 0;
   this.dialogIcon = '';
   this.dialogMessage = '';
   this.cancelFlag = cancelFlag !== undefined;
   if(this.cancelFlag === true){
     this.router.navigateByUrl('quotation-processing');
   }
   for (var i = 0 ; this.passData.tableData.length > i; i++) {
     var rec = this.passData.tableData[i];
     if(rec.fileName === '' || rec.fileName === null || rec.fileName === undefined){
       this.dialogIcon = 'error';
       this.dialogMessage = '';
       $('app-sucess-dialog #modalBtn').trigger('click');
       setTimeout(()=>{$('.globalLoading').css('display','none');0});
       console.log('error hereeeeeeeee');
       this.loading = false;
     }else{
        if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
           this.attachmentReq = {
              "deleteAttachmentsList": [],
              "quoteId": this.quoteId,
              "saveAttachmentsList": [
                {
                  "createDate":    (this.passData.tableData[i].createDate === null || this.passData.tableData[i].createDate === undefined || this.passData.tableData[i].createDate === '')?this.ns.toDateTimeString(0):this.ns.toDateTimeString(this.passData.tableData[i].createDate),
                  "createUser":    (this.passData.tableData[i].createUser === null || this.passData.tableData[i].createUser === undefined || this.passData.tableData[i].createUser === '')?JSON.parse(window.localStorage.currentUser).username:this.passData.tableData[i].createUser,
                  "description":   this.passData.tableData[i].description,
                  "fileName":      this.passData.tableData[i].fileName,
                  "fileNo":        this.passData.tableData[i].fileNo,
                  "updateDate":    this.ns.toDateTimeString(0),
                  "updateUser":    JSON.parse(window.localStorage.currentUser).username
                }
              ]
           }
           this.quotationService.saveQuoteAttachment(JSON.stringify(this.attachmentReq))
             .subscribe(data => {
               this.getAttachment();
               $('app-sucess-dialog #modalBtn').trigger('click');
               this.loading = false;
             });
         }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
           this.attachmentReq = {
              "deleteAttachmentsList": [
                {
                  "createDate":    this.passData.tableData[i].createDate,
                  "createUser":    this.passData.tableData[i].createUser ,
                  "description":   this.passData.tableData[i].description,
                  "fileName":      this.passData.tableData[i].fileName,  
                  "fileNo":        this.passData.tableData[i].fileNo,  
                  "updateDate":    this.passData.tableData[i].updateDate,
                  "updateUser":    this.passData.tableData[i].updateUser,
                }
              ],
              "quoteId": this.quoteId,
              "saveAttachmentsList": []
           }
           this.quotationService.saveQuoteAttachment(JSON.stringify(this.attachmentReq))
             .subscribe(data => {
               this.getAttachment();
               $('app-sucess-dialog #modalBtn').trigger('click');
               this.loading = false;
             });
         }else{
           console.log("entered here");
           this.counter++;
         }
     }
     
   }
/*<<<<<<< HEAD

   if(this.passData.tableData.length === this.counter){
      setTimeout(()=>{
         $('.globalLoading').css('display','none');
           this.dialogIcon = 'info';
           this.dialogMessage = 'Nothing to save.';
           $('app-sucess-dialog #modalBtn').trigger('click');
      },500);
   }
=======*/
   //upload
   for(let files of this.filesList){
     if (files.length == 0) {
       console.log("No file selected!");
       return

     }
     let file: File = files[0];

     this.upload.uploadFile(file)
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
/*>>>>>>> 461f752f32c09197d725373c176be5a6d657dcff*/
 
 } 

  cancel(){
    this.cancelBtn.clickCancel();

  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }

   //get the emitted files from the table
    uploads(event){
      this.filesList = event;
    }
}
