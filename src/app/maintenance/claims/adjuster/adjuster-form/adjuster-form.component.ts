import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService, NotesService, AuthenticationService, UploadService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-adjuster-form',
  templateUrl: './adjuster-form.component.html',
  styleUrls: ['./adjuster-form.component.css']
})
export class AdjusterFormComponent implements OnInit, OnDestroy {

  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
	@ViewChild(ConfirmSaveComponent) confirm: ConfirmSaveComponent;
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild('myForm') form : any;

	private sub: any;
	private currentUser: string = JSON.parse(window.localStorage.currentUser).username;

	savedData: any[] = [];
	deletedData: any[] = [];
	filesList: any [] = [];

	acceptFileFormats: string[] = [
		'image/jpeg', 'image/png', 'image/jpg', 'image/gif'
	];

	loading: boolean = false;
	cancelFlag: boolean = false;

	dialogIcon: string = '';
	dialogMessage: string = '';
	defaultTagCounter: number = 0;

	selected: any;

	adjData: any = {
		adjId: '',
		adjName: '',
		adjRefNo: '',
		addrLine1: '',
		addrLine2: '',
		addrLine3: '',
		fullAddress: '',
		zipCd: '',
		contactNo: '',
		emailAdd: '',
		activeTag: '',
		remarks: '',
		createUser: '',
		createDate: '',
		updateUser: '',
		updateDate: '',
	};

