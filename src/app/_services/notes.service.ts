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

  listParams:any;

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
    let timeString = s.split('T')[1] != undefined ? s.split('T')[1] : '00:00:00' ;
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

  getCurrentUserFullName() {
    return JSON.parse(window.localStorage.currentUser).firstName;
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
  
  export(name, query, tableData) {
    var currDate = this.toDateTimeString(0).replace(':', '.');
    var fileName = name + '_' + currDate + '.xls';
    
    var mystyle = {
      headers: true, 
      column: {style:{Font:{Bold:"1"}}}
    };

    var opts = {
              headers:true,
              column: {
                    style:{
                      Font:{
                          Bold:"1",
                          Color:"#3C3741",
                      },
                      Alignment:{
                          Horizontal:"Center"
                      },
                      Interior:{
                          Color:"#7CEECE",
                          Pattern:"Solid"
                      },
                  }
              }
            };
              
    alasql.fn.datetime = function(dateStr) {
      var date = new Date(dateStr);
      return date.toLocaleString();
    };

    alasql.fn.currency = function(currency) {
      // var parts = parseFloat(currency).toFixed(2).split(".");
      // var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
      //     (parts[1] ? "." + parts[1] : "");
      return currency;
    };

    alasql.fn.truncDate = function(str) {
      // var parts = parseFloat(currency).toFixed(2).split(".");
      // var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
      //     (parts[1] ? "." + parts[1] : "");
      return str==null ? '' : str.substr(0,10);
    };

     var into = "INTO XLSXML('" + fileName + "', ?)";
     alasql.promise(query + ' ' + into + ' FROM ?', [opts,tableData]);
  }

  setListParams(params){
    this.listParams = JSON.parse(JSON.stringify(params));
    this.listParams['paginationRequest.position'] = 1;
    this.listParams.recount = 'Y';
  }
}
