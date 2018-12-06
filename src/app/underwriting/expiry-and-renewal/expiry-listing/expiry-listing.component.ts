import { Component, OnInit } from '@angular/core';
import { ExpiryParameters, ExpiryListing, RenewedPolicy } from '../../../_models';
import { UnderwritingService } from '../../../_services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-expiry-listing',
  templateUrl: './expiry-listing.component.html',
  styleUrls: ['./expiry-listing.component.css']
})
export class ExpiryListingComponent implements OnInit {

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  tableData: ExpiryListing[] = [];
  renewedPolicyList: RenewedPolicy[] = [];
  renewedPolicyHeader: string[] = ["Original Policy No.","Policy Record No."];
  tHeader: any[] = ["Policy No","Line","Branch", "Ceding Company", "Insured", "Project Description", "Principal", "Contractor", "Currency", "Section I", "SI", "Premium"];
  byDate:boolean = true;
  constructor(private underWritingService: UnderwritingService,private modalService: NgbModal) { }

  ngOnInit() {
    this.tableData = this.underWritingService.getExpiryListing();
    this.renewedPolicyList = this.underWritingService.renewExpiredPolicies();
  }

  renewPolicies(){
     this.renewedPolicyList = this.underWritingService.renewExpiredPolicies();
     console.log(this.renewedPolicyList);
   }

  clearDates(){
    $('#fromDate').val("");
    $('#toDate').val("");
    this.expiryParameters.fromMonth=null;
    this.expiryParameters.fromYear=null;
    this.expiryParameters.toMonth=null;
    this.expiryParameters.toYear=null;
  }
}
