import { Component, OnInit } from '@angular/core';
import { ExpiryParameters, LastExtraction } from '../../../_models';
import { UnderwritingService } from '../../../_services';

@Component({
  selector: 'app-extract-expiring-policies',
  templateUrl: './extract-expiring-policies.component.html',
  styleUrls: ['./extract-expiring-policies.component.css']
})
export class ExtractExpiringPoliciesComponent implements OnInit {

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  lastExtraction: LastExtraction = new LastExtraction();
  constructor(private underWritingService: UnderwritingService) { }
  byDate:boolean = true;
  ngOnInit() {

  }

  save(){
  	alert("Extracted Policies: " + this.underWritingService.extractExpiringPolicies());
  	console.log(this.byDate);
  }

  clearDates(){

    this.expiryParameters.fromDate=null;
    this.expiryParameters.fromMonth=null;
    this.expiryParameters.fromYear=null;
    this.expiryParameters.toDate=null;
    this.expiryParameters.toMonth=null;
    this.expiryParameters.toYear=null;
    console.log(this.expiryParameters.fromDate);
  }

}
