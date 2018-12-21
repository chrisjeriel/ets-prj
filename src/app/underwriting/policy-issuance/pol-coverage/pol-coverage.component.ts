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
  tableData2: any[] = [];
  tHeader: any[] = [];
  tHeader2: any[] = [];
  dataTypes: any[] = [];
  selOptions: any[] = [];
  magnifyingGlass: any[] = ['coverCode'];
  optionsData: any[] = [];
  headerWithColspan: any[] = [];
  pageLength = 3 ;
  textArea: any;

  passDataSectionCover: any = {
        tHeader: ["Cover Code", "Section", "Bullet No", "Sum Insured", "Rate", "Prenium", "Add Sl"],
        dataTypes: [
                    "text", "select", "select", "currency", "percent", "currency", "checkbox"
                   ],
        opts: [{ selector: "section", vals: ["I", "II", "III"] }, { selector: "bulletNo", vals: ["1", "1.2", "1.3"] }],
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
    };


  passDataTotalPerSection: any = {
        tHeader: ["Section", "Sum Insured", "Prenium"],
        dataTypes: [
                    "text", "text", "text"
                   ],
        tableData: [["SECTION I","",""],["SECTION II","",""],["SECTION III","",""]],
        pageLength:3,
    };


  @Input() alteration: boolean;

  nData: UnderwritingCoverageInfo = new UnderwritingCoverageInfo(null, null, null, null, null, null, null);
  constructor(private underwritingservice: UnderwritingService, private titleService: Title, private modalService: NgbModal) { }

  ngOnInit() {

    this.titleService.setTitle("Pol | Coverage");
    if (!this.alteration) {

      this.passDataSectionCover.tableData = this.underwritingservice.getUWCoverageInfo();
      //this.passDataTotalPerSection.tableData = this.underwritingservice.getTotalPerSection();

    } else {
      this.tHeader.push("Cover Code");
      this.tHeader.push("Section");
      this.tHeader.push("Bullet No");
      this.tHeader.push("Sum Insured");
      this.tHeader.push("Rate");
      this.tHeader.push("Premium");
      this.tHeader.push("Sum Insured");
      this.tHeader.push("Rate");
      this.tHeader.push("Premium");
      this.tHeader.push("Sum Insured");
      this.tHeader.push("Rate");
      this.tHeader.push("Premium");
      this.tHeader.push("Add Sl");

      this.dataTypes.push("text");
      this.dataTypes.push("select");
      this.dataTypes.push("select");
      this.dataTypes.push("currency");
      this.dataTypes.push("percent");
      this.dataTypes.push("currency");
      this.dataTypes.push("currency");
      this.dataTypes.push("percent");
      this.dataTypes.push("currency");
      this.dataTypes.push("currency");
      this.dataTypes.push("percent");
      this.dataTypes.push("currency");
      this.dataTypes.push("checkbox");

      this.selOptions.push({ selector: "section", vals: ["I", "II", "III"] });
      this.selOptions.push({ selector: "bulletNo", vals: ["1", "1.2", "1.3"] });
      this.selOptions.push({ selector: "sortSe", vals: ["10", "20", "30"] });

      this.optionsData.push("USD", "PHP", "EUR");

      this.headerWithColspan.push({ header: "", span: 1 }, { header: "", span: 3 },
        { header: "Previous", span: 3 }, { header: "This Alteration", span: 3 },
        { header: "Cumulative", span: 3 }, { header: "", span: 1 });

      this.tableData = [
        {
          coverCode: "ASD",
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
    }
  }

  showTextEditorModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }
}
