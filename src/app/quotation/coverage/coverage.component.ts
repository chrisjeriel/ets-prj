import { Component, OnInit } from '@angular/core';
import { QuotationCoverageInfo } from '../../_models';
import { QuotationService } from '@app/_services';

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {

  private quotationCoverageInfo: QuotationCoverageInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  nData: QuotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null, null, null, null);

  constructor(private quotationService: QuotationService) { }

  ngOnInit() {

    this.tHeader.push("select");
    this.tHeader.push("Cover Code");
    this.tHeader.push("Section");
    this.tHeader.push("Bullet No");
    this.tHeader.push("Sum Insured");
    this.tHeader.push("Sort Se");
    this.tHeader.push("Add Sl");
    this.tHeader.push("Actions")
    this.tableData = this.quotationService.getCoverageInfo();

    this.quotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null, null, null, null);
    this.quotationCoverageInfo.quotationNo = "MOCK DATA";
    this.quotationCoverageInfo.insured = "MOCK DATA";
    this.quotationCoverageInfo.currency = "MOCK DATA";
    this.quotationCoverageInfo.sectionOne = "MOCK DATA";
    this.quotationCoverageInfo.sectionTwo = "MOCK DATA";
    this.quotationCoverageInfo.sectionThree = "MOCK DATA";
    this.quotationCoverageInfo.deductibles = "MOCK DATA";
    this.quotationCoverageInfo.remarks = "MOCK DATA";
  }

}
