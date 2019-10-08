import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { WorkFlowManagerService, NotesService, UserService } from '@app/_services';
import { finalize } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-wf-form-common',
  templateUrl: './wf-form-common.component.html',
  styleUrls: ['./wf-form-common.component.css']
})
export class WfFormCommonComponent implements OnInit {

  constructor(config: NgbModalConfig,
  	 private userService: UserService,
     public modalService: NgbModal,
     private workFlowManagerService: WorkFlowManagerService, 
     private ns: NotesService) { }
  
  @ViewChild(MtnUsersComponent) usersLov: MtnUsersComponent;
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild("recipientsTable") recipientsTable: CustEditableNonDatatableComponent;

  recipientsData: any = {
        tableData: [],
        tHeader: ['Type', 'Title', 'Note', 'Assigned To', 'Date Assigned'],
        dataTypes: ['text','text', 'text', 'text', 'date'],
        keys: ['type', 'title', 'note', 'assignedTo','createDate'],
        //widths: [60,'auto',100,'auto'],
        nData:{
            type: null,
            title: null,
            assignedTo: null,
            createDate: 0,
        },
        pageLength: 15,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 2,
        uneditable: [true,true,true,true,true],
  }

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

  userInfo: any = { 
  					userId: null,
				  	userName: null,
				  };

  createInfo: any = { 
  					createdBy: "Test",
				  	dateCreated: 0,
				  };			  

  updateInfo: any = { 
  					updatedBy: "Test",
				  	lastUpdate: 0,
				  };

  //Notes Variables
  titleNote: string = "";
  notes: string = "";

  //Reminders Variables
  titleReminder: string = "";
  alarmTime: any;
  reminder: string;
  reminderDate: any = this.ns.toDateTimeString(0);


  @Input() quotationInfo: any = {};
  @Input() policyInfo: any = {
    policyId : null,
    policyNo : null
  };
  @Input() claimInfo: any = {};
  @Input() moduleSource: string = "";
  disablebtnBool: boolean = false;
  disableAssignTo: boolean = true;
  disableAssignToMany: boolean = true;
  boolValue: any;
  userInfoToMany: string;
  selects: any[] = [];
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  onOkVar: any;
  mode:string = "note";
  referenceId:string = "";
  details:string = "";
  impTag:boolean = false;
  urgTag:boolean = false;

  saveNotesParams: any = {
    noteList : [],
    delNoteList : []
  };

  saveReminderParams: any = {
    reminderList : [],
    delReminderList : []
  };

  ngOnInit() {
  	console.log("NG ON INIT : ");
    console.log(this.quotationInfo);
    console.log(this.policyInfo);
    console.log(this.claimInfo);
    this.referenceId = (this.moduleSource == 'Quotation') ? this.quotationInfo.quoteId : (this.moduleSource == 'Policy' ? this.policyInfo.policyId : this.claimInfo.claimId);
    this.details = (this.moduleSource == 'Quotation') ? this.quotationInfo.quotationNo : (this.moduleSource == 'Policy' ? this.policyInfo.policyNo : this.claimInfo.claimNo);

    this.loadTable();
  }

