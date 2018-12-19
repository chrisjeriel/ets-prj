import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { ALOPItemInformation, ALOPInfo } from '../../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pol-alop',
  templateUrl: './pol-alop.component.html',
  styleUrls: ['./pol-alop.component.css']
})
export class PolAlopComponent implements OnInit {
  aLOPInfo: ALOPInfo = new ALOPInfo();
  tableData: any[] = [];
  tHeader: string[] = [];
  policyRecordInfo: any = {};
  dataTypes: string[] = [];
  nData: ALOPItemInformation = new ALOPItemInformation(null, null, null, null, null);
  constructor(private uwService: UnderwritingService, private modalService: NgbModal, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | ALOP");
    this.policyRecordInfo.policyNo = "CAR-2018-5081-077-0177";
    this.tHeader = ["Item No", "Quantity", "Description", "Relative Importance", "Possible Loss Min"];
    this.dataTypes = ["number", "number", "text", "text", "text"];
    if (this.policyRecordInfo.policyNo.substr(0, 3) == "CAR") {
      this.tHeader = ["Item No", "Quantity", "Description", "Possible Loss Min"];
      this.dataTypes = ["number", "number", "text", "text"];
    }

    this.tableData = this.uwService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0, 3));
  }

  save() {
    console.log(this.aLOPInfo);
  }

}
