import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generate-number-series-service',
  templateUrl: './generate-number-series-service.component.html',
  styleUrls: ['./generate-number-series-service.component.css']
})
export class GenerateNumberSeriesServiceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
  	if ($event.nextId === 'Exit') {
  		this.router.navigateByUrl('');
  	}
  }
}
