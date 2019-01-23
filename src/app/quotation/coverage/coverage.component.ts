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
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  tHeader: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  options: any[] = [];
  dataTypes: any[] = [];
  opts: any[] = [];
  checkFlag;
  selectFlag;
  addFlag;
  editFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  searchFlag;

  checkboxFlag;
  columnId;
  pageLength = 10;

  editedData: any[] = [];
  // editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // rowClick: EventEmitter<any> = new EventEmitter();
  // rowDblClick: EventEmitter<any> = new EventEmitter();

  optionsData: any[] = [];
  optionsData2: any[] = [];
  selOptions: any[] = [];

  passData: any = {
    tableData: [],
    tHeader: [],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: new QuotationCoverageInfo(null, null, null, null, null),
    checkFlag: true,
    selectFlag: false,
    addFlag: true,
    editFlag: false,
    deleteFlag: true,
    paginateFlag: false,
    infoFlag: false,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 'unli',
    widths: []
  };


  multiSelectHeaderTxt: string = "";
  multiSelectData: any[] = [];

  nData: QuotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null);

  constructor(private quotationService: QuotationService, private titleService: Title) { }

  temp: number = 0;

  printSelectedValue(event) {
    console.log(event.item);
  }

  getMS(event) {
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

    this.passData.tHeader.push("Cover Code");
    this.passData.tHeader.push("Section");
    this.passData.tHeader.push("Bullet No");
    this.passData.tHeader.push("Sum Insured");
    this.passData.tHeader.push("Add Sl");

    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("select");
    this.passData.dataTypes.push("select");
    this.passData.dataTypes.push("currency");
    this.passData.dataTypes.push("checkbox");

    this.passData.opts.push({ selector: "section", vals: ["I", "II", "III"] });
    this.passData.opts.push({ selector: "bulletNo", vals: ["1", "1.2", "1.3"] });
    this.passData.opts.push({ selector: "sortSe", vals: ["10", "20", "30"] });

    this.passData.widths.push("1", "auto", "auto", "auto", "1", "1");
    this.passData.magnifyingGlass.push("coverCode");

    this.passData.tableData = this.quotationService.getCoverageInfo();

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
