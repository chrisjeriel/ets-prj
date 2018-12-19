import { Component, OnInit } from '@angular/core';
import { QuotationCoverageInfo, NotesReminders } from '../../_models';
import { QuotationService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {

  private quotationCoverageInfo: QuotationCoverageInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  selOptions: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  optionsData: any[] = [];
  optionsData2: any[] = [];

  multiSelectHeaderTxt: string = "";
  multiSelectData: any[] = [];

  nData: QuotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null);

  constructor(private quotationService: QuotationService, private titleService: Title) { }

  temp: number = 0;

  printSelectedValue(event) {
    console.log(event.item);
  }

  getMS(event) {
    //console.log(event.allSelectedData + ' : ' + event.allSelectedData[2].value);
    console.log('VALUE : ' + event.returnValue + ' ' + 'ID : ' + event.returnId);
  }

  ngOnInit() {
    this.titleService.setTitle("Quo | Coverage");
    this.optionsData.push("USD", "PHP", "EUR");
    this.optionsData2.push("a", "b", "c");

    this.multiSelectHeaderTxt = "COVERAGE";
    this.multiSelectData.push("zero", "one", "two", "three", "four");


    this.tHeader.push("Cover Code");
    this.tHeader.push("Section");
    this.tHeader.push("Bullet No");
    this.tHeader.push("Sum Insured");
    this.tHeader.push("Add Sl");

    this.dataTypes.push("text");
    this.dataTypes.push("select");
    this.dataTypes.push("select");
    this.dataTypes.push("currency");
    this.dataTypes.push("checkbox");

    this.selOptions.push({ selector: "section", vals: ["I", "II", "III"] });
    this.selOptions.push({ selector: "bulletNo", vals: ["1", "1.2", "1.3"] });
    this.selOptions.push({ selector: "sortSe", vals: ["10", "20", "30"] });

    this.tableData = this.quotationService.getCoverageInfo();

    // this.quotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null, null, null, null);
    // this.quotationCoverageInfo.quotationNo = "MOCK DATA";
    // this.quotationCoverageInfo.insured = "MOCK DATA";
    // this.quotationCoverageInfo.currency = "MOCK DATA";
    // this.quotationCoverageInfo.sectionOne = "MOCK DATA";
    // this.quotationCoverageInfo.sectionTwo = "MOCK DATA";
    // this.quotationCoverageInfo.sectionThree = "MOCK DATA";
    // this.quotationCoverageInfo.deductibles = "MOCK DATA";
    // this.quotationCoverageInfo.remarks = "MOCK DATA";
  }

}
