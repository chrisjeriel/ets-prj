import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mon-end-trial-bal',
  templateUrl: './mon-end-trial-bal.component.html',
  styleUrls: ['./mon-end-trial-bal.component.css']
})
export class MonEndTrialBalComponent implements OnInit {

  tranDate: string = '';
  inclPrevMon: boolean = true;
  inclPrevYrs: boolean = true;
  adjEntsOnly: boolean = true;

  constructor( private router: Router) { }

  ngOnInit() {
  }
  
   onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

}
