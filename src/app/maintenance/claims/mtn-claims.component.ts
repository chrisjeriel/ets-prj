import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mtn-claims',
  templateUrl: './mtn-claims.component.html',
  styleUrls: ['./mtn-claims.component.css']
})
export class MtnClaimsComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Mtn | Claims");
  }

}
