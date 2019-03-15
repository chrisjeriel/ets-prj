import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbDropdownConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { QuotationService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';

@Component({
    selector: 'app-change-quote-status',
    templateUrl: './change-quote-status.component.html',
    styleUrls: ['./change-quote-status.component.css']
})
export class ChangeQuoteStatusComponent implements OnInit {
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
    @ViewChild(MtnRiskComponent) riskLov: MtnTypeOfCessionComponent;

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
    typeOfCessionId = "";
    typeOfCession = "";
    riskCd: string = "";
    riskName: string = "";
    cedingCode: string = "";
    cedingName: string = "";

    selectedData : any ={
        quotationNo: null,
        status: null,
        statusCd: null,
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

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title, config: NgbDropdownConfig,private router: Router, private ns: NotesService) {
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

    saveProcess(){
        console.log(this.saveData.changeQuoteStatus)
        console.log(this.saveData.statusCd)
        console.log(this.saveData)
        if(this.saveData.changeQuoteStatus.length != 0 && this.saveData.statusCd != null){
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
        }else{
            this.dialogMessage = "Nothing to save.";
            this.dialogIcon = "info"
            $('#successModalBtn').trigger('click');
        }
    }

    emptyVariables(){
        this.saveData.reasonCd = null
        this.saveData.statusCd = null
        this.selectedData ={
            quotationNo: null,
            status: null,
            statusCd: null,
            cedingName: null,
            insuredDesc: null,
            riskName: null,
            processor: null,
            reasonCd: null,
            description: null,
            remarks: null
        }
        this.typeOfCession = "";
        this.typeOfCessionId = "";
        this.riskCd = "";
        this.riskName = "";
        this.cedingCode = "";
        this.cedingName = "";
        this.passData.tableData = [];
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
       this.saveProcess();
    }

    prepareData(){
        this.saveData.changeQuoteStatus =[];
        for(let data of this.passData.tableData){
            if(data.checked){
                this.saveData.changeQuoteStatus.push({
                    quoteId: data.quoteId
                })
            }
        }
    }

    query() {
        $('#search > #modalBtn').trigger('click');
    }

    onRowClick(data) {
        console.log(data)
    }

    openReasonLOV(){
        $('#reasonLOV #modalBtn').trigger('click');
    }

    setReason(data){
        this.selectedData.reasonCd = data.reasonCd;
        this.selectedData.description = data.description;
    }

    onTabChange($event: NgbTabChangeEvent) {
          if ($event.nextId === 'Exit') {
            this.router.navigateByUrl('');
          } 
 
    }

    showRiskLOV(){
        $('#riskLOV #modalBtn').trigger('click');
    }

    showCedingLOV(){
        $('#cedingCompanyLOV #modalBtn').trigger('click');
    }

    showTypeOfCessionLOV(){
        $('#typeOfCessionLOV #modalBtn').trigger('click');
    }

    setRisks(data){
        this.riskCd = data.riskId;
        this.riskName = data.riskName;
        this.ns.lovLoader(data.ev, 0);

        if(data.hasOwnProperty('fromLOV')){
            $('#search > #modalBtn').trigger('click');    
        }

    }

    setCedingcompany(data){
        this.cedingCode = data.cedingId;
        this.cedingName = data.cedingName;

        $('#search > #modalBtn').trigger('click'); 
    }

    setTypeOfCession(data){
        this.typeOfCessionId = data.cessionId;
        this.typeOfCession = data.description;
        this.ns.lovLoader(data.ev, 0);

        if(data.hasOwnProperty('fromLOV')){
            $('#search > #modalBtn').trigger('click');    
        }
    }

    checkCode(ev, field){
        this.ns.lovLoader(ev, 1);

        /*if(field === 'line') {            
            this.lineLov.checkCode(this.line, ev);
        } else*/ if(field === 'typeOfCession'){
            this.typeOfCessionLov.checkCode(this.typeOfCessionId, ev);
        } else if(field === 'risk') {
            this.riskLov.checkCode(this.riskCd, ev);
        }              
    }

}