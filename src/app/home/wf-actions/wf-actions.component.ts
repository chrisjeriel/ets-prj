import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, UserService, WorkFlowManagerService } from '../../_services';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { finalize } from 'rxjs/operators';
import { unHighlight, highlight, hideTooltip, showTooltip} from '@app/_directives/highlight';
import { WfRemindersComponent } from '@app/home/wf-reminders/wf-reminders.component';


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
  @ViewChild(WfRemindersComponent) wfReminders: WfRemindersComponent;

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
  loading: boolean = false;
  mode: boolean;
  notes: string = "";
  titleNote: string = "";

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

  resultReminder: any [] = [];
  resultNote: any [] = [];

  constructor(config: NgbModalConfig,
     private modalService: NgbModal,
     private ns: NotesService,
     private userService: UserService,
     private workFlowService: WorkFlowManagerService){ }

ngOnInit() {

}

open(content, mode : boolean) {
    this.radioBtnChange(this.reminderValue);
    this.createInfo.createdBy = JSON.parse(window.localStorage.currentUser).username;
    this.createInfo.dateCreated = this.ns.toDateTimeString(0);
    this.updateInfo.updatedBy = JSON.parse(window.localStorage.currentUser).username;
    this.updateInfo.lastUpdate = this.ns.toDateTimeString(0);
    this.content = content;

    if (mode){
      this.mode = true;
    } else{
      this.mode = false;
    }

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
    if (this.mode){
      this.open(this.contentMdl, true);
    } else {
      this.open(this.contentMdl, false);
    }
    
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
    	if (this.mode){
          this.open(this.contentMdl, true);
        } else {
          this.open(this.contentMdl, false);
      }
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
	if (this.mode){
          this.open(this.contentMdl, true);
        } else {
          this.open(this.contentMdl, false);
  }
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

saveReminderValidation(obj: boolean){

  if(obj){
    if (this.isEmptyObject(this.reminderDate) || this.isEmptyObject(this.reminder)){
      this.openErrorDiag();
    } else {
          var reminderTime = this.toTimeString(Date.parse(this.reminderDate));
          if (this.isEmptyObject(this.alarmDate)){
            this.resultReminder = [];
            this.saveReminder(this.reminderValue);
          }else {
             if(this.setAlarmTime(reminderTime,this.alarmDate)){
              this.resultReminder = [];
              this.saveReminder(this.reminderValue);
           }
          }
      }
  }else {
    if (this.isEmptyObject(this.notes)){
       this.openErrorDiag();
    } else {
       this.resultNote = [];
       this.saveNotes(this.reminderValue);
    }
  }

	
}


saveReminder(obj){
	switch(obj) { 
	   		case '1': { 
	   		   this.prepareParam(this.createInfo.createdBy,1);
	        break; 
	        } 
	        case '2': { 
	          if (this.isEmptyObject(this.userInfo.userName)){
    			   this.openErrorDiag();
    			  } else {
    			 	this.prepareParam(this.userInfo.userId,1);
    			  }
	        break; 
	        } 
	        case '3': { 
	       	  if (this.isEmptyObject(this.userInfoToMany)){
    			   this.openErrorDiag();
    			  } else {
            var array = this.userInfoToMany.split(',');
              for(let i=0;i<array.length-1 ;i++){ 
                  this.prepareParam(array[i],array.length-1);
              }
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

saveNotes(obj){
  switch(obj) { 
         case '1': { 
            this.prepareParamNote(this.createInfo.createdBy,1);
          break; 
          } 
          case '2': { 
            if (this.isEmptyObject(this.userInfo.userName)){
             this.openErrorDiag();
            } else {
             this.prepareParamNote(this.userInfo.userId,1);
            }
          break; 
          } 
          case '3': { 
             if (this.isEmptyObject(this.userInfoToMany)){
             this.openErrorDiag();
            } else {
            var array = this.userInfoToMany.split(',');
              for(let i=0;i<array.length-1 ;i++){ 
                  this.prepareParamNote(array[i],array.length-1);
              }
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

checkValidTime(event){
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
  	return true;
  } else {
  	this.dialogIcon = "error-message";
    this.dialogMessage = "Please choose alarm time between 00:00 to " + this.toTimeString(Date.parse(this.reminderDate));
    this.onOkVar = "openReminderMdl";
    this.successDiag.open();
    return false;
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

onOkSuccessDiag(obj, mode: boolean){
	if(obj === 'showUsersLOV'){
		this.showUsersLOV('0');
	}else if (obj === 'openReminderMdl'){
		this.modalService.dismissAll();
		    if (mode){
          this.open(this.contentMdl, true);
        } else {
          this.open(this.contentMdl, false);
        }
	}else if(obj === 'closeReminderMdl'){
	  this.modalService.dismissAll();

	}
}

prepareParam(assignedTo : string, length : number){
    
       var saveReminderInfoParam = {
       "alarmTime"  : this.alarmDate === null || this.alarmDate === undefined ? '' : this.alarmDate,
		   "assignedTo" : assignedTo,
		   "createDate" : this.createInfo.dateCreated,
		   "createUser" : this.createInfo.createdBy,
		   "remiderDate": this.reminderDate,
		   "reminder"   : this.reminder,
		   "reminderId" : "",
		   "status"     : "A",
		   "title"      : this.title,
		   "updateUser" : this.updateInfo.updatedBy,
		   "updateDate" : this.updateInfo.lastUpdate
       }

      console.log(saveReminderInfoParam);
      this.disablebtnBool = true;
	    this.saveReminderParams(saveReminderInfoParam,length);
	  
}

saveReminderParams(obj, length: number){
     this.workFlowService.saveWfmReminders(obj) .pipe(
           finalize(() => this.saveRemindersFinal(length) )
           ).subscribe(data => {
             console.log(data);
            if(data['returnCode'] === 0) {
                this.resultReminder.push(0)
            } else if (data['returnCode'] === -1) {  
                this.resultReminder.push(-1)         
            }

     })        
}

saveRemindersFinal(obj){
   this.disablebtnBool = false;
   if (this.resultReminder.length === obj){
     $('.globalLoading').css('display','none');
     $('.imgLoad').css('display','none');
     if(this.ifAnyNonZero(this.resultReminder)){
       this.saveSuccessReminder();
     } else {
       this.dialogIcon = 'error-message';
       this.dialogMessage = "Error saving reminder";
       this.successDiag.open();
     }

   }

}


prepareParamNote(assignedTo : string, length : number){
    
       var saveNoteInfoParam = {
       "assignedTo" : assignedTo,
       "createDate" : this.createInfo.dateCreated,
       "createUser" : this.createInfo.createdBy,
       "note"       : this.notes,
       "noteId"     : "",
       "status"     : "A",
       "title"      : this.titleNote,
       "updateUser" : this.updateInfo.updatedBy,
       "updateDate" : this.updateInfo.lastUpdate
       }

      console.log(saveNoteInfoParam);
      this.disablebtnBool = true;
      this.saveNoteParams(saveNoteInfoParam,length);
    
}

saveNoteParams(obj, length: number){
     this.workFlowService.saveWfmNotes(obj).pipe(
           finalize(() => this.saveNoteFinal(length) )
           ).subscribe(data => {
             console.log(data);
            if(data['returnCode'] === 0) {
                this.resultNote.push(0)
            } else if (data['returnCode'] === -1) {  
                this.resultNote.push(-1)         
            }

     })        
}

saveNoteFinal(obj){
   this.disablebtnBool = false;
   if (this.resultNote.length === obj){
     if(this.ifAnyNonZero(this.resultNote)){
       this.saveSuccessReminder();
     } else {
       this.dialogIcon = 'error-message';
       this.dialogMessage = "Error saving reminder";
       this.successDiag.open();
     }

   }

}

ifAnyNonZero (array) {
  for(var i = 0; i < array.length; ++i) {
    if(array[i] !== 0) {
      return true;
      break;
    }
  }
  return false;
}

saveSuccessReminder(){
        this.dialogIcon = 'success-message';
        this.dialogMessage = "Successfully Saved";;
        this.onOkVar = "closeReminderMdl";
        this.successDiag.open();
        this.alarmDate = null;
        this.title = null; 
        this.titleNote = null;
        this.reminderDate = null;
        this.reminder = null;
        this.notes = null;
        this.userInfo = {};
        this.userInfoToMany = null;
        this.reminderValue = null;
        this.clear('disable');
}


}
