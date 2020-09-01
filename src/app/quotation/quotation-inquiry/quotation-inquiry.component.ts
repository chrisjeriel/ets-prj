import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../_services';


@Component({
  selector: 'app-quotation-inquiry',
  templateUrl: './quotation-inquiry.component.html',
  styleUrls: ['./quotation-inquiry.component.css']
})
export class QuotationInquiryComponent implements OnInit {

  constructor(private titleService: Title, private userService: UserService
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Quo | Quotation Inquiry");
    this.userService.emitModuleId("QUOTE012");
  }

}
