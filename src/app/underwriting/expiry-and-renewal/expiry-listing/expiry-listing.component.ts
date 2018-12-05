import { Component, OnInit } from '@angular/core';
import { ExpiryParameters, LastExtraction } from '../../../_models';
import { UnderwritingService } from '../../../_services';

@Component({
  selector: 'app-expiry-listing',
  templateUrl: './expiry-listing.component.html',
  styleUrls: ['./expiry-listing.component.css']
})
export class ExpiryListingComponent implements OnInit {

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  lastExtraction: LastExtraction = new LastExtraction();
  constructor(private underWritingService: UnderwritingService) { }
  byDate:boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
