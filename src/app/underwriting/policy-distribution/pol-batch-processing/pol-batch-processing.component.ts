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
  
  passDataPosting: any = {
        tHeader: [
            "Dist No.", "Risk Dist No.", "Status","Line", "Policy No.",
            "Ceding Company", "Insured", "Risk","Currency","Sum Insured","Distribution Date", "Accounting Date"
        ],
        resizable: [
            false, false, true,false, false, true, true, true,false,true,false, false,
        ],
        dataTypes: [
            "text", "text", "text","text", "text", "text", "text", "text","text","currency","date", "date"
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
        tableData: this.underwritingService.getPolicyBatchPosting(),
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
        paginateFlag:true,
        infoFlag:true,
   };

   passDataDistribution: any = {
        tHeader: [
            "Dist No.", "Risk Dist No." , "Status","Line", "Policy No.",
            "Ceding Company", "Insured", "Risk","Currency","Sum Insured","Distribution Date", "Accounting Date"
        ],
        resizable: [
            false, false, true,false, false, true, true, true,false,true,false, false,
        ],
        dataTypes: [
            "text", "text", "text","text", "text", "text", "text", "text","text","currency","date", "date"
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
        tableData: this.underwritingService.getPolicyBatchDistribution(),
        checkFlag:true,
        addFlag:true,
        deleteFlag:true,
        pageLength: 10,
        searchFlag:true,
        paginateFlag:true,
        infoFlag:true,
   };

  constructor(private titleService: Title, private underwritingService: UnderwritingService) { }

  ngOnInit() {
        this.titleService.setTitle("Pol | Batch Processing");
    }

}
