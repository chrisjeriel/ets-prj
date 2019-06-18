import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clm-claim-processing',
  templateUrl: './clm-claim-processing.component.html',
  styleUrls: ['./clm-claim-processing.component.css']
})
export class ClmClaimProcessingComponent implements OnInit {
  tableData: any[] = [
    
    ["EEI-2018-00043", "In Progress", "EEI-2018-00066-078-0008-000", "CHARTER PING AN INSURANCE CORP.", "A.B Industries, Inc.", "C.Ayala Land,Inc./Gatewalk Central Estate", "05/09/2018", "Damaged electricl cables and supply line on 2nd", "PHP", "4000000", "0", "TLP Adj./ ACD Co Inc.", "CLETC"],
    ["MBI-2018-00087", "In Progress", "MBI-2018-00075-008-0004-000", "Dela Merced Adjustment Corp.", "A.C.G Construction", "JG Summit Holdings,Inc./Rob Gourmet", "02/09/2018", "Damaged electricl cables and supply line on 2nd", "PHP", "4000000", "0", "TLP Adj./ ACD Co Inc.", "CLCCZ"],
    ["BPV-2018-00055", "In Progress", "BPV-2018-00134-006-0009-000", "DOMESTIC INC. CO. OF THE PHIL.", "A.D. Reality and Contruction Corporation", "Producer's Bank Bldg.- Paseo, Makati", "11/09/2018", "Damaged electricl cables and supply line on 2nd", "PHP", "4000000", "0", "TLP Adj./ ACD Co Inc.", "CLCJCZ"],
    ["MLP-2018-00043", "In Progress", "MLP-2018-00077-009-0033-000", "EASTERN ASSURANCE AND SURETY CORP.", "A.G.S. Engineering and Management Resources, Inc.", "King's Court (I) Bldg - Makati", "10/09/2018", "Damaged electricl cables and supply line on 2nd", "PHP", "5000000", "1333898", "TLP Adj./ ACD Co Inc.", "CLECOH"],
    ["DOS-2018-00009", "In Progress", "DOS-2018-00001-001-0001-000", "GENERAL ACCIDENT INSURANCE ASIAL LTD", "Aguilar Consolidated Construction Industries, Corp.", "LBP Bldg - Makati", "01/03/2019", "Damaged electricl cables and supply line on 2nd", "PHP", "880000", "0", "TLP Adj./ ACD Co Inc.", "CLECOH"],
    ["CEC-2018-00014", "In Progress", "CEC-2018-00117-032-0001-000", "J.G. Bernas Adjusters and Surveyors, Inc.", "Chinmaya Mission Philippines, Inc.", "Crestly Bldg - Cebu", "10/09/2018", "Damaged electricl cables and supply line on 2nd", "PHP", "990000", "0", "TLP Adj./ ACD Co Inc.", "CLCCZ"],
    ["EAR-2018-00001", "In Progress", "EAR-2018-00111-034-0010-000", "LIBERTY INSURANCE CORP.", "DP Cornerstone Build & Trading Corp./ Cornerdot Construction", "Manila Pavillion - Ermita", "12/09/2018", "Damaged electricl cables and supply line on 2nd", "PHP", "2000000", "0", "TLP Adj./ ACD Co Inc.", "CLETC"],
    ["CAR-2018-00115", "In Progress", "CAR-2018-00001-082-0023-000", "MAA GENERAL INSURANCE PHILS., INC.", "Brostek Furniture / Barillo Construction & Enterprises", "Gemini Bldg - Gil Puyat, Makati", "01/01/2019", "Damaged electricl cables and supply line on 2nd", "PHP", "1200000", "0", "TLP Adj./ ACD Co Inc.", "CLETC"],
  ];
  //tableDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  tHeader: any[] = [];
  dataTypes: any[] = [];
  addFlag;
  editFlag;
  pagination;
  pageStatus;
  infoFlag;
  searchFlag;
  polLine;
  slctd: string = "";
  slctdArr: any[] = [];
  resizable;

  checkboxFlag;
  columnId;
  pageLength = 10;

  passData: any = {
    tableData: [{claimNo:"CAR-2018-00013", status:"In Progress", policyNo:"CAR-2018-00001-099-0001-000", cedingCompany:"ASIA INSURANCE (PHILIPPINES) CORP", insured:"Cornerdot Contructions / Solid Builders Corp", risk:"C-National Steel/Iligan City", lossDate:"03/09/2018", lossDetails:"Damaged electricl cables and supply line on 2nd", currency:"PHP", totalReserve:"1000000", totalPayment:"330000", adjusters:"TLP Adj./ ACD Co Inc."}],
    tHeader: ['Claim No','Status','Policy No', 'Ceding Company','Inusred','Risk','Loss Date','Loss Details','Currency','Total Reserve','Total Payment','Adjusters'],
    dataTypes: ["text", "text", "text", "text", "text", "text", "date", "text", "text", "currency", "currency", "text"],
    addFlag: true,
    editFlag: true,
    pagination: true,
    pageStatus: true,
    searchFlag: true,
    pageLength: 10,
    keys:['claimNo','status','policyNo','cedingCompany','insured','risk','lossDate','lossDetails','currency','totalReserve','totalPayment','adjusters'],
    resizable: [true, true, true, true, true, true, true, true, true, true, true, true],
  };


  constructor(private titleService: Title, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim Processing");
  }
  navigateToGenInfo() {
    var pLine = this.polLine.toUpperCase();

    if (pLine === 'CAR' ||
      pLine === 'EAR' ||
      pLine === 'EEI' ||
      pLine === 'CEC' ||
      pLine === 'MBI' ||
      pLine === 'BPV' ||
      pLine === 'MLP' ||
      pLine === 'DOS') {
      this.modalService.dismissAll();
      this.router.navigate(['/claims-claim', { line: pLine }], { skipLocationChange: true });
    }

  }

  onRowDblClick(event) {
    this.slctd = event.target.closest("tr").children[0].innerText;
    this.slctdArr = this.slctd.split("-");
    for (var i = 0; i < this.slctdArr.length; i++) {
      this.polLine = this.slctdArr[0];
    }
    this.router.navigate(['/claims-claim', { line: this.polLine }], { skipLocationChange: true });
  }

  onClickAdd(event) {
    $('#addClaim > #modalBtn').trigger('click');
  }
}
