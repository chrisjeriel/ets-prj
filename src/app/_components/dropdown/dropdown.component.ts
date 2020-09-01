import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, DoCheck } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit, OnChanges, DoCheck {
  
  @Input() options:any = null;
  @Input() editable:boolean = true;
  @Output() valueChange = new EventEmitter<any>();

  values : any = null;
  prevVal: any;
  dropdownVal: any = null;

  constructor() { 
  }

  ngOnInit() {
  	this.values = this.options;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    this.values = changes.options.currentValue;
  }

  ngDoCheck() {
    /*if(this.values != null && this.values != this.options) {
      this.values = this.options;
    }*/
  }

  updateValue(data){

  }

  focus(data){
    this.prevVal = data.target.value;
  }

  blur(data){
    if(this.prevVal !== data.target.value){
      this.valueChange.emit(data.target.value)
    }
  }
}
