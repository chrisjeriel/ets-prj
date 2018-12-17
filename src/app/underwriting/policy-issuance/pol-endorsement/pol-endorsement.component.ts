import { Component, OnInit, Input } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { PolicyEndorsement } from '../../../_models/PolicyEndorsement'
import { UnderwritingService } from '../../../_services';

@Component({
    selector: 'app-pol-endorsement',
    templateUrl: './pol-endorsement.component.html',
    styleUrls: ['./pol-endorsement.component.css']
})
export class PolEndorsementComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    tableData: any[] = [];
    options: any[] = [];
    dataTypes: any[] = [];
    magnifyingGlass: any[]=["endtCode"];
    nData: PolicyEndorsement = new PolicyEndorsement(null, null, null, null);

    tHeader: any[] = ['C','Endt Code','Endt Title', 'Remarks'];
    
    @Input() alteration: boolean;

       constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService) { 
      	config.placement = 'bottom-right';
        config.autoClose = false;
     }

    ngOnInit() {
        this.tableData = this.underwritingService.getPolicyEndorsement();
    }
    
    onClickCancel(){
        
    }
    
    onClickSave(){
        
    }
}
