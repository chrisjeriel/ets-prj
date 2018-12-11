import { Component, OnInit, Input } from '@angular/core';
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
    options: any[] = [];
    dataTypes: any[] = [];
    magnifyingGlass: any[]=["endtCode"];
    nData: QuoteEndorsement = new QuoteEndorsement(null, null, null, null, null);

    tHeader: any[] = ['Endt Code','Endt Title', 'Endt Description', 'Wording', 'Edit Flag'];
    
    @Input() alteration: boolean;

       constructor(config: NgbDropdownConfig, private quotationService: QuotationService) { 
      	config.placement = 'bottom-right';
        config.autoClose = false;
     }

    ngOnInit() : void{
        this.tableData = this.quotationService.getEndorsements(1);
    }
    
    onClickCancel(){
        
    }
    
    onClickSave(){
        
    }
}
