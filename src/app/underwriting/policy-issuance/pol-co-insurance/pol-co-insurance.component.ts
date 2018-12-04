import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService } from '../../../_services';
import { PolicyCoInsurance } from '@app/_models';

@Component({
  selector: 'app-pol-co-insurance',
  templateUrl: './pol-co-insurance.component.html',
  styleUrls: ['./pol-co-insurance.component.css']
})

export class PolCoInsuranceComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
    tableData: any[] = [];
    tHeader: any[] = [];
    options: any[] = [];
    dataTypes: any[] = [];
    nData: PolicyCoInsurance = new PolicyCoInsurance(null, null, null, null, null);
    alteration: boolean = false;

   constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

    ngOnInit() : void{
        //this.tHeader.push("");
        this.tHeader.push("Risk");
        this.tHeader.push("Company");
        this.tHeader.push("Share Percentage");
        this.tHeader.push("Share Sum Insured");
        this.tHeader.push("Share Premium");
        this.tHeader.push("Actions");
        
        //this.dataTypes.push("checkbox");
        this.dataTypes.push("string");
        this.dataTypes.push("string");
        this.dataTypes.push("percent");
        this.dataTypes.push("currency");
        this.dataTypes.push("currency");
        
        this.tableData = this.underwritingService.getCoInsurance();
        console.log(this.underwritingService.getCoInsurance());
    }

}
