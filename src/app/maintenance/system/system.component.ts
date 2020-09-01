import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '@app/_services';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {

  constructor(private titleService: Title, private us : UserService) { }

  modules:any[] = [];
  ngOnInit() {
  	this.titleService.setTitle("Mtn | System");
  	this.us.accessibleModules.subscribe(data=>{this.modules = data})
  }

}
