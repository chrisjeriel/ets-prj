import { Component, OnInit, Input } from '@angular/core';
import { UnderwritingService } from '@app/_services/underwriting.service';
import { UnderwritingCoverageInfo } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-coverage',
  templateUrl: './pol-coverage.component.html',
  styleUrls: ['./pol-coverage.component.css']
})
export class PolCoverageComponent implements OnInit {

  private underwritingCoverageInfo: UnderwritingCoverageInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  selOptions: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  optionsData: any[] = [];
  headerWithColspan: any[] = [];

  passData: any = {
    tableData:[],
    tHeader:[],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:[],
    opts:[],
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    searchFlag: true,
    checkFlag: true
  };

  passData2: any = {
    tableData:[],
    tHeader:[],
    tHeaderWithColspan:[],
    options:[],
    dataTypes:[],
    paginateFlag: true,
  };

  textArea: string = "<b>Test</b>";
  @Input() alteration: boolean;

  nData: UnderwritingCoverageInfo = new UnderwritingCoverageInfo(null, null, null, null, null, null, null);
  constructor(private underwritingservice: UnderwritingService, private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {

    this.titleService.setTitle("Pol | Coverage");
    if (!this.alteration) {
      this.tHeader.push("Cover Code");
      this.tHeader.push("Section");
      this.tHeader.push("Bullet No");
      this.tHeader.push("Sum Insured");
      this.tHeader.push("Rate");
      this.tHeader.push("Prenium");
      this.tHeader.push("Add Sl");

      this.dataTypes.push("text");
      this.dataTypes.push("select");
      this.dataTypes.push("select");
      this.dataTypes.push("currency");
      this.dataTypes.push("percent");
      this.dataTypes.push("currency");
      this.dataTypes.push("checkbox");

      this.selOptions.push({ selector: "section", vals: ["I", "II", "III"] });
      this.selOptions.push({ selector: "bulletNo", vals: ["1", "1.2", "1.3"] });
      this.selOptions.push({ selector: "sortSe", vals: ["10", "20", "30"] });

      this.optionsData.push("USD", "PHP", "EUR");

      this.tableData = this.underwritingservice.getUWCoverageInfo();
    } else {
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
  }

  showTextEditorModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }
}
