import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../_services';

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {
  tableData: any[] = [];
  tHeader: any[] = [];
  constructor(private quotationService: QuotationService) { }

  ngOnInit() {
    this.tHeader.push("Cover Code");
    this.tHeader.push("Section");
    this.tHeader.push("Bullet No");
    this.tHeader.push("Sum Insured");
    this.tHeader.push("Sort Se");
    this.tHeader.push("Add Sl");

    this.tableData = this.quotationService.getCoverageInfo();
  }
}
