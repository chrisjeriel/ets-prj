import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-quotation-and-policy',
  templateUrl: './quotation-and-policy.component.html',
  styleUrls: ['./quotation-and-policy.component.css']
})
export class QuotationAndPolicyComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
  	this.titleService.setTitle("Mtn | Quotation & Policy");
  }

}
