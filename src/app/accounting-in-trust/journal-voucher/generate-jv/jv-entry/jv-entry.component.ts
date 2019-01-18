import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-jv-entry',
  templateUrl: './jv-entry.component.html',
  styleUrls: ['./jv-entry.component.css']
})
export class JvEntryComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Acc | Journal Voucher");
  }

}
