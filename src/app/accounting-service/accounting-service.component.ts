import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accounting-service',
  templateUrl: './accounting-service.component.html',
  styleUrls: ['./accounting-service.component.css']
})
export class AccountingServiceComponent implements OnInit {
  
  paymentType: string = "";
  record: any = {
                   arNo: null,
                   payor: null,
                   arDate: null,
                   paymentType: null,
                   status: null,
                   particulars: null,
                   amount: null
                 };

  constructor(private router: Router, private titleService: Title) { }

  ngOnInit() {
  }

  checkTabs(event) {
  	var type = event.type;
  	this.paymentType = type;  	
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('acct-or-listings');
    }
  }
}
