import { Component, OnInit } from '@angular/core';
import { NotesService } from '../_services';
import { NotesReminders } from '../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
	tableData: any[] = [];
	tHeader: any[] = [];
	dataTypes: any[] = [];
	opts: any[] = [];
	nData: NotesReminders = new NotesReminders(null, null, null, null, null, null, 'user', new Date());
	mdlConfig = {
		mdlType: "confirmation",
		confirmationMsg: "Do you want to save the changes you have made?"
	};

  passData: any = {
        tableData:[],
        tHeader:[],
        magnifyingGlass:[],
        options:[],
        dataTypes:[],
        opts:[],
        addFlag: true,
        editFlag: true,
        paginateFlag: true,
        searchFlag: true,
        nData: {}
    };

	constructor(private notesService: NotesService, private modalService: NgbModal, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Notes and Reminders");
		this.passData.tHeader.push("Type");
		this.passData.tHeader.push("Details");
		this.passData.tHeader.push("Alarm User");
		this.passData.tHeader.push("Alarm Date");
		this.passData.tHeader.push("Alarm Time");
		this.passData.tHeader.push("Status");
		this.passData.tHeader.push("Created By");
		this.passData.tHeader.push("Date Created");

		this.passData.dataTypes.push("select");
		this.passData.dataTypes.push("text");
		this.passData.dataTypes.push("text");
		this.passData.dataTypes.push("date");
		this.passData.dataTypes.push("time");
		this.passData.dataTypes.push("select");
		this.passData.dataTypes.push("text");
		this.passData.dataTypes.push("datetime");

		this.passData.opts.push({ selector: "type", vals: ["Reminder", "Note"] },
			{ selector: "status", vals: ["N/A", "Pending", "Done"] });

		this.passData.tableData = this.notesService.getNotesReminders();

    this.passData.nData = {
          type: "",
          details: "",
          alarmUser: "",
          alarmDate: "",
          alarmTime: "",
          status: "",
          createdBy: "",
          dateCreated: ""
        }
	}
}
