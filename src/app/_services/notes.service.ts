import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { NotesReminders } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notesRemindersData : NotesReminders[] = [];

  constructor(private http: HttpClient) {

  }

  getNotesReminders() {
  	this.notesRemindersData = [
  		new NotesReminders('Reminder', 'Call Mr. Bean later', 'cuaresma', new Date('02-28-2015'), '4:00 PM', 'Pending',
  			'cuaresma', new Date('02-28-2015'))
  	]

  	return this.notesRemindersData;
  }
}
