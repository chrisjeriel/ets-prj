import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkFlowManagerService, NotesService } from '@app/_services';
import { finalize } from 'rxjs/operators';
import { WfReminderFormComponent } from '@app/home/wf-reminders/wf-reminder-form/wf-reminder-form.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';


interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
];

@Component({
  selector: 'app-wf-reminders',
  templateUrl: './wf-reminders.component.html',
  styleUrls: ['./wf-reminders.component.css']
})
export class WfRemindersComponent implements OnInit {
  @ViewChild(WfReminderFormComponent) wfReminder : WfReminderFormComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  countries = COUNTRIES;
  currentUser : string;
  alarmTime: string;
  reminder: string;
  reminderDate: string;
  title: string;
  reminderList: any[] = [];
  reminderBool: boolean = true;
  selectedReminder: any = null;
  reminderNull: boolean = false;
  loadingFlag: boolean;
  content: any;
  reminderInfo: any[] =[];
  cancelFlag: boolean;
  dialogIcon:string  = "";
  dialogMessage:string  = "";
  onOkVar: string = "";
  updateMode: boolean;
  updateReminderInfoParam = {};

  constructor(private workFlowManagerService: WorkFlowManagerService, private ns: NotesService,private modalService: NgbModal) { }
    
  ngOnInit() {
     this.selectedReminder = 'atm';
     this.retrieveReminders('atm');
  }

  retrieveReminders(obj){
       this.currentUser = JSON.parse(window.localStorage.currentUser).username;
       console.log(obj);
       
    if (obj === 'atm'){
       this.reminderBool = true;
       this.reminderList = [];
       this.loadingFlag = true;
       this.reminderNull = false;
       $("#reminderDiv").css({"height": "auto"});
       this.workFlowManagerService.retrieveWfmReminders('',this.currentUser,'').pipe(finalize(() => this.setReminderList()))
       .subscribe((data)=>{
           var records = data['reminderList'];
               for(let rec of records){
                 if(rec.assignedTo === this.currentUser && rec.status === "A"){
                   this.reminderList.push(rec);
                 }
               }
        },
            error => {
              console.log("ERROR:::" + JSON.stringify(error));
       });

    } else if(obj === 'mr') {
      this.reminderBool = false;
      this.reminderList = [];
      this.loadingFlag = true;
      this.reminderNull = false;
      $("#reminderDiv").css({"height": "auto"});
       this.workFlowManagerService.retrieveWfmReminders('','',this.currentUser).pipe(finalize(() => this.setReminderList()))
       .subscribe((data)=>{
           var records = data['reminderList'];
               for(let rec of records){
                 if(rec.createUser === this.currentUser && rec.status === "A"){
                   this.reminderList.push(rec);
                 }
               }
        },
            error => {
              console.log("ERROR:::" + JSON.stringify(error));
       });
    }
  }

  setReminderList(){
    console.log(this.reminderList);
    this.loadingFlag = false;
    if(this.isEmptyObject(this.reminderList)){
      $("#reminderDiv").css({"height": "auto"});
      this.reminderNull = true;
    } else if (this.reminderList.length <= 3) {
      $("#reminderDiv").css({"height": "auto"});
      this.reminderNull = false;
    } else {
      $("#reminderDiv").css({"height": "400px"});
      this.reminderNull = false;
    }

  }

