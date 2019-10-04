import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { NotesReminders } from '@app/_models';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notesRemindersData : NotesReminders[] = [];

  formGroup: FormGroup = new FormGroup({});

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
    if(millis == null) {
     return '';
    }
    var d = (millis == 0) ? new Date() : new Date(millis);

    function pad(num) {
      return (num < 10) ? '0' + num : num;
    }

    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  toDate(s:string):Date{
    let dateString = s.split('T')[0];
    let timeString = s.split('T')[1];
    return new Date(
                    parseInt(dateString.split('-')[0]),
                    parseInt(dateString.split('-')[1])-1,
                    parseInt(dateString.split('-')[2]),
                    parseInt(timeString.split(':')[0]),
                    parseInt(timeString.split(':')[1]),
                    parseInt(timeString.split(':')[2]),
                  );
  }

  lovLoader(ev, num){
    if(ev != null) {
      var ic = $(ev.target).next().find('i');
      
      if(num == 0) {
        if(ic.closest('td').length == 0) {
          ic.closest('div').css('font-size', '14px');
        }
        ic.removeClass('fa-spinner fa-spin');
        ic.closest('div').css('pointer-events', 'initial');
      } else if(num == 1) {
        ic.addClass('fa-spinner fa-spin');
        ic.closest('div').css('pointer-events', 'none').css('font-size', '13px');
      }  
    }       
  }

  getCurrentUser() {
    return JSON.parse(window.localStorage.currentUser).username;
  }

  dateConstructor(ev, data, type) {
    if(data != null && data != '') {
      var dArr = data.split('T');

      if(type == 'd') {
        dArr[0] = ev;
      } else if(type == 't') {
        dArr[1] = ev;
      }

      return dArr.join('T') == 'T' ? '' : dArr.join('T');  
    } else {
      return type == 'd' ? ev + 'T' : type == 't' ? 'T' + ev : '';
    }
  }

  clearFormGroup() {
    Object.keys(this.formGroup.controls).forEach(a => {
      this.formGroup.removeControl(a);
    });

    this.formGroup.reset();
  }
  
}
