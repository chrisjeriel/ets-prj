import { Component, OnInit,Input } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkFlowManagerService,NotesService } from '@app/_services';

@Component({
  selector: 'app-wf-reminder-form',
  templateUrl: './wf-reminder-form.component.html',
  styleUrls: ['./wf-reminder-form.component.css']
})
export class WfReminderFormComponent implements OnInit {
  @Input() reminderInfo: {
  	    alarmTime: '',
		assignedTo: '',
		createDate: '',
		createUser: '',
		reminder: '',
		reminderDate:'',
		reminderId: '',
		title: '',
		updateDate: '',
		updateUser: ''
  }
  
  reminderDate: any;
  alarmDate: any;
  title: string = "";
  reminder: string = "";
  userId: string = "";
  ViewMode: boolean = true;	

  createInfo:any = {
	createdBy: null,
	dateCreated: null
  }

  updateInfo: any = {
  	updatedBy: null,
  	lastUpdate: null
  }

  constructor(config: NgbModalConfig,
     private modalService: NgbModal,private workFlowManagerService: WorkFlowManagerService, private ns: NotesService) { }

  ngOnInit() {
  	console.log(this.reminderInfo);
  }

  


}
