import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { UserService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-users',
  templateUrl: './mtn-users.component.html',
  styleUrls: ['./mtn-users.component.css']
})
export class MtnUsersComponent implements OnInit {

selected: any = null;

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
  
  constructor(private userService: UserService, private modalService: NgbModal) { }

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
  }

  onRowClick(data){
    if(Object.is(this.selected, data)){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  confirm(){
  	this.selectedData.emit(this.selected);
    this.usersListing.tableData = [];
    this.table.refreshTable();
  }

  cancel(){
    this.usersListing.tableData = [];
    this.table.refreshTable();
  }

  openModal(){
      /*for(var j = 0; j < this.passDataAttention.tableData.length; j++){
        this.passDataAttention.tableData.pop();
      }*/
      setTimeout(()=>{    //<<<---    using ()=> syntax
           this.userService.retMtnUsers('').subscribe((data: any) =>{
                 for(var i = 0; i < data.usersList.length; i++){
                 	this.usersListing.tableData.push(data.usersList[i]);
                 }
                 this.table.refreshTable();
               });
                 this.modalOpen = true;
       }, 100);
      
  }

  checkCode(code) {
    if(code.trim() === ''){
      this.selectedData.emit({
        currencyCd: '',
        currencyRt: ''
      });
    } else {
      this.userService.retMtnUsers('').subscribe(data => {
        if(data['currency'].length > 0) {
          this.selectedData.emit(data['currency'][0]);
        } else {
          this.selectedData.emit({
            currencyCd: '',
            currencyRt: ''
          });

          $('#usersMdl > #modalBtn').trigger('click');
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