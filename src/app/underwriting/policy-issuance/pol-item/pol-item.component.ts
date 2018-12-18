import { Component, OnInit } from '@angular/core';
import { PolItem_MLP, PolItem_EEI_MBI_CEC, PolItem_BPV, PolGoods_DOS, PolMachinery_DOS } from '@app/_models';
import { UnderwritingService } from '../../../_services';

@Component({
    selector: 'app-pol-item',
    templateUrl: './pol-item.component.html',
    styleUrls: ['./pol-item.component.css']
})
export class PolItemComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    tableData_EEI_MBI_CEC: any[] = [
        new PolItem_EEI_MBI_CEC('10001', 45, 'Item Description 1', '2018', 5, 20000),
    ];
    tableData_BPV: any[] = [
        //['S10001', 'Region IV, Laguna, Calamba', '100001 Juan de la Cruz', new Date(), 90000],
        //['S10001', 'Region IV, Laguna, Calamba', '100001 Juan de la Cruz', '2018', 90000],
    ];

    tHeader_EEI_MBI_CEC: any[] = ['Item No.', 'Quantity', 'Description of Items', 'Year of Make', 'Deductible', 'Sum Insured'];
    tHeader_BPV: any[] = ['Serial No', 'Location', 'Description Maker\'s No. and Maker\'s Name', 'Year of Make', 'Sum Insured'];

    dataTypes_EEI_MBI_CEC: any[] = ['string', 'number', 'string', 'string', 'number', 'currency'];
    dataTypes_BPV: any[] = ['string', 'string', 'string', 'string', 'currency'];

    nData_EEI_MBI_CEC: PolItem_EEI_MBI_CEC = new PolItem_EEI_MBI_CEC(null, null, null, null, null, null);
    nData_BPV: PolItem_BPV = new PolItem_BPV(null, null, null, null, null);

    mlpTableData: PolItem_MLP[];
    mlpTHeader: string[] = ['Item No','Quantity','Description of Machinery','Indemnity Period(months)','Relative Importance(%)','Spare Parts in stock standby Units'];
    mlpDataTypes: string[] = ['text','number','text','number','percent','number'];
    mlpNData: PolItem_MLP = new PolItem_MLP(null,null,null,null,null,null);

    dosGoodsTableData: PolGoods_DOS[];
    dosGoodsTHeader: string[] = ["Item No", "Refrigerating Chamber No", "Type of Goods", "No-Claims Period","Sum Insured"];
    dosGoodsDataTypes:string[] = ["text","text","text","text","currency"];

    dosMachineryTableData: PolMachinery_DOS[];
    dosMachineryTHeader: string[] = ["Item No","Number of Units", "Description of Items (Technical Data including Capacity)", "Year of Make", "Sum Insured"];
    dosMachineryDataTypes:string[] = ["text","number","text","number","currency"];

    polEEI: boolean = true;
    polBPV: boolean = false;
    polMLP: boolean = false;
    polDOS: boolean = false;

    constructor(private underwritingService: UnderwritingService) { }

    ngOnInit() {
        this.mlpTableData = this.underwritingService.getPolItemMLPData();
        this.dosGoodsTableData = this.underwritingService.getPolGoodsDOSData();
        this.dosMachineryTableData = this.underwritingService.getPolMachineryDOSData();
    }

}
