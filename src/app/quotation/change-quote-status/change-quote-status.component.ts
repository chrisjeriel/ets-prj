import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { QuotationService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-change-quote-status',
    templateUrl: './change-quote-status.component.html',
    styleUrls: ['./change-quote-status.component.css']
})
export class ChangeQuoteStatusComponent implements OnInit {
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    tHeader: any[] = [];
    tableData: any[] = [];
    saveData: any = {
        changeQuoteStatus: [],
        reasonCd: null
    };

    resizable: boolean[] = [false, false, true, true, true];

    records: any = [];
    selected: any = null;
    
    dialogMessage:string = "";
    dialogIcon: string = "";
    cancelFlag:boolean;

    selectedData : any ={
        quotationNo: null,
        status: null,
        statusCd: 0,
        cedingName: null,
        insuredDesc: null,
        riskName: null,
        processor: null,
        reasonCd: null,
        description: null,
        remarks: null
    }


    passData: any = {
      tHeader: ['Quotation No.','Type of Cession','Ceding Company','Insured','Risk'],
      tableData:[],
      dataTypes: ['text','text','text','text','text'],
      checkFlag: true,
      pageLength: 10,
      paginateFlag: true,
      infoFlag: true,
      uneditable: [true,true,true,true,true],
      keys: ['quotationNo','cessionDesc','cedingName','insuredDesc','riskName']
    };

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, config: NgbDropdownConfig,) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Quo | Change Quote Status");
        //setTimeout(function () { $('#modalBtn').trigger('click'); }, 100);        

        this.getChangeQuote();
        
    }

    getChangeQuote(){
        this.quotationService.getQuoProcessingData([]).subscribe((data:any) => {
            this.records = data.quotationList;
            console.log(this.records)
            for(let rec of this.records){
                this.passData.tableData.push(
                    {
                        quoteId: rec.quoteId,
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

    savetest(){
        this.quotationService.saveChangeQuoteStatus(this.saveData).subscribe(data => {
            if(data['returnCode'] == 0) {
                this.dialogMessage = data['errorList'][0].errorMessage;
                this.dialogIcon = "error";
                $('#successModalBtn').trigger('click');
            } else{
                this.dialogMessage="";
                this.dialogIcon = "";
                $('#successModalBtn').trigger('click');
                $('.ng-dirty').removeClass('ng-dirty');
                this.emptyVariables();
                this.getChangeQuote();
            }
       });
    }

    emptyVariables(){
        this.saveData.reasonCd = ""
        this.selectedData ={
            quotationNo: null,
            status: null,
            statusCd: 0,
            cedingName: null,
            insuredDesc: null,
            riskName: null,
            processor: null,
            reasonCd: null,
            description: null,
            remarks: null
        }
    }

    process(cancelFlag?) {
       this.prepareData();
       this.saveData.statusCd = this.selectedData.statusCd;
       this.cancelFlag = cancelFlag !== undefined;
           
       if(this.selectedData.statusCd == 9){
           this.saveData.reasonCd = this.selectedData.reasonCd;
       }else{
           this.saveData.reasonCd = this.saveData.reasonCd == null ? "":this.selectedData.reasonCd;
       }
       console.log(this.saveData.reasonCd)
       this.savetest();
    }

    prepareData(){
        /*for(let rec of this.records){
            if(rec.quotationNo === data.quotationNo) {
                if(data.checked){
                    this.selectedData = data;
                    this.saveData.changeQuoteStatus.push({
                        quoteId: rec.quoteId
                    })
                }else {
                    for(var j=0;j<this.saveData.changeQuoteStatus.length;j++){
                        if(this.saveData.changeQuoteStatus[j].quoteId == rec.quoteId){
                            this.saveData.changeQuoteStatus.pop(this.saveData.changeQuoteStatus[j])
                        }
                    }
                }
            }
        }*/
        this.saveData.changeQuoteStatus =[]
        //     for(var j=0; j < this.passData.tableData.length;j++){
        //             if(this.passData.tableData[j].checked){
        //                 this.selectedData = this.passData.tableData[j];
        //                 for(var k=0;k<this.saveData.changeQuoteStatus.length;k++){
        //                     if(this.saveData.changeQuoteStatus[k].quoteId == this.records.quoteId){
        //                         this.saveData.changeQuoteStatus.pop(this.saveData.changeQuoteStatus[j])
        //                         console.log('push')
        //                     }else{
        //                         this.saveData.changeQuoteStatus.push({
        //                             quoteId: this.passData.tableData[j].quoteId
        //                         })
        //                         console.log('pop')
        //                     }
        //                 }
                        
        //             }
        // }
        for(let data of this.passData.tableData){
            if(data.checked){
                console.log(data);
                this.saveData.changeQuoteStatus.push({
                    quoteId: data.quoteId
                })
            }
        }
    }

    query() {
        $('#modalBtn').trigger('click');
    }

    onRowClick(data) {
        //console.log(this.passData.tableData)
        /*for(let rec of this.records){
            if(rec.quotationNo === data.quotationNo) {
                if(data.checked){
                    this.selectedData = data;
                    this.saveData.changeQuoteStatus.push({
                        quoteId: rec.quoteId
                    })
                }else {
                    for(var j=0;j<this.saveData.changeQuoteStatus.length;j++){
                        if(this.saveData.changeQuoteStatus[j].quoteId == rec.quoteId){
                            this.saveData.changeQuoteStatus.pop(this.saveData.changeQuoteStatus[j])
                        }
                    }
                }
            }
        }*/
    }

    cancel(){
       this.prepareData();
       console.log(this.saveData)
       console.log(this.passData.tableData);
    }

    save(cancelFlag?){

    }

    openReasonLOV(){
        $('#reasonLOV #modalBtn').trigger('click');
    }

    setReason(data){
        this.selectedData.reasonCd = data.reasonCd;
        this.selectedData.description = data.description;
    }

}