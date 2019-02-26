import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { QuotationCoverageInfo, NotesReminders } from '../../_models';
import { QuotationService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    currencyCd: null,
    exchRt: null,
    totalSi: null,
    sectionISi: null,
    sectionIISi: null,
    sectionIIISi: null,
    remarks: null,
    sectionCovers:[],
    createDate:[0,0,0],
    createUser:'Earl',
    currencyRt: 0,
    //updateDate:[0,0,0],
    updateUser: 'Earl'
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
    magnifyingGlass: ['coverCd'],
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
  quoteId: any;
  @Input() quotationInfo: any = {};
  errorMdlMessage: string = "";
  sectionCoverLOVRow: number;
  sectionI: number = 0;
  sectionII: number = 0;
  sectionIII: number = 0;
  totalSi: number = 0;

  constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute,private modalService: NgbModal) {}

  ngOnInit() {
    this.titleService.setTitle("Quo | Coverage");

    this.quoteNo = this.quotationInfo.quotationNo.split(/[-]/g)[0]
    for (var i = 1; i < this.quotationInfo.quotationNo.split(/[-]/g).length; i++) {
      this.quoteNo += '-' + parseInt(this.quotationInfo.quotationNo.split(/[-]/g)[i]);
    } 

    this.riskId = this.quotationInfo.riskId;

    this.quotationService.getCoverageInfo(this.quoteNo,null).subscribe((data: any) => {
    if(data.quotation.project !== null ){
      this.coverageData = data.quotation.project.coverage;
      for (var i = 0; i < data.quotation.project.coverage.sectionCovers.length; i++) {
        this.passData.tableData.push(data.quotation.project.coverage.sectionCovers[i]);
      }
      this.table.refreshTable();}
      setTimeout(() => {
        $('input[appCurrency]').focus();
        $('input[appCurrency]').blur();
      }, 0)











      if(data.quotation.project.coverage.sectionCovers !== null){
        for(var i = 0; i < data.quotation.project.coverage.sectionCovers.length; i++){
            if(data.quotation.project.coverage.sectionCovers[i].section == 'I' && data.quotation.project.coverage.sectionCovers[i].addSi == 'Y'){
              this.sectionI = this.sectionI + data.quotation.project.coverage.sectionCovers[i].sumInsured;
            }
            if(data.quotation.project.coverage.sectionCovers[i].section == 'II' && data.quotation.project.coverage.sectionCovers[i].addSi == 'Y'){
              this.sectionII = this.sectionII + data.quotation.project.coverage.sectionCovers[i].sumInsured;
            }
            if(data.quotation.project.coverage.sectionCovers[i].section == 'III' && data.quotation.project.coverage.sectionCovers[i].addSi == 'Y'){
              this.sectionIII = this.sectionIII + data.quotation.project.coverage.sectionCovers[i].sumInsured;
            }
        }
        this.coverageData.sectionISi = this.sectionI;
        this.coverageData.sectionIISi = this.sectionII;
        this.coverageData.sectionIIISi = this.sectionIII;
        this.coverageData.totalSi = this.sectionI + this.sectionII + this.sectionIII;
      }
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
    //this.coverageData.updateDate          = new Date(this.coverageData.updateDate[0],this.coverageData.updateDate[1]-1,this.coverageData.updateDate[2]).toISOString();
    this.coverageData.saveSectionCovers   = this.editedData;
    this.coverageData.deleteSectionCovers = this.deletedData;
    this.coverageData.quoteId             = this.quotationInfo.quoteId;
    this.coverageData.projId              = 1;
    this.coverageData.riskId              = this.riskId;
    this.quotationService.saveQuoteCoverage(this.coverageData.quoteId,this.coverageData.projId,this.coverageData).subscribe((data: any) => {
      if(data['returnCode'] == 0) {
          this.errorMdlMessage = data['errorList'][0].errorMessage;
          $('#errorMdl > #modalBtn').trigger('click');
        } else{
          $('#successModalBtn').trigger('click');
         }
    });
  }

  cancel(){
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
    console.log(this.editedData)
  }

  sectionCoversLOV(data){
        $('#sectionCoversLOV #modalBtn').trigger('click');
        //data.tableData = this.passData.tableData;
        this.sectionCoverLOVRow = data.index;
  }

  selectedSectionCoversLOV(data){
    console.log(data)
    this.passData.tableData[this.sectionCoverLOVRow].coverCd = data.coverCode; 
  }

  update(data){
     if(this.passData.tableData.edited){
       if(data.addSi == 'Y' && data.section == 'I'){
           this.coverageData.sectionISi =  this.coverageData.sectionISi + data.sumInsured;
          
        }
        if(data.addSi == 'N' && data.section == 'I'){
           this.coverageData.sectionISi =  this.coverageData.sectionISi - data.sumInsured;
          
        }
        if(data.addSi == 'Y' && data.section == 'II'){
           this.coverageData.sectionIISi =  this.coverageData.sectionIISi + data.sumInsured;
          
        }
        if(data.addSi == 'N' && data.section == 'II'){
           this.coverageData.sectionIISi =  this.coverageData.sectionIISi - data.sumInsured;
          
        }
        if(data.addSi == 'Y' && data.section == 'III'){
           this.coverageData.sectionIIISi =  this.coverageData.sectionIIISi + data.sumInsured;
          
        }
        if(data.addSi == 'N' && data.section == 'III'){
           this.coverageData.sectionIIISi =  this.coverageData.sectionIIISi - data.sumInsured;
          
        }
       }

  }

}
