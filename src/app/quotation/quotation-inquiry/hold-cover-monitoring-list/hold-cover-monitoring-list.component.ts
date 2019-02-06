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
                key: 'cedingCompany',
                title: 'Ceding Company',
                dataType: 'text'
            },
            {
                key: 'quotationNo',
                title: 'Quotation No',
                dataType: 'text'
            },
            {
                key: 'risk',
                title: 'Risk',
                dataType: 'text'
            },
            {
                key: 'insured',
                title: 'Insured',
                dataType: 'text'
            },
            {
                key: 'periodFrom',
                title: 'Period From',
                dataType: 'date'
            },
            {
                key: 'periodTo',
                title: 'Period To',
                dataType: 'date'
            },
            {
                key: 'compRefHoldCoverNo',
                title: 'Comp. Ref. Hold Cover No.',
                dataType: 'text'
            },
            {
                key: 'requestedBy',
                title: 'Requested By',
                dataType: 'text'
            },
            {
                key: 'requestDate',
                title: 'Request Date',
                dataType: 'date'
            },

        ],
        pageLength: 10,
        expireFilter: true, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: true, pagination: true, pageStatus: true,
        keys: ['holdCoverNo','status','cedingName','quotationNo','riskName',
            'insuredDesc','periodFrom','periodTo','compRefHoldCovNo','reqBy','reqDate']
    }

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
        this.quotationService.getQuotationHoldCoverInfo()
            .subscribe(val =>
                {
                    console.log(val);
                    for(let i of val['quotationList']){
                            // this.holdCoverMonitoringList.holdCoverNo        = i.holdCover.holdCoverNo;
                            // this.holdCoverMonitoringList.status             = i.holdCover.status;
                            // this.holdCoverMonitoringList.cedingCompany      = i.cedingName;
                            // this.holdCoverMonitoringList.quotationNo        = i.quotationNo;
                            // this.holdCoverMonitoringList.risk               = i.project.riskName;
                            // this.holdCoverMonitoringList.insured            = i.insuredDesc;
                            // this.holdCoverMonitoringList.periodFrom         = i.holdCover.periodFrom;
                            // this.holdCoverMonitoringList.periodTo           = i.holdCover.periodTo;
                            // this.holdCoverMonitoringList.compRefHoldCoverNo = i.holdCover.compRefHoldCovNo;
                            // this.holdCoverMonitoringList.requestedBy        = i.holdCover.reqBy;
                            // this.holdCoverMonitoringList.requestDate        = i.holdCover.reqDate;
                         this.passData.tableData.push(new HoldCoverMonitoringList(
                            i.holdCover.holdCoverNo,
                            i.holdCover.status,
                            i.cedingName,
                            i.quotationNo,
                            i.project.riskName,
                            i.insuredDesc,
                            new Date(this.formatDate(i.holdCover.periodFrom)),
                            new Date(this.formatDate(i.holdCover.periodTo)),
                            i.holdCover.compRefHoldCovNo,
                            i.holdCover.reqBy,
                            new Date(this.formatDate(i.holdCover.reqDate))
                         ));
                    }
                    this.table.refreshTable();
                }
            );
    }
    onRowClick(event) {
        for (var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }
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
        // if(date[1] < 9){
        //   return date[0] + "-" + '0'+ date[1] + "-" + date[2];
        // }else{
          return date[0] + "-" +date[1] + "-" + date[2];
        //}
      }
}
