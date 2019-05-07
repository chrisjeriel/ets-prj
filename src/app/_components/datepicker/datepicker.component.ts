import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NotesService } from '@app/_services'

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit, OnChanges {

  constructor(private ns: NotesService) { }
  datepickerVal: any = new Date();
  minimumDate: any = null;

  @Output() outVal = new EventEmitter<any>();

  @Input() type: string = 'datetime';
  @Input() showIcon: boolean = true;
  @Input() showSeconds: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() textAlign: string = 'left';
  @Input() value: string = new Date().toString();
  @Input() minDate: string = '1970-01-01';
  @Input() maxDate: string = '';

  spanStyle: any = {
  	width: '100%',
  	position: 'absolute',
  	display: 'contents'
  }

  inputStyle: any = {
  	position: 'relative',
  	backgroundColor: '#ffffff',
  }

  ngOnInit() {
  	/*this.minimumDate = new Date(this.minDate);

  	if(this.type == 'time') {
  		var d = new Date();
  		var hrs = Number(this.value.split(':')[0]);
  		var mins = Number(this.value.split(':')[1]);
  		d.setHours(hrs, mins);

  		this.datepickerVal = d;
  	} else {
  		this.datepickerVal = new Date(this.value);
  	}*/  	
  	this.inputStyle['textAlign'] = this.textAlign;

  	if(this.required) {
  		this.inputStyle['backgroundColor'] = '#fffacd85';
  	}

  	if(this.showIcon && this.type != 'time') {
  		this.spanStyle['position'] = 'relative';
  		this.spanStyle['display'] = 'block';
  		this.inputStyle['position'] = 'absolute';
  	}
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.value && changes.value.currentValue) {
    	if(this.type == 'time') {    		
    		var d = new Date();
    		var hrs = Number(changes.value.currentValue.split(':')[0]);
    		var mins = Number(changes.value.currentValue.split(':')[1]);
    		d.setHours(hrs, mins);

    		this.datepickerVal = d;
    	} else {
    		this.datepickerVal = new Date(changes.value.currentValue);
    	}  	  	    	
    } else if(changes.minDate && changes.minDate.currentValue) {
    	this.minimumDate = new Date(changes.minDate.currentValue);
    }
  }

  valueChanged() {
  	var dateString = this.ns.toDateTimeString(this.type == 'datetime' ? this.datepickerVal : this.datepickerVal == null ? '' : this.datepickerVal.setSeconds(0));

  	switch (this.type) {
  		case "datetime":  	
  			this.outVal.emit(dateString);
  			break;

  		case "date":
  		console.log(dateString.split('T')[0]);
  			this.outVal.emit(dateString.split('T')[0]);
  			break;

  		case "time":
  			this.outVal.emit(dateString.split('T')[1]);
  			break;
  	}  
  }

  clearInput() {
  	this.datepickerVal = null;
  	this.valueChanged();
  }

}
