import { Component, OnInit } from '@angular/core';
import { ExpiryParameters, LastExtraction } from '../../../_models';
import { UnderwritingService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-extract-expiring-policies',
  templateUrl: './extract-expiring-policies.component.html',
  styleUrls: ['./extract-expiring-policies.component.css']
})
export class ExtractExpiringPoliciesComponent implements OnInit {

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  lastExtraction: LastExtraction = new LastExtraction();
  constructor(private underWritingService: UnderwritingService, private modalService: NgbModal, private titleService: Title) { }
  byDate: any = '';
  extractedPolicies: number = 0;
  ngOnInit() {
    this.titleService.setTitle("Pol | Extract Expiring Policy");
  }

  extract() {
    this.extractedPolicies = this.underWritingService.extractExpiringPolicies();
  }

  clearPolicyNo() {
    this.expiryParameters.line = null;
    this.expiryParameters.year = null;
    this.expiryParameters.sequence = null;
    this.expiryParameters.coCode = null;
    this.expiryParameters.coSeriesNo = null;
    this.expiryParameters.alt = null;
  }

  clearDates() {
    $('#fromDate').val("");
    $('#toDate').val("");
    this.expiryParameters.fromMonth = null;
    this.expiryParameters.fromYear = null;
    this.expiryParameters.toMonth = null;
    this.expiryParameters.toYear = null;
    this.clearPolicyNo();
  }

  clearAll() {
    this.clearDates();
    this.expiryParameters.branch1 = null;
    this.expiryParameters.branch2 = null;
    this.expiryParameters.cedingCompany1 = null;
    this.expiryParameters.cedingCompany2 = null;
    this.expiryParameters.line1 = null;
    this.expiryParameters.line2 = null;
    this.lastExtraction.extractionDate = null;
    $("#extractionDate").val("");
    this.clearPolicyNo();
  }

}
