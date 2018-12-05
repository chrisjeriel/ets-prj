import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '@app/_services/underwriting.service';
import { UnderwritingOtherRatesInfo } from '@app/_models';
@Component({
  selector: 'app-pol-other-rates',
  templateUrl: './pol-other-rates.component.html',
  styleUrls: ['./pol-other-rates.component.css']
})
export class PolOtherRatesComponent implements OnInit {

  private underwritingOtherRatesInfo: UnderwritingOtherRatesInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];

  nData: UnderwritingOtherRatesInfo = new UnderwritingOtherRatesInfo(null, null, null, null);

  constructor(private underwritingservice: UnderwritingService) { }
  policyNo: boolean = false;
  pol(event) {
    this.policyNo = true;
  }
  ngOnInit() {
    this.tHeader.push("");
    this.tHeader.push("Others");
    this.tHeader.push("Amounts");
    this.tHeader.push("Deductible/Remarks");

    this.dataTypes.push("checkbox");
    this.dataTypes.push("text");
    this.dataTypes.push("currency");
    this.dataTypes.push("text");

    this.tableData = this.underwritingservice.getUWOtherRatesInfo();
  }

}
