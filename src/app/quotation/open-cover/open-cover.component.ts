import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-open-cover',
  templateUrl: './open-cover.component.html',
  styleUrls: ['./open-cover.component.css']
})
export class OpenCoverComponent implements OnInit {

  quoteData: any = {};

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public beforeChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'approval-tab') {
			$event.preventDefault();
		}
	}

  onTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        this.router.navigateByUrl('');
      } 
  
  }

  quoteDataF(data){
    this.quoteData = data;
  }
}
