import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accounting-entries',
  templateUrl: './accounting-entries.component.html',
  styleUrls: ['./accounting-entries.component.css']
})
export class AccountingEntriesComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  sub: any;
  activeID: string;
  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
  		this.activeID = params['tabID'];
  	});

  }



}
