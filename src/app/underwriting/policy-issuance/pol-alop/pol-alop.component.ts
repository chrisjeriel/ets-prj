import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { ALOPItemInformation } from '../../../_models';

@Component({
  selector: 'app-pol-alop',
  templateUrl: './pol-alop.component.html',
  styleUrls: ['./pol-alop.component.css']
})
export class PolAlopComponent implements OnInit {
  tableData: any[] = [];
  tHeader:string[] = [];
  policyRecordInfo:any = {};
  dataTypes: string[] = [];
  nData:ALOPItemInformation = new ALOPItemInformation(null,null,null,null,null);
  constructor(private uwService: UnderwritingService) { }

  ngOnInit() {
  	this.policyRecordInfo.policyNo = "CAR-2018-5081-077-0177";
  	//this.tHeader = ["Item No","Quantity","Description","Relative Importance","Possible Loss Min"];
  	this.tHeader = ["Item No","Quantity","Description","Possible Loss Min"];
  	this.dataTypes = ["number","number","text","text","text"];
  	this.tableData = this.uwService.getALOPItemInfos();
  }

}
