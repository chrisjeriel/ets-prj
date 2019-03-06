import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { QuotationService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
    selector: 'app-change-quote-status',
    templateUrl: './change-quote-status.component.html',
    styleUrls: ['./change-quote-status.component.css']
})
export class ChangeQuoteStatusComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;

    tHeader: any[] = [];
    tableData: any[] = [];

    resizable: boolean[] = [false, false, true, true, true];

    records: any[] = [];
    selected: any = null;
    
    batchOption: any = 0;

    passData: any = {
        tableData: [], 
        tHeader: ['Quotation No.','Type of Cession','Ceding Company','Insured','Risk'],
        dataTypes: [],
        resizable: [false, false, true, true, true],
        filters: [],
        pageLength: 10,
        expireFilter: false, checkFlag: true, tableOnly: true, fixedCol: false, printBtn: false, pageStatus: true, pagination: true,
        keys: ['quotationNo','cessionDesc','cedingName','insuredDesc','riskName']
    }

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title) {

    }

    ngOnInit() {
        this.titleService.setTitle("Quo | Change Quote Status");
        //setTimeout(function () { $('#modalBtn').trigger('click'); }, 100);        

        this.quotationService.getQuoProcessingData([]).subscribe(data => {
            this.records = data['quotationList'];
            console.log(this.records)
            for(let rec of this.records){
                this.passData.tableData.push(
                    {
                        quotationNo: rec.quotationNo,
                        cessionDesc: rec.cessionDesc,
                        cedingName: rec.cedingName,
                        insuredDesc: rec.insuredDesc,
                        riskName: (rec.project == null) ? '' : rec.project.riskName
                    }
                );
            }

            this.table.refreshTable();
        });
        
        
    }

    save() {
        //do something
       this.selected
       this.quotationService.saveChangeQuoteStatus(this.selected).subscribe(data => {
            if(data['returnCode'] == 0) {
                console.log('error')
            }else{
                console.log('success')
            }
       });
    }
    query() {
        $('#modalBtn').trigger('click');
    }

    onRowClick(event) {

        for(let rec of this.records){
            if(rec.quotationNo === event.quotationNo) {
                this.selected = rec;
                console.log(this.selected)
            }
        }
    }

}
