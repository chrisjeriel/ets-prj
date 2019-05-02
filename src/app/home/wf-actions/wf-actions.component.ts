import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, UserService } from '../../_services';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-wf-actions',
  templateUrl: './wf-actions.component.html',
  styleUrls: ['./wf-actions.component.css']
})
export class WfActionsComponent implements OnInit {
  @ViewChild('content') contentMdl : any;
  @ViewChild(MtnUsersComponent) usersLov: MtnUsersComponent;
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  content: any ;
  disablebtnBool: boolean;
  disableAssignTo: boolean;
  disableAssignToMany: boolean;
  reminderValue: any;
  dialogIcon:string  = "";
  dialogMessage:string  = "";

  userInfo:any = {
	userId: null,
	userName: null
  }

  createInfo:any = {
	createdBy: null,
	dateCreated: null
  }

  updateInfo: any = {
  	updatedBy: null,
  	lastUpdate: null
  }
   
  userInfoToMany: string;
  selected: any = null;
  selects: any[] = [];

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
    pageID: 'usersToManyMdl',
    colSize: ['100px', '250px'],
    keys:['userId','userName'],
    checkFlag: true
  };

  constructor(config: NgbModalConfig,
     private modalService: NgbModal,
     private ns: NotesService,
     private userService: UserService){ }

ngOnInit() {

}

open(content) {
    this.radioBtnChange(this.reminderValue);
    this.createInfo.createdBy = JSON.parse(window.localStorage.currentUser).username;
    this.createInfo.dateCreated = this.ns.toDateTimeString(0);
    this.updateInfo.updatedBy = JSON.parse(window.localStorage.currentUser).username;
    this.updateInfo.lastUpdate = this.ns.toDateTimeString(0);
    this.content = content;
    this.modalService.open(this.content, { centered: true , windowClass : 'modal-size'} );
}

openModal(){
	  this.usersListing.tableData = [];
	  this.table.refreshTable('first');
      setTimeout(()=>{    //<<<---    using ()=> syntax
           this.userService.retMtnUsers('').pipe(
           finalize(() => this.setCheckRecords() )
           ).subscribe((data: any) =>{
                 for(var i = 0; i < data.usersList.length; i++){
                 	this.usersListing.tableData.push(data.usersList[i]);
                 }
                 this.table.refreshTable();
               });
       }, 100);
}

setCheckRecords(){
	
	if(this.isEmptyObject(this.userInfoToMany)){
	}else{
	    var array = this.userInfoToMany.split(",");
	}
       for( var j = 0; j < array.length; j ++){
       	   for(var i = 0; i < this.usersListing.tableData.length; i++){
		      if(array[j] === this.usersListing.tableData[i].userId){
	       	   this.usersListing.tableData[i].checked = true;
	       	  }
           }  
       }
    

}

cancel(){
    this.usersListing.tableData = [];
    this.table.refreshTable();
    this.open(this.contentMdl);
}

confirm(){
	  this.selects = [];
      for(var i = 0; i < this.usersListing.tableData.length; i++){
        if(this.usersListing.tableData[i].checked){
          this.selects.push(this.usersListing.tableData[i]);
        }
      }

    if (this.selects.length === 0 || this.selects.length === 1 ){
    	this.dialogIcon = "error-message";
        this.dialogMessage = "Please select at least 2 users";
        this.successDiag.open();
    }else {
    var records = this.selects;
	var temp: string = "";
		for(let rec of records){
			temp = rec.userId + "," + temp; 
		}
	this.userInfoToMany = temp;
	this.open(this.contentMdl);
    }

    
 }


radioBtnChange(obj){
	if (this.isEmptyObject(obj)){
		this.clear('disable');
	} else {
		switch (obj) {
			case '1': {
				this.clear('enable');
				break;
			}
			case '2': {
				this.disableAssignTo = false;
		        this.disableAssignToMany = true;
                break; 
			}
			case '3': {
				this.disableAssignTo = true;
		        this.disableAssignToMany = false;
		        break; 
			}
			case '4': {
				this.clear('enable');
				break;
			}
			default:
				// code...
				break;
		}
	}
}

handleRadioBtnChange(event){
   	this.disablebtnBool = false;
   	switch(event.target.value) { 
   		case '1': { 
        this.reminderValue = '1';
        this.clear('enable');
        $('#searchicon').removeClass('fa-spinner fa-spin')
        $('#search').css('pointer-events', 'initial');
        break; 
        } 
        case '2': { 
        this.reminderValue = '2';
        this.disableAssignTo = false;
        this.disableAssignToMany = true;
        break; 
        } 
        case '3': { 
        this.reminderValue = '3';
        this.disableAssignTo = true;
        this.disableAssignToMany = false;
        $('#searchicon').removeClass('fa-spinner fa-spin')
        $('#search').css('pointer-events', 'initial');
        break; 
        } 
        case '4': { 
        this.reminderValue = '4';
        this.clear('enable');
        $('#searchicon').removeClass('fa-spinner fa-spin')
        $('#search').css('pointer-events', 'initial');
        break;
        } 
         default: { 
        //statements; 
        break; 
        } 
    }
}

cancelReminder(){
   this.radioBtnChange(this.reminderValue);
}

clear(obj){
    this.disableAssignTo = true;
  	this.disableAssignToMany = true;
  	if (obj == 'disable'){
  		this.disablebtnBool = true;
    } else {
    	this.disablebtnBool = false;
    }
}

showUsersLOV(obj){
	if(parseInt(obj) === 0){
	  $('#usersToManyMdl #modalBtn').trigger('click');
      $('#usersToManyMdl #modalBtn').addClass('ng-dirty');
	} else if (parseInt(obj) === 1) {
	  $('#usersLOV #modalBtn').trigger('click');
	  $('#usersLOV #modalBtn').addClass('ng-dirty');
	}
}	

setPreparedBy(event){
	this.userInfo.userId = event.userId;
	this.userInfo.userName = event.userName;

    this.modalService.dismissAll();
	this.open(this.contentMdl);
}

isEmptyObject(obj) {
    for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
    }
    return true;
}

checkCode(ev) {
    this.ns.lovLoader(ev, 1);
    $(ev.target).addClass('ng-dirty');
    var userId = this.userInfo.userId;
    this.userInfo = [];
  	this.usersLov.checkCode(userId, ev);		
}


}
