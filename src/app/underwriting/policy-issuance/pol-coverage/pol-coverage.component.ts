import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '@app/_services/underwriting.service';
import { UnderwritingCoverageInfo } from '@app/_models';

@Component({
  selector: 'app-pol-coverage',
  templateUrl: './pol-coverage.component.html',
  styleUrls: ['./pol-coverage.component.css']
})
export class PolCoverageComponent implements OnInit {

  private underwritingCoverageInfo: UnderwritingCoverageInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  selOptions: any[] = [];

  nData: UnderwritingCoverageInfo = new UnderwritingCoverageInfo(null, null, null, null, null, null, null);
  constructor(private underwritingservice: UnderwritingService) { }
  policyNo: boolean = false;
  pol(event) {
    this.policyNo = true;
  }
  ngOnInit() {
    this.tHeader.push("");
    this.tHeader.push("Cover Code");
    this.tHeader.push("Section");
    this.tHeader.push("Bullet No");
    this.tHeader.push("Sum Insured");
    this.tHeader.push("Sort Sequence");
    this.tHeader.push("Add Sl");

    this.dataTypes.push("checkbox");
    this.dataTypes.push("text");
    this.dataTypes.push("select");
    this.dataTypes.push("select");
    this.dataTypes.push("currency");
    this.dataTypes.push("select");
    this.dataTypes.push("checkbox");

    this.selOptions.push({ selector: "section", vals: ["I", "II", "III"] });
    this.selOptions.push({ selector: "bulletNo", vals: ["1", "2", "3"] });
    this.selOptions.push({ selector: "sortSe", vals: ["10", "20", "30"] });

    this.tableData = this.underwritingservice.getUWCoverageInfo();

  }

}