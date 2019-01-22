import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-generate-number-series',
	templateUrl: './generate-number-series.component.html',
	styleUrls: ['./generate-number-series.component.css']
})
export class GenerateNumberSeriesComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit() {
	}


	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.router.navigateByUrl('');
		}
	}
}
