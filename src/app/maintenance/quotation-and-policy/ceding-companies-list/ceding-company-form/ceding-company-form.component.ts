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
  selector: 'app-ceding-company-form',
  templateUrl: './ceding-company-form.component.html',
  styleUrls: ['./ceding-company-form.component.css']
})
export class CedingCompanyFormComponent implements OnInit, OnDestroy {

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

	companyData: any = {
		cedingId : '',
		cedingName: '',
		cedingAbbr: '',
		addrLine1: '',
		addrLine2: '',
		addrLine3: '',
		zipCd: '',
		address: '',
		contactNo: '',
		emailAdd: '',
		tinNo: '',
		bussTypeId: '',
		activeTag: 'Y',
		govtTag: '',
		oldCedingId: '',
		membershipTag: 'N',
		membershipDate: '',
		withdrawDate: '',
		inactiveDate: '',
    treatyTag: 'N',
    withdrawTag: 'N',
		remarks: '',
		createUser: '',
		createDate: '',
		updateUser: '',
		updateDate: ''
	};

	repData: any = {
		tableData: [],
		tHeader: ['Default', 'Designation', 'First Name', 'M.I.', 'Last Name', 'Position', 'Department', 'Contact No', 'E-Signature'],
		dataTypes: ['checkbox', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'file'],
		keys: ['defaultTag', 'designation', 'firstName', 'middleInitial', 'lastName', 'position', 'department', 'contactNo', 'eSignature'],
		nData: {
			cedingId: '',
			cedingRepId: '',
			designation: '',
			firstName: '',
			middleInitial: '',
			lastName: '',
			defaultTag: 'N',
			position: '',
			department: '',
			contactNo: '',
			emailAdd: '',
			eSignature: ''
		},
		searchFlag: true,
		addFlag: true,
		genericBtn: 'Delete',
		infoFlag: true,
		paginateFlag: true,
		pageLength: 5,
		pageID: 'cedingRepTable',
		restrict: 'image',
    disableGeneric: true,
	}

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, 
  	          private titleService: Title, private router: Router,private mtnService: MaintenanceService,
  	          private modalService: NgbModal, private ns: NotesService, private upload: UploadService ) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params =>{
  		//if edit
  		if(params.info === undefined){
  			this.loading = true;
  			this.retrieveMtnCedingCompanyMethod(params.cedingId);
  		}
  	});
  }

  retrieveMtnCedingCompanyMethod(cedingId: string){
  		this.mtnService.getCedingCompany(cedingId).subscribe((data: any)=>{
  			data.cedingCompany[0].membershipDate = data.cedingCompany[0].membershipDate === null ? '' : this.ns.toDateTimeString(data.cedingCompany[0].membershipDate);
  			data.cedingCompany[0].withdrawDate = data.cedingCompany[0].withdrawDate === null ? '' : this.ns.toDateTimeString(data.cedingCompany[0].withdrawDate);
  			data.cedingCompany[0].inactiveDate = data.cedingCompany[0].inactiveDate === null ? '' : this.ns.toDateTimeString(data.cedingCompany[0].inactiveDate);
  			//put eSignature to filename for the table to recognize it
  			for(var i = 0; i < data.cedingCompany[0].cedingRepresentative.length; i++){
  				data.cedingCompany[0].cedingRepresentative[i].fileName = data.cedingCompany[0].cedingRepresentative[i].eSignature;
          data.cedingCompany[0].cedingRepresentative[i].fileNameServer = this.ns.toDateTimeString(data.cedingCompany[0].cedingRepresentative[i].createDate).match(/\d+/g).join('') + data.cedingCompany[0].cedingRepresentative[i].eSignature;
  			}

  			this.companyData = data.cedingCompany[0];
  			console.log(this.companyData);
  			this.repData.tableData = this.companyData.cedingRepresentative;
  			this.table.refreshTable();
  			this.loading = false;
  		});
  }

  ngOnDestroy(){
  	this.sub.unsubscribe();
  }

  onClickSave(fromCancel?){
  	if(!this.checkParams()){
  		this.dialogIcon = 'error';
  		//this.dialogMessage = 'Please fill all required fields.';
  		this.successDiag.open();
  	}else if(!this.checkDefaultTag()){
  		this.dialogIcon = 'info';
  		this.dialogMessage = 'Unable to save the record, Only one default company representative is allowed.';
  		this.successDiag.open();
  	}else{
      if(fromCancel !== undefined){
        this.save('cancel');
      }else{
  		  $('#confirm-save #modalBtn2').trigger('click');
      }
  	}
  }

  checkParams(){
  	//check if mandatory fields are filled on table
  	this.defaultTagCounter = 0;
  	for(var i of this.repData.tableData){
      console.log(i.deleted);
  		if((i.firstName === '' || i.lastName === '') && (i.deleted !== undefined && !i.deleted)){
  			return false;
  		}
  		//check if theres only 1 default tag in ceding rep table
  		else if(i.defaultTag === 'Y'){
  			this.defaultTagCounter += 1;
  		}
  	}

  	//check if mandatory fields are filled on form
  	if(this.companyData.cedingName.length === 0 || this.companyData.cedingAbbr.length === 0 || this.companyData.addrLine1.length === 0 ||
       (this.companyData.membershipTag === 'Y' && this.companyData.membershipDate.length === 0) ||
       (this.companyData.activeTag === 'N' && this.companyData.inactiveDate.length === 0) ||
       (this.companyData.withdrawTag === 'Y' && this.companyData.withdrawDate.length === 0)){
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
  	      this.savedData[this.savedData.length-1].cedingId = this.savedData[this.savedData.length-1].cedingId === '' ? this.companyData.cedingId : this.savedData[this.savedData.length-1].cedingId;
  	      this.savedData[this.savedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].createUser = this.currentUser;
  	      this.savedData[this.savedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	      this.savedData[this.savedData.length-1].updateUser = this.currentUser;
  	  }
  	  else if(this.repData.tableData[i].edited && this.repData.tableData[i].deleted){
  	      this.deletedData.push(this.repData.tableData[i]);
  	      this.deletedData[this.deletedData.length-1].cedingId = this.deletedData[this.deletedData.length-1].cedingId === '' ? this.companyData.cedingId : this.deletedData[this.deletedData.length-1].cedingId;
  	      this.deletedData[this.deletedData.length-1].createDate = this.ns.toDateTimeString(0);
  	      this.deletedData[this.deletedData.length-1].updateDate = this.ns.toDateTimeString(0);
  	  }
  	}
  	//seting up ceding comp updates
  	this.companyData.membershipTag = this.companyData.membershipTag === '' || this.companyData.membershipTag === 'N' ? 'N' : 'Y';
    this.companyData.treatyTag = this.companyData.treatyTag === '' || this.companyData.treatyTag === 'N' ? 'N' : 'Y';
  	this.companyData.govtTag = this.companyData.govtTag === '' || this.companyData.govtTag === 'N'? 'N' : 'Y';
  	this.companyData.activeTag = this.companyData.activeTag === '' || this.companyData.activeTag === 'N' ? 'N' : 'Y';
  	this.companyData.createUser = this.currentUser;
  	this.companyData.createDate = this.ns.toDateTimeString(0);
  	this.companyData.updateUser = this.currentUser;
  	this.companyData.updateDate = this.ns.toDateTimeString(0);

  	//setting up params for web service request
  	let params: any = this.companyData;
  	params.delCedingRepList = this.deletedData;
  	params.saveCedingRepList = this.savedData;

  	console.log(params);
  	//saving updates
  	this.mtnService.saveMtnCedingCompany(JSON.stringify(params)).subscribe((data: any)=>{
  		console.log(data);
  		if(data.returnCode === 0){
        if(this.cancelFlag){
          this.cancelFlag = false;
        }
  			this.dialogIcon = 'error';
  			this.successDiag.open();
  		}else{
        if(data.uploadDate != null){
          this.uploadMethod(data.uploadDate);
        }
        if(this.deletedData.length !== 0){
          this.deleteFileMethod();
        }
  			this.companyData.cedingId = data.outCedingId;
  			this.retrieveMtnCedingCompanyMethod(data.outCedingId);
  			this.form.control.markAsPristine();
  			this.table.markAsPristine();
  			this.dialogIcon = '';
  			this.successDiag.open();
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
  		this.dialogMessage = 'Unable to delete company representative tagged as default.';
  		this.successDiag.open();
  	}else{
  		this.table.confirmDelete();
  	}
  }

  uploads(event){
    this.filesList = event;
  }


}
