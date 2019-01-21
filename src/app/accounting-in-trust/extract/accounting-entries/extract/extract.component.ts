import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.css']
})
export class ExtractComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Extract");
  }

}
