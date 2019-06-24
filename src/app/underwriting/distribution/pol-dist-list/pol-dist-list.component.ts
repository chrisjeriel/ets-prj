import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
    selector: 'app-pol-dist-list',
    templateUrl: './pol-dist-list.component.html',
    styleUrls: ['./pol-dist-list.component.css']
})
export class PolDistListComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

    passData: any = {
        tHeader: [
            "Dist No.", "Risk Dist No.", "Status", "Line", "Policy No.",
            "Ceding Company", "Insured", "Risk","Currency","Sum Insured","Distribution Date", "Accounting Date"
        ],
        filters: [
           {
                key: 'distId',
                title:'Dist. No.',
                dataType: 'text'
            },
            {
                key: 'riskDistId',
                title:'Risk Dist. No.',
                dataType: 'text'
            },
            {
                key: 'Sstatus',
                title:'Status',
                dataType: 'text'
            },
            {
                key: 'policyNo',
                title:'Policy No.',
                dataType: 'text'
            },
            {
                key: 'cedingName',
                title:'Ceding Co.',
                dataType: 'text'
            },
            {
                key: 'insuredDesc',
                title:'Insured',
                dataType: 'text'
            },
            {
                key: 'riskName',
                title:'Risk',
                dataType: 'text'
            },
            {
                 keys: {
                      from: 'distDateFrom',
                      to: 'distDateTo'
                  },
                  title: 'Dist Date',
                  dataType: 'datespan'
            },
            {
                 keys: {
                      from: 'acctDateFrom',
                      to: 'acctDateTo'
                  },
                  title: 'Acct Date',
                  dataType: 'datespan'
              },
        ],
        dataTypes: [
            "sequence-5", "sequence-5", "text","text", "text", "text", "text", "text","text","currency","date", "date"
        ],
        tableData: [],
        keys: ['distId', 'riskDistId', 'status', 'lineCd' ,'policyNo', 'cedingName', 'insuredDesc', 'riskName', 'currencyCd', 'totalSi', 'distDate', 'acctDate'],
        pageLength: 20,
        printBtn: false,
        addFlag: false,
        pagination: true,
        pageStatus: true,

    }

    searchParams: any[] = [];
    selected: any;
    constructor(config: NgbDropdownConfig, private underwritingService: UnderwritingService, private titleService: Title, private router: Router) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Pol | Policy Distribution List");
        this.retrievePolDistList();
    }

    retrievePolDistList(){
        this.underwritingService.getPolDistList(this.searchParams).subscribe((data:any)=>{
            this.passData.tableData = data.polDistList;
            this.table.refreshTable();
        });
    }

    searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        //this.passData.btnDisabled = true;
        this.retrievePolDistList();

   }

   gotoInfo(){
       this.router.navigate(['policy-dist', {policyId:this.selected.policyId,
                                                 policyNo: this.selected.policyNo,
                                                 lineCd:this.selected.lineCd,
                                                 lineClassCd: this.selected.lineClassCd,
                                                 cedingName: this.selected.cedingName,
                                                 insured: this.selected.insuredDesc,
                                                 riskName: this.selected.riskName,
                                                 exitLink: '/pol-dist-list'
                                                 }], { skipLocationChange: true });
   }

}