  onClickSave() {
  	$('#warningModal > #modalBtn').trigger('click');
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
        break;
        }
        case '3': {
        this.boolValue = '3';
        this.disableAssignTo = true;
        this.disableAssignToMany = false;
        $('#searchicon').removeClass('fa-spinner fa-spin')
        $('#search').css('pointer-events', 'initial');
        break;
        }
        case '4': {
        this.boolValue = '4';
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

  showUsersLOV(obj){
  	if(parseInt(obj) === 0){
  	  $('#usersToManyMdl #modalBtn').trigger('click');
        $('#usersToManyMdl #modalBtn').addClass('ng-dirty');
  	} else if (parseInt(obj) === 1) {
  	  $('#usersLOV #modalBtn').trigger('click');
  	  $('#usersLOV #modalBtn').addClass('ng-dirty');
  	}
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

  openModal(){
	  this.usersListing.tableData = [];
	  this.table.refreshTable('first');
      this.userService.retMtnUsers('').pipe(finalize(() => this.setCheckRecords())
           ).subscribe((data: any) =>{
                 for(var i = 0; i < data.usersList.length; i++){
                   this.usersListing.tableData.push(data.usersList[i]);
                 }
                 this.table.refreshTable();
               });
  }

  isEmptyObject(obj) {
    for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
    }
    return true;
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

  setPreparedBy(event){
	  this.userInfo.userId = event.userId;
	  this.userInfo.userName = event.userName;
  	this.modalService.dismissAll();
  }

  cancel(){
    this.usersListing.tableData = [];
    this.table.refreshTable();
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
	    } else {
	    
      var records = this.selects;
			var temp: string = "";
			for(let rec of records){
				temp = rec.userId + "," + temp;
			}
			this.userInfoToMany = temp;
		}
  }

  saveNotesAndReminders() {

    this.prepareParams();

    console.log("saveNotesAndReminders");
    console.log(this.saveNotesParams);
    console.log(this.saveReminderParams);
    console.log("---------------------");

    if (this.mode == 'note') {

      this.workFlowManagerService.saveWfmNotes(this.saveNotesParams).subscribe((data: any)=>{
          if (data.errorList.length > 0) {
            this.dialogIcon = "error";
            this.successDiag.open();
          } else {
            this.dialogIcon = "success";
            this.successDiag.open();
            this.loadTable();
          }
      });

    } else if (this.mode == 'reminder') {

      this.workFlowManagerService.saveWfmReminders(this.saveReminderParams).subscribe((data: any)=>{
          if (data.errorList.length > 0) {
            this.dialogIcon = "error";
            this.successDiag.open();
          } else {
            this.dialogIcon = "success";
            this.successDiag.open();
            this.loadTable();
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

    console.log("this.impTag : " + this.impTag);
    console.log("this.urgTag : " + this.urgTag);

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
            "module"       : this.moduleSource,
            "referenceId"  : this.referenceId,
            "details"      : this.details,
            "assignedTo"   : JSON.parse(window.localStorage.currentUser).username,
            "status"       : "A",
            "createUser"   : JSON.parse(window.localStorage.currentUser).username,
            "createDate"   : this.ns.toDateTimeString(0),
            "updateUser"   : JSON.parse(window.localStorage.currentUser).username,
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
            "module"       : this.moduleSource,
            "referenceId"  : this.referenceId,
            "details"      : this.details,
            "assignedTo"   : this.userInfo.userId,
            "status"       : "A",
            "createUser"   : JSON.parse(window.localStorage.currentUser).username,
            "createDate"   : this.ns.toDateTimeString(0),
            "updateUser"   : JSON.parse(window.localStorage.currentUser).username,
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
              "module"       : this.moduleSource,
              "referenceId"  : this.referenceId,
              "details"      : this.details,
              "assignedTo"   : this.selects[i].userId,
              "status"       : "A",
              "createUser"   : JSON.parse(window.localStorage.currentUser).username,
              "createDate"   : this.ns.toDateTimeString(0),
              "updateUser"   : JSON.parse(window.localStorage.currentUser).username,
              "updateDate"   : this.ns.toDateTimeString(0),
          };

          noteList.push(note);
        }

      } else {

      }

    } else if (this.mode == 'reminder') {

      if (this.boolValue == 1) {
        //Assign to me
        var reminder = {};

        reminder = {
          "reminderId"   : null,
          "title"        : this.titleReminder,
          "reminder"     : this.reminder,
          "module"       : this.moduleSource,
          "referenceId"  : this.referenceId,
          "details"      : this.details,
          "alarmTime"    : null,
          "assignedTo"   : JSON.parse(window.localStorage.currentUser).username,
          "createDate"   : null,
          "createUser"   : JSON.parse(window.localStorage.currentUser).username,
          "reminderDate" : this.ns.toDateTimeString(this.setSec(this.reminderDate)),
          "status"       : "A",
          "updateUser"   : JSON.parse(window.localStorage.currentUser).username,
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
          "module"       : this.moduleSource,
          "referenceId"  : this.referenceId,
          "details"      : this.details,
          "alarmTime"    : null,
          "assignedTo"   : this.userInfo.userId,
          "createDate"   : null,
          "createUser"   : JSON.parse(window.localStorage.currentUser).username,
          "reminderDate" : this.ns.toDateTimeString(this.setSec(this.reminderDate)),
          "status"       : "A",
          "updateUser"   : JSON.parse(window.localStorage.currentUser).username,
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
            "module"       : this.moduleSource,
            "referenceId"  : this.referenceId,
            "details"      : this.details,
            "alarmTime"    : null,
            "assignedTo"   : this.selects[i].userId,
            "createDate"   : null,
            "createUser"   : JSON.parse(window.localStorage.currentUser).username,
            "reminderDate" : this.ns.toDateTimeString(this.setSec(this.reminderDate)),
            "status"       : "A",
            "updateUser"   : JSON.parse(window.localStorage.currentUser).username,
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

  setSec(d) {
    d = new Date(d);
    return d.setSeconds(0);
  }

  switchScreen() {
    this.loadTable();
  }

  loadTable() {

    this.recipientsData.tableData = [];

    if (this.mode == 'note') {
      this.recipientsData.dataTypes = ['text','text', 'text', 'text', 'date'];
      this.recipientsData.keys = ['type', 'title', 'note', 'assignedTo','createDate'];
      this.recipientsData.tHeader = ['Type', 'Title', 'Note', 'Assigned To', 'Date Assigned'];
      this.recipientsData.uneditable = [true,true,true,true,true];
    } else if (this.mode == 'reminder') {
      this.recipientsData.dataTypes = ['text','text', 'text', 'date', 'text', 'date'];
      this.recipientsData.keys = ['type', 'title', 'reminder', 'reminderDate', 'assignedTo','createDate'];
      this.recipientsData.tHeader = ['Type', 'Title', 'Reminder', 'Reminder Date', 'Assigned To', 'Date Assigned'];
      this.recipientsData.uneditable = [true,true,true,true,true,true];
    }

    
    var createUser = JSON.parse(window.localStorage.currentUser).username;

    this.recipientsTable.overlayLoader = true;

    if (this.mode == 'note') {
      try {

        this.workFlowManagerService.retrieveWfmNotes('', '', createUser, this.moduleSource, this.referenceId).subscribe((data: any)=>{
            if (data.noteList != null) {          
              for(let rec of data.noteList){
                rec.type = 'Note';
                this.recipientsData.tableData.push(rec);
              }

              this.recipientsTable.refreshTable();
            } else {
              //alert("Saved successfully.");
            }
        });
      } catch(e) {
        alert("Error calling WFM Services in NOTE loadTable(): " + e);
      } finally {

      }
    } else if (this.mode == 'reminder') {

      try {

        this.workFlowManagerService.retrieveWfmReminders('', '', createUser, this.moduleSource, this.referenceId).subscribe((data: any)=>{
            if (data.reminderList != null) {          
              for(let rec of data.reminderList){
                rec.type = 'Reminder';
                this.recipientsData.tableData.push(rec);
              }

              this.recipientsTable.refreshTable();
            } else {
              //alert("Saved successfully.");
            }
        });
      } catch(e) {
        alert("Error calling WFM Services in REMINDER loadTable(): " + e);
      } finally {

      }

    }

  }
}
