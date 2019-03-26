import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService, NotesService } from '@app/_services';
import { AttachmentInfo } from '../../_models/Attachment';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { Location } from '@angular/common';
import { Router } from '@angular/router';



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

  constructor(config: NgbDropdownConfig,
    private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute,private modalService: NgbModal,private ns : NotesService,
     private location: Location, private router: Router ) {

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

  // saveData(cancelFlag?){
  //   this.savedData = [];
  //   this.deletedData = [];
  //   this.cancelFlag = cancelFlag !== undefined;
  //   for (var i = 0 ; this.passData.tableData.length > i; i++) {
  //     if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  //         this.savedData.push(this.passData.tableData[i]);
  //         this.savedData[this.savedData.length-1].createDate = new Date(this.savedData[this.savedData.length-1].createDate[0],this.savedData[this.savedData.length-1].createDate[1]-1,this.savedData[this.savedData.length-1].createDate[2]);
  //         this.savedData[this.savedData.length-1].updateDate = new Date(this.savedData[this.savedData.length-1].updateDate[0],this.savedData[this.savedData.length-1].updateDate[1]-1,this.savedData[this.savedData.length-1].updateDate[2]);
  //     }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
  //       this.deletedData.push(this.passData.tableData[i]);
  //       this.deletedData[this.deletedData.length-1].createDate = new Date(this.deletedData[this.deletedData.length-1].createDate[0],this.deletedData[this.deletedData.length-1].createDate[1]-1,this.deletedData[this.deletedData.length-1].createDate[2]).toISOString();
  //       this.deletedData[this.deletedData.length-1].updateDate = new Date(this.deletedData[this.deletedData.length-1].updateDate[0],this.deletedData[this.deletedData.length-1].updateDate[1]-1,this.deletedData[this.deletedData.length-1].updateDate[2]).toISOString();
  //     }
  //     // delete this.savedData[i].tableIndex;
  //   }
  //   console.log(JSON.stringify(this.savedData) + " >> this.savedData ");

  //   if (this.savedData.length != 0 || this.deletedData.length!=0 ) {
  //     this.quotationService.saveQuoteAttachment(this.quoteId,this.savedData,this.deletedData).subscribe((data: any) => {
  //       console.log(data)
  //       if(data['returnCode'] == 0) {
  //           this.dialogMessage = data['errorList'][0].errorMessage;
  //           this.dialogIcon = "error";
  //           $('#successModalBtn').trigger('click');
  //         } else{
  //           this.dialogMessage="";
  //           this.dialogIcon = "";
  //           $('#successModalBtn').trigger('click');
  //           this.getAttachment();
  //           this.table.markAsPristine();
  //         }
  //       });
  //   }else{
  //     this.dialogMessage = "Nothing to save.";
  //     this.dialogIcon = "info"
  //     $('#successModalBtn').trigger('click');
  //   }
  // }

 onSaveAttachment(cancelFlag?){
   this.loading = true;
   this.cancelFlag = cancelFlag !== undefined;
   console.log(this.cancelFlag + " >> this.cancel");
   if(this.cancelFlag === true){
     this.router.navigateByUrl('quotation-processing');
   }
   for (var i = 0 ; this.passData.tableData.length > i; i++) {
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
     }
   }
 
 } 

  cancel(){
    this.cancelBtn.clickCancel();

  }

  onClickSave(){
    $('#confirm-save #modalBtn2').trigger('click');
  }
}
