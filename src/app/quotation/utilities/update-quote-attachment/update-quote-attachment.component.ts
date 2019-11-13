import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { ConfirmLeaveComponent,CancelButtonComponent, CustEditableNonDatatableComponent,ConfirmSaveComponent, ModalComponent, SucessDialogComponent } from '@app/_components/common';
import { NgForm } from '@angular/forms';
import { QuotationService, NotesService, UploadService } from '@app/_services';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-update-quote-attachment',
  templateUrl: './update-quote-attachment.component.html',
  styleUrls: ['./update-quote-attachment.component.css']
})
export class UpdateQuoteAttachmentComponent implements OnInit {

  quoteInfo:any = {
  	quotationNoArr:[]

  };

  searchParams: any = {
        'paginationRequest.count':10,
        'paginationRequest.position':1,   
  };

  passDataQuoteLOV : any = {
		tableData	: [],
		tHeader		: ["Quotation No.", "Ceding Company", "Insured", "Risk"],
	  	sortKeys:['QUOTATION_NO','CEDING_NAME','INSURED_DESC','RISK_NAME'],
		dataTypes	: ["text","text","text","text"],
		pageLength	: 10,
		resizable	: [false,false,false,false],
		tableOnly	: false,
		keys		: ['quotationNo','cedingName','insuredDesc','riskName'],
		pageStatus	: true,
		pagination	: true,
		colSize		: ['', '250px', '250px', '250px'],
		filters: [
			{key: 'quotationNo', title: 'Quotation No.',dataType: 'text'},
			{key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
			{key: 'insuredDesc',title: 'Insured',dataType: 'text'},
			{key: 'riskName',title: 'Risk',dataType: 'text'},
		]
	};

  completeSearch:boolean = false;

  passData : any = {
    tableData: [],
    dataTypes: ['text', 'text'],
    tHeader: ['File Name', 'Description', 'Action'],
    nData :{
    	fileName:'',
    	description:''
    },
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
    keys:['fileName','description'],
    disableAdd:true
  };

  @ViewChild('quoteMdl') quoteMdl: ModalComponent;
  @ViewChild(LoadingTableComponent) quoteTable: LoadingTableComponent;
  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;

  filesList: any[] = [];

  dialogMessage:string;
  dialogIcon:string;
  @ViewChild(SucessDialogComponent) successDiag :SucessDialogComponent; 
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;

  cancelFlag:boolean;

  constructor(private qs: QuotationService, private upload: UploadService, private ns: NotesService) { } 

  ngOnInit() {
  }

  search(key,ev) {
  		this.quoteInfo.quotationNoArr[0] =  (this.quoteInfo.quotationNoArr[0] == undefined || this.quoteInfo.quotationNoArr[0] == '')?'':this.quoteInfo.quotationNoArr[0];
  		this.quoteInfo.quotationNoArr[1] =  (this.quoteInfo.quotationNoArr[1] == undefined || this.quoteInfo.quotationNoArr[1] == '')?'':this.quoteInfo.quotationNoArr[1];
		this.quoteInfo.quotationNoArr[2] =  (this.quoteInfo.quotationNoArr[2] == undefined || this.quoteInfo.quotationNoArr[2] == '')?'':this.quoteInfo.quotationNoArr[2].padStart(5,'0');
		this.quoteInfo.quotationNoArr[3] =  (this.quoteInfo.quotationNoArr[3] == undefined || this.quoteInfo.quotationNoArr[3] == '')?'':this.quoteInfo.quotationNoArr[3].padStart(2,'0');
		this.quoteInfo.quotationNoArr[4] =  (this.quoteInfo.quotationNoArr[4] == undefined || this.quoteInfo.quotationNoArr[4] == '')?'':this.quoteInfo.quotationNoArr[4].padStart(3,'0');
		
		this.searchParams.quotationNo = this.quoteInfo.quotationNoArr.map(a=>a.toUpperCase()).join('%-%');
		this.passDataQuoteLOV.filters[0].search = this.searchParams.quotationNo;
    	this.passDataQuoteLOV.filters[0].enabled =true;

		if(this.quoteInfo.quotationNoArr.includes('')) {
			//this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
			this.completeSearch = false;
			this.quoteInfo  = {
				quotationNo 	: '',
				quotationNoArr  : this.quoteInfo.quotationNoArr,
				cedingName		: '',
				insuredDesc		: '',
				riskName		: '',
				totalSi			: '',
				status			: ''
			};
		}else{
			this.completeSearch = true;
			
			this.getQuoteList();
		}


		
	}


	getQuoteList(){
		this.qs.newGetQuoProcessingData(this.searchParams).subscribe(a=>{
			this.passDataQuoteLOV.count = a['length'];
			this.quoteTable.placeData(a['quotationList'].map(i => 
					{ 
						i.riskName = (i.project == null || i.project == undefined)?'':i.project.riskName;
					  	return i;
					}
				)
			); 
			if(a['quotationList'].length == 1 && this.completeSearch){
				this.quoteInfo = a['quotationList'][0];
				this.quoteInfo.quotationNoArr = this.quoteInfo.quotationNo.split('-');
				this.getAttachment();
			}else if(a['quotationList'].length == 0 && this.completeSearch){
				this.searchParams = {
										'paginationRequest.count':10,
				        				'paginationRequest.position':1,   
				        			};
    			this.completeSearch = false;
    			this.showQuoteLov();
			}
		});
	}

	showQuoteLov(){
		this.quoteMdl.openNoClose();
		this.getQuoteList();
	}

	searchQuery(searchParams){
		for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }
        this.completeSearch = false;
		this.getQuoteList();
	}

