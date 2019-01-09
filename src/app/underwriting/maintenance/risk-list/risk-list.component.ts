import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { UnderwritingService } from '../../../_services';

@Component({
    selector: 'app-risk-list',
    templateUrl: './risk-list.component.html',
    styleUrls: ['./risk-list.component.css']
})
export class RiskListComponent implements OnInit {

    maintenanceRiskListData: any = {
        tableData: this.underwritingService.getMaintenanceRisksListData(),
        tHeader: ['Active', 'Risk No.', 'Description', 'Abbreviation', 'Region', 'Province', 'City/Town', 'District', 'Block', 'Lat', 'Long'],
        dataTypes: ['checkbox', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'],
        resizable: [false, false, true, false, true, true, true, true, true, true, true],
        tableOnly: false,
        addFlag: true,
        editFlag: true,
        pageStatus: true,
        pagination: true,
        pageLength: 10
    }
    
    constructor(private titleService: Title, private underwritingService: UnderwritingService, private router: Router) { }

    ngOnInit() {
        this.titleService.setTitle('Pol | Risk')
    }
    
    onClickAdd(event){
        this.router.navigate(['/maintenance-risk']);
    }
    
    onClickEdit(event){
        this.router.navigate(['/maintenance-risk']);
    }

}
