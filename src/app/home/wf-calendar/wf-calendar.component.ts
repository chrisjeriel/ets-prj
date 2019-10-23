import { Component, OnInit, Input } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkFlowManagerService } from '@app/_services';

@Component({
  selector: 'app-wf-calendar',
  templateUrl: './wf-calendar.component.html',
  styleUrls: ['./wf-calendar.component.css']
})
export class WfCalendarComponent implements OnInit {

  constructor(public modalService: NgbModal, private workFlowService : WorkFlowManagerService) { }
  
  events: any[] = [];
  options: any;
  today: any = new Date();
  eventsHolder: any[] = [];


  ngOnInit() {

    this.options = {
        plugins:[ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        defaultDate: this.today,
        header: {
            left: 'prev', /*left: 'prev,next',*/
            center: 'title',
            right: 'today,next'
/*                right: 'dayGridMonth,timeGridWeek,timeGridDay'*/
        },
        editable: false
    };

    this.loadData();
  }

  loadData() {
  	var currentUser = JSON.parse(window.localStorage.currentUser).username;
  	var eventsHolder = [];

    this.workFlowService.retrieveWfmReminders('',currentUser,'','','', '').subscribe((data)=>{
       var records = data['reminderList'];
       	console.log(records.length);
       	
           for(let rec of records){
               eventsHolder.push({
                 "title" : rec.title,
                 "start" : rec.reminderDate.substring(0, 10),
               });
           }

        this.events = eventsHolder;
    },
    error => {
      console.log("ERROR:::" + JSON.stringify(error));
    });
  }

}
