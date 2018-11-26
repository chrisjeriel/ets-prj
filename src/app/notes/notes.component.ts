import { Component, OnInit } from '@angular/core';
import { NotesService } from '../_services';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];

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

  	this.tableData = this.notesService.getNotesReminders();
  }

}
