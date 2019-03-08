import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { QuotationService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
    selector: 'app-change-quote-status',
    templateUrl: './change-quote-status.component.html',
    styleUrls: ['./change-quote-status.component.css']
})
export class ChangeQuoteStatusComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    tHeader: any[] = [];
    tableData: any[] = [];
    saveData: any = {
        changeQuoteStatus: [],
    };

    resizable: boolean[] = [false, false, true, true, true];

    records: any[] = [];
    selected: any = null;
    
    statusCode: any = 0;
    dialogMessage:string = "";
    dialogIcon: string = "";
    cancelFlag:boolean;

    mockTesting : any ={
        quoteId: null,
        reasonCd: null,
        status: null
    }


    passData: any = {
      tHeader: ['Quotation No.','Type of Cession','Ceding Company','Insured','Risk'],
      tableData:[],
      dataTypes: ['text','text','text','text','text'],
      checkFlag: true,
      pageLength: 10,
      uneditable: [true,true,true,true,true],
      keys: ['quotationNo','cessionDesc','cedingName','insuredDesc','riskName']
    };

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
                    /*{
                        quotationNo: rec.quotationNo,
                        cessionDesc: rec.cessionDesc,
                        cedingName: rec.cedingName,
                        insuredDesc: rec.insuredDesc,
                        riskName: (rec.project == null) ? '' : rec.project.riskName
                    }*/
                    rec
                );
            }

            this.table.refreshTable();
        });
        
        
    }

    process() {
        this.saveData.statusCd = this.statusCode;
        console.log(JSON.stringify(this.saveData))
       this.quotationService.saveChangeQuoteStatus(this.saveData).subscribe(data => {
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

    onRowClick(target) {

        /*for(let rec of this.records){
            if(rec.quotationNo === event.quotationNo) {
                this.saveData.changeQuoteStatus.push({
                    quoteId: rec.quoteId,
                    reasonCd: 'LC'
                })
            }
        }*/
        /*console.log(target)*/
        console.log(event)
    }
    /*onRowClick(event) {

        for(let rec of this.records){
            if(rec.quotationNo === event.quotationNo) {
                this.saveData.changeQuoteStatus.push({
                    quoteId: rec.quoteId,
                    reasonCd: 'LC'
                })
            }
        }
    }*/

    testing(data){
        console.log(data)
    }

    cancel(){
        console.log(this.passData.tableData)    
    }

    save(cancelFlag?){

    }

}
