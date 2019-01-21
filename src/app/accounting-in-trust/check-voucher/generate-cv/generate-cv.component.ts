import { Component, OnInit } from '@angular/core';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-cv',
  templateUrl: './generate-cv.component.html',
  styleUrls: ['./generate-cv.component.css']
})
export class GenerateCvComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onTabChange($event: NgbTabChangeEvent) {
  		if ($event.nextId === 'Exit') {
    		this.router.navigateByUrl('');
  		} 
  
  }

}
