import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  
  @Input() options:any;
  @Input() editable:boolean = true;

  values : any;

  constructor() { 
  }

  ngOnInit() {
  	this.values = this.options;
  	console.log(this.options)
  }

}
