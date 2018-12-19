import { Component, OnInit } from '@angular/core';
import { DistributionByRiskInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-distribution-by-risk',
  templateUrl: './distribution-by-risk.component.html',
  styleUrls: ['./distribution-by-risk.component.css']
})
export class DistributionByRiskComponent implements OnInit {

  private polDistributionByRisk: DistributionByRiskInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  nData: DistributionByRiskInfo = new DistributionByRiskInfo(null, null, null, null, null);

  constructor(private polService: UnderwritingService, private titleService: Title) { }


  ngOnInit() {
    this.titleService.setTitle("Pol | Risk Distribution");
    this.tHeader.push("Treaty");
    this.tHeader.push("Ceding Company");
    this.tHeader.push("Share (%)");
    this.tHeader.push("Comm Rate (%)");
    this.tHeader.push("Line");

    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("percent");
    this.dataTypes.push("percent");
    this.dataTypes.push("text");

    this.tableData = this.polService.getDistByRiskData();
  }

}
