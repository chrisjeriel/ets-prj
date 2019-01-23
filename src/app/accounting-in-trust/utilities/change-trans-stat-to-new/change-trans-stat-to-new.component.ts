import { Component, OnInit } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-trans-stat-to-new',
  templateUrl: './change-trans-stat-to-new.component.html',
  styleUrls: ['./change-trans-stat-to-new.component.css']
})
export class ChangeTransStatToNewComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
