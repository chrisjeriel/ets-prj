import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UserService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { finalize } from 'rxjs/operators';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-approver',
  templateUrl: './mtn-approver.component.html',
  styleUrls: ['./mtn-approver.component.css']
})
export class MtnApproverComponent implements OnInit {
@ViewChild('userModal') modal: ModalComponent;
@Output() cancelMdl: EventEmitter<any> = new EventEmitter();
selected: any = null;
@Input() hide:string[] = [];
  usersListing: any = {
    tableData: [],
    tHeader: ['User ID', 'User Name'],
    dataTypes: ['text', 'text'],
    filters: [
	    {
	    	key: 'userId',
	    	title: 'User Id',
	    	dataType: 'text',
	    },
	    {
	    	key: 'userName',
	    	title: 'User Name',
	    	dataType: 'text',
	    },
    ],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    pageID: 'usersLov',
    colSize: ['100px', '250px'],
    keys:['userId','userName']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  modalOpen: boolean = false;

  searchParams: any[] = [];

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];
  
  constructor(private userService: UserService, private modalService: NgbModal, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
  	/*this.maintenanceService.getMtnCurrency().subscribe((data: any) =>{
  		for(var currencyCount = 0; currencyCount < data.currency.length; currencyCount++){
  			this.currencyListing.tableData.push(
  				new Row(data.currency[currencyCount].currencyCd, 
  						data.currency[currencyCount].currencyAbbr,
  						data.currency[currencyCount].currencyWord,
  						data.currency[currencyCount].currencyRt,
  						data.currency[currencyCount].currencyDesc)
  			);  		
  		}
  		this.table.refreshTable();
  	});*/
    if(this.lovCheckBox){
      this.usersListing.checkFlag = true;
    }
  }

  onRowClick(data){
    // if(Object.is(this.selected, data)){
    if(Object.entries(data).length === 0 && data.constructor === Object){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  confirm(){
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
      this.usersListing.tableData = [];
      this.table.refreshTable('');
      this.selected = null;
    }
    else{
      for(var i = 0; i < this.usersListing.tableData.length; i++){
        if(this.usersListing.tableData[i].checked){
          this.selects.push(this.usersListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  cancel(){
    this.usersListing.tableData = [];
    this.table.refreshTable();
  }

  cancelClicked(event) {
       this.cancelMdl.next(event);
   }


  openModal(){
      /*for(var j = 0; j < this.passDataAttention.tableData.length; j++){
        this.passDataAttention.tableData.pop();
      }*/
      /*setTimeout(()=>{    //<<<---    using ()=> syntax
           this.userService.retMtnUsers('').subscribe((data: any) =>{
                 for(var i = 0; i < data.usersList.length; i++){
                   if(this.hide.indexOf(data.usersList[i].userId)== -1){
                     this.usersListing.tableData.push(data.usersList[i]);
                   }
                 }
                 this.table.refreshTable();
               });
                 this.modalOpen = true;
       }, 100);*/
      
      this.maintenanceService.getMtnApprover().subscribe((data:any) => {
      	for(var i = 0; i < data.approverList.length; i++){
                   if(this.hide.indexOf(data.approverList[i].userId)== -1){
                     this.usersListing.tableData.push(data.approverList[i]);
                   }
                 }
                 this.table.refreshTable();
      });
      	this.modalOpen = true;
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        userId: '',
        userName:'',
        ev: ev,
        singleSearchLov: true
      });
    } else {
      this.maintenanceService.getMtnApprover(code).subscribe((data:any) => {
        console.log(data)
      		//data['approverList'] = data['approverList'].filter(a=> this.hide.indexOf(a.userId) == -1)
      		if(data['approverList'].length > 0) {
      		  data['approverList'][0]['ev'] = ev;
      		  data['approverList'][0]['singleSearchLov'] = true;
      		  this.selectedData.emit(data['approverList'][0]);
      		} else {
      		  //data['approverList'] = data['approverList'].filter((a)=>{return ev.filter.indexOf(a.userId)==-1});
      		  this.selectedData.emit({
      		    userId: '',
      		    userName:'',
      		    ev: ev,
      		    singleSearchLov: true
      		  });
      		  //$('#usersMdl > #modalBtn').trigger('click');
      		  this.modal.openNoClose();
      		  //this.table.refreshTable('');
      		}
      });
   }
  }
  //Method for DB query
  searchQuery(searchParams){
      this.searchParams = searchParams;
      this.usersListing.tableData = [];
      this.openModal();
  }
}

class Row{
	activeTag: string;
	createDate: Date;
	createUser: string;
	emailAddress: string;
	invalidLoginTries: number;
	lastLogin: Date;
	password: string;
	passwordResetDate: Date;
	remarks: string;
	salt: string;
	updateDate: Date;
	updateUser: string;
	userGrp: number;
	userGrpDesc: string;
	userId: string;
	userName: string;

	constructor(activeTag: string,
				createDate: Date,
				createUser: string,
				emailAddress: string,
				invalidLoginTries: number,
				lastLogin: Date,
				password: string,
				passwordResetDate: Date,
				remarks: string,
				salt: string,
				updateDate: Date,
				updateUser: string,
				userGrp: number,
				userGrpDesc: string,
				userId: string,
				userName: string){

			this.activeTag = activeTag;
			this.createDate = createDate;
			this.createUser = createUser;
			this.emailAddress = emailAddress;
			this.invalidLoginTries = invalidLoginTries;
			this.lastLogin = lastLogin;
			this.password = password;
			this.passwordResetDate = passwordResetDate;
			this.remarks = remarks;
			this.salt = salt;
			this.updateDate = updateDate;
			this.updateUser = updateUser;
			this.userGrp = userGrp;
			this.userGrpDesc = userGrpDesc;
			this.userId = userId;
			this.userName = userName;
	}
}
