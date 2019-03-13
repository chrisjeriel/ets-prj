import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService, UnderwritingService, NotesService } from '@app/_services';
import { QuotationProcessing, Risks, CedingCompanyList } from '../../_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';


@Component({
    selector: 'app-quotation-processing',
    templateUrl: './quotation-processing.component.html',
    styleUrls: ['./quotation-processing.component.css'],
    providers: [NgbModal, NgbActiveModal]
})
export class QuotationProcessingComponent implements OnInit {
    @ViewChildren(CustNonDatatableComponent) table: QueryList<CustNonDatatableComponent>;
    @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
    @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
    @ViewChild(MtnRiskComponent) riskLov: MtnTypeOfCessionComponent;

    tableData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    rowData: any[] = [];
    disabledEditBtn: boolean = true;
    disabledCopyBtn: boolean = true;
    /*  addQuoteFlag: boolean = true;
    copyQuotationFlag: boolean = true;*/

    line: string = "";
    description: string = "";
    splittedLine: string[] = [];
    typeOfCessionId = "";
    typeOfCession = "";
    riskCd: string = "";
    riskName: string = "";
    riskNameList: string[] = [];
    //existingQuoteNoIndex: number = 0;
    existingQuotationNo: string[] = [];

    selectedQuotation: any = null;

    fetchedData: any;
    quotationNo = "";
    lineDataInfo: any [];

    riskCodeFill: string = "";
    riskFill: string = "";
    mdlConfig = {
        mdlBtnAlign: 'center',
    }

    riskList: Risks = new Risks(null, null, null, null, null, null, null);
    cedingCode: any;
    cedingName: any;

    searchParams: any[] = [];

