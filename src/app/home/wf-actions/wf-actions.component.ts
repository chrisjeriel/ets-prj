import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, UserService, WorkFlowManagerService, MaintenanceService } from '../../_services';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { finalize } from 'rxjs/operators';
import { unHighlight, highlight, hideTooltip, showTooltip} from '@app/_directives/highlight';
import { WfRemindersComponent } from '@app/home/wf-reminders/wf-reminders.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { WfCalendarComponent } from '@app/home/wf-calendar/wf-calendar.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-wf-actions',
  templateUrl: './wf-actions.component.html',
  styleUrls: ['./wf-actions.component.css']
})
export class WfActionsComponent implements OnInit {
  @ViewChild('content') contentMdl : any;
  @ViewChild(MtnUsersComponent) usersLOV: MtnUsersComponent;
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(WfRemindersComponent) wfReminders: WfRemindersComponent;
  @ViewChild("userGrpTable") userGrpTable: CustNonDatatableComponent;
  @ViewChild("usersTable") usersTable: CustNonDatatableComponent;
  @ViewChild("userGrpListingModal") userGrpListingModal : ModalComponent;
  @ViewChild("usersToManyMdl") usersToManyMdl : ModalComponent;
  @ViewChild("warningModal") warningModal : ModalComponent;
  @ViewChild("calendarModal") calendarModal : ModalComponent;
  @ViewChild(WfCalendarComponent) wfCalendar : WfCalendarComponent;
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;

  content: any ;
  disablebtnBool: boolean;
  disableAssignTo: boolean;
  disableAssignToMany: boolean;
  reminderValue: any;
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  alarmDate: any;
  title: string = "";
  onOkVar: any;
  disableAlarmTime: boolean = true;
  loading: boolean = false;
  mode: string;

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
  selectsUserGrp: any[] = [];

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

  userGrpListing: any = {
    tableData: [],
    tHeader: ['User Group', 'Description'],
    dataTypes: ['text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    pageID: 'userGrps',
    colSize: ['100px', '250px'],
    keys:['userGrp','userGrpDesc'],
    checkFlag: true
  };

  resultReminder: any [] = [];
  resultNote: any [] = [];
  userList: any[] = [];
  disableAssignToGroup: boolean = true;
  userInfoToGroup: any = "";
  boolValue: any;
  impTag:boolean = false;
  urgTag:boolean = false;
  //Notes Variables
  titleNote: string = "";
  notes: string = "";

  //Reminders Variables
  titleReminder: string = "";
  alarmTime: any = this.ns.toDateTimeString(0);
  reminder: string;
  reminderDate: any = this.ns.toDateTimeString(0);

  saveNotesParams: any = {
    noteList : [],
    delNoteList : []
  };

  saveReminderParams: any = {
    reminderList : [],
    delReminderList : []
  };

  relatedRecordTxt:string  = "";
  events: any;
  cancelFlag: boolean = false;

  constructor(config: NgbModalConfig,
     public modalService: NgbModal,
     private ns: NotesService,
     private userService: UserService,
     private workFlowService: WorkFlowManagerService,
     private mtnService: MaintenanceService){ }

  ngOnInit() {
  }

  open(content, mode) {
      this.radioBtnChange(this.reminderValue);
      this.content = content;
      this.mode = mode;
      this.modalService.open(this.content, { centered: true , windowClass : 'modal-size'} );
  }

  openModal(){
  	  this.usersListing.tableData = [];
  	  this.usersTable.overlayLoader = true;
      this.userService.retMtnUsers('').pipe(
             finalize(() => this.setCheckRecords() )
             ).subscribe((data: any) =>{
                   for(var i = 0; i < data.usersList.length; i++){
                     this.usersListing.tableData.push(data.usersList[i]);
                   }
                   this.usersTable.refreshTable();
                 });
  }

  setCheckRecords(){
  	if(this.isEmptyObject(this.userInfoToMany)){
  	
    }else{
  	    var array = this.userInfoToMany.split(",");
    }
    for( var j = 0; j < array.length; j ++){
     	   for(var i = 0; i < this.usersListing.tableData.length; i++){
        if(array[j].trim() === this.usersListing.tableData[i].userId){
       	   this.usersListing.tableData[i].checked = true;
       	  }
         }
    }
  }

  setCheckRecordsUserGrp(){
    if(this.isEmptyObject(this.userInfoToGroup)){
    
    }else{
        var array = this.userInfoToGroup.split(",");
    }
    for( var j = 0; j < array.length; j ++){
          for(var i = 0; i < this.userGrpListing.tableData.length; i++){
        if(array[j].trim() === this.userGrpListing.tableData[i].userGrpDesc){
            this.userGrpListing.tableData[i].checked = true;
           }
         }
    }
  }

  cancel(){
      this.usersListing.tableData = [];
      this.userGrpListing.tableData = [];
      this.table.refreshTable();
      this.open(this.contentMdl, this.mode);
  }

  confirm(){
  	  this.selects = [];
      for(var i = 0; i < this.usersListing.tableData.length; i++){
          if(this.usersListing.tableData[i].checked){
            this.selects.push(this.usersListing.tableData[i]);
          }
      }

      var records = this.selects;
  	  var temp: string = "";
  		for(let rec of records){
  			temp = temp + (temp != "" ? ", " : "") + rec.userId;
  		}
  	  this.userInfoToMany = temp;
      this.usersToManyMdl.closeModal();
  }

  confirmUserGrp() {
    this.selectsUserGrp = [];
    for(var i = 0; i < this.userGrpListing.tableData.length; i++){
        if(this.userGrpListing.tableData[i].checked){
          this.selectsUserGrp.push(this.userGrpListing.tableData[i]);
        }
    }

    var temp: string = "";
    for(let rec of this.selectsUserGrp){
      temp = temp + (temp != "" ? ", " : "") + rec.userGrpDesc;
    }
    this.userInfoToGroup = temp;
    this.userGrpListingModal.closeModal();
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
          this.boolValue = '1';
          this.clear('enable');
          $('#searchicon').removeClass('fa-spinner fa-spin')
          $('#search').css('pointer-events', 'initial');
          break;
          }
          case '2': {
          this.boolValue = '2';
          this.disableAssignTo = false;
          this.disableAssignToMany = true;
          this.disableAssignToGroup = true;
          break;
          }
          case '3': {
          this.boolValue = '3';
          this.disableAssignTo = true;
          this.disableAssignToMany = false;
          this.disableAssignToGroup = true;
          $('#searchicon').removeClass('fa-spinner fa-spin')
          $('#search').css('pointer-events', 'initial');
          break;
          }
          case '4': {
          this.boolValue = '4';
          this.disableAssignTo = true;
          this.disableAssignToMany = true;
          this.disableAssignToGroup = false;
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
      this.usersToManyMdl.openNoClose();
  	} else if (parseInt(obj) === 1) {
      this.usersLOV.openModal();
  	}
  }

