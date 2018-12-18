import { Component, OnInit } from '@angular/core';
import { PolItem_MLP, PolItem_EEI_MBI_CEC, PolItem_BPV } from '@app/_models';
import { UnderwritingService } from '../../../_services';

@Component({
    selector: 'app-pol-item',
    templateUrl: './pol-item.component.html',
    styleUrls: ['./pol-item.component.css']
})
export class PolItemComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    tableData_EEI_MBI_CEC: any[] = [
        ['10001', 45, 'Item Description 1', new Date(), 5, 20000],
        ['10002', 96, 'Item Description 2', new Date(), 2, 40000],
        ['10003', 23, 'Item Description 3', new Date(), 1, 30000],
    ];
    tableData_BPV: any[] = [
        ['S10001', 'Region IV, Laguna, Calamba', '100001 Juan de la Cruz', new Date(), 90000],
    ];

    tHeader_EEI_MBI_CEC: any[] = ['Item No.', 'Quantity', 'Description of Items', 'Year of Make', 'Deductible', 'Sum Insured'];
    tHeader_BPV: any[] = ['Serial No', 'Location', 'Description Maker\'s No. and Maker\'s Name', 'Year of Make', 'Sum Insured'];

    dataTypes_EEI_MBI_CEC: any[] = ['string', 'number', 'string', 'date', 'number', 'currency'];
    dataTypes_BPV: any[] = ['string', 'string', 'string', 'date', 'currency'];

    nData_EEI_MBI_CEC: PolItem_EEI_MBI_CEC = new PolItem_EEI_MBI_CEC(null, null, null, null, null, null);
    nData_BPV: PolItem_BPV = new PolItem_BPV(null, null, null, null, null);

    polEEI: boolean = false;
    polBPV: boolean = true;

    constructor(private underwritingService: UnderwritingService) { }

    ngOnInit() {
    }

}