  tabSelectedRemindersController(event){
     if (this.selectedReminder == "atm"){
          this.retrieveReminders('atm');
     } else {
          this.retrieveReminders('mr');
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

  showReminderModal( reminderId : string,
    reminder : string, 
    reminderDate : string, 
    title : string,
    alarmTime : string, 
    assignedTo : string, 
    createUser: string,
    createDate : string,
    updateUser : string,
    updateDate : string ,
    viewMode : boolean){

    this.reminderInfo = [];

    this.reminderInfo.push({
                            reminderId : reminderId,
                            createDate : createDate,
                          });
    
    this.wfReminder.reminderDate = this.ns.toDateTimeString(reminderDate);
    this.wfReminder.alarmDate = alarmTime;
    this.wfReminder.title = title;
    this.wfReminder.reminder = reminder;
    this.wfReminder.userId = assignedTo;
    this.wfReminder.createdBy = createUser;
    this.wfReminder.updatedBy = updateUser;
    this.wfReminder.dateCreated = this.formatDate(createDate);
    this.wfReminder.lastUpdate = this.formatDate(updateDate);


    if (viewMode){
       this.wfReminder.ViewMode = true;
       this.wfReminder.disablebtnBool = true;
     } else {
       this.wfReminder.ViewMode = false;
       this.wfReminder.disablebtnBool = false;
     }

     $('#reminderModal #modalBtn').trigger('click');
   
  }

   updateReminderModal( reminderId : string,
    reminder : string, 
    reminderDate : string, 
    title : string,
    alarmTime : string, 
    assignedTo : string, 
    createUser: string,
    createDate : string,
    updateUser : string,
    updateDate : string ,
    updateMode : boolean){

    this.updateMode = updateMode;
    var status : any ;

    if (updateMode){
      status = 'C';
      $('#confirmModal #modalBtn').trigger('click');
    } else {
      status = 'D';
      $('#confirmModal #modalBtn').trigger('click');
    }
    this.updateReminderInfoParam = {};

    this.updateReminderInfoParam = {
       "alarmTime"  : alarmTime,
       "assignedTo" : assignedTo,
       "createDate" : this.ns.toDateTimeString(createDate),
       "createUser" : createUser,
       "remiderDate": this.ns.toDateTimeString(reminderDate),
       "reminder"   : reminder,
       "reminderId" : reminderId,
       "status"     : status,
       "title"      : title,
       "updateUser" : JSON.parse(window.localStorage.currentUser).username,
       "updateDate" : this.ns.toDateTimeString(0),
     }
  }

  onClickYes(updateMode){
    this.modalService.dismissAll();
    this.saveReminderParams(this.updateReminderInfoParam);
  }

  onClickNo(){
     this.modalService.dismissAll();
  }




  formatDate(date) {
    var d = new Date(date);
    return  ("00" + (d.getMonth() + 1)).slice(-2) + "/" +("00" + d.getDate()).slice(-2)+ "/" + d.getFullYear()+ " "+("00" + d.getHours()).slice(-2) + ":" +("00" + d.getMinutes()).slice(-2) 
    +":" + ("00" + d.getSeconds()).slice(-2) 
  }

  saveReminder(event){        
    $('#confirm-save #modalBtn2').trigger('click');
  }

  prepareParam(cancelFlag?){
      this.cancelFlag = cancelFlag !== undefined;

       var saveReminderInfoParam = {
       "alarmTime"  : this.wfReminder.alarmDate,
       "assignedTo" : this.wfReminder.userId,
       "createDate" : this.ns.toDateTimeString(this.reminderInfo[0].createDate),
       "createUser" : this.wfReminder.createdBy,
       "remiderDate": this.wfReminder.reminderDate,
       "reminder"   : this.wfReminder.reminder,
       "reminderId" : this.reminderInfo[0].reminderId,
       "status"     : "A",
       "title"      : this.wfReminder.title,
       "updateUser" : JSON.parse(window.localStorage.currentUser).username,
       "updateDate" : this.ns.toDateTimeString(0),
       }

       console.log(saveReminderInfoParam);
       this.saveReminderParams(saveReminderInfoParam);

    }

    saveReminderParams(obj){
     this.workFlowManagerService.saveWfmReminders(obj).pipe(finalize(() => this.saveFinalProcess())).
     subscribe(data => {
             console.log(data);

            if(data['returnCode'] === 0) {
                 this.dialogIcon = 'error-message';
                 this.dialogMessage = "Error saving reminder";
                 this.modalService.dismissAll();
                 this.onOkVar = 'openReminderMdl';
                 this.successDiag.open();
            } else if (data['returnCode'] === -1) {  
                 this.dialogIcon = 'success-message';
                 this.dialogMessage = "Successfully Saved";;
                 this.modalService.dismissAll();
                 this.onOkVar = 'closeReminderMdl';
                 this.successDiag.open();     
            }
     })        
    }
  
   saveFinalProcess(){
      if (this.selectedReminder == "atm"){
          this.retrieveReminders('atm');
      } else {
          this.retrieveReminders('mr');
      }
   }



  onOkSuccessDiag(obj){
    if (obj === 'openReminderMdl'){
      this.modalService.dismissAll();
      $('#reminderModal #modalBtn').trigger('click');
    }else if(obj === 'closeReminderMdl'){
        this.modalService.dismissAll();
    }
  }

}