	onClickOkQuoteLov(){
		this.quoteInfo = this.quoteTable.indvSelect;
		this.quoteInfo.quotationNoArr = this.quoteInfo.quotationNo.split('-');
		this.quoteMdl.closeModal();
		this.getAttachment();
		console.log(this.quoteInfo)
	}


	// ATTACHMENT LAND

  getAttachment(){
    this.passData.tableData = [];
    this.passData.disableAdd = false;
    this.qs.getAttachment(this.quoteInfo.quoteId, null)
      .subscribe(data => {
        this.passData.tableData = data['quotation'][0].attachmentsList.map(i=>{
        	i.fileNameServer = i.fileName;
        	i.module = 'quotation';
        	i.refId = this.quoteInfo.quoteId;
        	return i;
        });
    	this.table.refreshTable();
  	});
  }

  uploads(event){
	  this.filesList = event;
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
        this.confirmSave.confirmModal();
      }
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

    onSaveAttachment(cancelFlag?){
      this.dialogIcon = '';
      this.dialogMessage = '';
      this.cancelFlag = cancelFlag !== undefined;
      let savedData = [];
      let deletedData = [];
      for (var i = 0 ; this.passData.tableData.length > i; i++) {
        if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
            savedData.push(this.passData.tableData[i]);
            savedData[savedData.length-1].createDate = this.ns.toDateTimeString(0);
            savedData[savedData.length-1].createUser = JSON.parse(window.localStorage.currentUser).username;
            savedData[savedData.length-1].updateDate = this.ns.toDateTimeString(0);
            savedData[savedData.length-1].updateUser = JSON.parse(window.localStorage.currentUser).username;
        }
        else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
           deletedData.push(this.passData.tableData[i]);
           deletedData[deletedData.length-1].createDate = this.ns.toDateTimeString(0);
           deletedData[deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
        }

      }

      let params: any = {
        deleteAttachmentsList: deletedData,
        saveAttachmentsList: savedData,
        quoteId: this.quoteInfo.quoteId
      }

      this.qs.saveQuoteAttachment(JSON.stringify(params))
        .subscribe((data: any) => {
          console.log(data);
          if(data.returnCode === 0){
            this.cancelFlag = false;
            this.dialogIcon = 'error';
            this.successDiag.open();
            console.log(this.cancelFlag);
          }else{
            this.dialogIcon = 'success';
            this.successDiag.open();
            if(data.uploadDate != null){
              this.uploadMethod(data.uploadDate);
            }
            if(deletedData.length !== 0){
              this.deleteFileMethod();
            }
            this.getAttachment();
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
        this.upload.uploadFile(file, date, 'quotation', this.quoteInfo.quoteId)
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
     let deleteFile = [];
     for(var i of deleteFile){
       console.log(i.fileNameServer);
       this.upload.deleteFile(i.fileNameServer, 'quotation', this.quoteInfo.quoteId).subscribe(
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


}
