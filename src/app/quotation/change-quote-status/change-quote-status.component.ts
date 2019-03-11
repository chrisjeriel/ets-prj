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
    };

    resizable: boolean[] = [false, false, true, true, true];

    records: any[] = [];
    selected: any = null;
    
    dialogMessage:string = "";
    dialogIcon: string = "";
    cancelFlag:boolean;
    required: boolean = true;
    statusCode: any = 0;

    selectedData : any ={
        quotationNo: null,
        status: null,
        statusCode: null,
        cedingCompany: null,
        insured: null,
        risk: null,
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

    reasonRequired(){
        this.required = false;
    }

    reasonNotRequired(){
        this.required = true;
    }

    getChangeQuote(){
        this.quotationService.getQuoProcessingData([]).subscribe((data:any) => {
            this.records = data.quotationList;
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

    process(cancelFlag?) {
       this.saveData.statusCd = this.selectedData.statusCode;
       this.cancelFlag = cancelFlag !== undefined;
       //if (this.saveData.changeQuoteStatus.length != 0 && this.saveData.statusCd != null) {
           this.quotationService.saveChangeQuoteStatus(this.saveData).subscribe(data => {
                if(data['returnCode'] == 0) {
                    this.dialogMessage = data['errorList'][0].errorMessage;
                    this.dialogIcon = "error";
                    console.log('return code 0')
                    $('#successModalBtn').trigger('click');
                } else{
                    this.dialogMessage="";
                    this.dialogIcon = "";
                    console.log('return code not 0')
                    $('#successModalBtn').trigger('click');
                    $('.ng-dirty').removeClass('ng-dirty');
                    this.getChangeQuote();
                }
           });
        /*}else{
          this.dialogMessage = "Nothing to save.";
          this.dialogIcon = "info"
          console.log('outside nothing to save')
          $('#successModalBtn').trigger('click');
        }*/
    }

    query() {
        $('#modalBtn').trigger('click');
    }

    onRowClick(data) {
        for(let rec of this.records){
            if(rec.quotationNo === data.quotationNo) {
                if(data.checked){
                    this.saveData.changeQuoteStatus.push({
                        quoteId: rec.quoteId,
                        reasonCd: 'LC'
                    })
                }else {
                    for(var j=0;j<this.saveData.changeQuoteStatus.length;j++){
                        if(this.saveData.changeQuoteStatus[j].quoteId == rec.quoteId){
                            this.saveData.changeQuoteStatus.pop(this.saveData.changeQuoteStatus[j])
                        }
                    }
                }
            }
        }
    }

    cancel(){
        console.log(this.saveData)    
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
