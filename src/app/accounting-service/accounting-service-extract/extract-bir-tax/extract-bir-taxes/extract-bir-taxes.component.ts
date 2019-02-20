import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-extract-bir-taxes',
  templateUrl: './extract-bir-taxes.component.html',
  styleUrls: ['./extract-bir-taxes.component.css']
})
export class ExtractBirTaxesComponent implements OnInit {


  @Output() onChange: EventEmitter<any> = new EventEmitter();
  taxType: any = 'Creditable Withholding Tax';
  defaultTab: false;

  constructor() { }

  ngOnInit() {
  }

   tabController(event) {
   	this.taxType = event.target.value;
  	this.onChange.emit(this.taxType);
  }

}
