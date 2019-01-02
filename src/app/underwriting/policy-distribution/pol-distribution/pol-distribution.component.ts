import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionByRiskInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';

@Component({
  selector: 'app-pol-distribution',
  templateUrl: './pol-distribution.component.html',
  styleUrls: ['./pol-distribution.component.css']
})
export class PolDistributionComponent implements OnInit {

  nData: DistributionByRiskInfo = new DistributionByRiskInfo(null, null, null, null, null, null);

  distFlag: any = 'treaty';

  passData: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {},
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    checkboxFlag: true,
    pageLength: 10,
    widths: []
  };

  constructor(private polService: UnderwritingService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Distribution");

    this.passData.tHeader.push("Treaty");
    this.passData.tHeader.push("Treaty Company");
    this.passData.tHeader.push("Share (%)");
    this.passData.tHeader.push("SI Amount");
    this.passData.tHeader.push("Premium Amount");
    this.passData.tHeader.push("Comm Share");

    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("percent");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");
    this.passData.dataTypes.push("number");

    this.passData.tableData = this.polService.getDistByRiskData();
  }

}
