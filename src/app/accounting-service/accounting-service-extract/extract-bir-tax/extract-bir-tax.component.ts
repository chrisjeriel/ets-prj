import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-extract-bir-tax',
  templateUrl: './extract-bir-tax.component.html',
  styleUrls: ['./extract-bir-tax.component.css']
})
export class ExtractBirTaxComponent implements OnInit {

  @Output() onChange: EventEmitter<any> = new EventEmitter();
  taxType: any;
  defaultTab: false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

   tabController(event) {
   	this.taxType = event.target.value;
  	this.onChange.emit(this.taxType);
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }

}
