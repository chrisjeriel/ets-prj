import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-me-batch-proc',
  templateUrl: './me-batch-proc.component.html',
  styleUrls: ['./me-batch-proc.component.css']
})
export class MeBatchProcComponent implements OnInit {

 constructor( private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

}
