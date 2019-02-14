import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { QuotationCoverageInfo, NotesReminders } from '../../_models';
import { QuotationService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {

  private quotationCoverageInfo: QuotationCoverageInfo;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
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

  

  coverageData: any = {
    currency: null,
    exchRt: null,
    totalSi: null,
    sectionI: null,
    sectionII: null,
    sectionIII: null,
    remarks: null,
    sectionCovers:[]
  }

  passData: any = {
    tHeader: ['Cover Code','Section','Bullet No','Sum Insured','Add Sl'],
    tableData:[],
    magnifyingGlass: [],
    options: [],
    dataTypes: [],
    opts: [],
    nData: {
      createDate: [0,0,0],
      createUser: "PCPR",
      coverCode:null,
      section:null,
      bulletNo:null,
      sumInsured:null,
      addSi:"N",
      updateDate: [0,0,0],
      updateUser: "PCPR"
    },
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
    widths: [],
    keys:['coverCd','section','bulletNo','sumInsured','addSi']
  };

  @Input() pageData:any;

  multiSelectHeaderTxt: string = "";
  multiSelectData: any[] = [];
  dataLoaded:boolean = false;

  nData: QuotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null);

  quotationNo: string;
  insuredName: string;
  risk: string;

  constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute) {


   }

  temp: number = 0;
  sub: any;

  printSelectedValue(event) {
  }

  getMS(event) {
    console.log('VALUE : ' + event.returnValue + ' ' + 'ID : ' + event.returnId);
  }

  ngOnInit() {
    let quoteNo:string = "";
    this.sub = this.route.params.subscribe(params => {
      this.quotationNo = params["quotationNo"];
      quoteNo = this.quotationNo.split(/[-]/g)[0]
      for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
       quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
     } 
    });
    
    this.quotationService.getCoverageInfo(quoteNo,null).subscribe((data: any) => {
      this.risk = data.quotation.project.riskName;
        this.coverageData = data.quotation.project.coverage;
        // this.passData.tableData = data.quotation.project.coverage.sectionCovers;
        for (var i = data.quotation.project.coverage.sectionCovers.length - 1; i >= 0; i--) {
          this.passData.tableData.push(data.quotation.project.coverage.sectionCovers[i]);
        }
        this.table.refreshTable();
    });

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

  saveData(){
    console.log(this.passData.tableData);
   this.editedData = [];
   for (var i = 0 ; this.passData.tableData.length > i; i++) {
      /*if(this.passData.tableData[i].edited){
          this.editedData.push(this.passData.tableData[i]);
          this.editedData[this.editedData.length-1].createDate = new Date(this.editedData[this.editedData.length-1].createDate[0],this.editedData[this.editedData.length-1].createDate[1]-1,this.editedData[this.editedData.length-1].createDate[2]).toISOString();
          this.editedData[this.editedData.length-1].updateDate = new Date(this.editedData[this.editedData.length-1].updateDate[0],this.editedData[this.editedData.length-1].updateDate[1]-1,this.editedData[this.editedData.length-1].updateDate[2]).toISOString();
          this.editedData[this.editedData.length-1].lineCd = 'CAR';
        }*/
     
          this.editedData.push(this.passData.tableData[i]);
          this.editedData[this.editedData.length-1].createDate = new Date(this.editedData[this.editedData.length-1].createDate[0],this.editedData[this.editedData.length-1].createDate[1]-1,this.editedData[this.editedData.length-1].createDate[2]).toISOString();
          this.editedData[this.editedData.length-1].updateDate = new Date(this.editedData[this.editedData.length-1].updateDate[0],this.editedData[this.editedData.length-1].updateDate[1]-1,this.editedData[this.editedData.length-1].updateDate[2]).toISOString();
          this.editedData[this.editedData.length-1].lineCd = 'CAR';
        
    }

    this.coverageData.createDate = new Date(this.coverageData.createDate[0],this.coverageData.createDate[1]-1,this.coverageData.createDate[2]).toISOString();
    
   
    this.coverageData.sectionCovers =this.editedData;
    this.coverageData.quoteId=1;
    this.coverageData.projId=1;
    this.coverageData.riskId=1;
    this.quotationService.saveQuoteCoverage(10,10,this.coverageData).subscribe((data: any) => {});
    
  }

  cancel(){
    console.log(this.coverageData.totalSi);
  }

}
