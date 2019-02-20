import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-jv-entry-service',
  templateUrl: './jv-entry-service.component.html',
  styleUrls: ['./jv-entry-service.component.css']
})
export class JvEntryServiceComponent implements OnInit {
   
  @Input() data: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  tabController(event) {
  	this.onChange.emit(this.data);
  	console.log(this.data);
  }

}
