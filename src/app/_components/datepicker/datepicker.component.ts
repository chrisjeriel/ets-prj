import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, DoCheck, ViewChild } from '@angular/core';
import { NotesService } from '@app/_services'

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit, OnChanges, DoCheck {

  constructor(private ns: NotesService) { }

  private datepickerVal: any = null;
  private minimumDate: any = null;
  private maximumDate: any = null;
  private ev: any = null;
  private inputStyeClass: string = 'form-control form-control-sm';
  private icon: string = 'fa fa-calendar';
  
  private spanStyle: any = {
  	width: '100%',
  	position: 'absolute',
  	display: 'contents'
  }

  private inputStyle: any = {
  	position: 'relative',
  	backgroundColor: 'transparent',
  }

  @Input() value: string = null;
  @Output() valueChange = new EventEmitter<any>();
  @Output() onFocus = new EventEmitter<any>();

  @Input() type: string = 'datetime';
  @Input() showIcon: boolean = true;
  @Input() showSeconds: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() textAlign: string = 'left';  
  @Input() minDate: string = '1970-01-01';
  @Input() maxDate: string = '2120-12-31';
  @Input() disabledDates: any[] = null;
  @Input() disabledDays: any[] = null;
  @Input() tabindex: any = null;
  @Input() name: any = null;
  @Input() table: boolean = false;

  ngOnInit() {
    this.minimumDate = new Date(this.minDate);
    this.maximumDate = new Date(this.maxDate);
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
  		this.spanStyle['minWidth'] = this.type == 'time' ? '1px' : '9em';
  		this.inputStyeClass += ' tbl-dp';
  	}

  	if(this.table && !this.showIcon) {
  		this.spanStyle['display'] = 'block';
  		this.spanStyle['position'] = 'relative';
  		this.spanStyle['marginTop'] = '-6px';  	
  	}
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.value && changes.value.currentValue) {
      if(typeof changes.value.currentValue != 'string') {
        return;
      }

    	if(this.type == 'time') {
    		if(this.value != '' && this.value != null && this.value != 'undefined') {
	    		var d = new Date();
	    		var hrs = Number(changes.value.currentValue.split(':')[0]);
	    		var mins = Number(changes.value.currentValue.split(':')[1]);
	    		d.setHours(hrs, mins, 0);
	    		this.datepickerVal = d;
    		} else {
  				this.datepickerVal = null;
  			}
    	} else {
    		this.datepickerVal = changes.value.currentValue == '' || changes.value.currentValue == null ? null : new Date(changes.value.currentValue);
    	}
    }

    if(changes.minDate && changes.minDate.currentValue) {
    	this.minimumDate = changes.minDate.currentValue == '' ? null : new Date(changes.minDate.currentValue);
    }
  }

  ngDoCheck() {
  	if(this.datepickerVal != null && this.type == 'time' && this.ns.toDateTimeString(this.datepickerVal).split('T')[1] != this.value.substring(0, 5) + ':00') {
  		if(this.value != '' && this.value != null && this.value != 'undefined') {
  			var d = new Date();
  			var hrs = Number(this.value.split(':')[0]);
  			var mins = Number(this.value.split(':')[1]);
  			d.setHours(hrs, mins, 0);

  			this.datepickerVal = d;	
  		} else {
  			this.datepickerVal = null;
  		}  		
  	} else if(this.datepickerVal != null && this.type == 'date' && this.ns.toDateTimeString(this.datepickerVal).split('T')[0] != this.value) {
  		this.datepickerVal = this.value == '' || this.value == null ? null : new Date(this.value);
  	} else if(this.datepickerVal != null && this.type == 'datetime' && this.ns.toDateTimeString(this.datepickerVal) != this.value){
      this.datepickerVal = this.value == '' || this.value == null ? null : new Date(this.value);
    }
  	
  	if(this.minimumDate != null && this.ns.toDateTimeString(this.minimumDate).split('T')[0] != this.minDate) {
  		this.minimumDate = this.minDate == '' ? null : new Date(this.minDate);
  	}
  }

  valueUpdated() {
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

  	this.valueChange.emit(dateString);
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
  	/*setTimeout(() => { 
  		$('.ui-datepicker-title').addClass('input-group').attr('style', 'padding: 0 15px 5px !important');
  		$('.ui-datepicker-month').addClass('form-control form-control-sm cust-sm col-sm-7');
  		$('.ui-datepicker-year').addClass('form-control form-control-sm cust-sm col-sm-5');
  	}, 0);*/ //REMOVED BECAUSE OF STYLE BUG

  	this.onFocus.emit();
  }
}