  setPreparedBy(event){
  	this.userInfo.userId = event.userId;
  	this.userInfo.userName = event.userName;
    this.modalService.dismissAll();
  	this.open(this.contentMdl, this.mode);
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
    	this.usersLOV.checkCode(userId, ev);
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

  changeModalSize() {

/*    this.setEventsForCalendar();
    console.log("EVENTS:");
    console.log(this.events);*/

/*    this.wfCalendar.loadData();*/

    var elements = document.getElementsByClassName("modal-content");

    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].setAttribute("style", "max-height: 800px !important;");
    }

    var elementsX = document.getElementsByTagName("H2");

    for (var i = elementsX.length - 1; i >= 0; i--) {
      elementsX[i].setAttribute("style", "font-size: 20px !important;");
    }

  }

  onClickCalendarModal() {


    this.calendarModal.openNoClose();

    var elements = document.getElementsByClassName("modal-content");

    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].setAttribute("style", "max-height: 800px !important; min-height: 800px;");
    }
  }

  setEventsForCalendar() {
    var currentUser = this.ns.getCurrentUser();
    this.events = [];

    this.workFlowService.retrieveWfmReminders('',currentUser,'','','', 'A').subscribe((data)=>{
           var records = data['reminderList'];
               for(let rec of records){
                 if(rec.assignedTo === currentUser){
                   var event = {
                     title : rec.title,
                     start : rec.reminderDate.substring(0, 10),
                   };
                   this.events.push(event);
                 }
               }
        },
            error => {
              console.log("ERROR:::" + JSON.stringify(error));
       });
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
  		this.open(this.contentMdl, this.mode);
  	}else if(obj === 'closeReminderMdl'){
  	  this.modalService.dismissAll();

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

  showUserGrpLOV(obj?) {
    this.userGrpListingModal.openNoClose();
  }

  retrieveUserGrp(){
    try {
      this.userGrpListing.tableData = [];
      this.userGrpTable.overlayLoader = true;
      this.mtnService.getMtnUserGrp('').pipe(
             finalize(() => this.setCheckRecordsUserGrp() )
             ).subscribe((data: any) =>{
                   for(var i = 0; i < data.userGroups.length; i++){
                     this.userGrpListing.tableData.push(data.userGroups[i]);
                   }
                   this.userGrpTable.refreshTable();
                 });
    } catch (ex) {
      alert(ex);
    }
  }

  onClickSave() {
    this.confirmSave.confirmModal();  
  }

  setSec(d) {
    d = new Date(d);
    return d.setSeconds(0);
  }

  saveNotesAndReminders(cancel?) {
    this.cancelFlag = cancel !== undefined;
    this.prepareParams();

    console.log("saveNotesAndReminders");
    console.log(this.saveNotesParams);
    console.log(this.saveReminderParams);
    console.log("---------------------");

    if (this.mode == 'note') {

      this.workFlowService.saveWfmNotes(this.saveNotesParams).subscribe((data: any)=>{
          if (data.errorList.length > 0) {
            this.dialogIcon = "error";
            this.successDiag.open();
          } else {
            this.dialogIcon = "success";
            this.successDiag.open();
            this.createInfo.createdBy = this.ns.getCurrentUser();
            this.createInfo.dateCreated = this.ns.toDateTimeString(0);
            this.updateInfo.updatedBy = this.ns.getCurrentUser();
            this.updateInfo.lastUpdate = this.ns.toDateTimeString(0);
            $('.ng-dirty').removeClass('ng-dirty');
          }
      });

    } else if (this.mode == 'reminder') {

      this.workFlowService.saveWfmReminders(this.saveReminderParams).subscribe((data: any)=>{
          if (data.errorList.length > 0) {
            this.dialogIcon = "error";
            this.successDiag.open();
          } else {
            this.dialogIcon = "success";
            this.successDiag.open();
          }
      });

    }

  }

  prepareParams() {
    this.saveNotesParams = {
      noteList : [],
      delNoteList : []
    };
    this.saveReminderParams = {
      reminderList : [],
      delReminderList : []
    };

    var noteList = [];
    var delNoteList = [];
    var reminderList = [];
    var delReminderList = [];

    if (this.mode == 'note') {

      if (this.boolValue == 1) {
        //Assign to me
        var note = {};

        note = {
            "noteId"       : null,
            "title"        : this.titleNote,
            "note"         : this.notes,
            "impTag"       : this.impTag ? 'Y' : 'N',
            "urgTag"       : this.urgTag ? 'Y' : 'N',
            "module"       : '',
            "referenceId"  : '',
            "details"      : '',
            "assignedTo"   : this.ns.getCurrentUser(),
            "status"       : "A",
            "createUser"   : this.ns.getCurrentUser(),
            "createDate"   : this.ns.toDateTimeString(0),
            "updateUser"   : this.ns.getCurrentUser(),
            "updateDate"   : this.ns.toDateTimeString(0),
        };

        noteList.push(note);

      } else if (this.boolValue == 2) {
        //Assign to user userInfo.userId

        var note = {};

        note = {
            "noteId"       : null,
            "title"        : this.titleNote,
            "note"         : this.notes,
            "impTag"       : this.impTag ? 'Y' : 'N',
            "urgTag"       : this.urgTag ? 'Y' : 'N',
            "module"       : '',
            "referenceId"  : '',
            "details"      : '',
            "assignedTo"   : this.userInfo.userId,
            "status"       : "A",
            "createUser"   : this.ns.getCurrentUser(),
            "createDate"   : this.ns.toDateTimeString(0),
            "updateUser"   : this.ns.getCurrentUser(),
            "updateDate"   : this.ns.toDateTimeString(0),
        };

        noteList.push(note);

      } else if (this.boolValue == 3) {
        //Assign to many this.selects

        for (var i = 0; i < this.selects.length; i++) {
          var note = {};

          note = {
              "noteId"       : null,
              "title"        : this.titleNote,
              "note"         : this.notes,
              "impTag"       : this.impTag ? 'Y' : 'N',
              "urgTag"       : this.urgTag ? 'Y' : 'N',
              "module"       : '',
              "referenceId"  : '',
              "details"      : '',
              "assignedTo"   : this.selects[i].userId,
              "status"       : "A",
              "createUser"   : this.ns.getCurrentUser(),
              "createDate"   : this.ns.toDateTimeString(0),
              "updateUser"   : this.ns.getCurrentUser(),
              "updateDate"   : this.ns.toDateTimeString(0),
          };

          noteList.push(note);
        }

      } else if (this.boolValue == 4) {
        //Assign to many this.selects

        for (var i = 0; i < this.selectsUserGrp.length; i++) {
          var note = {};

          note = {
              "noteId"       : null,
              "title"        : this.titleNote,
              "note"         : this.notes,
              "impTag"       : this.impTag ? 'Y' : 'N',
              "urgTag"       : this.urgTag ? 'Y' : 'N',
              "module"       : '',
              "referenceId"  : '',
              "details"      : '',
              "assignedToGroup"   : this.selectsUserGrp[i].userGrp,
              "status"       : "A",
              "createUser"   : this.ns.getCurrentUser(),
              "createDate"   : this.ns.toDateTimeString(0),
              "updateUser"   : this.ns.getCurrentUser(),
              "updateDate"   : this.ns.toDateTimeString(0),
          };

          noteList.push(note);
        }

      } else {

      }

    } else if (this.mode == 'reminder') {

      console.log("reminder alarm time");
      console.log(this.alarmTime);
      console.log("-----------");

      if (this.boolValue == 1) {
        //Assign to me
        var reminder = {};

        reminder = {
          "reminderId"   : null,
          "title"        : this.titleReminder,
          "reminder"     : this.reminder,
          "module"       : '',
          "referenceId"  : '',
          "details"      : '',
          "alarmTime"    : this.ns.toDateTimeString(this.alarmTime),
          "impTag"       : this.impTag ? 'Y' : 'N',
          "urgTag"       : this.urgTag ? 'Y' : 'N',
          "assignedTo"   : this.ns.getCurrentUser(),
          "createDate"   : null,
          "createUser"   : this.ns.getCurrentUser(),
          "reminderDate" : this.ns.toDateTimeString(this.setSec(this.reminderDate)),
          "status"       : "A",
          "updateUser"   : this.ns.getCurrentUser(),
          "updateDate"   : null,
        }

        reminderList.push(reminder);

      } else if (this.boolValue == 2) {
        //Assign to user userInfo.userId
        var reminder = {};

        reminder = {
          "reminderId"   : null,
          "title"        : this.titleReminder,
          "reminder"     : this.reminder,
          "module"       : '',
          "referenceId"  : '',
          "details"      : '',
          "alarmTime"    : this.ns.toDateTimeString(this.alarmTime),
          "impTag"       : this.impTag ? 'Y' : 'N',
          "urgTag"       : this.urgTag ? 'Y' : 'N',
          "assignedTo"   : this.userInfo.userId,
          "createDate"   : null,
          "createUser"   : this.ns.getCurrentUser(),
          "reminderDate" : this.ns.toDateTimeString(this.setSec(this.reminderDate)),
          "status"       : "A",
          "updateUser"   : this.ns.getCurrentUser(),
          "updateDate"   : null,
        }

        reminderList.push(reminder);

      } else if (this.boolValue == 3) {
        //Assign to many this.selects
        for (var i = 0; i < this.selects.length; i++) {
          var note = {};

          reminder = {
            "reminderId"   : null,
            "title"        : this.titleReminder,
            "reminder"     : this.reminder,
            "module"       : '',
            "referenceId"  : '',
            "details"      : '',
            "alarmTime"    : this.ns.toDateTimeString(this.alarmTime),
            "impTag"       : this.impTag ? 'Y' : 'N',
            "urgTag"       : this.urgTag ? 'Y' : 'N',
            "assignedTo"   : this.selects[i].userId,
            "createDate"   : null,
            "createUser"   : this.ns.getCurrentUser(),
            "reminderDate" : this.ns.toDateTimeString(this.setSec(this.reminderDate)),
            "status"       : "A",
            "updateUser"   : this.ns.getCurrentUser(),
            "updateDate"   : null,
          }

          reminderList.push(reminder);
        }

        
      } else if (this.boolValue == 4) {
        //Assign to many this.selects
        for (var i = 0; i < this.selectsUserGrp.length; i++) {
          var note = {};

          reminder = {
            "reminderId"   : null,
            "title"        : this.titleReminder,
            "reminder"     : this.reminder,
            "module"       : '',
            "referenceId"  : '',
            "details"      : '',
            "alarmTime"    : this.ns.toDateTimeString(this.alarmTime),
            "impTag"       : this.impTag ? 'Y' : 'N',
            "urgTag"       : this.urgTag ? 'Y' : 'N',
            "assignedToGroup"   : this.selectsUserGrp[i].userGrp,
            "createDate"   : null,
            "createUser"   : this.ns.getCurrentUser(),
            "reminderDate" : this.ns.toDateTimeString(this.setSec(this.reminderDate)),
            "status"       : "A",
            "updateUser"   : this.ns.getCurrentUser(),
            "updateDate"   : null,
          }

          reminderList.push(reminder);
        }

        
      } else {

      }

    }

    this.saveNotesParams = {
      noteList : noteList,
      delNoteList : delNoteList
    };
    this.saveReminderParams = {
      reminderList : reminderList,
      delReminderList : delReminderList
    };
  }

  clearValues(){
    this.modalService.dismissAll()
    this.titleNote = '';
    this.notes = '';
    this.userInfo.userId = '';
    this.userInfo.userName = '';
    this.userInfoToMany = '';
    this.userInfoToGroup = '';
    this.boolValue = '';
    this.impTag = false;
    this.urgTag = false;
    this.createInfo.createdBy = '';
    this.createInfo.dateCreated = '';
    this.updateInfo.updatedBy = '';
    this.updateInfo.lastUpdate = '';
  }
}
