import { Component, OnInit, ViewChild } from '@angular/core';
import { QuotationService } from '@app/_services'
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-ready-for-printing',
  templateUrl: './ready-for-printing.component.html',
  styleUrls: ['./ready-for-printing.component.css']
})
export class ReadyForPrintingComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  records: any[] = [];

  constructor(private quotationService: QuotationService) { }
  btnDisabled: boolean;
  passData: any = {
    tHeader: [
      "Quotation No", "Approved By", "Type of Cession", "Line Class", "Status", "Ceding Company", "Principal", "Contractor", "Insured", "Risk", "Object", "Site", "Currency", "Quote Date", "Valid Until", "Requested By"
    ],

    resizable: [
      true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true
    ],
    dataTypes: [
      "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "date", "date", "text"
    ],
    filters: [
      {
        key: 'quotationNo',
        title: 'Quotation No',
        dataType: 'text'
      },
      {
        key: 'approvedBy',
        title: 'Approved By',
        dataType: 'text'
      },
      {
        key: 'typeOfCession',
        title: 'Type of Cession',
        dataType: 'text'
      },
      {
        key: 'lineClass',
        title: 'Line Class',
        dataType: 'text'
      },
      {
        key: 'status',
        title: 'Status',
        dataType: 'text'
      },
      {
        key: 'cedingCompany',
        title: 'Ceding Co',
        dataType: 'text'
      },
      {
        key: 'principal',
        title: 'Principal',
        dataType: 'text'
      },
      {
        key: 'contractor',
        title: 'Contractor',
        dataType: 'text'
      },
      {
        key: 'insured',
        title: 'Insured',
        dataType: 'text'
      },
      {
        key: 'risk',
        title: 'Risk',
        dataType: 'text'
      },
      {
        key: 'object',
        title: 'Object',
        dataType: 'text'
      },
      {
        key: 'site',
        title: 'Site',
        dataType: 'text'
      },
      {
        key: 'currency',
        title: 'Currency',
        dataType: 'text'
      },
      {
        key: 'quoteDate',
        title: 'Quote Date',
        dataType: 'date'
      },
      {
        key: 'validUntil',
        title: 'Valid Until',
        dataType: 'date'
      },
      {
        key: 'requestedBy',
        title: 'Requested By',
        dataType: 'text'
      },
    ],

    tableData: [],
    pageLength: 10,
    checkFlag: true,
    pagination: true,
    pageStatus: true,
    keys: ['quotationNo','approvedBy','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','currencyCd','issueDate','expiryDate','reqBy']

  }

  ngOnInit() {
    this.btnDisabled = true;

    this.quotationService.getQuoProcessingData([]).subscribe(data => {
            this.records = data['quotationList'];

            for(let rec of this.records){
              if(rec.status === 'In Progress'){
                this.passData.tableData.push(
                    {
                      quotationNo: rec.quotationNo,
                      approvedBy: rec.approvedBy,
                      cessionDesc: rec.cessionDesc,
                      lineClassCdDesc: rec.lineClassCdDesc,
                      status: rec.status,
                      cedingName: rec.cedingName,
                      principalName: rec.principalName,
                      contractorName: rec.contractorName,
                      insuredDesc: rec.insuredDesc,
                      riskName: (rec.project == null) ? '' : rec.project.riskName,
                      objectDesc: (rec.project == null) ? '' : rec.project.objectDesc,
                      site: (rec.project == null) ? '' : rec.project.site,
                      currencyCd: rec.currencyCd,
                      issueDate: this.dateParser(rec.issueDate),
                      expiryDate: this.dateParser(rec.expiryDate),
                      reqBy: rec.reqBy
                    }
                );
              }  
            }

            this.table.refreshTable();
        });

  }

  dateParser(arr){
    return new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);   
  }

}
