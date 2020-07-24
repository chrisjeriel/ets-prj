import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '@app/_services';

@Component({
  selector: 'app-quotation-and-policy',
  templateUrl: './quotation-and-policy.component.html',
  styleUrls: ['./quotation-and-policy.component.css']
})
export class QuotationAndPolicyComponent implements OnInit {

  constructor(private titleService: Title, private us : UserService) { }
  
  modules:any[] = [];

  ngOnInit() {
  	this.titleService.setTitle("Mtn | Quotation & Policy");
  	this.us.accessibleModules.subscribe(data=>{this.modules = data})
  }

}
