import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-funds-held',
  templateUrl: './funds-held.component.html',
  styleUrls: ['./funds-held.component.css']
})
export class FundsHeldComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }
}
