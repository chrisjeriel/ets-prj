import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, DoCheck } from '@angular/core';
import { NotesService } from '@app/_services'

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit, OnChanges, AfterViewInit, DoCheck {
  constructor(private ns: NotesService) { }
  datepickerVal: any = null;
  minimumDate: any = null;
  ev: any = null;

  @Output() outVal = new EventEmitter<any>();

  @Input() type: string = 'datetime';
  @Input() showIcon: boolean = true;
  @Input() showSeconds: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() textAlign: string = 'left';
  @Input() value: string = null;
  @Input() minDate: string = '1970-01-01';
  @Input() maxDate: string = '';
  @Input() disabledDays: any[] = null;
  @Input() disabledDates: any[] = null;

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
    		console.log('here value');
    		console.log(changes.value);
    		this.datepickerVal = changes.value.currentValue == '' ? null : new Date(changes.value.currentValue);
    	}  	  	    	
    }

    if(changes.minDate && changes.minDate.currentValue) {
    	console.log('here');
    	console.log(changes.minDate);
    	this.minimumDate = changes.minDate.currentValue == '' ? null : new Date(changes.minDate.currentValue);
    }
  }

  ngDoCheck() {
  // 	if(this.value != null && this.type == 'time' && this.ns.toDateTimeString(this.datepickerVal).split('T')[1] != this.value) {    		
  // 		var d = new Date();
  // 		var hrs = Number(this.value.split(':')[0]);
		// var mins = Number(this.value.split(':')[1]);
		// d.setHours(hrs, mins);

  // 		this.datepickerVal = d;
  // 	} else if(this.value != null && this.type == 'date' && this.ns.toDateTimeString(this.datepickerVal).split('T')[0] != this.value) {
  // 		this.datepickerVal = this.value == '' ? null : new Date(this.value);
  // 	} CAPTAIN BUGGY
  	
  	
  	if(this.minimumDate != null && this.ns.toDateTimeString(this.minimumDate).split('T')[0] != this.minDate) {
  		this.minimumDate = this.minDate == '' ? null : new Date(this.minDate);
  	}
  }

  ngAfterViewInit() {
  	$('.ui-inputtext').attr("mask","999");
  }

  valueChanged() {
  	var dateString = this.ns.toDateTimeString(this.type == 'datetime' && this.datepickerVal != null ? this.datepickerVal : this.datepickerVal == null ? '' : this.datepickerVal.setSeconds(0));

  	switch (this.type) {
  		case "datetime":  	
  			dateString = this.datepickerVal == null ? '' : dateString;
  			break;

  		case "date":  			
  			dateString = this.datepickerVal == null ? '' : dateString.split('T')[0];
  			break;

  		case "time":
  			dateString = this.datepickerVal == null ? '' : dateString.split('T')[1];
  			break;
  	}

  	this.outVal.emit(dateString);
  }

  clearInput(ev) {
  	console.log(ev);
  }

  onBlur(ev) {
  	this.ev = ev;
  	if(this.datepickerVal == null && this.required) {
  		$(ev.target).css('boxShadow', 'rgb(255, 51, 51) 0px 0px 5px');
  	} else if(this.datepickerVal != null && this.required) {
  		$(ev.target).css('boxShadow', 'none');
  	}
  }

  onSelect() {
  	$(this.ev.target).focus();
  	$(this.ev.target).blur();
  }
}
