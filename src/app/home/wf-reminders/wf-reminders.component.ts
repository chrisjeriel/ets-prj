import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkFlowManagerService,NotesService } from '@app/_services';
import { finalize } from 'rxjs/operators';


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

  constructor(private workFlowManagerService: WorkFlowManagerService, private ns: NotesService) { }

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
       $("#reminderDiv").css({"height": "auto"});
       this.workFlowManagerService.retrieveWfmReminders('',this.currentUser,'').pipe(finalize(() => this.setReminderList()))
       .subscribe((data)=>{
           console.log(data);
           var records = data['reminderList'];
               for(let rec of records){
                 if(rec.assignedTo === this.currentUser){
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
      $("#reminderDiv").css({"height": "auto"});
       this.workFlowManagerService.retrieveWfmReminders('','',this.currentUser).pipe(finalize(() => this.setReminderList()))
       .subscribe((data)=>{
           console.log(data);
           var records = data['reminderList'];
               for(let rec of records){
                 if(rec.createUser === this.currentUser){
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

 

}
