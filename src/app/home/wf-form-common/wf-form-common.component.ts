import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnUsersComponent } from '@app/maintenance/mtn-users/mtn-users.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { WorkFlowManagerService, NotesService, UserService } from '@app/_services';
import { finalize } from 'rxjs/operators';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-wf-form-common',
  templateUrl: './wf-form-common.component.html',
  styleUrls: ['./wf-form-common.component.css']
})
export class WfFormCommonComponent implements OnInit {

  constructor(config: NgbModalConfig,
  	 private userService: UserService,
     private modalService: NgbModal,
     private workFlowManagerService: WorkFlowManagerService, 
     private ns: NotesService) { }
  
  @ViewChild(MtnUsersComponent) usersLov: MtnUsersComponent;
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  recipientsData: any = {
        tableData: [ {
        	type: "Note",
        	title: "Sample Note",
        	assignedTo: "Totzkie",
        	dateAssigned: [2019, 2, 21, 0, 0, 0, 0]
        },
        {
        	type: "Reminder",
        	title: "Sample Reminder",
        	assignedTo: "Inahbelles",
        	dateAssigned: [2019, 2, 21, 0, 0, 0, 0]
        } ],
        tHeader: ['Type', 'Title', 'Assigned To', 'Date Assigned'],
        dataTypes: ['text','text', 'text','date'],
        keys: ['type', 'title', 'assignedTo','dateAssigned'],
        //widths: [60,'auto',100,'auto'],
        nData:{
            type: null,
            title: null,
            assignedTo: null,
            dateAssigned: [2019, 2, 21, 0, 0, 0, 0],
        },
        pageLength: 15,
        deleteFlag: true,
        checkFlag: true,
        paginateFlag: true,
        infoFlag: true,
        searchFlag: true,
        pageID: 2,
        uneditable: [true,true,true,true],
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
				  	dateCreated: [2019, 2, 21, 0, 0, 0, 0],
				  };			  

  updateInfo: any = { 
  					updatedBy: "Test",
				  	lastUpdate: [2019, 2, 21, 0, 0, 0, 0],
				  };

  //Notes Variables
  titleNote: string = "";
  notes: string = "";
  @Input() quotationInfo: any = {};
  disablebtnBool: boolean = false;
  disableAssignTo: boolean = true;
  disableAssignToMany: boolean = true;
  boolValue: any;
  userInfoToMany: string;
  selects: any[] = [];
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  onOkVar: any;

  ngOnInit() {
  	
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
  	if (this.boolValue == '3') {
  		if (this.selects.length > 0) {
  			for (var i = this.selects.length - 1; i >= 0; i--) {
  				var saveNoteParams = this.prepareSaveNoteParams(this.selects[i].userId);
  				this.callServiceSaveNotes(saveNoteParams);
  			}
  		}
  	}

  	/*var saveNoteInfoParam = {
  	    "noteId" 		: null,
		"title" 		: this.titleNote,
		"note" 			: this.notes,
		"module" 		: "Quotation",
		"referenceId" 	: this.quotationInfo.quoteId,
		"details" 		: this.quotationInfo.quotationNo,
		"assignedTo" 	: "CPI",
		"status" 		: "A",
		"createUser" 	: JSON.parse(window.localStorage.currentUser).username,
		"createDate" 	: this.ns.toDateTimeString(0),
		"updateUser" 	: JSON.parse(window.localStorage.currentUser).username,
		"updateDate" 	: this.ns.toDateTimeString(0),
    };

    console.log(saveNoteInfoParam);*/

    
  }

  prepareSaveNoteParams(assignedTo) {
  	var saveNoteInfoParam = {
  	    "noteId" 		: null,
		"title" 		: this.titleNote,
		"note" 			: this.notes,
		"module" 		: "Quotation",
		"referenceId" 	: this.quotationInfo.quoteId,
		"details" 		: this.quotationInfo.quotationNo,
		"assignedTo" 	: assignedTo,
		"status" 		: "A",
		"createUser" 	: JSON.parse(window.localStorage.currentUser).username,
		"createDate" 	: this.ns.toDateTimeString(0),
		"updateUser" 	: JSON.parse(window.localStorage.currentUser).username,
		"updateDate" 	: this.ns.toDateTimeString(0),
    };

    return saveNoteInfoParam;
  }

  callServiceSaveNotes(saveNoteInfoParam) {
  	this.workFlowManagerService.saveWfmNotes(saveNoteInfoParam).subscribe((data: any)=>{
        if (data.errorList.length > 0) {
        	alert("Error during saving");
        } else {
        	alert("Saved successfully.");
        }
    });
  }
}
