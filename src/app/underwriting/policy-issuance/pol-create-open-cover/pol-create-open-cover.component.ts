import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pol-create-open-cover',
  templateUrl: './pol-create-open-cover.component.html',
  styleUrls: ['./pol-create-open-cover.component.css']
})
export class PolCreateOpenCoverComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Create Open Cover");
  }

}
