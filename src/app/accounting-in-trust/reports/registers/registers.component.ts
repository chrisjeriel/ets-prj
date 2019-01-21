import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
	selector: 'app-registers',
	templateUrl: './registers.component.html',
	styleUrls: ['./registers.component.css']
})
export class RegistersComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit() {
	}


	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.router.navigateByUrl('');
		}
	}
}
