import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-me-trial-bal-proc',
  templateUrl: './me-trial-bal-proc.component.html',
  styleUrls: ['./me-trial-bal-proc.component.css']
})
export class MeTrialBalProcComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }
  
   onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

}
