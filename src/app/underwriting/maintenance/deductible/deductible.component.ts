import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UnderwritingService, MaintenanceService } from '../../../_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
    selector: 'app-deductible',
    templateUrl: './deductible.component.html',
    styleUrls: ['./deductible.component.css']
})
export class DeductibleComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
    fixedAmount: boolean = true;
    maintenanceDeductibleData: any = {
        tableData: [],
        tHeader: ['Active', 'Deductible', 'Title', 'Deductible Type', 'Rate', 'Deductible Amount'],
        dataTypes: ['checkbox', 'text', 'text', 'text', 'percent', 'currency'],
        resizable: [false,false,true,false,false,false],
        tableOnly: true,
        pageStatus: true,
        pagination: true,
        pageLength: 10,
        keys: ['activeTag','deductibleCd','deductibleTitle','deductibleType','deductibleRate','deductibleAmt']
    };
    data: any;
    
    constructor(private titleService: Title, private underwritingService: UnderwritingService, private mntService: MaintenanceService ) { }

    ngOnInit() {
        this.titleService.setTitle('Mtn | Deductibles')

        // this.underwritingService.getMaintenanceDeductibles().subscribe((data: any) => {
           
        //     this.data = data.deductibles;
        //     console.log(this.data);
        //     for (var i = data.deductibles.length - 1; i >= 0; i--) {
        //         this.maintenanceDeductibleData.tableData.push(data.deductibles[i]);
        //         console.log(data.deductibles[i]);
        //     }

        //     this.table.refreshTable();

        // });
        

    }

    FixedAmount(){
        this.fixedAmount = true;
    }

    NotFixedAmount(){
        this.fixedAmount = false;
    }

}
