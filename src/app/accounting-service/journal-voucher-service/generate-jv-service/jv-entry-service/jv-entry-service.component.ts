import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-jv-entry-service',
  templateUrl: './jv-entry-service.component.html',
  styleUrls: ['./jv-entry-service.component.css']
})
export class JvEntryServiceComponent implements OnInit {
   
  @Input() data: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acc-Service | Journal Voucher");
  }

  tabController(event) {
  	this.onChange.emit(this.data);
  }
}

