import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService, NotesService, AuthenticationService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

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

	private sub: any;
	private currentUser: string = JSON.parse(window.localStorage.currentUser).username;

	loading: boolean = false;

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
		activeTag: '',
		govtTag: '',
		oldCedingId: '',
		membershipTag: '',
		membershipDate: '',
		terminationDate: '',
		inactiveDate: '',
		remarks: '',
		createUser: '',
		createDate: '',
		updateUser: '',
		updateDate: ''
	};

	repData: any = {
		tableData: [],
		tHeader: ['Default', 'Designation', 'First Name', 'M.I.', 'Last Name', 'Position', 'Department', 'Contact No', 'E-Signature'],
		dataTypes: ['checkbox', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'],
		keys: ['defaultTag', 'designation', 'firstName', 'middleInitial', 'lastName', 'position', 'department', 'contactNo', 'eSignature'],
		nData: {
			designation: '',
			firstName: '',
			middleInitial: '',
			lastName: '',
			position: '',
			department: '',
			contactNo: '',
			eSignature: ''
		},
		searchFlag: true,
		addFlag: true,
		genericBtn: 'Delete',
		infoFlag: true,
		paginateFlag: true,
		pageLength: 5,
		pageID: 'cedingRepTable'
	}

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, 
  	          private titleService: Title, private router: Router,private mtnService: MaintenanceService,
  	          private modalService: NgbModal, private ns: NotesService ) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params =>{
  		console.log(params);
  		if(params.info === undefined){
  			this.loading = true;
  			this.retrieveMtnCedingCompanyMethod(params.cedingId);
  		}
  	});
  }

  retrieveMtnCedingCompanyMethod(cedingId: string){
  		this.mtnService.getCedingCompany(cedingId).subscribe((data: any)=>{
  			data.cedingCompany[0].membershipDate = data.cedingCompany[0].membershipDate === null ? '' : data.cedingCompany[0].membershipDate;
  			data.cedingCompany[0].terminationDate = data.cedingCompany[0].terminationDate === null ? '' : data.cedingCompany[0].terminationDate;
  			data.cedingCompany[0].inactiveDate = data.cedingCompany[0].inactiveDate === null ? '' : data.cedingCompany[0].inactiveDate;
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

  onClickSave(){

  }

  onClickCancel(){
  	this.cancelBtn.clickCancel();
  }

  onRowClick(data){
  	console.log(data);
  }

  onClickAdd(event){

  }

  onClickDelete(event){

  }


}
