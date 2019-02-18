import { Component, OnInit } from '@angular/core';
import { Title } from  '@angular/platform-browser';

@Component({
  selector: 'app-acct-srvc-import',
  templateUrl: './acct-srvc-import.component.html',
  styleUrls: ['./acct-srvc-import.component.css']
})
export class AcctSrvcImportComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-Service | Import");
  }

}
