import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit, OnChanges {
  
  @Input() options:any = null;
  @Input() editable:boolean = true;
  @Output() valueChange = new EventEmitter<any>();

  values : any;
  prevVal: any;
  dropdownVal: any = null;

  constructor() { 
  }

  ngOnInit() {
  	this.values = this.options;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.values = changes.options.currentValue;
    console.log(this.values)
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
