import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuotationList } from '@app/_models';
import { QuotationService } from '../../../_services';

@Component({
    selector: 'app-list-of-quotations',
    templateUrl: './list-of-quotations.component.html',
    styleUrls: ['./list-of-quotations.component.css']
})
export class ListOfQuotationsComponent implements OnInit {
    tableData: any[] = [];
    allData: any[] = [];
    tHeader: any[] = [];
    resizables: boolean[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    pageLength: number;
    i: number;
    line: string = "";
    quoteList: QuotationList = new QuotationList(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

    passData: any = {
        tableData: [], 
        tHeader: ['Quotation No.','Type of Cession','Line Class','Status','Ceding Company','Principal','Contractor','Insured','Risk','Object','Site','Policy No','Currency'],
        dataTypes: [],
        resizable: [false, false, true, true, true, true, true, true, true, true, false, false],
        filters: [
            {
                key: 'quotationNo',
                title:'Quotation No.',
                dataType: 'text'
            },
            {
                key: 'cessionType',
                title:'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'lineClass',
                title:'Line Class',
                dataType: 'text'
            },
            {
                key: 'quoteStatus',
                title:'Quote Status',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title:'Ceding Company',
                dataType: 'text'
            },
            {
                key: 'principal',
                title:'Principal',
                dataType: 'text'
            },
            {
                key: 'insured',
                title:'Insured',
                dataType: 'text'
            },
            {
                key: 'risk',
                title:'Risk',
                dataType: 'text'
            },
            {
                key: 'object',
                title:'Object',
                dataType: 'text'
            },
            {
                key: 'location',
                title:'Insured',
                dataType: 'text'
            },
            {
                key: 'quoteDate',
                title:'Period From',
                dataType: 'date'
            },
        ],
        pageLength: 10,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: true, printBtn: true, pagination: true, pageStatus: true,
    }

    constructor(private quotationService: QuotationService, private router: Router) { 
        this.pageLength = 10;
    }

    ngOnInit() {
        this.tHeader.push("Quotation No.");
        this.tHeader.push("Type of Cession");
        this.tHeader.push("Line Class");
        this.tHeader.push("Status");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Principal");
        this.tHeader.push("Contractor");
        this.tHeader.push("Insured");
        this.tHeader.push("Risk");
        this.tHeader.push("Object");
        this.tHeader.push("Site");
        this.tHeader.push("Policy No.");
        this.tHeader.push("Currency");

        this.resizables.push(false);
        this.resizables.push(false);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(true);
        this.resizables.push(false);
        this.resizables.push(false);

        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");
        this.dataTypes.push("text");

        this.passData.tableData = this.quotationService.getQuotationListInfo();
        this.passData.tableData.forEach(function(e){
            delete e.quoteDate;
            delete e.validityDate;
            delete e.createdBy;
            delete e.requestedBy;
            delete e.approvedBy;
        });
        this.allData = this.quotationService.getQuotationListInfo();
    }
    onRowClick(event) {
       /* for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }
        if(!Number.isNaN(event.path[2].rowIndex - 1)){
            this.quoteList = this.allData[event.path[2].rowIndex - 1];
        }*/
       this.quoteList = event;
       for(let val in this.allData){
          if(this.quoteList.quotationNo == this.allData[val].quotationNo){
              this.quoteList = this.allData[val];
              break;
          }
       }
    }

    onRowDblClick(event) {
        for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }

        this.line = this.quotationService.rowData[0].split("-")[0]; 
        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        console.log(this.line);
        /*this.router.navigate(['/quotation']);*/
        setTimeout(() => {
               this.router.navigate(['/quotation', { line: this.line }], { skipLocationChange: true });
        },100); 
    }
}