    passData: any = {
        tableData: [],
        tHeader: ['Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Insured', 'Risk', 'Object', 'Site', 'Policy No', 'Currency', 'Quote Date', 'Valid Until', 'Requested By', 'Created By'],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'date', 'date', 'text',],
        resizable: [false, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true],
        filters: [
        {
            key: 'quotationNo',
            title: 'Quotation No.',
            dataType: 'seq'
        },
        {
            key: 'cessionDesc',
            title: 'Type of Cession',
            dataType: 'text'
        },
        {
            key: 'lineClassCdDesc',
            title: 'Line Class',
            dataType: 'text'
        },
        {
            key: 'status',
            title: 'Status',
            dataType: 'text'
        },
        {
            key: 'cedingName',
            title: 'Ceding Co.',
            dataType: 'text'
        },
        {
            key: 'principalName',
            title: 'Principal',
            dataType: 'text'
        },
        {
            key: 'contractorName',
            title: 'Contractor',
            dataType: 'text'
        },
        {
            key: 'insuredDesc',
            title: 'Insured',
            dataType: 'text'
        },
        {
            key: 'riskName',
            title: 'Risk',
            dataType: 'text'
        },
        {
            key: 'objectDesc',
            title: 'Object',
            dataType: 'text'
        },
        {
            key: 'site',
            title: 'Site',
            dataType: 'text'
        },
        {
            key: 'policyNo',
            title: 'Policy No.',
            dataType: 'seq'
        },
        {
            key: 'currencyCd',
            title: 'Currency',
            dataType: 'text'
        },
        {
            key: 'issueDate',
            title: 'Quote Date',
            dataType: 'date'
        },
        {
            key: 'expiryDate',
            title: 'Valid Until',
            dataType: 'date'
        },
        {
            key: 'reqBy',
            title: 'Requested By',
            dataType: 'text'
        },
        {
            key: 'createUser',
            title: 'Created By',
            dataType: 'text'
        },
        ],
        pageLength: 10,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, addFlag: true, editFlag: true, copyFlag: true, pageStatus: true, pagination: true, pageID: 1,
        keys: ['quotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','policyNo','currencyCd','issueDate','expiryDate','reqBy','createUser'],
    }

    riskData: any = {
        tableData: [],
        tHeader: ['Risk Code', 'Risk', 'Region', 'Province', 'Town/City', 'District', 'Block'],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text'],
        resizable: [false, true, false, true, true, false, false],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 2
    }

     lineData: any = {
        tableData: [],
        tHeader: ['Line', 'Description','Remarks'],
        dataTypes: ['text', 'text', 'text'],
        resizable: [true, true, true],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 2,
        keys:["lineCd","description","remarks"]
    }

    loading: boolean = false;
    copyStatus = 0;

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router
        , public activeModal: NgbActiveModal, private titleService: Title, private ns: NotesService
        ) { }

    
    ngOnInit() {
        this.titleService.setTitle("Quo | List Of Quotations");
        this.rowData = this.quotationService.getRowData();
        this.riskData.tableData = this.quotationService.getRisksLOV();

        this.retrieveQuoteListingMethod();

    }

    retrieveQuoteListingMethod(){
        this.quotationService.getQuoProcessingData(this.searchParams).subscribe(data => {
            var records = data['quotationList'];
            this.fetchedData = records;
            for(let rec of records){
                //neco was here
                this.splittedLine.push(rec.quotationNo.split("-", 1));
                this.riskNameList.push((rec.project == null) ? '' : rec.project.riskName);
                //neco ends here
                this.passData.tableData.push(new QuotationProcessing(
                                                rec.quotationNo,
                                                rec.cessionDesc,
                                                rec.lineClassCdDesc,
                                                rec.status,
                                                rec.cedingName,
                                                rec.principalName,
                                                rec.contractorName,
                                                rec.insuredDesc,
                                                (rec.project == null) ? '' : rec.project.riskName,
                                                (rec.project == null) ? '' : rec.project.objectDesc,
                                                (rec.project == null) ? '' : rec.project.site,
                                                rec.policyNo,
                                                rec.currencyCd,
                                                this.dateParser(rec.issueDate),
                                                this.dateParser(rec.expiryDate),
                                                rec.reqBy,
                                                rec.createUser
                                            ));
            }


               this.table.forEach(table => { table.refreshTable() });
        });
    }

    onClickAdd(event) {        
        $('#addModal > #modalBtn').trigger('click');
        setTimeout(function() { $(event).focus(); }, 0);        
    }
    
    onClickEdit(event) {
        this.line = this.selectedQuotation.quotationNo.split('-')[0];
        this.quotationNo = this.selectedQuotation.quotationNo;
        this.typeOfCession = this.selectedQuotation.cessionDesc;        

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);

        this.quotationService.savingType = 'normal';

        setTimeout(() => {
            this.router.navigate(['/quotation', { line: this.line, typeOfCession: this.typeOfCession,  quotationNo : this.quotationNo, from: 'quo-processing', savingType: 'normal' }], { skipLocationChange: true });
        },100);
    }

    onClickCopy(event) {
        $('#copyModal > #modalBtn').trigger('click');
    }

    showRiskLOV() {
        $('#riskLOV #modalBtn').trigger('click');
    }

    showCedingCompanyLOV() {
        $('#cedingCompanyLOV #modalBtn').trigger('click');
    }

    showLineLOV(){
        $('#lineLOV #modalBtn').trigger('click');
    }

    //Method for DB query
    searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.retrieveQuoteListingMethod();
    }

    setLine(data){
        this.line = data.lineCd;
        this.description = data.description;
        this.ns.lovLoader(data.ev, 0);

        if(data.hasOwnProperty('fromLOV')){
            $('#addModal > #modalBtn').trigger('click');    
        }
    }

    getRisk(event) {
        if (!Number.isNaN(event.path[2].rowIndex - 1)) {
            this.riskList = this.riskData.tableData[event.path[2].rowIndex - 1];
        }
    }

    nextBtnEvent() {
        //neco was here
        this.existingQuotationNo = [];
        for(var i = 0; i < this.splittedLine.length; i++){
            if(this.line == this.splittedLine[i][0] && this.riskName == this.riskNameList[i] && this.riskNameList[i] != ""){
                //this.existingQuoteNoIndex = i;
                this.existingQuotationNo.push(this.passData.tableData[i].quotationNo);
                //break;
            }
        }

        if(this.existingQuotationNo.length > 0){
            $('#modIntModal > #modalBtn').trigger('click');

        }else{
            var qLine = this.line.toUpperCase();

            if (qLine === 'CAR' ||
                qLine === 'EAR' ||
                qLine === 'EEI' ||
                qLine === 'CEC' ||
                qLine === 'MBI' ||
                qLine === 'BPV' ||
                qLine === 'MLP' ||
                qLine === 'DOS') {
                this.modalService.dismissAll();

            this.quotationService.rowData = [];
            this.quotationService.toGenInfo = [];
            this.quotationService.toGenInfo.push("add", qLine);
            /*this.router.navigate(['/quotation']);*/

            var addParams = {
                cessionId: this.typeOfCessionId,
                cessionDesc: this.typeOfCession,
                riskId: this.riskCd,
                intComp: false,
            }

            this.quotationService.savingType = 'normal';

            setTimeout(() => {
                this.router.navigate(['/quotation', { line: qLine, addParams: JSON.stringify(addParams), from: 'quo-processing' }], { skipLocationChange: true });
            },100); 
        }
        //neco's influence ends here

        /*var qLine = this.line.toUpperCase();

        if (qLine === 'CAR' ||
            qLine === 'EAR' ||
            qLine === 'EEI' ||
            qLine === 'CEC' ||
            qLine === 'MBI' ||
            qLine === 'BPV' ||
            qLine === 'MLP' ||
            qLine === 'DOS') {
            this.modalService.dismissAll();

        this.quotationService.rowData = [];
        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("add", qLine);*/
        /*this.router.navigate(['/quotation']);*/
        /*setTimeout(() => {
            this.router.navigate(['/quotation', { line: qLine, typeOfCession: this.quoTypeOfCession, from: 'quo-processing' }], { skipLocationChange: true });
        },100); */
    }
}

