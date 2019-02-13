import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-registers-service',
  templateUrl: './registers-service.component.html',
  styleUrls: ['./registers-service.component.css']
})
export class RegistersServiceComponent implements OnInit {

	constructor(private router: Router, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-Service | Registers");
	}

	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.router.navigateByUrl('');
		}
	}
}
