import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService, UnderwritingService, NotesService, MaintenanceService } from '@app/_services';
import { QuotationProcessing, Risks, CedingCompanyList } from '../../_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';

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
    @ViewChild('riskLOV') riskLOV: MtnRiskComponent;
    @ViewChild('copyRiskLOV') copyRiskLOV: MtnRiskComponent;
    @ViewChildren(CedingCompanyComponent) cedingCoLovs: QueryList<CedingCompanyComponent>;

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
        pageLength: 20,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, addFlag: true, editFlag: true, copyFlag: false, pageStatus: true, pagination: true, pageID: 1,
        keys: ['quotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','policyNo','currencyCd','issueDate','expiryDate','reqBy','createUser'],
        genericBtn1: 'Copy Quote Details',
        genericBtn2: 'Internal Competition'
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
    copyFromQuotationNo: any = "";
    copyToQuotationNo: any = "";
    copyQuoteId: any = "";
    copyQuoteLineCd: any = "";
    copyQuoteYear: any = "";
    copyCedingId: any = "";
    copyCedingName: any = "";
    copyRiskId: any = "";
    copyRiskName: any = "";
    copyIntCompRiskId: any = "";
    copyIntCompRiskName: any = "";

    dialogMessage = "";
    dialogIcon = "";

    tempCedingId = "";
    tempQuoteId = "";

    exclude: any[] = [];
    testArr: any[] = [];


    first = false;

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router
        , public activeModal: NgbActiveModal, private titleService: Title, private ns: NotesService, private maintenanceService: MaintenanceService
        ) { }

    
    ngOnInit() {
        this.first = true;
        this.titleService.setTitle("Quo | List Of Quotations");
        this.rowData = this.quotationService.getRowData();
        this.riskData.tableData = this.quotationService.getRisksLOV();

        this.retrieveQuoteListingMethod();

    }

    retrieveQuoteListingMethod(){
        this.passData.tableData = [];
        console.log(this.searchParams)
        this.quotationService.getQuoProcessingData(this.searchParams).subscribe(data => {
            console.log(data)
            var records = data['quotationList'];
            this.fetchedData = records;
            for(let rec of records){
                if(rec.status.toUpperCase() === 'IN PROGRESS' || rec.status.toUpperCase() === 'REQUESTED' || rec.status.toUpperCase() === 'RELEASED') {
                    //neco was here
                    this.testArr.push(rec);
                    this.splittedLine.push(rec.quotationNo.split("-", 1));
                    this.riskNameList.push((rec.project == null) ? '' : rec.project.riskName);
                    //neco ends here
                }
                
                if(rec.status.toUpperCase() === 'IN PROGRESS' || rec.status.toUpperCase() === 'REQUESTED') {
                    
                    this.passData.tableData.push(
                                                    {
                                                        quotationNo: rec.quotationNo,
                                                        cessionDesc: rec.cessionDesc,
                                                        lineClassCdDesc: rec.lineClassCdDesc,
                                                        status: rec.status,
                                                        cedingName: rec.cedingName,
                                                        principalName: rec.principalName,
                                                        contractorName: rec.contractorName,
                                                        insuredDesc: rec.insuredDesc,
                                                        riskName: (rec.project == null) ? '' : rec.project.riskName,
                                                        objectDesc: (rec.project == null) ? '' : rec.project.objectDesc,
                                                        site: (rec.project == null) ? '' : rec.project.site,
                                                        policyNo: rec.policyNo,
                                                        currencyCd: rec.currencyCd,
                                                        issueDate: this.ns.toDateTimeString(rec.issueDate),
                                                        expiryDate: this.ns.toDateTimeString(rec.issueDate),
                                                        reqBy: rec.reqBy,
                                                        createUser: rec.createUser
                                                    }
                                                );    
                }           
            }


               this.table.forEach(table => { table.refreshTable() });
        });
    }

    onClickAdd(event) {
        if(this.first){
            this.maintenanceService.getMtnTypeOfCession(1).subscribe(data => {            
                this.typeOfCessionId = data['cession'][0].cessionId;
                this.typeOfCession = data['cession'][0].cessionAbbr;

                this.first = false;
            });
        }
        

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
        this.exclude = [];

        for(var i = 0; i < this.splittedLine.length; i++){
            if(this.line == this.splittedLine[i][0] && this.riskName == this.riskNameList[i] && this.riskNameList[i] != ""){
                //this.existingQuoteNoIndex = i;
                // this.existingQuotationNo.push(this.passData.tableData[i].quotationNo);
                this.existingQuotationNo.push(this.testArr[i].quotationNo);
                //break;

                // this.exclude.push(this.passData.tableData[i].quotationNo.split('-')[4]);
                this.exclude.push(this.testArr[i].quotationNo.split('-')[4]);
            }
        }

        for(let i of this.fetchedData) {
            if(i.quotationNo == this.existingQuotationNo[0]) {
                this.tempQuoteId = i.quoteId;
            }
        }

        if(this.existingQuotationNo.length > 0 && Number(this.riskCd) > 0){
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
    if(event != null){
        for(let i of this.fetchedData) {

           if(i.quotationNo == event.quotationNo) {               
               this.tempCedingId = i.quotationNo.split('-')[4];

               this.copyQuoteId = i.quoteId;
               this.copyFromQuotationNo = i.quotationNo;
               this.copyQuoteLineCd = i.quotationNo.split('-')[0];
               this.copyQuoteYear = i.quotationNo.split('-')[1];

               this.copyIntCompRiskId = i.project.riskId;
               this.copyIntCompRiskName = i.project.riskName;
           }
        }    
    }

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
        this.copyCedingId = data.cedingId;
        this.copyCedingName = data.cedingName;
        this.ns.lovLoader(data.ev, 0);

        if(data.hasOwnProperty('fromLOV')){
             this.onClickCopy(1);
        }        
}

setCedingIntCompCompany(data) {

        this.copyCedingId = data.cedingId;
        this.copyCedingName = data.cedingName;
        this.ns.lovLoader(data.ev, 0);

        if(data.hasOwnProperty('fromLOV')){
             this.onClickIntCompCopy(1);
        }  
}

showCedingCompanyIntCompLOV() {
        $('#cedingCompanyIntCompLOV #modalBtn').trigger('click');
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
                this.router.navigate(['/quotation', { line: qLine, addParams: JSON.stringify(addParams), quotationNo: this.existingQuotationNo[0], from: 'quo-processing', exclude: this.exclude, tempQuoteIdInternalComp: this.tempQuoteId }], { skipLocationChange: true });
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
            this.riskLOV.checkCode(this.riskCd, '#riskLOV', ev);
        } else if(field === 'copyRisk') {
            this.copyRiskLOV.checkCode(this.copyRiskId, '#copyRiskLOV', ev);
        } else if(field === 'cedingCo') {
            this.cedingCoLovs['first'].checkCode(this.copyCedingId, ev);
        } else if(field === 'cedingCoIntComp') {
            this.cedingCoLovs['last'].checkCode(this.copyCedingId, ev);
        } 
    }

    clearAddFields(){
        this.line = '';
        this.description = '';
        this.typeOfCessionId = '';
        this.typeOfCession = '';
        this.riskCd = '';
        this.riskName = '';

        this.first = true;
    }

    copyOkBtn() {        
        this.loading = true;
        var currentDate = this.ns.toDateTimeString(0);

        //change copyStatus to 1 if successful
        var params = {
            "cedingId": this.copyCedingId,
            "copyingType": 'normal',
            "createDate": currentDate,
            "createUser": 'USER', //JSON.parse(window.localStorage.currentUser).username,
            "lineCd": this.copyQuoteLineCd,
            "quoteId": this.copyQuoteId,
            "quoteYear": new Date().getFullYear().toString(),
            "riskId": this.copyRiskId,
            "updateDate": currentDate,
            "updateUser": 'USER', //JSON.parse(window.localStorage.currentUser).username,
        }

        this.quotationService.saveQuotationCopy(JSON.stringify(params)).subscribe(data => {
            this.loading = false;
            
            if(data['returnCode'] == -1) {
                this.retrieveQuoteListingMethod();
                this.copyToQuotationNo = data['quotationNo'];

                this.copyStatus = 1;
                this.copyQuoteId = "";
                this.copyQuoteLineCd = "";
                this.copyQuoteYear = "";
                this.copyCedingId = "";
                this.copyCedingName = "";
                this.copyRiskId = "";
                this.copyRiskName = "";                
            } else if (data['returnCode'] == 0) {
                this.dialogMessage = data['errorList'][0].errorMessage;
                this.dialogIcon = "error";

                $('#quoProcessing #successModalBtn').trigger('click');
            }
        });
    }

    showCopyRiskLOV() {
        $('#copyRiskLOV #modalBtn').trigger('click');
    }

    setCopyRisks(data){
        this.copyRiskId = data.riskId;
        this.copyRiskName = data.riskName;
        this.ns.lovLoader(data.ev, 0);

        if(data.hasOwnProperty('fromLOV')){           
            this.onClickCopy(1);
        }
    }

    onClickIntCompCopy(event) {
        this.exclude = [];     
        // this.exclude.push(this.tempCedingId);
        
        for(var i = 0; i < this.splittedLine.length; i++){
            if(this.copyQuoteLineCd == this.splittedLine[i][0] && this.copyIntCompRiskName == this.riskNameList[i] && this.riskNameList[i] != ""){               

                this.exclude.push(this.passData.tableData[i].quotationNo.split('-')[4]);
            }
        }

        $('#copyIntCompModal > #modalBtn').trigger('click');
    }

    clearCopyFields() {
        this.copyCedingId = '';
        this.copyCedingName = '';
        this.copyRiskId = '';
        this.copyRiskName = '';
    }

    copyIntCompOkBtn() {
        this.loading = true;
        var currentDate = this.ns.toDateTimeString(0);

        //change copyStatus to 1 if successful
        var params = {
            "cedingId": this.copyCedingId,
            "copyingType": 'internalComp',
            "createDate": currentDate,
            "createUser": JSON.parse(window.localStorage.currentUser).username,
            "lineCd": this.copyQuoteLineCd,
            "quoteId": this.copyQuoteId,
            "quoteYear": new Date().getFullYear().toString(),
            "riskId": this.copyIntCompRiskId,
            "updateDate": currentDate,
            "updateUser": JSON.parse(window.localStorage.currentUser).username,
        }

        this.quotationService.saveQuotationCopy(JSON.stringify(params)).subscribe(data => {
            console.log(data);
            this.loading = false;            

            if(data['returnCode'] == -1) {
                this.retrieveQuoteListingMethod();
                this.copyToQuotationNo = data['quotationNo'];

                //insert sa quote_competition
                var internalCompParams: any[] = [{
                    adviceNo: 0,
                    cedingId: this.copyCedingId,
                    cedingRepId: 0,
                    createDate: currentDate,
                    createUser: JSON.parse(window.localStorage.currentUser).username,
                    quoteId: data['quoteId'],
                    updateDate: currentDate,
                    updateUser: JSON.parse(window.localStorage.currentUser).username,
                }];

                console.log(JSON.stringify(internalCompParams));

                this.quotationService.saveQuoteCompetition(internalCompParams).subscribe((result: any) => {
                    console.log(result);
                });
                //end insert

                this.copyStatus = 1;
                this.copyQuoteId = "";
                this.copyQuoteLineCd = "";
                this.copyQuoteYear = "";
                this.copyCedingId = "";
                this.copyCedingName = "";
                this.copyRiskId = "";
                this.copyRiskName = "";
                this.copyIntCompRiskId = "";             
            } else if (data['returnCode'] == 0) {
                this.dialogMessage = data['errorList'][0].errorMessage;
                this.dialogIcon = "error";

                $('#quoProcessing #successModalBtn').trigger('click');
            }
        });
    }

    copyModalToGenInfo(quotationNo) {
        console.log(quotationNo);

        this.line = quotationNo.split("-")[0];
        this.quotationNo = quotationNo;

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        
        this.quotationService.savingType = 'normal';

        setTimeout(() => {
            this.router.navigate(['/quotation', { line: this.line, quotationNo : this.quotationNo, from: 'quo-processing' }], { skipLocationChange: true });
        },100); 
    }
}
