import { Component, OnInit } from '@angular/core';
import { UnderwritingPolicyInquiryInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';

@Component({
  selector: 'app-policy-inquiry',
  templateUrl: './policy-inquiry.component.html',
  styleUrls: ['./policy-inquiry.component.css']
})
export class PolicyInquiryComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];

  constructor(private underwritingService: UnderwritingService) { }

  ngOnInit() {

    this.tHeader.push("Policy No");
    this.tHeader.push("Branch");
    this.tHeader.push("Ceding Company");
    this.tHeader.push("Principal");
    this.tHeader.push("Contractor");
    this.tHeader.push("Intermediary");
    this.tHeader.push("Insured");
    this.tHeader.push("Status");
    this.tHeader.push("Section I SI");
    this.tHeader.push("Section II SI");
    this.tHeader.push("Section III SI");
    this.tHeader.push("Object");

    this.tableData = this.underwritingService.getPolicyInquiry();

  }

}
