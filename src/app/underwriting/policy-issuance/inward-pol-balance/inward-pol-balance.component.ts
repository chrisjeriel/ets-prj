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
  tHeader: any[] = [];
  options: any[] = [];
  dataTypes: any[] = [];
  

  constructor(private underwritingservice: UnderwritingService) { }

  ngOnInit() {
  	this.tHeader.push("Cover Code");
    this.tHeader.push("Section");
    this.tHeader.push("Bullet No");
    this.tHeader.push("Premium")

    this.dataTypes.push("select");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("select");

    this.options.push({ selector: "taxCode", vals: ["","EXE-CODE", "EXC-CODE", "EXC-CODE"] });
    this.options.push({ selector: "taxAllocation", vals: ["","Fire", "Flood", "Calamity"] });

    this.tableData = this.underwritingservice.getInwardPolBalance();
  }

}
