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
        tableData: this.underwritingService.getPolicyBatchPosting(),
        tHeader: [
            "Dist No.", "Risk Dist No." , "Status","Line", "Policy No.","Type of Cession",
            "Ceding Company", "Insured", "Risk","Object","Site","Currency","Sum Insured","Premium","Issue Date","Inception Date","Expiry Date", "Accounting Date","Distribution Date"
        ],
        dataTypes: [
            "text", "text", "text","text", "text", "text","text", "text", "text","text","text","text","currency","currency","date", "date","date","date","date"
        ],
        filters: [
            {
                key: 'distNo',
                title: 'Dist No.',
                dataType: 'text'
            },
            {
                key: 'riskDistNo',
                title: 'Risk Dist No',
                dataType: 'text'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
            {
                key: 'line',
                title: 'Line',
                dataType: 'text'
            },
            {
                key: 'policyNo',
                title: 'Policy No',
                dataType: 'text'
            },
            {
                key: 'typeOfCession',
                title: 'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title: 'Ceding Company',
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
                title: 'Object.',
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
                key: 'sumInsured',
                title: 'Sum Insured',
                dataType: 'text'
            },
            {
                key: 'prenium',
                title: 'Prenium',
                dataType: 'text'
            },
            {
                key: 'issueDate',
                title: 'Issue Date',
                dataType: 'date'
            },
            {
                key: 'inceptionDate',
                title: 'Inception Date',
                dataType: 'date'
            },
            {
                key: 'expiryDate',
                title: 'Expiry Date',
                dataType: 'date'
            },
            {
                key: 'accountingDate',
                title: 'Accounting Date',
                dataType: 'date'
            },
            {
                key: 'distributionDate',
                title: 'Distribution Date',
                dataType: 'date    '
            },
        ],
        pageLength: 10,
        checkFlag: true,
        pageStatus: true, 
        pagination: true,
        resizable: [false,false,true,false,false,false,true,true,true,true,true,false,true,true,false,false,false,false,false] 
       
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
                key: 'distNo',
                title: 'Dist No.',
                dataType: 'text'
            },
            {
                key: 'riskDistNo',
                title: 'Risk Dist No',
                dataType: 'text'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
            {
                key: 'line',
                title: 'Line',
                dataType: 'text'
            },
            {
                key: 'policyNo',
                title: 'Policy No',
                dataType: 'text'
            },
            {
                key: 'typeOfCession',
                title: 'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title: 'Ceding Company',
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
                title: 'Object.',
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
                key: 'sumInsured',
                title: 'Sum Insured',
                dataType: 'text'
            },
            {
                key: 'prenium',
                title: 'Prenium',
                dataType: 'text'
            },
            {
                key: 'issueDate',
                title: 'Issue Date',
                dataType: 'date'
            },
            {
                key: 'inceptionDate',
                title: 'Inception Date',
                dataType: 'date'
            },
            {
                key: 'expiryDate',
                title: 'Expiry Date',
                dataType: 'date'
            },
            {
                key: 'accountingDate',
                title: 'Accounting Date',
                dataType: 'date'
            },
            {
                key: 'distributionDate',
                title: 'Distribution Date',
                dataType: 'date'
            },
        ],
        pageLength: 10,
        checkFlag: true,
        pageStatus: true, 
        pagination: true,
        resizable: [false,false,true,false,false,false,true,true,true,true,true,false,true,true,false,false,false,false,false] 
       
    }

  constructor(private titleService: Title, private underwritingService: UnderwritingService) { }

  ngOnInit() {
        this.titleService.setTitle("Pol | Batch Processing");
    }

}
