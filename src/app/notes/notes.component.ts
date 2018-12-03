import { Component, OnInit } from '@angular/core';
import { NotesService } from '../_services';
import { NotesReminders } from '../_models';

@Component({
	selector: 'app-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
	tableData: any[] = [];
	tHeader: any[] = [];
	dataTypes: any[] = [];
	nData: NotesReminders = new NotesReminders(null, null, null, null, null, null, 'user', new Date());

	constructor(private notesService: NotesService) { }

	ngOnInit() {
		this.tHeader.push("Type");
		this.tHeader.push("Details");
		this.tHeader.push("Alarm User");
		this.tHeader.push("Alarm Date");
		this.tHeader.push("Alarm Time");
		this.tHeader.push("Status");
		this.tHeader.push("Created By");
		this.tHeader.push("Date Created");

		this.dataTypes.push("select");
		this.dataTypes.push("text");
		this.dataTypes.push("text");
		this.dataTypes.push("date");
		this.dataTypes.push("text");
		this.dataTypes.push("text");
		this.dataTypes.push("text");
		this.dataTypes.push("date");

		this.tableData = this.notesService.getNotesReminders();
	}

}
