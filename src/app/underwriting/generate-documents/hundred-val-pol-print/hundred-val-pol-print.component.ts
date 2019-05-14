import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hundred-val-pol-print',
  templateUrl: './hundred-val-pol-print.component.html',
  styleUrls: ['./hundred-val-pol-print.component.css']
})
export class HundredValPolPrintComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {            
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

}
