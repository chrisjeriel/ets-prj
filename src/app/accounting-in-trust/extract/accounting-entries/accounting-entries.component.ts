import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accounting-entries',
  templateUrl: './accounting-entries.component.html',
  styleUrls: ['./accounting-entries.component.css']
})
export class AccountingEntriesComponent implements OnInit {

  constructor(private router: Router,private route: ActivatedRoute) { }

  sub: any;
  activeID: string;
  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
  		this.activeID = params['tabID'];
  	});

  }

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  }
}
