import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { QuoteEndorsement } from '../../../_models/QuoteEndorsement'
import { QuotationService } from '../../../_services';

@Component({
    selector: 'app-pol-endorsement',
    templateUrl: './pol-endorsement.component.html',
    styleUrls: ['./pol-endorsement.component.css']
})
export class PolEndorsementComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    tableData: any[] = [];
    tHeader: any[] = [];
    options: any[] = [];
    dataTypes: any[] = [];
    nData: QuoteEndorsement = new QuoteEndorsement(null, null, null);
    alteration: boolean = false;

   constructor(config: NgbDropdownConfig, private quotationService: QuotationService) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

    ngOnInit() : void{
       // this.tHeader.push("");
        this.tHeader.push("Endt Title");
        this.tHeader.push("Endt Description");
        this.tHeader.push("Wording");
        this.tHeader.push("Edit Flag");
        //this.tHeader.push("Actions");
        
        this.tableData = this.quotationService.getEndorsements();
    }

}
