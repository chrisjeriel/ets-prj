import { Component, OnInit } from '@angular/core';
import { ExpiryParameters, ExpiryListing, RenewedPolicy } from '../../../_models';
import { UnderwritingService } from '../../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-expiry-listing',
  templateUrl: './expiry-listing.component.html',
  styleUrls: ['./expiry-listing.component.css']
})
export class ExpiryListingComponent implements OnInit {

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  tableData: ExpiryListing[] = [];
  renewedPolicyList: RenewedPolicy[] = [];
  byDate: boolean = true;
  
  passDataAnnualPolicies: any = {
        tHeader: ["P", "RA", "RC", "NR", "Policy No", "Type of Cession", "Ceding Company", "Co Ref No","Ren TSI Amount","Ren Pre Amount","TSI Amount","Prem Amount","Co Ref No","S","B","C","R","RP"],
        dataTypes: [
                    "checkbox", "checkbox", "checkbox", "checkbox", "text", "text","text","text","text","text","text","text","text","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
        tableData: [[false,false,false,false,"TEST","TEST","TEST","TEST","TEST","TEST","TEST","TEST","TEST",false,false,false,false,false]],
        pageLength: 10,
        paginateFlag:true,
        infoFlag:true
   };

   passDataExtensionPolicies: any = {
        tHeader: ["P","Policy No", "Type of Cession", "Ceding Company", "Co Ref No","TSI Amount","Prem Amount","Co Ref No","S","B","C","R","RP"],
        dataTypes: [
                    "checkbox", "text", "text","text","text","text","text","text","checkbox","checkbox","checkbox","checkbox", "checkbox"
                   ],
        tableData: [[false,"TEST","TEST","TEST","TEST","TEST","TEST","TEST",false,false,false,false,false]],
        pageLength: 10,
        paginateFlag:true,
        infoFlag:true
   };

   passDataHistory: any = {
        tHeader: ["History No", "Amount Type", "History Type", "Currency","mount","Remarks","Accounting Tran ID","Accounting Date"],
        dataTypes: [
                    "number", "select", "select","select","currency","text","number","number"
                   ],
        tableData: [[1,"LOST","OS Reserve","",10000000,"Initial OS Reserve",3480,"11/14/2018"]],
        pageLength: 10,
        paginateFlag:true,
        infoFlag:true,
        addFlag:true,
   };


  constructor(private underWritingService: UnderwritingService, private modalService: NgbModal, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Expiry Listing");
    this.tableData = this.underWritingService.getExpiryListing();
    this.renewedPolicyList = this.underWritingService.renewExpiredPolicies();
  }

  renewPolicies() {
    this.renewedPolicyList = this.underWritingService.renewExpiredPolicies();
    console.log(this.renewedPolicyList);
  }

  clearDates() {
    $('#fromDate').val("");
    $('#toDate').val("");
    this.expiryParameters.fromMonth = null;
    this.expiryParameters.fromYear = null;
    this.expiryParameters.toMonth = null;
    this.expiryParameters.toYear = null;
  }
}
