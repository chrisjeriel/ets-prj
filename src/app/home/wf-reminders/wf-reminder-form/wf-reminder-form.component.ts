import { Component, OnInit,Input } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkFlowManagerService,NotesService } from '@app/_services';

@Component({
  selector: 'app-wf-reminder-form',
  templateUrl: './wf-reminder-form.component.html',
  styleUrls: ['./wf-reminder-form.component.css']
})
export class WfReminderFormComponent implements OnInit {

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

  constructor(config: NgbModalConfig,
     private modalService: NgbModal,private workFlowManagerService: WorkFlowManagerService, private ns: NotesService) { }

  ngOnInit() {
  }
  

}
