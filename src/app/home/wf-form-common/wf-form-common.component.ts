import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { WorkFlowManagerService, NotesService, UserService, MaintenanceService } from '@app/_services';
import { finalize } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';


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
     private ns: NotesService,
     private mtnService: MaintenanceService,
     private titleService : Title) { }
  
  @ViewChild(MtnUsersComponent) usersLov: MtnUsersComponent;
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild("recipientsTable") recipientsTable: CustEditableNonDatatableComponent;
  @ViewChild("userGrpTable") userGrpTable: CustEditableNonDatatableComponent;
  @ViewChild("userGrpListingModal") userGrpListingModal : ModalComponent;
  @ViewChild("warnMdl") warnMdl : ModalComponent;
  @ViewChild('myForm') form     : NgForm;
  

  recipientsData: any = {
        tableData: [],
        tHeader: ['Type', 'Title', 'Note', 'Assigned To', 'Date Assigned'],
        dataTypes: ['text','text', 'text', 'text', 'date'],
        keys: ['statusDesc', 'title', 'note', 'assignedTo','createDate'],
        //widths: [60,'auto',100,'auto'],
        nData:{
            type: null,
            title: null,
            assignedTo: null,
            createDate: 0,
        },
        pageLength: 15,
        //deleteFlag: true,
        genericBtn  :'Delete',
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

  userGrpListing: any = {
    tableData: [],
    tHeader: ['User Group', 'Description'],
    dataTypes: ['text', 'text'],
    filters: [
      {
        key: 'userGrp',
        title: 'User Id',
        dataType: 'text',
      },
    ],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    pageID: 'userGrps',
    colSize: ['100px', '250px'],
    keys:['userGrp','userGrpDesc'],
    checkFlag: true
  };

  userInfo: any = { 
  					userId: null,
				  	userName: null,
				  };

  // createInfo: any = { 
  // 					createdBy: "Test",
		// 		  	dateCreated: 0,
		// 		  };			  

  // updateInfo: any = { 
  // 					updatedBy: "Test",
		// 		  	lastUpdate: 0,
		// 		  };

    otherInfo : any = {
      createDate : null,
      createUser : null,
      updateDate : null,
      updateUser : null
    };

  //Notes Variables
  titleNote: string = "";
  notes: string = "";

  //Reminders Variables
  titleReminder: string = "";
  alarmTime: any = this.ns.toDateTimeString(0);
  reminder: string;
  reminderDate: any = this.ns.toDateTimeString(0);


  @Input() quotationInfo: any = {};
  @Input() policyInfo: any = {
    policyId : null,
    policyNo : null
  };
  @Input() claimInfo: any = {
    claimId : null,
    claimNo : null
  };
  @Input() moduleSource: string = "";
  disablebtnBool: boolean = false;
  disableAssignTo: boolean = true;
  disableAssignToMany: boolean = true;
  disableAssignToGroup: boolean = true;
  boolValue: any;
  userInfoToMany: string;
  userInfoToGroup: string;
  selects: any[] = [];
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  onOkVar: any;
  mode:string = "note";
  referenceId:string = "";
  details:string = "";
  impTag:boolean = false;
  urgTag:boolean = false;
  selectsUserGrp: any;
  id : any;
  from :string = '';
  currDate : any;
  onProceed:boolean = false;
  rowData : any;

  saveNotesParams: any = {
    noteList : [],
    delNoteList : []
  };

  saveReminderParams: any = {
    reminderList : [],
    delReminderList : []
  };

  relatedRecordTxt:string  = "";

  ngOnInit() {
    var tabTitle = this.moduleSource.toLowerCase() == 'quotation'? 'Quo' :(this.moduleSource.toLowerCase() == 'policy'? 'Pol' : 'Clm');
    this.titleService.setTitle(tabTitle + ' | Notes & Reminders');
  	console.log("NG ON INIT : ");
    console.log(this.quotationInfo);
    console.log(this.policyInfo);
    console.log(this.claimInfo);

    this.referenceId = (this.moduleSource == 'Quotation') ? this.quotationInfo.quoteId : (this.moduleSource == 'Policy' ? this.policyInfo.policyId : this.claimInfo.claimId);
    this.details = (this.moduleSource == 'Quotation') ? this.quotationInfo.quotationNo : (this.moduleSource == 'Policy' ? this.policyInfo.policyNo : this.claimInfo.claimNo);
    this.retrieveRelatedRecords();
    this.loadTable();
  }

  onClickSave() {
    this.from = 'save';
    if((this.mode == 'note'?this.notes == '':this.reminder == '') || this.boolValue == undefined
      || (this.boolValue == 3 && (this.userInfoToMany == '' || this.userInfoToMany == undefined)) 
      || (this.boolValue == 4 && (this.userInfoToGroup == '' || this.userInfoToGroup == undefined))){
      this.dialogIcon = 'error';
      this.successDiag.open();
    }else{
      $('#warningModal > #modalBtn').trigger('click');
    }
  }

  handleRadioBtnChange(event){
   	this.disablebtnBool = false;
    this.disableRad();
   	switch(event.target.value) {
   		case '1': {
        this.boolValue = '1';
        this.clear('enable');
        $('#searchicon').removeClass('fa-spinner fa-spin');
        $('#search').css('pointer-events', 'initial');
        this.userInfoToMany = '';
        this.userInfoToGroup = '';
        break;
        }
        case '2': {
        this.boolValue = '2';
        this.disableAssignTo = false;
        break;
        }
        case '3': {
        this.boolValue = '3';
        this.disableAssignToMany = false;
        $('#searchicon').removeClass('fa-spinner fa-spin');
        $('#search').css('pointer-events', 'initial');
        this.userInfoToGroup = '';
        break;
        }
        case '4': {
        this.boolValue = '4';
        this.disableAssignToGroup = false;
        $('#searchicon').removeClass('fa-spinner fa-spin');
        $('#search').css('pointer-events', 'initial');
        this.userInfoToMany = '';
        break;
        }
         default: {
        //statements;
        break;
        }
    }
  }

  disableRad() {
    this.disableAssignTo = true;
    this.disableAssignToMany = true;
    this.disableAssignToGroup = true;
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

  showUserGrpLOV() {
    this.userGrpListingModal.openNoClose();
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

  openModalGrp(){
    this.userGrpListing.tableData = [];
    this.userGrpTable.overlayLoader = true;
    this.mtnService.getMtnUserGrp('').subscribe((data: any) =>{
       for(var i = 0; i < data.userGroups.length; i++){
         this.userGrpListing.tableData.push(data.userGroups[i]);
       }
       this.userGrpTable.refreshTable();
    });
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
    console.log(this.userInfoToGroup);
    console.log(this.selectsUserGrp);
    this.userGrpListingModal.closeModal();
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

	    /*if (this.selects.length === 0 || this.selects.length === 1 ){
	    	this.dialogIcon = "error-message";
	        this.dialogMessage = "Please select at least 2 users";
	        this.onOkVar = "showUsersLOV";
	        this.successDiag.open();
	    } else {*/
	    
      var records = this.selects;
			var temp: string = "";
			for(let rec of records){
				temp = rec.userId + "," + temp;
			/*}*/
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
            this.recipientsTable.markAsPristine();
            this.form.control.markAsPristine();
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
            this.recipientsTable.markAsPristine();
            this.form.control.markAsPristine();
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
            "noteId"       : this.id,
            "title"        : this.titleNote,
            "note"         : this.notes,
            "impTag"       : this.impTag ? 'Y' : 'N',
            "urgTag"       : this.urgTag ? 'Y' : 'N',
            "module"       : this.moduleSource,
            "referenceId"  : this.referenceId,
            "details"      : this.details,
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
            "noteId"       : this.id,
            "title"        : this.titleNote,
            "note"         : this.notes,
            "impTag"       : this.impTag ? 'Y' : 'N',
            "urgTag"       : this.urgTag ? 'Y' : 'N',
            "module"       : this.moduleSource,
            "referenceId"  : this.referenceId,
            "details"      : this.details,
            "assignedTo"   : (this.id == ''|| this.id == null)?this.userInfo.userId:this.userInfoToMany,
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
              "noteId"       : this.id,
              "title"        : this.titleNote,
              "note"         : this.notes,
              "impTag"       : this.impTag ? 'Y' : 'N',
              "urgTag"       : this.urgTag ? 'Y' : 'N',
              "module"       : this.moduleSource,
              "referenceId"  : this.referenceId,
              "details"      : this.details,
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
        //Assign to many this.selectsUserGrp

        for (var i = 0; i < this.selectsUserGrp.length; i++) {
          var note = {};

          note = {
              "noteId"       : '',
              "title"        : this.titleNote,
              "note"         : this.notes,
              "impTag"       : this.impTag ? 'Y' : 'N',
              "urgTag"       : this.urgTag ? 'Y' : 'N',
              "module"       : this.moduleSource,
              "referenceId"  : this.referenceId,
              "details"      : this.details,
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
          "reminderId"   : this.id,
          "title"        : this.titleReminder,
          "reminder"     : this.reminder,
          "module"       : this.moduleSource,
          "referenceId"  : this.referenceId,
          "details"      : this.details,
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
          "reminderId"   : this.id,
          "title"        : this.titleReminder,
          "reminder"     : this.reminder,
          "module"       : this.moduleSource,
          "referenceId"  : this.referenceId,
          "details"      : this.details,
          "alarmTime"    : this.ns.toDateTimeString(this.alarmTime),
          "impTag"       : this.impTag ? 'Y' : 'N',
          "urgTag"       : this.urgTag ? 'Y' : 'N',
          "assignedTo"   : (this.id == ''|| this.id == null)?this.userInfo.userId:this.userInfoToMany,
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
          var reminder = {};

          reminder = {
            "reminderId"   : this.id,
            "title"        : this.titleReminder,
            "reminder"     : this.reminder,
            "module"       : this.moduleSource,
            "referenceId"  : this.referenceId,
            "details"      : this.details,
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
        //Assign to many this.selectsUserGrp
        for (var i = 0; i < this.selectsUserGrp.length; i++) {
          var reminder = {};

          reminder = {
            "reminderId"   : '',
            "title"        : this.titleReminder,
            "reminder"     : this.reminder,
            "module"       : this.moduleSource,
            "referenceId"  : this.referenceId,
            "details"      : this.details,
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


    console.log(this.saveNotesParams);
    console.log(this.saveReminderParams);
  }

  setSec(d) {
    d = new Date(d);
    return d.setSeconds(0);
  }

  switchScreen() {
    this.form.controls['select1'].markAsPristine();
    this.clearFields();  
    this.loadTable();  
  }

  loadTable() {
    // this.clearFields();
    this.recipientsData.tableData = [];

    if (this.mode == 'note') {
      this.currDate = this.ns.toDateTimeString(0);
      this.recipientsData.dataTypes = ['text','text', 'text', 'text', 'date'];
      this.recipientsData.keys = ['statusDesc', 'title', 'note', 'assignedTo','createDate'];
      this.recipientsData.tHeader = ['Status', 'Title', 'Note', 'Assigned To', 'Date Assigned'];
      this.recipientsData.uneditable = [true,true,true,true,true];
    } else if (this.mode == 'reminder') {
      this.recipientsData.dataTypes = ['text','text', 'text', 'datetime', 'time', 'text', 'date'];
      this.recipientsData.keys = ['statusDesc', 'title', 'reminder', 'reminderDate', 'alarmTime', 'assignedTo','createDate'];
      this.recipientsData.tHeader = ['Status', 'Title', 'Reminder', 'Reminder Date', 'Alarm Time', 'Assigned To', 'Date Assigned'];
      this.recipientsData.uneditable = [true,true,true,true,true,true,true];
    }

    
    //var createUser = this.ns.getCurrentUser(),

    this.recipientsTable.overlayLoader = true;

    if (this.mode == 'note') {
      try {

        this.workFlowManagerService.retrieveWfmNotes('', '', this.ns.getCurrentUser(), this.moduleSource, this.referenceId).subscribe((data: any)=>{
            if (data.noteList != null) {          
              for(let rec of data.noteList){
                rec.type = 'Note';
                rec.statusDesc = rec.status == 'A' ? 'Assigned' : (rec.status == 'C' ? 'Completed' : 'Deleted');
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
        this.workFlowManagerService.retrieveWfmReminders('', '', this.ns.getCurrentUser(), this.moduleSource, this.referenceId).subscribe((data: any)=>{
            if (data.reminderList != null) {          
              for(let rec of data.reminderList){
                rec.type = 'Reminder';
                rec.statusDesc = rec.status == 'A' ? 'Assigned' : (rec.status == 'C' ? 'Completed' : 'Deleted');
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

  retrieveRelatedRecords() {
    try {

      this.workFlowManagerService.retrieveRelatedRecords(this.moduleSource, this.referenceId).subscribe((data: any)=>{
          if (data.relatedRecordList != null) {

            console.log("retrieveRelatedRecords");
            console.log(data);
            console.log("------------------");

            var quotationList = "";       
            for(let rec of data.relatedRecordList){
              if (rec.module.toUpperCase() == 'QUOTATION' && this.details != rec.referenceNo) {
                quotationList = quotationList + (quotationList == "" ? "" : " / ") + rec.referenceNo;
              } 
            }
            if (quotationList != "") {
              this.relatedRecordTxt = this.relatedRecordTxt + "Quotation : " + quotationList;
            }

            var policyList = "";       
            for(let rec of data.relatedRecordList){
              if (rec.module.toUpperCase() == 'POLICY' && this.details != rec.referenceNo) {
                policyList = policyList + (policyList == "" ? "" : " / ") + rec.referenceNo;
              } 
            }
            if (policyList != "") {
              this.relatedRecordTxt = (this.relatedRecordTxt == "" ? "" : this.relatedRecordTxt + " \n") + "Policy : " + policyList;
            }

            var claimList = "";       
            for(let rec of data.relatedRecordList){
              if (rec.module.toUpperCase() == 'CLAIM' && this.details != rec.referenceNo) {
                claimList = claimList + (claimList == "" ? "" : " / ") + rec.referenceNo;
              } 
            }
            if (claimList != "") {
              this.relatedRecordTxt = (this.relatedRecordTxt == "" ? "" : this.relatedRecordTxt + " \n") + "Claim : " + claimList;
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
  }

  checkDirty(event){
    this.rowData = event;
    if(this.form.control.dirty){
      this.from = 'confirm';
      this.warnMdl.openNoClose();
    }else{
      var ev =this.rowData;
      this.onRowClick(ev);
    }
  }

  onRowClick(event){
    console.log(event);
      if(event != null){
        this.otherInfo.createUser = event.createUser;
        this.otherInfo.updateUser = event.updateUser;
        this.otherInfo.createDate = this.ns.toDateTimeString(event.createDate);
        this.otherInfo.updateDate = this.ns.toDateTimeString(event.updateDate);

        this.titleNote       = event.title;
        this.notes           = event.note;
        this.impTag          = (event.impTag == 'Y')?true:false;
        this.urgTag          = (event.urgTag == 'Y')?true:false;
        this.boolValue       = 2;
        this.userInfoToMany  = event.assignedTo;
        this.userInfo.userId = event.assignedTo;
        this.id              = event.type.toLowerCase() == 'reminder' ? event.reminderId : event.noteId;
        this.referenceId     = event.referenceId;
        this.details         = event.details;
        this.moduleSource    = event.module;

        this.titleReminder   = event.title;
        this.reminder        = event.reminder;
        this.alarmTime       = event.alarmTime;
        this.reminderDate    = event.reminderDate; 
      }else{
        this.clearFields();
      }  
    console.log(this.id);
  }

  clearFields(){
    this.titleNote       = null;
    this.notes           = null;
    this.impTag          = false;
    this.urgTag          = false;
    this.boolValue       = null;
    this.userInfoToMany  = null
    this.userInfoToGroup = null;
    this.userInfo.userId = null;
    this.id              = null;
    this.titleReminder   = null;
    this.reminder        = null;
    this.alarmTime       = this.ns.toDateTimeString(0);
    this.reminderDate    = this.ns.toDateTimeString(0);
    this.otherInfo.createUser = null;
    this.otherInfo.updateUser = null;
    this.otherInfo.createDate = null;
    this.otherInfo.updateDate = null;
  }

  onClickDelete(){
    console.log('test for delete');
    this.from = 'delete';
    this.saveNotesParams.delNoteList = [];
    this.saveReminderParams.delReminderList = [];

    this.recipientsData.tableData.forEach(e => {
       if(e.checked){
         console.log(e);
         (this.mode == 'note')?this.saveNotesParams.delNoteList.push(e):this.saveReminderParams.delReminderList.push(e);
       }
    });
    // this.recipientsTable.confirmDelete();
    this.warnMdl.openNoClose();
  }

  onYesDelete(){
    this.saveNotesParams.noteList = [];
    this.saveReminderParams.reminderList = [];

    if(this.mode == 'note'){
      this.workFlowManagerService.saveWfmNotes(this.saveNotesParams).subscribe((data: any)=>{
          if (data.errorList.length > 0) {
            this.dialogIcon = "error";
            this.successDiag.open();
          } else {
            this.dialogIcon = "success";
            this.successDiag.open();
            this.loadTable();
            this.recipientsTable.markAsPristine();
          }
      });
    }else{
      this.workFlowManagerService.saveWfmReminders(this.saveReminderParams).subscribe((data: any)=>{
          if (data.errorList.length > 0) {
            this.dialogIcon = "error";
            this.successDiag.open();
          } else {
            this.dialogIcon = "success";
            this.successDiag.open();
            this.loadTable();
            this.recipientsTable.markAsPristine();
          }
      });
    }
  }

  onYesWarnMdl(){
    this.modalService.dismissAll();
    if(this.from == 'delete'){
      this.onYesDelete();
    }else if(this.from == 'save'){
      this.saveNotesAndReminders();
    }else{
      var ev = this.rowData;
      this.onRowClick(ev);
      this.form.control.markAsPristine();
    }
  }
}
