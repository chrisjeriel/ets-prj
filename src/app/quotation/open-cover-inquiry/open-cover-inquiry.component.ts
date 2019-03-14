import { Component, OnInit, ViewChild } from '@angular/core';
import { QuotationService } from '../../_services';
import { OpenCoverList, OpenCoverProcessing } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-open-cover-inquiry',
  templateUrl: './open-cover-inquiry.component.html',
  styleUrls: ['./open-cover-inquiry.component.css']
})
export class OpenCoverInquiryComponent implements OnInit {

  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

  line: string = "";
  selectedArr: any = [];
  ocLine: string = "";
  ocTypeOfCession = "";
  ocQuoteNo: string = "";
  mtnCessionDesc: string = "";

  passDataOpenCoverInquiry: any = {
    tableData: [],
    tHeader: ["Open Cover Quotation No", "Type of Cession", "Line Class", "Status", "Ceding Company", "Principal", "Contractor", "Insured", "Risk", "Object", "Site", "Policy No", "Currency"],
    dataTypes: ["text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text"],
    colSize: ['100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%'],
    pageLength: 20,
    pageStatus: true,
    pagination: true,
    printBtn: true,
    addFlag: false,
    pageID: 1,
    filters: [
      {
        key: 'quotationNo',
        title: 'OC Quo No',
        dataType: 'text'
      },
      {
        key: 'cessionDesc',
        title: 'Type Of Cession',
        dataType: 'text'
      },
      {
        key: 'lineClassCdDesc',
        title: 'Line Class',
        dataType: 'text'
      },
      {
        key: 'status',
        title: 'Status',
        dataType: 'text'
      },
      {
        key: 'cedingName',
        title: 'Ceding Co.',
        dataType: 'text'
      },
      {
        key: 'principalName',
        title: 'Principal',
        dataType: 'text'
      },
      {
        key: 'contractorName',
        title: 'Contractor',
        dataType: 'text'
      },
      {
        key: 'insuredDesc',
        title: 'Insured',
        dataType: 'text'
      },
      {
        key: 'riskName',
        title: 'Risk',
        dataType: 'text'
      },
      {
        key: 'objectDesc',
        title: 'Object',
        dataType: 'text'
      },
      {
        key: 'site',
        title: 'Site',
        dataType: 'text'
      },
      {
        key: 'policyNo',
        title: 'Policy',
        dataType: 'text'
      },
      {
        key: 'currencyCd',
        title: 'Currency',
        dataType: 'text'
      },
    ],
    keys: ['openQuotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','openPolicyNo','currencyCd'],
  };

  records: any[] = null;
  selected: any = null;

  constructor(private titleService: Title, private router: Router, private quotationService: QuotationService) { }

  ngOnInit() {
    this.titleService.setTitle("Quo | Open Cover Inquiry");

    this.quotationService.getOpenCoverProcessingData([]).subscribe(data => {
      this.records = data['quotationOcList'];

      for(let rec of this.records){
        this.passDataOpenCoverInquiry.tableData.push(
          {
            openQuotationNo: rec.openQuotationNo,
            cessionDesc: rec.cessionDesc,
            lineClassCdDesc: rec.lineClassCdDesc,
            status: rec.status,
            cedingName: rec.cedingName,
            principalName: rec.principalName,
            contractorName: rec.contractorName,
            insuredDesc: rec.insuredDesc,
            riskName: (rec.projectOc == null) ? '' : rec.projectOc.riskName,
            objectDesc: (rec.projectOc == null) ? '' : rec.projectOc.objectDesc,
            site: (rec.projectOc == null) ? '' : rec.projectOc.site,
            openPolicyNo: rec.openPolicyNo,
            currencyCd: rec.currencyCd,
          }
        );

      }

      this.table.refreshTable();
    });
  }

  onRowDblClick(event) {
    /*//line
    this.selectedArr = (event.target.closest('tr').children[0].innerText).split("-");
    this.ocLine = this.selectedArr[1];
    //end line

    //type of cession
    this.ocTypeOfCession = event.target.closest('tr').children[1].innerText;
    //end type of cession

    setTimeout(() => {
      this.checkLine(this.ocLine);
    }, 100);
*/
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
      this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }

    this.ocLine = this.quotationService.rowData[0].split("-")[1];
    this.ocQuoteNo  = this.quotationService.rowData[0];
    this.mtnCessionDesc =  this.quotationService.rowData[1];

    /*this.ocLine = this.selectedOpenQuotationNo.openQuotationNo.split('-')[1];
    this.ocQuoteNo = this.selectedOpenQuotationNo.openQuotationNo;
    this.mtnCessionDesc = this.selectedOpenQuotationNo.cessionDesc;*/

    setTimeout(() => {
      this.router.navigate(['/open-cover', { line: this.ocLine, from: "oc-processing", typeOfCession: this.mtnCessionDesc, fromBtn: 'view', ocQuoteNo: this.ocQuoteNo, inquiryFlag: true }], { skipLocationChange: true });
    }, 100);
  }

  onRowClick(event) {
    var sel = event.openQuotationNo;

    for(let rec of this.records){
      if(rec.openQuotationNo === sel){
        this.selected = rec;
        this.selected.issueDate = (this.selected.issueDate == null) ? '' : this.dateParser(this.selected.issueDate);
        this.selected.expiryDate = (this.selected.expiryDate == null) ? '' : this.dateParser(this.selected.expiryDate);
        break;
      }
    }
  }

  checkLine(cline: string) {
    if (cline === 'CAR' ||
      cline === 'EAR') {
      this.router.navigate(['/open-cover', { line: cline, typeOfCession: this.ocTypeOfCession, from: "oc-inquiry" }], { skipLocationChange: true });
    }
  }

  dateParser(arr){
    if(Array.isArray(arr)){
      return new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);  
    } else {
      return arr;
    }    
  }
}
