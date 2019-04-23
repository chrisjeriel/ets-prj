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
  		new NotesReminders('Reminder', 'Call Mr. Bean later', 'cuaresma', new Date('2015-02-28'), new Date('2015-02-28 16:00'), 'Pending',
  			'cuaresma', new Date('2015-02-28'))
  	]

  	return this.notesRemindersData;
  }

  toDateTimeString(millis: any) {
    var d = (millis == 0) ? new Date() : new Date(millis);

    function pad(num) {
      return (num < 10) ? '0' + num : num;
    }

    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  lovLoader(ev, num){
    if(ev != null) {
      var ic = $(ev.target).next().find('i');

      if(num == 0) {
        ic.removeClass('fa-spinner fa-spin')
        ic.closest('div').css('pointer-events', 'initial');
      } else if(num == 1) {
        ic.addClass('fa-spinner fa-spin');
        ic.closest('div').css('pointer-events', 'none');
      }  
    }       
  }

  getCurrentUser() {
    return JSON.parse(window.localStorage.currentUser).username;
  }
  
}
