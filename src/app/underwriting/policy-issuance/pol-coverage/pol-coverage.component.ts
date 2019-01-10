import { Component, OnInit, Input } from '@angular/core';
import { UnderwritingService } from '@app/_services/underwriting.service';
import { UnderwritingCoverageInfo, CoverageDeductibles } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pol-coverage',
  templateUrl: './pol-coverage.component.html',
  styleUrls: ['./pol-coverage.component.css']
})
export class PolCoverageComponent implements OnInit {

  private underwritingCoverageInfo: UnderwritingCoverageInfo;
  tableData: any[] = [];
  tableData2: any[] = [];
  tHeader: any[] = [];
  tHeader2: any[] = [];
  dataTypes: any[] = [];
  selOptions: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  optionsData: any[] = [];
  headerWithColspan: any[] = [];
  pageLength = 3 ;
  searchFlag;
  addFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;

  passDataSectionCover: any = {
        tHeader: ["Cover Code", "Section", "Bullet No", "Sum Insured", "Rate", "Premium", "Add Sl"],
        dataTypes: [
                    "text", "select", "select", "currency", "percent", "currency", "checkbox"
                   ],
        opts: [{ selector: "section", vals: ["I", "II", "III"] }, { selector: "bulletNo", vals: ["1", "1.2", "1.3"] }],
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
        magnifyingGlass: ['coverCode'],
        widths:[228,1,1,200,1,1,1]
    };


  passDataTotalPerSection: any = {
        tHeader: ["Section", "Sum Insured", "Premium"],
        dataTypes: [
                    "text", "text", "text"
                   ],
        tableData: [["SECTION I","",""],["SECTION II","",""],["SECTION III","",""]],
        pageLength:3,
    };

  passDataCATPerils: any = {
        tHeader: ["CAT Perils", "Probable Maximum Loss", "Percentage(%)"],
        dataTypes: [
                    "text", "currency", "percent"
                   ],
        tableData: [["Earthquake",40000000,"15"],["Typhoon",30000000,"10"],["Flood",50000000,"10"],["Volcanic Eruption",10000000,"1"]],
        pageLength:10,
    };

  passDataDeductibles: any = {
        tHeader: ["Deductible Code","Deductible Title", "Rate(%)", "Amount", "Deductible Text"],
        dataTypes: [
                    "text","text", "percent", "currency","text"
                   ],
        pageLength:5,
        addFlag: true,
        deleteFlag: true,
        searchFlag: true,
        checkFlag: true,
        infoFlag: true,
        paginateFlag: true,
        widths: [1, 1, 1, 1, 1, 1],
        magnifyingGlass: ['deductibleCode'],
        nData2: {},
    };


  passData: any = {
    tableData:[],
    tHeader:[],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:[],
    opts:[],
    addFlag: true,
    deleteFlag: true,
    // paginateFlag: true,
    searchFlag: true,
    checkFlag: true,
    magnifyingGlass: ['coverCode'],
    pageLength:'unli'
  };

  passData2: any = {
    tableData:[],
    tHeader:[],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:[],
    pageLength: 3
  };

 
  textArea: string = "";
  @Input() alteration: boolean;
  line: string;
  sub: any;

  nData2: CoverageDeductibles = new CoverageDeductibles(null,null,null,null,null);
  nData: UnderwritingCoverageInfo = new UnderwritingCoverageInfo(null, null, null, null, null, null, null);
  constructor(private underwritingservice: UnderwritingService, private titleService: Title, private modalService: NgbModal,private route: ActivatedRoute) { }

  ngOnInit() {

    this.titleService.setTitle("Pol | Coverage");
    if (!this.alteration) {

      this.passDataSectionCover.tableData = this.underwritingservice.getUWCoverageInfo();
      this.passDataDeductibles.tableData = this.underwritingservice.getUWCoverageDeductibles();
      //this.passDataTotalPerSection.tableData = this.underwritingservice.getTotalPerSection();

    } else {
      this.passDataDeductibles.tableData = this.underwritingservice.getUWCoverageDeductibles();
      this.passData.tHeader.push("Cover Code");
      this.passData.tHeader.push("Section");
      this.passData.tHeader.push("Bullet No");
      this.passData.tHeader.push("Sum Insured");
      this.passData.tHeader.push("Rate");
      this.passData.tHeader.push("Premium");
      this.passData.tHeader.push("Sum Insured");
      this.passData.tHeader.push("Rate");
      this.passData.tHeader.push("Premium");
      this.passData.tHeader.push("Sum Insured");
      this.passData.tHeader.push("Rate");
      this.passData.tHeader.push("Premium");
      this.passData.tHeader.push("Add Sl");

      this.passData.dataTypes.push("text");
      this.passData.dataTypes.push("select");
      this.passData.dataTypes.push("select");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("percent");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("percent");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("percent");
      this.passData.dataTypes.push("currency");
      this.passData.dataTypes.push("checkbox");

      this.passData.opts.push({ selector: "section", vals: ["I", "II", "III"] });
      this.passData.opts.push({ selector: "bulletNo", vals: ["1", "1.2", "1.3"] });
      this.passData.opts.push({ selector: "sortSe", vals: ["10", "20", "30"] });

      this.optionsData.push("USD", "PHP", "EUR");

      this.passData.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "", span: 3 },
        { header: "Previous", span: 3 }, { header: "This Alteration", span: 3 },
        { header: "Cumulative", span: 3 }, { header: "", span: 1 });

      this.passData.tableData = [
        {
          coverCode: "ABC",
          section: "I",
          bulletNo: 1.2,
          prevSumInsured: 20,
          prevRate: 5,
          prevPremium: 100,
          thisAltSumInsured: 60,
          thisAltRate: 5,
          thisAltPremium: 50,
          cumuSumInsured: 90,
          cumuRate: 5,
          cumuPremium: 800,
          addSl: ""
        }
      ];

      //

      this.passData2.tHeader.push("Section");
      this.passData2.tHeader.push("Sum Insured");
      this.passData2.tHeader.push("Premium");
      this.passData2.tHeader.push("Sum Insured");
      this.passData2.tHeader.push("Premium");
      this.passData2.tHeader.push("Sum Insured");
      this.passData2.tHeader.push("Premium");

      this.passData2.dataTypes.push("text");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");
      this.passData2.dataTypes.push("currency");

      this.passData2.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "Previous", span: 2 }, 
        { header: "This Alteration", span: 2 }, { header: "Cumulative", span: 2 });

      this.passData2.tableData = [
        {
          section: 'Section I',
          pSumInsured: '',
          pPremium: '',
          tSumInsured: '',
          tPremium: '',
          cSumInsured: '',
          cPremium: ''
        },
        {
          section: 'Section II',
          pSumInsured: '',
          pPremium: '',
          tSumInsured: '',
          tPremium: '',
          cSumInsured: '',
          cPremium: ''
        },
        {
          section: 'Section III',
          pSumInsured: '',
          pPremium: '',
          tSumInsured: '',
          tPremium: '',
          cSumInsured: '',
          cPremium: ''
        }
      ];
    }

    this.sub = this.route.params.subscribe(params => {
            this.line = params['line'];
        });
  }

  showTextEditorModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  CATPerils() {
        $('#modalBtn').trigger('click');
    }

  showDeductiblesModal(deductibles){
    this.modalService.open(deductibles, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }


}
