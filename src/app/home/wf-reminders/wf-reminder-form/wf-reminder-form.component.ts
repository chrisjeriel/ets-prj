import { Component, OnInit,Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkFlowManagerService,NotesService } from '@app/_services';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';


@Component({
  selector: 'app-wf-reminder-form',
  templateUrl: './wf-reminder-form.component.html',
  styleUrls: ['./wf-reminder-form.component.css']
})

export class WfReminderFormComponent implements OnInit {

  @Output() onYes: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

  reminderDate: any;
  alarmDate: any; 
  title: string = "";
  reminder: string = "";
  userId: string = "";
  createdBy: string = "";
  dateCreated: string = "";
  updatedBy: string = "";
  lastUpdate: string = "";
  ViewMode: boolean = true;	
  disablebtnBool: boolean = true;
  reminderInfo: any[] =[];
  dialogIcon:string  = "";
  dialogMessage:string  = "";


  constructor(config: NgbModalConfig,
     public modalService: NgbModal,private workFlowManagerService: WorkFlowManagerService, private ns: NotesService) { }

  ngOnInit() {
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
    this.successDiag.open();
    return false;
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

  toTimeString(millis: any) {
    var d = (millis == 0) ? new Date() : new Date(millis);
    function pad(num) {
      return (num < 10) ? '0' + num : num;
    }
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  onClickSave(){
    this.disablebtnBool = false;
    var reminderTime = this.toTimeString(Date.parse(this.reminderDate));  
    if (this.isEmptyObject(this.reminderDate) || this.isEmptyObject(this.reminder)){
        this.openErrorDiag()
        this.disablebtnBool = false;
      } else {
        if (this.isEmptyObject(this.alarmDate)){
         this.onYes.emit();
        } else {
          if(this.setAlarmTime(reminderTime,this.alarmDate)){
            this.onYes.emit();
          }
        }
      }
  }

  onOkSuccessDiag(){
    this.modalService.dismissAll();
    $('#reminderModal #modalBtn').trigger('click');
  }

  openErrorDiag(){
    this.dialogIcon = "error-message";
    this.dialogMessage = "Please fill required fields";
    this.successDiag.open();
}
  

}
