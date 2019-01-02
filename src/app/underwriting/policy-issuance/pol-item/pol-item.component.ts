import { Component, OnInit } from '@angular/core';
import { PolItem_MLP, PolItem_EEI_MBI_CEC, PolItem_BPV, PolGoods_DOS, PolMachinery_DOS, PolItem_CEC } from '@app/_models';
import { UnderwritingService } from '../../../_services';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-pol-item',
    templateUrl: './pol-item.component.html',
    styleUrls: ['./pol-item.component.css']
})
export class PolItemComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    tableData_EEI_MBI_CEC: any[] = [
        new PolItem_EEI_MBI_CEC('10001', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10002', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10003', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10004', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10005', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10006', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10007', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10008', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10009', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10010', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10011', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10012', 45, 'Item Description 1', '2018', 5, 20000),
        new PolItem_EEI_MBI_CEC('10013', 45, 'Item Description 1', '2018', 5, 20000),
    ];
    tableData_BPV: any[] = [
        new PolItem_BPV('S10001', 'Region IV, Laguna, Calamba', '100001 Juan de la Cruz', "2018", 90000),
        //['S10001', 'Region IV, Laguna, Calamba', '100001 Juan de la Cruz', '2018', 90000],
    ];

    tHeader_EEI_MBI_CEC: any[] = ['Item No.', 'Quantity', 'Description of Items', 'Year of Make', 'Deductible', 'Sum Insured'];
    tHeader_BPV: any[] = ['Serial No', 'Location', 'Description Maker\'s No. and Maker\'s Name', 'Year of Make', 'Sum Insured'];

    dataTypes_EEI_MBI_CEC: any[] = ['string', 'number', 'string', 'string', 'number', 'currency'];
    dataTypes_BPV: any[] = ['string', 'string', 'string', 'string', 'currency'];

    nData_EEI_MBI_CEC: PolItem_EEI_MBI_CEC = new PolItem_EEI_MBI_CEC(null, null, null, null, null, null);
    nData_BPV: PolItem_BPV = new PolItem_BPV(null, null, null, null, null);



    eeiPassData:any={
        tableData:this.tableData_EEI_MBI_CEC,
        tHeader: ['Item No.', 'Quantity', 'Description of Items', 'Year of Make', 'Deductible', 'Sum Insured'],
        dataTypes:['string', 'number', 'string', 'string', 'number', 'currency'],
        nData: new PolItem_EEI_MBI_CEC(null, null, null, null, null, null),
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        totalFlag:true,
        widths: ["1","1","auto","1","1","228"],
        searchFlag:true,
        pageLength:'unli'

    }

    bpvPassData: any = {
        tableData:[
            new PolItem_BPV('S10001', 'Region IV, Laguna, Calamba', '100001 Juan de la Cruz', "2018", 90000),
        ],
        tHeader: ['Serial No', 'Location', 'Description Maker\'s No. and Maker\'s Name', 'Year of Make', 'Sum Insured'],
        dataTypes:['string', 'string', 'string', 'string', 'currency'],
        nData: new PolItem_BPV(null, null, null, null, null),
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        //widths: ["1","1","auto","1","1","228"]
    }
    
    mlpPassData: any = {
        tableData: [],
        tHeader:  ['Item No', 'Quantity', 'Description of Machinery', 'Indemnity Period(months)', 'Relative Importance(%)', 'Spare Parts in stock standby Units'],
        dataTypes:  ['text', 'number', 'text', 'number', 'percent', 'number'],
        nData:  new PolItem_MLP(null, null, null, null, null, null),
        checkFlag:"true",
        addFlag:"true",
        deleteFlag:"true",
        widths:  ['1','1','auto','1','1','1'],
        searchFlag : true
    }
    
    dosGoodsPassData: any = {
        tableData: [],
        tHeader: ["Item No", "Refrigerating Chamber No", "Type of Goods", "No-Claims Period", "Sum Insured"],
        dataTypes: ["text", "text", "text", "text", "currency"],
        nData: new PolGoods_DOS(null, null, null, null, null),
        widths: ['1','1','auto','1','228'],
        // pageLength: 5,
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        totalFlag:true,
        pageLength: 5,
        searchFlag:true
    }

    dosMachineryPassData: any = {
        tableData: [],
        tHeader: ["Item No", "Number of Units", "Description of Items (Technical Data including Capacity)", "Year of Make", "Sum Insured"],
        dataTypes: ["text", "number", "text", "text", "currency"],
        nData: new PolMachinery_DOS(null, null, null, null, null),
        widths:  ['1','1','auto','1','228'],
        pageLength: 5,
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        totalFlag:true,
        searchFlag: true
    }

    cecPassData: any = {
        tableData:[],
        tHeader: ['Item No.', 'Insured Item and Location', 'Deductible', 'Sum Insured'],
        dataTypes:['string','string', 'string', 'currency'],
        nData: new PolItem_EEI_MBI_CEC(null, null, null, null, null, null),
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        totalFlag:true,
        widths: ["1","auto","auto","228"],
        searchFlag:true,
        pageLength:'unli'
    }

    
    polEEI: boolean = true;
    polBPV: boolean = false;
    polMLP: boolean = false;
    polDOS: boolean = false;

    line: string;
    sub: any;

    constructor(private route: ActivatedRoute, private underwritingService: UnderwritingService, private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Item");
        this.mlpPassData.tableData = this.underwritingService.getPolItemMLPData();
        this.dosGoodsPassData.tableData = this.underwritingService.getPolGoodsDOSData();
        this.dosMachineryPassData.tableData = this.underwritingService.getPolMachineryDOSData();
        this.cecPassData.tableData = this.underwritingService.getPolCECData();
        this.sub = this.route.params.subscribe(params => {
            this.line = params['line'];
        });
    }


}
