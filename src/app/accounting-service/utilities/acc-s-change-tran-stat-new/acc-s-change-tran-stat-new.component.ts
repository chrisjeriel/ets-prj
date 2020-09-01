import { Component, OnInit } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acc-s-change-tran-stat-new',
  templateUrl: './acc-s-change-tran-stat-new.component.html',
  styleUrls: ['./acc-s-change-tran-stat-new.component.css']
})
export class AccSChangeTranStatNewComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }
}