onRowClick(event) {
    this.selectedQuotation = event;
    this.disabledEditBtn = false;
    this.disabledCopyBtn = false;
}

onRowDblClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
        this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }

    this.line = this.quotationService.rowData[0].split("-")[0];
    this.quotationNo = this.quotationService.rowData[0];
    this.typeOfCession = event.target.closest('tr').children[1].innerText;

    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", this.line);
    
    this.quotationService.savingType = 'normal';

    setTimeout(() => {
        this.router.navigate(['/quotation', { line: this.line, typeOfCession: this.typeOfCession,  quotationNo : this.quotationNo, from: 'quo-processing' }], { skipLocationChange: true });
    },100); 

}
showApprovalModal(content) {
    this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
}

closeModalPls(content) {
    this.activeModal = content;
    this.activeModal.dismiss;
}

dateParser(arr){
    return new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);   
}


setCedingcompany(data){
        this.cedingCode = data.coNo;
        this.cedingName = data.name;
        this.onClickCopy(1);
}


//neco was here
    toInternalCompetition(){
            var qLine = this.line.toUpperCase();

            if (qLine === 'CAR' ||
                qLine === 'EAR' ||
                qLine === 'EEI' ||
                qLine === 'CEC' ||
                qLine === 'MBI' ||
                qLine === 'BPV' ||
                qLine === 'MLP' ||
                qLine === 'DOS') {
                this.modalService.dismissAll();

            this.quotationService.rowData = [];
            this.quotationService.toGenInfo = [];
            this.quotationService.toGenInfo.push("edit", qLine);

            var addParams = {
                cessionId: this.typeOfCessionId,
                cessionDesc: this.typeOfCession,
                riskId: this.riskCd,
                // intComp: true,
            }

            setTimeout(() => {
                this.router.navigate(['/quotation', { line: qLine, addParams: JSON.stringify(addParams), quotationNo: this.existingQuotationNo, from: 'quo-processing' }], { skipLocationChange: true });
            },100); 
        }
    }
//neco ends here

    setRisks(data){
        this.riskCd = data.riskId;
        this.riskName = data.riskName;
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#riskCd');   
        }
    }

    showTypeOfCessionLOV(){
        $('#typeOfCessionLOV #modalBtn').trigger('click');
    }

    setTypeOfCession(data) {        
        this.typeOfCessionId = data.cessionId;
        this.typeOfCession = data.description;
        this.ns.lovLoader(data.ev, 0);
        
        if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#typeOfCessionId');    
        } 
    }

    toGeneralInfo(savingType){
        var qLine = this.line.toUpperCase();

        if (qLine === 'CAR' ||
            qLine === 'EAR' ||
            qLine === 'EEI' ||
            qLine === 'CEC' ||
            qLine === 'MBI' ||
            qLine === 'BPV' ||
            qLine === 'MLP' ||
            qLine === 'DOS') {
            this.modalService.dismissAll();

            this.quotationService.rowData = [];
            this.quotationService.toGenInfo = [];
            this.quotationService.toGenInfo.push("edit", qLine);

            var addParams = {
                cessionId: this.typeOfCessionId,
                cessionDesc: this.typeOfCession,
                riskId: this.riskCd,
                //intComp: savingType === 'internalComp',
            }

            this.quotationService.savingType = savingType;

            setTimeout(() => {
                this.router.navigate(['/quotation', { line: qLine, addParams: JSON.stringify(addParams), quotationNo: this.existingQuotationNo, from: 'quo-processing' }], { skipLocationChange: true });
            },100);
        }
    }

    checkCode(ev, field){
        this.ns.lovLoader(ev, 1);

        if(field === 'line') {            
            this.lineLov.checkCode(this.line, ev);
        } else if(field === 'typeOfCession'){
            this.typeOfCessionLov.checkCode(this.typeOfCessionId, ev);
        } else if(field === 'risk') {
            this.riskLov.checkCode(this.riskCd, ev);
        }              
    }

    clearAddFields(){
        this.line = '';
        this.description = '';
        this.typeOfCessionId = '';
        this.typeOfCession = '';
        this.riskCd = '';
        this.riskName = '';
    }
}
