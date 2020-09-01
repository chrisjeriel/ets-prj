import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '@app/_services';

@Component({
	selector: 'app-registers',
	templateUrl: './registers.component.html',
	styleUrls: ['./registers.component.css']
})
export class RegistersComponent implements OnInit {

	constructor(private router: Router, private userService: UserService, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Acct-IT | Register Reports");
    	this.userService.emitModuleId("ACIT060");
	}


	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			this.router.navigateByUrl('');
		}
	}
}
