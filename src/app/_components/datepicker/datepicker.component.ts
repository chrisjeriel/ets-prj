import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, DoCheck, Renderer2, ViewChild } from '@angular/core';
import { NotesService } from '@app/_services'

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit, OnChanges, AfterViewInit, DoCheck {

  constructor(private ns: NotesService, private r2: Renderer2) { }

  datepickerVal: any = null;
  minimumDate: any = null;
  ev: any = null;
  inputStyeClass: string = 'form-control form-control-sm';
  icon: string = 'fa fa-calendar';

  @Output() outVal = new EventEmitter<any>();
  @Output() onFocus = new EventEmitter<any>();

  @Input() type: string = 'datetime';
  @Input() showIcon: boolean = true;
  @Input() showSeconds: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() textAlign: string = 'left';
  @Input() value: string = null;
  @Input() minDate: string = '1970-01-01';
  @Input() maxDate: string = '';
  @Input() disabledDates: any[] = null;
  @Input() disabledDays: any[] = null;
  @Input() tabindex: any = null;
  @Input() name: any = null;
  @Input() table: boolean = false;

  spanStyle: any = {
  	width: '100%',
  	position: 'absolute',
  	display: 'contents'
  }

  inputStyle: any = {
  	position: 'relative',
  	backgroundColor: 'transparent',
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

  	if(this.table) {
  		this.spanStyle['minWidth'] = '9em';
  		this.inputStyeClass += ' tbl-dp';
  	}

  	if((this.table && !this.showIcon) || this.type == 'time') {
  		this.spanStyle['display'] = 'block';
  		this.spanStyle['position'] = 'relative';
  		this.spanStyle['marginTop'] = '-6px';  	
  	}
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.value && changes.value.currentValue) {
    	if(this.type == 'time') {
    		if(this.value != '') {  		
	    		var d = new Date();
	    		var hrs = Number(changes.value.currentValue.split(':')[0]);
	    		var mins = Number(changes.value.currentValue.split(':')[1]);
	    		d.setHours(hrs, mins, 0);

	    		this.datepickerVal = d;
    		} else {
  				this.datepickerVal = null;
  			}
    	} else {
    		this.datepickerVal = changes.value.currentValue == '' ? null : new Date(changes.value.currentValue);
    	}  	  	    	
    }

    if(changes.minDate && changes.minDate.currentValue) {
    	this.minimumDate = changes.minDate.currentValue == '' ? null : new Date(changes.minDate.currentValue);
    }
  }

  ngDoCheck() {
  	if(this.datepickerVal != null && this.type == 'time' && this.ns.toDateTimeString(this.datepickerVal).split('T')[1] != this.value) {
  		if(this.value != '') {
  			var d = new Date();
  			var hrs = Number(this.value.split(':')[0]);
  			var mins = Number(this.value.split(':')[1]);
  			d.setHours(hrs, mins, 0);

  			this.datepickerVal = d;	
  		} else {
  			this.datepickerVal = null;
  		}  		
  	} else if(this.datepickerVal != null && this.type == 'date' && this.ns.toDateTimeString(this.datepickerVal).split('T')[0] != this.value) {
  		this.datepickerVal = this.value == '' ? null : new Date(this.value);
  	}	
  	
  	if(this.minimumDate != null && this.ns.toDateTimeString(this.minimumDate).split('T')[0] != this.minDate) {
  		this.minimumDate = this.minDate == '' ? null : new Date(this.minDate);
  	}
  }

  ngAfterViewInit() {  	
  	/*FOR MASKING - IN PROGRESS*/
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

  onClearClick() {
  	if(this.datepickerVal == null && this.required) {
  		$(this.ev.target).css('boxShadow', 'rgb(255, 51, 51) 0px 0px 5px');
  	} else if(this.datepickerVal != null && this.required) {
  		$(this.ev.target).css('boxShadow', 'none');
  	}
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

  focused() {
  	setTimeout(() => { 
  		$('.ui-datepicker-title').addClass('input-group').attr('style', 'padding: 0 15px 5px !important');
  		$('.ui-datepicker-month').addClass('form-control form-control-sm cust-sm col-sm-6');
  		$('.ui-datepicker-year').addClass('form-control form-control-sm cust-sm col-sm-6');
  	}, 0);

  	this.onFocus.emit();
  }
}
