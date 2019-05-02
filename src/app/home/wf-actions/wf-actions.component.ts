import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, UserService } from '../../_services';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { finalize } from 'rxjs/operators';
import { unHighlight, highlight, hideTooltip, showTooltip} from '@app/_directives/highlight';

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
  reminderDate: any;
  alarmDate: any;
  title: string = "";
  reminder: string = "";
  onOkVar: any;
  disableAlarmTime: boolean = true;

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
       ,
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
        this.onOkVar = "showUsersLOV";
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

saveReminder(){
	if (this.isEmptyObject(this.reminderDate) || this.isEmptyObject(this.reminder)){
		this.openErrorDiag();
	} else {
		console.log(this.reminderValue);

	    switch(this.reminderValue) { 
	   		case '1': { 
	   		
	        break; 
	        } 
	        case '2': { 
	          if (this.isEmptyObject(this.userInfo.userName)){
			   this.openErrorDiag();
			  } else {
			 	console.log("save");
			  }
	        break; 
	        } 
	        case '3': { 
	       	  if (this.isEmptyObject(this.userInfoToMany)){
			   this.openErrorDiag();
			  } else {
			 	console.log("save");
			  }
	        break; 
	        } 
	        case '4': { 
	        
	        break;
	        } 
	         default: { 
	        //statements; 
	        break; 
	        } 
	    }

    }
}

checkValidTime(event){
	console.log(event.target.value);
	if(this.isEmptyObject(event.target.value)){
    } else {
    	var reminderTime = this.toTimeString(Date.parse(this.reminderDate));	
		if(this.isEmptyObject(this.alarmDate)){
		} else {
		  this.setAlarmTime(reminderTime,this.alarmDate);
		}
    }
}


checkValidDate(event){
	if(this.isEmptyObject(event.target.value)){
		this.disableAlarmTime = true;
		this.alarmDate = null;
	}else {
		this.disableAlarmTime = false;
		var reminderTime = this.toTimeString(Date.parse(this.reminderDate));	    

		if(this.isEmptyObject(this.alarmDate)){
		} else {
		  this.setAlarmTime(reminderTime,this.alarmDate);
		}

	}
}


setAlarmTime(reminderTime: string, alarmTime: string){
  var arrayTime = reminderTime.split(':');
  var arrayAlarmTime = alarmTime.split(':');
  var endHour = new Date();
  var startHour = new Date();
  var alarmHour = new Date();
  startHour.setHours(0,0);
  endHour.setHours(parseInt(arrayTime[0]),parseInt(arrayTime[1]));
  alarmHour.setHours(parseInt(arrayAlarmTime[0]),parseInt(arrayAlarmTime[1]))

  if (alarmHour >= startHour && alarmHour <= endHour){
  } else {
  	console.log("Choose in between");
  }

}



toTimeString(millis: any) {
    var d = (millis == 0) ? new Date() : new Date(millis);

    function pad(num) {
      return (num < 10) ? '0' + num : num;
    }

    return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

openErrorDiag(){
		this.dialogIcon = "error-message";
        this.dialogMessage = "Please fill required fields";
        this.onOkVar = "openReminderMdl";
        this.successDiag.open();
}

onOkSuccessDiag(obj){
	if(obj === 'showUsersLOV'){
		this.showUsersLOV('0');
	}else if (obj === 'openReminderMdl'){
		console.log(this.alarmDate);
		this.modalService.dismissAll();
		this.open(this.content);
	}
}

prepareParam(){
    
       var savePolGenInfoParam = {
         "alarmTime"       : this.alarmDate,


       }

       console.log(savePolGenInfoParam);
/*       this.loading = true;*/
        

 
}

saveReminderParams(obj){

	  this.us.updatePolGenInfo(obj).subscribe(data => {
           console.log(data);
        /*     this.loading = false;*/
             if(data['returnCode'] === 0) {
                this.dialogIcon = 'error';
                this.dialogMessage = data['errorList'][0].errorMessage;
                $('#updatePolGenInfo #successModalBtn').trigger('click');
            } else if (data['returnCode'] === -1) {           
                this.dialogIcon = 'success-message';
                this.dialogMessage = "Successfully Saved";
                this.policyInfo.updateUser = JSON.parse(window.localStorage.currentUser).username;
                this.policyInfo.updateDate  = this.ns.toDateTimeString(0);
                $('#updatePolGenInfo #successModalBtn').trigger('click');
            }
          });
}











}
