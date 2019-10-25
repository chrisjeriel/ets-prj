import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { QuotationService, NotesService, MaintenanceService, UserService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { environment } from '@environments/environment';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { MtnReasonComponent } from '@app/maintenance/mtn-reason/mtn-reason.component';


@Component({
    selector: 'app-change-quote-status',
    templateUrl: './change-quote-status.component.html',
    styleUrls: ['./change-quote-status.component.css']
})
export class ChangeQuoteStatusComponent implements OnInit, AfterViewInit {
    @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    //NECO 05/22/2019
    @ViewChild(CustNonDatatableComponent) tableNonEditable: CustNonDatatableComponent;
    @ViewChild('quoteListMdl') modal: ModalComponent;
    @ViewChild('riskMdl') riskModal: any;
    @ViewChild('cedCoMdl') cedCoModal: any;
    @ViewChild('cessionMdl') cessionModal: any;
    @ViewChild(MtnRiskComponent) riskLovs: MtnRiskComponent;
    @ViewChild(CedingCompanyComponent) cedingCoLovs: CedingCompanyComponent;
    @ViewChild('successDiagSave') successDiag: SucessDialogComponent;
    @ViewChild('successDiagGeneric') genericDiag: SucessDialogComponent;
    @ViewChild(MtnReasonComponent) mtnReason : MtnReasonComponent;
    @ViewChild('myForm') form : any;
    //END NECO 05/22/2019
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
    //@ViewChildren(MtnRiskComponent) riskLovs: QueryList<MtnTypeOfCessionComponent>;
    //@ViewChildren(CedingCompanyComponent) cedingCoLovs: QueryList<CedingCompanyComponent>;

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
        quotationNo: '',
        status: '',
        statusCd: 2,
        cedingName: '',
        insuredDesc: '',
        riskName: '',
        processor: '',
        reasonCd: '',
        description: '',
        remarks: ''
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

    //NECO 05/22/2019
    quoteListingLOV: any = {
      tHeader: ['Quotation No.','Type of Cession','Ceding Company','Insured','Risk'],
      tableData:[],
      dataTypes: ['text','text','text','text','text'],
      pageLength: 10,
      pagination: true,
      pageStatus: true,
      keys: ['quotationNo','cessionDesc','cedingName','insuredDesc','riskName']
    };
    //END NECO 05/22/2019

    searchParams: any = {
        riskName:'',
        riskId: '',
        cedingName: '',
        cedingId: '',
        cessionDesc: '',
        cessionId: ''
    }

    //NECO 05/22/2019
    tempQuoteNo: string[] = ['','','','',''];
    selectedQuote: any;
    emptySelect: boolean = false;
    processBtnDisabled: boolean = true;
    isIncomplete: boolean = true;
    isType: boolean = false;
    noDataFound: boolean = false;
    statusCd: number = 2;
    //END NECO 05/22/2019
    
    constructor(private qs: QuotationService, private modalService: NgbModal, private titleService: Title, config: NgbDropdownConfig, private ns: NotesService, private maintenanceService: MaintenanceService, private userService: UserService) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.titleService.setTitle("Quo | Change Quote Status");
        this.userService.emitModuleId("QUOTE015");
        setTimeout(() => {$('#searchQuote > #modalBtn').trigger('click') }, 0);        
        this.first = true;
        
    }

    ngAfterViewInit(){
        setTimeout(()=>{
            this.processBtnDisabled = false;
        })
    }

    //NECO 05/22/2019
    showQuoteListLOV(){
        this.isType = false;
        this.retrieveQuoteListing();
        this.modal.openNoClose();
    }

    retrieveQuoteListing(){
        this.quoteListingLOV.tableData = [];
        this.tableNonEditable.loadingFlag = true;
        this.qs.getQuoProcessingData([{key: 'quotationNo', search: this.noDataFound ? '' : this.tempQuoteNo.join('%-%')}]).subscribe((data: any)=>{
            if(data.quotationList.length === 0){
                console.log(this.isType)
                if(this.isType && !this.isIncomplete){
                    setTimeout(()=>{
                        this.showQuoteListLOV();
                    },100);
                }else if(!this.noDataFound){
                    this.noDataFound = true;
                    this.retrieveQuoteListing();
                }else{
                    this.tableNonEditable.refreshTable();
                }
            }else{
                this.noDataFound = false;
                for(var i of data.quotationList){
                    this.quoteListingLOV.tableData.push({
                        quotationNo: i.quotationNo,
                        cessionId: i.cessionId,
                        cessionDesc: i.cessionDesc,
                        cedingId: i.cedingId,
                        cedingName: i.cedingName,
                        insuredDesc: i.insuredDesc,
                        riskId: i.project.riskId,
                        riskName: i.project.riskName
                    });
                }
                this.tableNonEditable.refreshTable();
                this.tableNonEditable.loadingFlag = false;
                if(this.isType){
                    this.selectedQuote = this.quoteListingLOV.tableData[0];
                    this.isType = false;
                    this.isIncomplete = false;
                    this.selectQuote();
                }
            }
        });
    }

    quoteListRowClick(data){
        if(data === null || (data !== null && Object.keys(data).length === 0)){
            this.emptySelect = true;
        }else{
            this.selectedQuote = data;
            this.emptySelect = false;
        }
    } 

    selectQuote(){
        this.tempQuoteNo = this.selectedQuote.quotationNo.split('-');
        this.searchParams.riskId = this.selectedQuote.riskId;
        this.searchParams.riskName = this.selectedQuote.riskName;
        this.searchParams.cedingId = this.selectedQuote.cedingId;
        this.searchParams.cedingName = this.selectedQuote.cedingName;
        this.searchParams.cessionId = this.selectedQuote.cessionId;
        this.searchParams.cessionDesc = this.selectedQuote.cessionDesc;
    }
    //END NECO 05/22/2019

    getChangeQuote(){
        //NECO 05/22/2019
        let emptyFlag: boolean = true;
        //check if quoteNo fields are empty
        for(var i of this.tempQuoteNo){
            if(String(i).trim().length !== 0){
                emptyFlag = false;
                break;
            }
        }
        //check if cession, ceding, and risk are empty
        if((String(this.searchParams.cedingId).trim().length !== 0  ||
           String(this.searchParams.cessionId).trim().length !== 0 ||
           String(this.searchParams.riskId).trim().length !== 0) && emptyFlag){
            emptyFlag = false;
        }
        //END NECO 05/22/2019
        if(emptyFlag){
            this.dialogIcon = 'info';
            this.dialogMessage = 'No values were entered';
            this.genericDiag.open();
        }else{
            this.modalService.dismissAll();
            this.passData.tableData = [];
            this.table.loadingFlag = true;
            this.qs.getQuoProcessingData([
                                            {key: 'quotationNo', search: this.tempQuoteNo.join('%-%')},
                                            {key: 'cessionDesc', search: this.searchParams.cessionDesc.toUpperCase()},
                                            {key: 'cedingName', search: this.searchParams.cedingName.toUpperCase()},
                                            {key: 'riskName', search: this.searchParams.riskName.toUpperCase()}
                                         ]).subscribe((data:any) => {
                this.passData.tableData = [];
                this.records = data.quotationList;
                for(let rec of this.records){
                    this.passData.tableData.push(
                        {
                            quoteId: rec.quoteId,
                            quotationNo: rec.quotationNo,
                            cessionDesc: rec.cessionDesc,
                            cedingName: rec.cedingName,
                            insuredDesc: rec.insuredDesc,
                            riskName: (rec.project == null) ? '' : rec.project.riskName,
                            status: rec.status,
                            preparedBy: rec.preparedBy
                        }
                    );
                }
                //NECO 05/23/2019
                if(this.statusCd == 2){
                    this.passData.tableData = this.passData.tableData.filter(a => {return a.status.toUpperCase() === 'DID NOT MATERIALIZE' || 
                                                            a.status.toUpperCase() === 'RISK NOT COMMENSURATE' || 
                                                            a.status.toUpperCase() === 'SPOILED' });
                }else{
                    this.passData.tableData = this.passData.tableData.filter(a => {return a.status.toUpperCase() === 'REQUESTED' || 
                                                                a.status.toUpperCase() === 'IN PROGRESS' || 
                                                                a.status.toUpperCase() === 'RELEASED' });
                }
                this.table.refreshTable();
                this.table.loadingFlag = false;
                //END NECO 05/23/2019
            });
        }
    }

    //NECO 06/03/2019
    clearMainTable(statusCd){
        if(((statusCd === 9 || statusCd === 10 || statusCd === 99) && this.statusCd === 2) ||
            (statusCd === 2 && (this.statusCd === 9 || this.statusCd === 10 || this.statusCd === 99))){
            this.passData.tableData = [];
            this.table.selected = [];
            this.table.refreshTable();
        }
        this.statusCd = statusCd;
    }
    //END

    savetest(){
        this.qs.saveChangeQuoteStatus(this.saveData).subscribe(data => {
            if(data['returnCode'] == 0) {
                this.dialogMessage = data['errorList'][0].errorMessage;
                this.dialogIcon = "error";
                //$('#successModalBtn').trigger('click');
                this.successDiag.open();
            } else{
                this.dialogMessage="";
                this.dialogIcon = "";
                //$('#successModalBtn').trigger('click');
                this.successDiag.open();
                this.form.control.markAsPristine();
                this.table.selected = [];
                //$('.ng-dirty').removeClass('ng-dirty');
                //this.emptyVariables();
                //this.getChangeQuote();
            }
       });
    }

    postSave(){
        this.emptyVariables();
        this.getChangeQuote();
    }

    emptyVariables(){
        this.saveData.reasonCd = ""
        this.selectedData ={
            quotationNo: '',
            status: '',
            statusCd: 0,
            cedingName: '',
            insuredDesc: '',
            riskName: '',
            processor: '',
            reasonCd: '',
            description: '',
            remarks: ''
        }
        this.passData.tableData = [];
    }

    onClickProcess(){
        if(this.statusCd == 9 && ((String(this.selectedData.reasonCd).trim().length === 0 && this.selectedData.description.length === 0)
                                                || (this.selectedData.reasonCd === undefined && this.selectedData.description === undefined))){
            this.dialogIcon = 'info';
            this.dialogMessage = 'Please fill all required fields';
            this.genericDiag.open();
        }else{
            $('#confirm-save #modalBtn2').trigger('click');
        }
    }

    process(cancelFlag?) {
       this.prepareData();
       this.saveData.statusCd = this.statusCd;
       this.cancelFlag = cancelFlag !== undefined;
           
       if(this.statusCd == 9){
           this.saveData.reasonCd = this.selectedData.reasonCd;
       }else{
           this.saveData.reasonCd = this.saveData.reasonCd == null ? "":this.selectedData.reasonCd;
       }
       this.savetest();
    }

    prepareData(){
        this.saveData.changeQuoteStatus = [];
        for(let data of this.passData.tableData){
            if(data.checked){
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
            if(data.checked){
                this.table.markAsDirty();
            }
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
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#reason');   
        }
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
            this.typeOfCessionLov.checkCode(this.searchParams.cessionId, ev);
        } else if(field === 'risk') {
            this.riskLovs.checkCode(this.searchParams.riskId, '#riskLOV', ev);
        } else if(field === 'cedingCo') {
            this.cedingCoLovs.checkCode(this.searchParams.cedingId === '' ? '' : String(this.searchParams.cedingId).padStart(3, '0'), ev, '#cedingCompanyLOV');
        } else if(field === 'reason'){
            this.mtnReason.checkCode(this.selectedData.reasonCd, ev);
        }
    }

     setRisks(data){
        this.searchParams.riskId = data.riskId;
        this.searchParams.riskName = data.riskName;
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#riskCd');   
        }
    }

    setTypeOfCession(data) {    
        this.searchParams.cessionId = data.cessionId;
        this.searchParams.cessionDesc = data.description;
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#typeOfCessionId');    
        } 
    }

    setCedingcompany(data){
        this.searchParams.cedingId = data.cedingId;
        this.searchParams.cedingName = data.cedingName;
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
        /*this.riskCd = "";
        this.riskName = "";
        this.typeOfCessionId = "";
        this.typeOfCession = "";
        this.cedingId = "";
        this.cedingName = "";*/

        //NECO 05/22/2019
        this.searchParams = {
            riskName:'',
            riskId: '',
            cedingName: '',
            cedingId: '',
            cessionDesc: '',
            cessionId: ''
        }
        
        //END NECO 05/22/2019
    }

    //NECO 05/23/2019
    emptyQuoteNo(){
        this.tempQuoteNo = ['','','','',''];
    }

    checkQuoteNoSearch(event, type){
        this.isType = true;
        if(event.target.value.length === 0){
            this.isIncomplete = true;
            this.emptyVar();
        }else{
            if(type === 'seqNo'){
                this.tempQuoteNo[2] = String(this.tempQuoteNo[2]).padStart(5, '0');
            }else if(type === 'revNo'){
                this.tempQuoteNo[3] = String(this.tempQuoteNo[3]).padStart(2, '0');
            }else if(type ==='cedingId'){
                this.tempQuoteNo[4] = String(this.tempQuoteNo[4]).padStart(3, '0');
            }
            for(var i of this.tempQuoteNo){
                if(i.length === 0){
                    this.isIncomplete = true;
                    break;
                }else{
                    this.isIncomplete = false;
                }
            }
        }

        if(!this.isIncomplete){
            this.retrieveQuoteListing();
        }
    }

    //END NECO 05/23/2019


}