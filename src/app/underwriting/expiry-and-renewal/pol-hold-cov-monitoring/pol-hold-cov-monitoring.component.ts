import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pol-hold-cov-monitoring',
  templateUrl: './pol-hold-cov-monitoring.component.html',
  styleUrls: ['./pol-hold-cov-monitoring.component.css']
})
export class PolHoldCovMonitoringComponent implements OnInit {

passData: any = {
        tableData: [],
        tHeader: ['Hold Cover No', 'Status', 'Ceding Company', 'Policy No', 'Risk', 'Insured', 'Period From', 'Period To', 'Co Ref Hold Cover No', 'Requested By', 'Request Date'],
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
                key: 'policyNo',
                title: 'Quotation No',
                dataType: 'text'
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
            {
                key: 'coRefHoldCovNo',
                title: 'CR Hold Cov No.',
                dataType: 'text'
            },
            {
                key: 'reqBy',
                title: 'Requested By',
                dataType: 'text'
            },
            {
                 keys: {
                    from: 'reqDateFrom',
                    to: 'reqDateTo'
                },
                title: 'Request Date',
                dataType: 'datespan'
            },
            {
                key: 'expiringInDays',
                title: 'Expires in (Days)',
                dataType: 'expire'
            },

        ],
        pageLength: 10,
        expireFilter: true, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, pagination: true, pageStatus: true,
        keys: ['holdCoverNo','status','cedingName','quotationNo','riskName',
            'insuredDesc','periodFrom','periodTo','compRefHoldCovNo','reqBy','reqDate'],
        exportFlag: true
    }


  constructor() { }

  ngOnInit() {
  }

}
