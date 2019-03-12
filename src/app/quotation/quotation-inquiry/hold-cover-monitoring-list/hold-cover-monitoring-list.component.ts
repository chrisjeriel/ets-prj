import { Component, OnInit , ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { QuotationService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { HoldCoverMonitoringList } from '@app/_models/quotation-list';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
    selector: 'app-hold-cover-monitoring-list',
    templateUrl: './hold-cover-monitoring-list.component.html',
    styleUrls: ['./hold-cover-monitoring-list.component.css']
})
export class HoldCoverMonitoringListComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table:CustNonDatatableComponent; 
    private holdCoverMonitoringList: HoldCoverMonitoringList;

    tableData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    pageLength: number;
    line: string = "";
    filterDataTypes: any[] = [];
    constructor(private quotationService: QuotationService, private router: Router, private titleService: Title) {
        this.pageLength = 10;
    }

    passData: any = {
        tableData: [],
        tHeader: ['Hold Cover No.', 'Status', 'Ceding Company', 'Quotation No.', 'Risk', 'Insured', 'Period From', 'Period To', 'Comp. Ref. Hold Cover No.', 'Requested By', 'Request Date'],
        dataTypes: [],
        resizable: [false, false, true, false, true, true, false, false, false, true, false],
        filters: [
            {
                key: 'holdCoverNo',
                title: 'Hold Cover No.',
                dataType: 'text'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
            {
                key: 'cedingName',
                title: 'Ceding Co',
                dataType: 'text'
            },
            {
                key: 'quotationNo',
                title: 'Quotation No',
                dataType: 'seq'
            },
            {
                key: 'riskName',
                title: 'Risk',
                dataType: 'text'
            },
            {
                key: 'insuredDesc',
                title: 'Insured',
                dataType: 'text'
            },
            {
                keys: {
                    from: 'periodFrom',
                    to: 'periodTo'
                },
                title: 'Period',
                dataType: 'datespan'
            },
           /* {
                key: 'periodTo',
                title: 'Period To',
                dataType: 'datespan'
            },*/
            {
                key: 'compRefHoldCovNo',
                title: 'CR Hold Cov No.',
                dataType: 'seq'
            },
            {
                key: 'reqBy',
                title: 'Requested By',
                dataType: 'text'
            },
            {
                key: 'reqDate',
                title: 'Request Date',
                dataType: 'date'
            },
            {
                key: 'expiringInDays',
                title: 'Expires in (Days)',
                dataType: 'expire'
            },

        ],
        pageLength: 10,
        expireFilter: true, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: true, pagination: true, pageStatus: true,
        keys: ['holdCoverNo','status','cedingName','quotationNo','riskName',
            'insuredDesc','periodFrom','periodTo','compRefHoldCovNo','reqBy','reqDate']
    }

    searchParams: any[] = [];

    ngOnInit() {
        this.titleService.setTitle("Quo | Hold Cover Monitoring");
        this.tHeader.push("Hold Cover No.");
        this.tHeader.push("Status");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Quotation No.");
        this.tHeader.push("Risk");
        this.tHeader.push("Insured");
        this.tHeader.push("Period From");
        this.tHeader.push("Period To");
        this.tHeader.push("Comp. Ref. Hold Cover No.");
        this.tHeader.push("Requested By");
        this.tHeader.push("Request Date");

        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("date");
        this.passData.dataTypes.push("date");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("date");

        //this.passData.tableData = this.quotationService.getQuotationHoldCoverInfo();
    
        //this.holdCoverMonitoringList = new HoldCoverMonitoringList(null,null,null,null,null,null,null,null,null,null,null);
       
       this.retrieveQuoteHoldCoverListingMethod();
    }

    retrieveQuoteHoldCoverListingMethod(){
         this.quotationService.getQuotationHoldCoverInfo(this.searchParams)
            .subscribe(val =>
                {
                    console.log(val);
                    for(var i = val['quotationList'].length -1 ; i >= 0 ; i--){
                         var list = val['quotationList'][i]
                         this.passData.tableData.push(new HoldCoverMonitoringList(
                            list.holdCover.holdCoverNo,
                            list.holdCover.status,
                            list.cedingName,
                            list.quotationNo,
                            (list.project == null) ? '' : list.project.riskName,
                            list.insuredDesc,
                            new Date(this.formatDate(list.holdCover.periodFrom)),
                            new Date(this.formatDate(list.holdCover.periodTo)),
                            list.holdCover.compRefHoldCovNo,
                            list.holdCover.reqBy,
                            new Date(this.formatDate(list.holdCover.reqDate))
                         ));
                    }
                    this.table.refreshTable();
                }
            );
    }

     //Method for DB query
    searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.retrieveQuoteHoldCoverListingMethod();
    }

    onRowClick(event) {
        /*for (var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }*/

        console.log(event);
    }

    onRowDblClick(event) {
        for (var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }

        this.line = this.quotationService.rowData[0].split("-")[0];

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        this.router.navigate(['/quotation']);
    }

    formatDate(date){
       var dt = new Date(date);
       return (dt.getMonth()+1) + '-' + dt.getDate() + '-' + dt.getFullYear(); 
    }
}
