import { Component, OnInit ,OnChanges,Input,Output,EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-jv-entry',
  templateUrl: './jv-entry.component.html',
  styleUrls: ['./jv-entry.component.css']
})
export class JvEntryComponent implements OnInit {

  @Input() record: any = {
                  jvType: null
                 };

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Journal Voucher");
  	this.onChange.emit({ type: this.record.jvType });
  }

  tabController(event) {
  	this.onChange.emit({ type: this.record.jvType });
  }

  newJV(){
    
  }

}
