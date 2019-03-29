import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, QuotationService } from '../../../_services';
import { CreateParInfo } from '../../../_models/CreatePolicy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-pol-create-par',
  templateUrl: './pol-create-par.component.html',
  styleUrls: ['./pol-create-par.component.css']
})
export class PolCreatePARComponent implements OnInit {
  @ViewChild('polLov') lovTable: CustNonDatatableComponent;

  private createParInfo: CreateParInfo
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];  
  quoteLine: any;

  qu: boolean = true;
  hc: boolean = false;
  oc: boolean = false;

  quotationList: any[] = [];

  passDataLOV: any = {
    tableData: [],
    tHeader:["Quotation No.", "Ceding Company", "Insured", "Risk"],  
    dataTypes: ["text","text","text","text"],
    pageLength: 10,
    resizable: [false,false,false,false],
    tableOnly: false,
    keys: ['quotationNo','cedingName','insuredDesc','riskName'],
    pageStatus: true,
    pagination: true,
    filters: [
    /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
    {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
    {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
    {key: 'riskName',title: 'Risk',dataType: 'text'}*/]
  }

  constructor(private underwritingService: UnderwritingService,
    private modalService: NgbModal, private router: Router, private titleService: Title, private quoteService: QuotationService) {

  }

  ngOnInit() {    
    this.getQuoteListing();
  }

  getQuoteListing() {
    this.quoteService.getQuoProcessingData([]).subscribe(data => {
      this.quotationList = data['quotationList'];

      this.passDataLOV.tableData = this.quotationList.filter(q => q.status.toUpperCase() === 'RELEASED').map(q => { q.riskName = q.project.riskName; return q; });

      this.lovTable.refreshTable();
    });
  }

  navigateToGenInfo() {
    var qLine = this.quoteLine.toUpperCase();

    if (qLine === 'CAR' ||
      qLine === 'EAR' ||
      qLine === 'EEI' ||
      qLine === 'CEC' ||
      qLine === 'MBI' ||
      qLine === 'BPV' ||
      qLine === 'MLP' ||
      qLine === 'DOS') {
      this.router.navigate(['/policy-issuance', { line: qLine }], { skipLocationChange: true });
    }

  }

  toggle(str) {
    switch (str) {
      case 'qu':
        this.qu = true;   
        this.hc = false;
        this.oc = false;
        break;

      case 'hc':
        this.qu = false;
        this.hc = true;        
        this.oc = false;
        break;
      
      case 'oc':        
        this.qu = false;
        this.hc = false;
        this.oc = true;
        break;
    }
  }

  showLOV() {
    $('#polLovMdl > #modalBtn').trigger('click');
  }
}
