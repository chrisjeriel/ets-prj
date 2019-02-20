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


  editedData: any[] = [];
  deletedData: any[] = [];
  // editedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  // rowClick: EventEmitter<any> = new EventEmitter();
  // rowDblClick: EventEmitter<any> = new EventEmitter();
  

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
    dataTypes: ['text','select','select','currency','checkbox'],
    opts: [{ selector: "section", vals: ["I", "II", "III"] }, { selector: "bulletNo", vals: ["1", "1.2", "1.3"] }],
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
    addFlag: true,
    deleteFlag: true,
    searchFlag: true,
    checkboxFlag: true,
    pageLength: 'unli',
    widths:[228,1,1,200,1,1],
    keys:['coverCd','section','bulletNo','sumInsured','addSi']
  };

  @Input() pageData:any;

  multiSelectHeaderTxt: string = "";
  multiSelectData: any[] = [];
  dataLoaded:boolean = false;
  nData: QuotationCoverageInfo = new QuotationCoverageInfo(null, null, null, null, null);
  projId: number;
  riskId: number;
  temp: number = 0;
  sub: any;
  quoteNo:string = '';
  lineCd: string = '';
  @Input() quotationInfo: any = {};

  constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute) {}

  ngOnInit() {
    this.titleService.setTitle("Quo | Coverage");

    this.quoteNo = this.quotationInfo.quotationNo.split(/[-]/g)[0]
    for (var i = 1; i < this.quotationInfo.quotationNo.split(/[-]/g).length; i++) {
      this.quoteNo += '-' + parseInt(this.quotationInfo.quotationNo.split(/[-]/g)[i]);
    } 

    
    this.quotationService.getCoverageInfo(this.quoteNo,null).subscribe((data: any) => {
      console.log()
      this.riskId       = data.quotation.project.riskId;
      this.coverageData = data.quotation.project.coverage;
        // this.passData.tableData = data.quotation.project.coverage.sectionCovers;
        for (var i = data.quotation.project.coverage.sectionCovers.length - 1; i >= 0; i--) {
          this.passData.tableData.push(data.quotation.project.coverage.sectionCovers[i]);
        }
        this.table.refreshTable();

    });

    this.multiSelectHeaderTxt = "COVERAGE";
    this.multiSelectData.push("zero", "one", "two", "three", "four");

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
   this.lineCd      = this.quoteNo.split('-')[0];
   this.editedData  = [];
   this.deletedData = [];

   for (var i = 0 ; this.passData.tableData.length > i; i++) {
      if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted ){
          this.editedData.push(this.passData.tableData[i]);
          this.editedData[this.editedData.length-1].createDate = new Date(this.editedData[this.editedData.length-1].createDate[0],this.editedData[this.editedData.length-1].createDate[1]-1,this.editedData[this.editedData.length-1].createDate[2]).toISOString();
          this.editedData[this.editedData.length-1].updateDate = new Date(this.editedData[this.editedData.length-1].updateDate[0],this.editedData[this.editedData.length-1].updateDate[1]-1,this.editedData[this.editedData.length-1].updateDate[2]).toISOString();
          this.editedData[this.editedData.length-1].lineCd     = this.lineCd;
      }else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
        this.deletedData.push(this.passData.tableData[i]);
        this.deletedData[this.deletedData.length-1].createDate = new Date(this.deletedData[this.deletedData.length-1].createDate[0],this.deletedData[this.deletedData.length-1].createDate[1]-1,this.deletedData[this.deletedData.length-1].createDate[2]).toISOString();
        this.deletedData[this.deletedData.length-1].updateDate = new Date(this.deletedData[this.deletedData.length-1].updateDate[0],this.deletedData[this.deletedData.length-1].updateDate[1]-1,this.deletedData[this.deletedData.length-1].updateDate[2]).toISOString();
        this.deletedData[this.deletedData.length-1].lineCd = this.lineCd;
      }
    }

    this.coverageData.createDate          = new Date(this.coverageData.createDate[0],this.coverageData.createDate[1]-1,this.coverageData.createDate[2]).toISOString();
    this.coverageData.saveSectionCovers   = this.editedData;
    this.coverageData.deleteSectionCovers = this.deletedData;
    this.coverageData.quoteId             = this.quotationInfo.quoteId;
    this.coverageData.projId              = 1;
    this.coverageData.riskId              = this.riskId;
    this.quotationService.saveQuoteCoverage(this.coverageData.quoteId,this.coverageData.projId,this.coverageData).subscribe((data: any) => {});
    
  }

  cancel(){
    console.log(this.deletedData)
  }

}
