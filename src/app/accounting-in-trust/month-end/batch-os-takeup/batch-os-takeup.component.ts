import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-batch-os-takeup',
  templateUrl: './batch-os-takeup.component.html',
  styleUrls: ['./batch-os-takeup.component.css']
})
export class BatchOsTakeupComponent implements OnInit {

 constructor( private router: Router) { }

  ngOnInit() {
  }
  
  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }
}
