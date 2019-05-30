import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { QuotationService, NotesService, MaintenanceService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';


@Component({
    selector: 'app-change-quote-status',
    templateUrl: './change-quote-status.component.html',
    styleUrls: ['./change-quote-status.component.css']
})
export class ChangeQuoteStatusComponent implements OnInit {
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    //NECO 05/22/2019
    @ViewChild(CustNonDatatableComponent) tableNonEditable: CustNonDatatableComponent;
    @ViewChild('quoteListMdl') modal: ModalComponent;
    @ViewChild('riskMdl') riskModal: any;
    @ViewChild('cedCoMdl') cedCoModal: any;
    @ViewChild('cessionMdl') cessionModal: any;
    //END NECO 05/22/2019
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
    @ViewChildren(MtnRiskComponent) riskLovs: QueryList<MtnTypeOfCessionComponent>;
    @ViewChildren(CedingCompanyComponent) cedingCoLovs: QueryList<CedingCompanyComponent>;

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
    cedingId: any = "";
    cedingName: any = "";
    first = false;

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

    quoteListingLOV: any = {
      tHeader: ['Quotation No.','Type of Cession','Ceding Company','Insured','Risk'],
      tableData:[],
      dataTypes: ['text','text','text','text','text'],
      pageLength: 10,
      pagination: true,
      pageStatus: true,
      keys: ['quotationNo','cessionDesc','cedingName','insuredDesc','riskName']
    };

    searchParams: any = {
        riskName:null,
        riskCd: null,
        cedingName: null,
        cedingId: null,
        typeOfCession: null,
        typeOfCessionId: null
    }

    //NECO 05/22/2019
    tempQuoteNo: string[] = ['','','','',''];

    //END NECO 05/22/2019
    
    constructor(private qs: QuotationService, private modalService: NgbModal, private titleService: Title, config: NgbDropdownConfig, private ns: NotesService, private maintenanceService: MaintenanceService) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Quo | Change Quote Status");
        setTimeout(() => {$('#searchQuote > #modalBtn').trigger('click') }, 0);        
        this.first = true;
        
        //this.getChangeQuote();
        
    }

    //NECO 05/22/2019
    showQuoteListLOV(){
        this.retrieveQuoteListing();
        this.modal.openNoClose();
    }

    retrieveQuoteListing(){
        this.quoteListingLOV.tableData = [];
        this.tableNonEditable.loadingFlag = true;
        this.qs.getQuoProcessingData([{key: 'quotationNo', search: this.tempQuoteNo.join('%-%')}]).subscribe((data: any)=>{
            this.quoteListingLOV.tableData = data.quotationList;
            this.tableNonEditable.refreshTable();
            this.tableNonEditable.loadingFlag = false;
        });
    }

    quoteListRowClick(data){
        console.log(data);
    }
    //END NECO 05/22/2019

    getChangeQuote(){
        this.qs.getQuoProcessingData(this.searchParams).subscribe((data:any) => {
            this.passData.tableData = [];
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
        this.qs.saveChangeQuoteStatus(this.saveData).subscribe(data => {
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
       console.log(this.saveData.reasonCd)
       this.savetest();
    }

    prepareData(){
        this.saveData.changeQuoteStatus = [];
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
        $('#searchQuote > #modalBtn').trigger('click');
    }

    onRowClick(data) {
        if(data != null){
            this.selectedData = data;
        }else{
            this.selectedData ={
            quotationNo: null,
            cedingName: null,
            insuredDesc: null,
            riskName: null,
            processor: null,
            reasonCd: null,
            description: null,
            remarks: null
            }
        }
    }

    openReasonLOV(){
        $('#reasonLOV #modalBtn').trigger('click');
    }

    setReason(data){
        this.selectedData.reasonCd = data.reasonCd;
        this.selectedData.description = data.description;
    }

    showRiskLOV() {
        //$('#riskLOV #modalBtn').trigger('click');
        this.riskModal.modal.openNoClose();
    }

    showCedingCompanyLOV() {
        //$('#cedingCompanyLOV #modalBtn').trigger('click');
        this.cedCoModal.modal.openNoClose();
    }

    showTypeOfCessionLOV(){
        //$('#typeOfCessionLOV #modalBtn').trigger('click');
        this.cessionModal.modal.openNoClose();
    }

    checkCode(ev, field){
        this.ns.lovLoader(ev, 1);

        if(field === 'typeOfCession'){
            this.typeOfCessionLov.checkCode(this.typeOfCessionId, ev);
        } else if(field === 'risk') {
            this.riskLovs['first'].checkCode(this.riskCd, ev);
        } else if(field === 'cedingCo') {
            this.cedingCoLovs['first'].checkCode(this.cedingId, ev);
        } 
    }

     setRisks(data){
        this.riskCd = data.riskId;
        this.riskName = data.riskName;
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#riskCd');   
        }
    }

    setTypeOfCession(data) {     
        console.log(data)   
        this.typeOfCessionId = data.cessionId;
        this.typeOfCession = data.description;
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#typeOfCessionId');    
        } 
    }

    setCedingcompany(data){
        this.cedingId = data.cedingId;
        this.cedingName = data.cedingName;
        this.ns.lovLoader(data.ev, 0);

        if(data.hasOwnProperty('fromLOV')){
              this.onClickAdd('#cedingId');
        }        
    }

    onClickAdd(event) {
        if(this.first){
            this.maintenanceService.getMtnTypeOfCession(1).subscribe(data => {            
                this.typeOfCessionId = data['cession'][0].cessionId;
                this.typeOfCession = data['cession'][0].cessionAbbr;
                this.first = false;
            });
        }
        

        $('#searchQuote > #modalBtn').trigger('click');
        setTimeout(function() { $(event).focus(); }, 0);        
    }

    emptyVar(){
        this.riskCd = "";
        this.riskName = "";
        this.typeOfCessionId = "";
        this.typeOfCession = "";
        this.cedingId = "";
        this.cedingName = "";
    }

}