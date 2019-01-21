import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accounting-entries',
  templateUrl: './accounting-entries.component.html',
  styleUrls: ['./accounting-entries.component.css']
})
export class AccountingEntriesComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
