import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users-maintenance',
  templateUrl: './users-maintenance.component.html',
  styleUrls: ['./users-maintenance.component.css']
})
export class UsersMaintenanceComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
  		this.router.navigateByUrl('');
		} 

    }
}
