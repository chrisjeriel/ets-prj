import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-risk-list',
  templateUrl: './risk-list.component.html',
  styleUrls: ['./risk-list.component.css']
})
export class RiskListComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
      this.titleService.setTitle('Pol | Risk')
  }

}
