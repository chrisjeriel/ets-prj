import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';


@Component({
  selector: 'app-pol-batch-processing',
  templateUrl: './pol-batch-processing.component.html',
  styleUrls: ['./pol-batch-processing.component.css']
})
export class PolBatchProcessingComponent implements OnInit {

    @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
    // @ViewChild("distListProcessing") distListProcessing : CustNonDatatableComponent;
    // @ViewChild("distListPosting") distListPosting : CustNonDatatableComponent;
  
    passDataPosting: any = {
        tableData: [],
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

    passDataProcessing: any = {
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
        exportFlag: true

    }

    searchParams: any[] = [];



    /*passDataDistribution: any = {
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
       
    }*/

  constructor(private titleService: Title, private underwritingService: UnderwritingService) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Batch Processing");
        this.retrievePolDistListProcessing();
        this.retrievePolDistListPosting();
    }

    retrievePolDistListProcessing(){
        this.passDataProcessing.tableData = [];
        // this.table.overlayLoader = true;
        this.underwritingService.getPolDistList(this.searchParams).subscribe((data:any)=>{
            this.passDataProcessing.tableData = data.polDistList;
            //this.distListProcessing.refreshTable();
        });
    }

    retrievePolDistListPosting(){
        this.passDataPosting.tableData = [];
        // this.table.overlayLoader = true;
        this.underwritingService.getPolDistList(this.searchParams).subscribe((data:any)=>{
            this.passDataPosting.tableData = data.polDistList;
            //this.distListPosting.refreshTable();
        });
    }

}
