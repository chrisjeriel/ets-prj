import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-pol-batch-processing',
  templateUrl: './pol-batch-processing.component.html',
  styleUrls: ['./pol-batch-processing.component.css']
})
export class PolBatchProcessingComponent implements OnInit {
  
  // passDataPosting: any = {
  //       tHeader: [
  //           "Dist No.", "Risk Dist No.", "Status","Line", "Policy No.",
  //           "Ceding Company", "Insured", "Risk","Currency","Sum Insured","Distribution Date", "Accounting Date"
  //       ],
  //       resizable: [
  //           false, false, true,false, false, true, true, true,false,true,false, false,
  //       ],
  //       dataTypes: [
  //           "text", "text", "text","text", "text", "text", "text", "text","text","currency","date", "date"
  //       ],
  //       tableData: this.underwritingService.getPolicyBatchPosting(),
  //       checkFlag:true,
  //       addFlag:true,
  //       deleteFlag:true,
  //       pageLength: 10,
  //       searchFlag:true,
  //       paginateFlag:true,
  //       infoFlag:true,
  //  };

    passDataPosting: any = {
        tableData: this.underwritingService.getPolicyBatchDistribution(),
        tHeader: [
            "Dist No.", "Risk Dist No." , "Status","Line", "Policy No.","Type of Cession",
            "Ceding Company", "Insured", "Risk","Object","Site","Currency","Sum Insured","Premium","Issue Date","Inception Date","Expiry Date", "Accounting Date","Distribution Date"
        ],
        dataTypes: [
            "text", "text", "text","text", "text", "text","text", "text", "text","text","text","text","currency","currency","date", "date","date","date","date"
        ],
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
        checkFlag: true,
        pageStatus: true, 
        pagination: true,
        resizable: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false] 
       
    }
   // passDataDistribution: any = {
   //      tHeader: [
   //          "Dist No.", "Risk Dist No." , "Status","Line", "Policy No.","Type of Cession",
   //          "Ceding Company", "Insured", "Risk","Object","Site","Currency","Sum Insured","Premium","Issue Date","Inception Date","Expiry Date", "Accounting Date","Distribution Date"
   //      ],
   //      dataTypes: [
   //          "text", "text", "text","text", "text", "text","text", "text", "text","text","text","text","currency","currency","date", "date","date","date","date"
   //      ],
   //      tableData: this.underwritingService.getPolicyBatchDistribution(),
   //      checkFlag:true,
   //      pageLength: 10,
   //      searchFlag:true,
   //      paginateFlag:true,
   //      infoFlag:true,
   // };

   passDataDistribution: any = {
        tableData: this.underwritingService.getPolicyBatchDistribution(),
        tHeader: [
            "Dist No.", "Risk Dist No." , "Status","Line", "Policy No.","Type of Cession",
            "Ceding Company", "Insured", "Risk","Object","Site","Currency","Sum Insured","Premium","Issue Date","Inception Date","Expiry Date", "Accounting Date","Distribution Date"
        ],
        dataTypes: [
            "text", "text", "text","text", "text", "text","text", "text", "text","text","text","text","currency","currency","date", "date","date","date","date"
        ],
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
        checkFlag: true,
        pageStatus: true, 
        pagination: true,
        resizable: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false] 
       
    }

  constructor(private titleService: Title, private underwritingService: UnderwritingService) { }

  ngOnInit() {
        this.titleService.setTitle("Pol | Batch Processing");
    }

}
