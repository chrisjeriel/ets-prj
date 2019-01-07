import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '../../../_services';
import { CreateAlterationParInfo } from '../../../_models/CreateAlterationPolicy';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pol-create-alteration-par',
  templateUrl: './pol-create-alteration-par.component.html',
  styleUrls: ['./pol-create-alteration-par.component.css']
})
export class PolCreateAlterationPARComponent implements OnInit {

  private createAlterationPar: CreateAlterationParInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  fromQuotation: boolean = true;
  policyLine: any;

  constructor(private underwritingService: UnderwritingService, private router: Router,
    private modalService: NgbModal, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Create Alteration");
    this.tHeader.push("Quotation No");
    this.tHeader.push("Branch");
    this.tHeader.push("Line Class");
    this.tHeader.push("Quote Status");
    this.tHeader.push("Ceding Company");
    this.tHeader.push("Principal");
    this.tHeader.push("Contractor");
    this.tHeader.push("Insured");
    this.tHeader.push("Quote Date");
    this.tHeader.push("Validity Date");
    this.tHeader.push("Requested By");
    this.tHeader.push("Created By");

    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("text");
    this.dataTypes.push("date");
    this.dataTypes.push("date");
    this.dataTypes.push("text");
    this.dataTypes.push("text");

    this.tableData = this.underwritingService.getAlterationFromQuotation();

    this.createAlterationPar = new CreateAlterationParInfo();
    this.createAlterationPar.line = "test";
    this.createAlterationPar.year = new Date();
    this.createAlterationPar.seqNo = 0;
    this.createAlterationPar.altNo = 0;
    this.createAlterationPar.cedingCompany = "test";
    this.createAlterationPar.principal = "test";
    this.createAlterationPar.contractor = "test";
  }


  fromHoldCover() {
    this.fromQuotation = false;
  }

  fromQuotationList() {
    this.fromQuotation = true;
  }

  navigateToGenInfo() {
    var pLine = this.policyLine.toUpperCase();

    if (pLine === 'CAR' ||
      pLine === 'EAR' ||
      pLine === 'EEI' ||
      pLine === 'CEC' ||
      pLine === 'MBI' ||
      pLine === 'BPV' ||
      pLine === 'MLP' ||
      pLine === 'DOS') {
      console.log(this.policyLine);
      this.router.navigate(['/policy-issuance-alt', { line: pLine }], { skipLocationChange: true });
    }
  }
}
