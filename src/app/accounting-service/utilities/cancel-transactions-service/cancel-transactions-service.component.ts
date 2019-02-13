import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cancel-transactions-service',
  templateUrl: './cancel-transactions-service.component.html',
  styleUrls: ['./cancel-transactions-service.component.css']
})
export class CancelTransactionsServiceComponent implements OnInit {

  constructor( private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-Service | Cancel Transactions");
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
