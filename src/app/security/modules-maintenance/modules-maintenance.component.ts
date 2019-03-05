import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modules-maintenance',
  templateUrl: './modules-maintenance.component.html',
  styleUrls: ['./modules-maintenance.component.css']
})
export class ModulesMaintenanceComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
 	if ($event.nextId === 'Exit') {
	this.router.navigateByUrl('');
	} 
  }

}
