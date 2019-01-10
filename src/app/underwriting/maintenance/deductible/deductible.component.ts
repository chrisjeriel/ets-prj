import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { UnderwritingService } from '../../../_services';

@Component({
    selector: 'app-deductible',
    templateUrl: './deductible.component.html',
    styleUrls: ['./deductible.component.css']
})
export class DeductibleComponent implements OnInit {
    fixedAmount: boolean = true;
    maintenanceDeductibleData: any = {
        tableData: this.underwritingService.getMaintenanceDeductibles(),
        tHeader: ['Active', 'Deductible', 'Title', 'Deductible Type', 'Rate', 'Deductible Amount'],
        dataTypes: ['checkbox', 'text', 'text', 'text', 'percent', 'currency'],
        resizable: [false,false,true,false,false,false],
        tableOnly: true,
        pageStatus: true,
        pagination: true,
        pageLength: 10
    };
    
    constructor(private titleService: Title, private underwritingService: UnderwritingService ) { }

    ngOnInit() {
        this.titleService.setTitle('Pol | Deductible')
    }

    FixedAmount(){
        this.fixedAmount = true;
    }

    NotFixedAmount(){
        this.fixedAmount = false;
    }

}
