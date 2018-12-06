import { Component, OnInit } from '@angular/core';
import { ExpiryParameters, ExpiryListing, RenewedPolicy } from '../../../_models';
import { UnderwritingService } from '../../../_services';

@Component({
  selector: 'app-expiry-listing',
  templateUrl: './expiry-listing.component.html',
  styleUrls: ['./expiry-listing.component.css']
})
export class ExpiryListingComponent implements OnInit {

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  tableData: ExpiryListing[] = [];
  renewedPolicyList: RenewedPolicy[] = [];
  tHeader: any[] = ["Policy No","Line","Branch", "Ceding Company", "Insured", "Project Description", "Principal", "Contractor", "Currency", "Section I", "SI", "Premium"];
  byDate:boolean = true;
  constructor(private underWritingService: UnderwritingService) { }
  ngOnInit() {
    this.tableData = this.underWritingService.getExpiryListing();
  }

}
