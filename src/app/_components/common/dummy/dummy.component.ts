import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../../_services';
import { DummyInfo } from '../../../_models';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.css']
})
export class DummyComponent implements OnInit {
  tableData: any[] = [];
  tableData2: any[] = [];
  tHeader: any[] = [];
  nData: DummyInfo = new DummyInfo(null, null, null, null, null, null, null);

  constructor(private quotationService: QuotationService) { }

  ngOnInit() {
  	this.tHeader.push("ID");
  	this.tHeader.push("First Name");
  	this.tHeader.push("Last Name");
    this.tHeader.push("Middle Name");
    this.tHeader.push("Gender");
    this.tHeader.push("Age");
    this.tHeader.push("Birth Date");


  	this.tableData = this.quotationService.getDummyInfo();
  	this.tableData2 = this.quotationService.getDummyEditableInfo();
  }

}
