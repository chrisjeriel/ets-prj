import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

import { UnderwritingService, MaintenanceService } from '../../../_services';

@Component({
    selector: 'app-risk-list',
    templateUrl: './risk-list.component.html',
    styleUrls: ['./risk-list.component.css']
})
export class RiskListComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

    maintenanceRiskListData: any = {
        tableData: [],
        tHeader: ['Active', 'Risk No.', 'Description', 'Abbreviation', 'Region', 'Province', 'City/Town', 'District', 'Block', 'Lat', 'Long'],
        dataTypes: ['checkbox', 'number', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'],
        resizable: [false, false, true, false, true, true, true, true, true, true, true],
        tableOnly: false,
        addFlag: true,
        editFlag: true,
        pageStatus: true,
        pagination: true,
        pageLength: 10,
        keys: ['activeTag','riskId','riskName','riskAbbr','regionDesc','provinceDesc','cityDesc','districtDesc','blockDesc','latitude','longitude']
    }
    selected:any;
    
    constructor(private titleService: Title, private underwritingService: UnderwritingService, private maintenanceService: MaintenanceService, private router: Router) { }

    ngOnInit() {
        this.titleService.setTitle('Pol | Risk');

        this.maintenanceService.getMtnRiskListing('','','','','','','','','','','').subscribe(data => {
            var records = data['risk'];
            for(let rec of records){
                this.maintenanceRiskListData.tableData.push(
                    rec
                // {
                //     activeTag: (rec.activeTag.toUpperCase() === 'Y'),
                //     riskId: rec.riskId,
                //     riskName: rec.riskName,
                //     riskAbbr: rec.riskAbbr,
                //     regionDesc: rec.regionDesc,
                //     provinceDesc: rec.provinceDesc,
                //     cityDesc: rec.cityDesc,
                //     districtDesc: rec.districtDesc,
                //     blockDesc: rec.blockDesc,
                //     latitude: rec.latitude,
                //     longitude: rec.longitude
                // }
                );
            }

            this.table.refreshTable();
        });
    }
    
    onClickAdd(event){
        this.router.navigate(['/maintenance-risk', { info: 'new'}], {skipLocationChange: true});
    }
    
    onClickEdit(event){
        this.router.navigate(['/maintenance-risk',this.selected], {skipLocationChange: true});
    }

}
