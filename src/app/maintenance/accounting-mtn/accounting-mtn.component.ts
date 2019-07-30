import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-accounting-mtn',
  templateUrl: './accounting-mtn.component.html',
  styleUrls: ['./accounting-mtn.component.css']
})
export class AccountingMtnComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Mtn | Accounting");
  }

}
