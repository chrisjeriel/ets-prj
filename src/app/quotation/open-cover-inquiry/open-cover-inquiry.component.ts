import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../_services';
import { OpenCoverList } from '@app/_models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-open-cover-inquiry',
  templateUrl: './open-cover-inquiry.component.html',
  styleUrls: ['./open-cover-inquiry.component.css']
})
export class OpenCoverInquiryComponent implements OnInit {
  i: number;
  line: string = "";
  openCoverList: OpenCoverList = new OpenCoverList(null, null, null, null, null, null, null, null, null, null, null, null, null);
  allData: any[] = [];

  passData: any = {
        tableData: this.quotationService.getOpenCoverListInfo(), 
        tHeader: ['Open Cover Quotation No.','Type of Cession','Line Class','Status','Ceding Company','Principal','Contractor','Insured','Risk','Object','Site','Policy No','Currency'],
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


  constructor( private quotationService: QuotationService,  private router: Router ) { }

  ngOnInit() {

  	this.allData = this.quotationService.getOpenCoverListInfo();
  }

  onRowClick(event) {
        for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }
        if(!Number.isNaN(event.path[2].rowIndex - 1)){
            this.openCoverList = this.allData[event.path[2].rowIndex - 1];
        }
    }

    onRowDblClick(event) {
        for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }

        this.line = this.quotationService.rowData[0].split("-")[0]; 

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        this.router.navigate(['/open-cover']);
    }
}
