import { Component, OnInit } from '@angular/core';
import { ExpiryParameters, LastExtraction } from '../../../_models';
import { UnderwritingService } from '../../../_services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-extract-expiring-policies',
  templateUrl: './extract-expiring-policies.component.html',
  styleUrls: ['./extract-expiring-policies.component.css']
})
export class ExtractExpiringPoliciesComponent implements OnInit {

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  lastExtraction: LastExtraction = new LastExtraction();
  constructor(private underWritingService: UnderwritingService,private modalService: NgbModal) { }
  byDate:boolean = true;
  extractedPolicies: number = 0;
  ngOnInit() {

  }

  save(){
  	this.extractedPolicies =  this.underWritingService.extractExpiringPolicies();
  }

  clearDates(){
    $('#fromDate').val("");
    $('#toDate').val("");
    this.expiryParameters.fromMonth=null;
    this.expiryParameters.fromYear=null;
    this.expiryParameters.toMonth=null;
    this.expiryParameters.toYear=null;
  }

  clearAll(){
    this.clearDates();
    this.expiryParameters.branch1 = null;
    this.expiryParameters.branch2 = null;
    this.expiryParameters.cedingCompany = null;
    this.expiryParameters.line1 = null;
    this.expiryParameters.line2 = null;
    this.lastExtraction.extractionDate = null;
    $("#extractionDate").val("");

  }

}
