import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { ALOPItemInformation, ALOPInfo } from '../../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pol-alop',
  templateUrl: './pol-alop.component.html',
  styleUrls: ['./pol-alop.component.css']
})
export class PolAlopComponent implements OnInit {
  aLOPInfo: ALOPInfo = new ALOPInfo();
  tableData: any[] = [["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ["test", "Test", "Test"],
  ];
  tableData2: any[] = [["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ["Test", "Test", "Test", "Test", "Test"],
  ]
  tHeader: string[] = [];
  tHeader2: string[] = [];
  policyRecordInfo: any = {};
  dataTypes: string[] = [];
  dataTypes2: string[] = [];
  nData: ALOPItemInformation = new ALOPItemInformation(null, null, null, null, null);
  line: string;
  sub: any;

  constructor(private underwritingService: UnderwritingService, private modalService: NgbModal, private route: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
  	/*this.policyRecordInfo.policyNo = "CAR-2018-5081-077-0177";
  	this.tHeader = ["Item No","Quantity","Description","Relative Importance","Possible Loss Min"];
    this.dataTypes = ["number","number","text","text","text"];
    
    if(this.policyRecordInfo.policyNo.substr(0,3) =="CAR"){
  	  this.tHeader = ["Item No","Quantity","Description","Possible Loss Min"];
      this.dataTypes = ["number","number","text","text"];
    }

  	this.tableData = this.underwritingService.getALOPItemInfos(this.policyRecordInfo.policyNo.substr(0,3));*/
    this.titleService.setTitle("Pol | ALOP");

    this.tHeader.push("Item No");
    this.tHeader.push("Description");
    this.tHeader.push("Possible Loss Minimization");

    this.tHeader2.push("Item No");
    this.tHeader2.push("Quantity");
    this.tHeader2.push("Description");
    this.tHeader2.push("Relative Importance");
    this.tHeader2.push("Possible Loss Minimization");

    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");

    this.dataTypes2.push("text");
    this.dataTypes2.push("text");
    this.dataTypes2.push("text");
    this.dataTypes2.push("text");
    this.dataTypes2.push("text");


    this.sub = this.route.params.subscribe(params => {
      this.line = params['line'];
    });
  }

  save() {
    console.log(this.aLOPInfo);
  }

}
