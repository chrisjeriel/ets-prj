import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

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
    alteration: boolean = true;

   constructor(config: NgbDropdownConfig) { 
  	config.placement = 'bottom-right';
    config.autoClose = false;
  }

    ngOnInit() : void{
        this.tHeader.push("");
        this.tHeader.push("Endt Title");
        this.tHeader.push("Endt Description");
        this.tHeader.push("Wording");
        this.tHeader.push("Edit Flag");
        this.tHeader.push("Actions");
        
    }

}