	repData: any = {
		tableData: [],
		tHeader: ['Default', 'Designation', 'First Name', 'M.I.', 'Last Name', 'Position', 'Department', 'Contact No', 'Email Address'],
		dataTypes: ['checkbox', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'],
		keys: ['defaultTag', 'designation', 'firstName', 'middleInitial', 'lastName', 'position', 'department', 'contactNo', 'emailAdd'],
		nData: {
			adjId: '',
			adjRepId: '',
			designation: '',
			firstName: '',
			middleInitial: '',
			lastName: '',
			defaultTag: 'N',
			position: '',
			department: '',
			contactNo: '',
			emailAdd: ''
		},
		searchFlag: true,
		addFlag: true,
		genericBtn: 'Delete',
		infoFlag: true,
		paginateFlag: true,
		pageLength: 5,
		pageID: 'adjRepTable'
	}

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, 
  	          private titleService: Title, private router: Router,private mtnService: MaintenanceService,
  	          private modalService: NgbModal, private ns: NotesService, private upload: UploadService ) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params =>{
  		//if edit
  		if(params.info === undefined){
  			this.loading = true;
  			this.retrieveMtnAdjuster(params.adjId);
  		}
  	});
    this.repData.disableGeneric = true;
  }

  retrieveMtnAdjuster(adjId: string){
  		this.mtnService.getMtnAdjRepresentative(adjId).subscribe((data: any)=>{
  			this.adjData = data.adjuster;
  			console.log(this.adjData);
  			this.repData.tableData = this.adjData.adjRepresentative;
  			this.table.refreshTable();
  			this.loading = false;
  		});
  }

  ngOnDestroy(){
  	this.sub.unsubscribe();
  }

  onClickSave(){
  	if(!this.checkParams()){
  		this.dialogIcon = 'info';
  		this.dialogMessage = 'Please fill all required fields.';
  		this.successDiag.open();
  	}else if(!this.checkDefaultTag()){
  		this.dialogIcon = 'info';
  		this.dialogMessage = 'Please enter one default company representative.';
  		this.successDiag.open();
  	}else{
  		$('#confirm-save #modalBtn2').trigger('click');
  	}
  }

  checkParams(){
  	//check if mandatory fields are filled on table
  	this.defaultTagCounter = 0;
  	for(var i of this.repData.tableData){
  		if(i.firstName === '' || i.lastName === ''){
  			return false;
  		}
  		//check if theres only 1 default tag in adj rep table
  		else if(i.defaultTag === 'Y'){
  			this.defaultTagCounter += 1;
  		}
  	}

  	//check if mandatory fields are filled on form
  	if(this.adjData.adjName.length === 0 || this.adjData.addrLine1.length === 0 ){
  		return false;
  	}

  	return true;

  }

  checkDefaultTag(){
  	//results of checking if theres only 1 default tag
  	if(this.defaultTagCounter !== 1){
  		return false;
  	}else{
  		return true;
  	}
  }

  /*checkToUploadFiles(){
  	//validation for uploaded files or in this case, "images"
  	for(var i of this.repData.tableData){
  		if(!this.acceptFileFormats.includes(i[0].type)){
  			this.invalidFileFlag = true;
  			for(var j = 0; j < this.repData.tableData.length; j++){
  				if(this.repData.tableData[j].fileName == i[0].name){
  					this.repData.tableData[j].fileName = '';
  					break;
  				}
  			}
  			this.filesList.splice(this.filesList.indexOf(i));
  			this.dialogIcon = 'info';
  			this.dialogMessage = 'File ' + i[0].name + ' is not a valid image.';
  			this.successDiag.open();
  			return false;
  		}
  	}
  	return true;
  }*/

  save(cancelFlag?){
  	this.cancelFlag = cancelFlag !== undefined;
  	this.savedData = [];
  	this.deletedData = [];
  	//setting up ceding rep updates
  	for (var i = 0 ; this.repData.tableData.length > i; i++) {
  	  if(this.repData.tableData[i].edited && !this.repData.tableData[i].deleted){
  	  	  this.repData.tableData[i].eSignature = this.repData.tableData[i].fileName;
  	      this.savedData.push(this.repData.tableData[i]);
  	      this.savedData[this.savedData.length-1].adjId = this.savedData[this.savedData.length-1].adjId === '' ? this.adjData.adjId : this.savedData[this.savedData.length-1].adjId;
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = this.currentUser;
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = this.currentUser;
  	  }
  	  else if(this.repData.tableData[i].edited && this.repData.tableData[i].deleted){
  	      this.deletedData.push(this.repData.tableData[i]);
  	      this.deletedData[this.deletedData.length-1].adjId = this.deletedData[this.deletedData.length-1].adjId === '' ? this.adjData.adjId : this.deletedData[this.deletedData.length-1].adjId;
  	      this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	  }
  	}
  	//seting up adj updates
  	this.adjData.activeTag = this.adjData.activeTag === '' || this.adjData.activeTag === 'N' ? 'N' : 'Y';
  	this.adjData.createUser = this.currentUser;
  	this.adjData.createDate = this.ns.toDateTimeString(0);
  	this.adjData.updateUser = this.currentUser;
  	this.adjData.updateDate = this.ns.toDateTimeString(0);

  	//setting up params for web service request
  	let params: any = this.adjData;
  	params.delAdjRepList = this.deletedData;
  	params.saveAdjRepList = this.savedData;

  	console.log(params);
  	//saving updates
  	this.mtnService.saveMtnAdjuster(JSON.stringify(params)).subscribe((data: any)=>{
  		console.log(data);
  		if(data.returnCode === 0){
        if(this.cancelFlag){
          this.cancelFlag = false;
        }
  			this.dialogIcon = 'error';
  			this.successDiag.open();
  		}else{
  			this.adjData.adjId = data.outAdjId;
  			this.retrieveMtnAdjuster(data.outAdjId);
  			this.form.control.markAsPristine();
  			this.table.markAsPristine();
  			this.dialogIcon = '';
  			this.successDiag.open();
  		}
  	});

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

  }

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  onRowClick(data){
    if(data !== null){
  	  this.selected = data;
      this.repData.disableGeneric = false;
    }else{
      this.repData.disableGeneric = true;
    }
  }

  onClickAdd(event){

  }

  onClickDelete(event){
  	this.table.selected = [this.table.indvSelect];
  	if(this.table.selected[0].defaultTag === 'Y'){
  		this.dialogIcon = 'info';
  		this.dialogMessage = 'Unable to delete adjuster representative tagged as default.';
  		this.successDiag.open();
  	}else{
  		this.table.confirmDelete();
  	}
  }

  uploads(event){
    this.filesList = event;
  }


}
