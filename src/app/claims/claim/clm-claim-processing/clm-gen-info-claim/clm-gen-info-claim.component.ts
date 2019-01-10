import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-clm-gen-info-claim',
  templateUrl: './clm-gen-info-claim.component.html',
  styleUrls: ['./clm-gen-info-claim.component.css']
})
export class ClmGenInfoClaimComponent implements OnInit {

  line: string;
  coClaimNo;
  lineClass;
  coRefNo;
  adjRefNo
  private sub: any;

  tableData: any[] = [
    ["001", "AArema Adjusters and Surveyors, Inc.", "PMMSC-MLP-2018-025"],
    ["002", "TLP Adj", "ADJ2 REF 001"],
    ["003", "ACD Co. Inc.", "ADJ3 REF 001"],
  ];

  tHeader: string[] = [];
  dataTypes: string[] = [];
  dataTypes2: string[] = [];
  magnifyingGlass;
  addFlag;
  deleteFlag;
  paginateFlag;
  infoFlag;
  pageLength = 10;

  passData: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    addFlag: true,
    deleteFlag: true,
    paginateFlag: true,
    infoFlag: true,
    pageLength: 10,
    widths: []
  };
  constructor(private router: ActivatedRoute, private modalService: NgbModal, private titleService: Title) { }

  ngOnInit() {
    this.sub = this.router.params.subscribe(params => {
      this.line = params['line'];
      // temporary data
      this.lineClass = this.line + " Wet Risk";
      this.coClaimNo = this.line + "-HO-2018-00015666";
      this.coRefNo = "EN-" + this.line + "-HO-2018-006792-01";
      this.adjRefNo = "PMMSC-" + this.line + "-2018-025 / ADJ2 REF 001 / ADJ3 REF 001";
      console.log(this.line);
      //end of temporary data
    });
    this.titleService.setTitle("Clm | General Info");
    this.passData.tHeader.push("Adjuster No", "Adjuster Name", "Adjuster Reference No");
    this.passData.dataTypes.push("number", "text", "text");
    this.passData.widths.push("1", "auto", "auto");
    this.passData.tableData = this.tableData;
  }


}
