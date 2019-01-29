import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-accounting-service',
  templateUrl: './accounting-service.component.html',
  styleUrls: ['./accounting-service.component.css']
})
export class AccountingServiceComponent implements OnInit {

  constructor(private router: Router, private titleService: Title) { }

  ngOnInit() {
  }

  
}
