import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pol-dist',
  templateUrl: './pol-dist.component.html',
  styleUrls: ['./pol-dist.component.css']
})
export class PolDistComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Distribution");
  }

}
