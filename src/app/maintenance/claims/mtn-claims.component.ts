import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '@app/_services';

@Component({
  selector: 'app-mtn-claims',
  templateUrl: './mtn-claims.component.html',
  styleUrls: ['./mtn-claims.component.css']
})
export class MtnClaimsComponent implements OnInit {

  constructor(private titleService: Title, private us : UserService) { }

  modules:any[] = [];
  
  ngOnInit() {
  	this.titleService.setTitle("Mtn | Claims");
  	this.us.accessibleModules.subscribe(data=>{this.modules = data})
  }

}

