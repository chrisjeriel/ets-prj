import { Component, OnInit, Input } from '@angular/core';
import { UnderwritingService } from '@app/_services/underwriting.service';
import { PolicyInwardPolBalance } from '@app/_models';

@Component({
  selector: 'app-inward-pol-balance',
  templateUrl: './inward-pol-balance.component.html',
  styleUrls: ['./inward-pol-balance.component.css']
})
export class InwardPolBalanceComponent implements OnInit {

  tableData: any[] = [];
  tableData2: any[] = [];  
  tHeader: any[] = [];
  tHeader2: any[] = [];
  options: any[] = [];
  dataTypes: any[] = [];
  

  constructor(private underwritingservice: UnderwritingService) { }

  ngOnInit() {
  	this.tHeader.push("Cover Code");
    this.tHeader.push("Section");
    this.tHeader.push("Bullet No");
    this.tHeader.push("Premium");

    this.tHeader2.push("Takeup Seq No");
    this.tHeader2.push("Booking Date");
    this.tHeader2.push("Premium");
    this.tHeader2.push("Total Tax");
    this.tHeader2.push("Amount Due");

    this.dataTypes.push("select");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("select");

    this.options.push({ selector: "taxCode", vals: ["","EXE-CODE", "EXC-CODE", "EXC-CODE"] });
    this.options.push({ selector: "taxAllocation", vals: ["","Fire", "Flood", "Calamity"] });

    this.tableData = this.underwritingservice.getInwardPolBalance();
    this.tableData2 = this.underwritingservice.getInwardPolBalance();

  }

}
