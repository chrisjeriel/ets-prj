import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '@app/_services';

@Component({
  selector: 'app-accounting-mtn',
  templateUrl: './accounting-mtn.component.html',
  styleUrls: ['./accounting-mtn.component.css']
})
export class AccountingMtnComponent implements OnInit {

  constructor(private titleService: Title, private us : UserService) { }
  modules:any[] = [];

  ngOnInit() {
  	this.titleService.setTitle("Mtn | Accounting");
  	this.us.accessibleModules.subscribe(data=>{this.modules = data})
  }

}
