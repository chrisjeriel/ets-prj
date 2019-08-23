import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService, NotesService, MaintenanceService, UserService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import * as alasql from 'alasql';

@Component({
    selector: 'app-quotation-processing',
    templateUrl: './quotation-processing.component.html',
    styleUrls: ['./quotation-processing.component.css']
})
export class QuotationProcessingComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
    @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
    @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
    @ViewChild('riskLOV') riskLOV: MtnRiskComponent;
    @ViewChild('copyRiskLOV') copyRiskLOV: MtnRiskComponent;
    @ViewChild('ceding') cedingLov: CedingCompanyComponent;
    @ViewChild('cedingIntComp') cedingIntLov: CedingCompanyComponent;

    tableData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    rowData: any[] = [];
    disabledEditBtn: boolean = true;
    disabledCopyBtn: boolean = true;

    line: string = "";
    description: string = "";
    lineCdList: string[] = [];
    typeOfCessionId = "";
    typeOfCession = "";
    riskCd: string = "";
    riskName: string = "";
    riskIdList: any[] = [];
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

    cedingCode: any;
    cedingName: any;

    searchParams: any[] = [];

    passData: any = {
        tableData: [],
        tHeader: ['Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Risk', 'Object', 'Site', 'Currency', 'Sum Insured', '1st Option Rate (%)', 'Quote Date', 'Valid Until', 'Requested By', 'Created By'],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'currency', 'percent', 'date', 'date', 'text',],
        resizable: [false, true, true, true, true, true, true, true, true, true, false, false, true, true, true, true],
        filters: [
        {
            key: 'quotationNo',
            title: 'Quotation No.',
            dataType: 'text'
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
        // {
        //     key: 'issueDate',
        //     title: 'Quote Date',
        //     dataType: 'date'
        // },
        { keys: {
            from: 'issueDateFrom',
            to: 'issueDateTo'
        },                        title: 'Quote Date',         dataType: 'datespan'},
        // {
        //     key: 'expiryDate',
        //     title: 'Valid Until',
        //     dataType: 'date'
        // },
        { keys: {
            from: 'expiryDateFrom',
            to: 'expiryDateTo'
        },                        title: 'Valid Until',         dataType: 'datespan'},
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
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, addFlag: true, editFlag: true, copyFlag: false, infoFlag: true, paginateFlag: true, pageID: 'quotationProcessingMainTbl',
        keys: ['quotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','riskName','objectDesc','site','currencyCd','sumInsured','firstOptionRt','issueDate','expiryDate','reqBy','createUser'],
        colSize: ['', '', '120px', '', '', '120px', '120px', '120px', '', '', '', '', '', '', '', '',''],
        genericBtn1: 'Copy Quote Details',
        genericBtn2: 'Internal Competition',
        exportFlag: true,
        pagination: true,
        pageStatus: true,
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
        pageID: 'quotationProcessingRiskTbl'
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
        pageID: 'quotationProcessingLineTbl',
        keys:["lineCd","description","remarks"]
    }

    loading: boolean = false;
    
    copyStatus = 0;
    copyFromQuotationNo: any = "";
    copyToQuotationNo: any = "";
    copyQuoteId: any = "";
    copyQuoteLineCd: any = "";
    copyQuoteYear: any = "";
    copyCessionDesc: any = "";
    copyCedingId: any = "";
    copyCedingName: any = "";
    copyRiskId: any = "";
    copyRiskName: any = "";
    copyIntCompRiskId: any = "";
    copyIntCompRiskName: any = "";
    routeNewQuoteId: number;

    dialogMessage = "";
    dialogIcon = "";

    tempCedingId = "";
    tempQuoteId = "";

    exclude: any[] = [];
    validationList: any[] = [];
    cessionDescList: any[] = [];
    first = false;
    accessibleModules:any = [];

    constructor(private quotationService: QuotationService, public modalService: NgbModal, private router: Router,
                private titleService: Title, private ns: NotesService, private maintenanceService: MaintenanceService, private userService: UserService) {
        
    }
    
    ngOnInit() {
        this.first = true;
        this.titleService.setTitle("Quo | List Of Quotations");
        this.userService.emitModuleId("QUOTE001");
        this.retrieveQuoteListingMethod();

        this.userService.accessibleModules.subscribe(value => {
            this.accessibleModules = value;
            console.log("Quo | List Of Quotations");
            console.log(value);
            console.log("---------");
            console.log(this.accessibleModules);
            console.log("---------");
        })
    }

    retrieveQuoteListingMethod(){
        this.passData.tableData = [];
        this.quotationService.getQuoProcessingData(this.searchParams).subscribe(data => {
            var records = data['quotationList'];
            this.fetchedData = records;

            this.validationList = records.filter(a => ['REQUESTED','IN PROGRESS','RELEASED','CONCLUDED','CONCLUDED (THRU ANOTHER CEDANT)',
                                                       'ON HOLD COVER','CONCLUDED (EXPIRED HOLD COVER)'].includes(a.status.toUpperCase()));

            this.passData.tableData = records.filter(a => ['IN PROGRESS','REQUESTED','PENDING APPROVAL','REJECTED'].includes(a.status.toUpperCase()))
                                             .map(i => {
                                                 i.riskId = i.project.riskId;
                                                 i.riskName = i.project.riskName;
                                                 i.objectDesc = i.project.objectDesc;
                                                 i.site = i.project.site;
                                                 i.issueDate = this.ns.toDateTimeString(i.issueDate);
                                                 i.expiryDate = this.ns.toDateTimeString(i.expiryDate);
                                                 return i;
                                             });
            this.table.refreshTable();
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
            this.router.navigate(['/quotation', { line: this.line, typeOfCession: this.typeOfCession, quoteId:this.selectedQuotation.quoteId, quotationNo: this.quotationNo, from: 'quo-processing', savingType: 'normal', exitLink:'/quotation-processing' }], { skipLocationChange: true });
        },100);
    }

    onClickCopy(event) {        
        $('#copyModal > #modalBtn').trigger('click');
    }

    showRiskLOV() {
        // $('#riskLOV #modalBtn').trigger('click');
        this.riskLOV.modal.openNoClose();
    }

    showCedingCompanyLOV() {
        // $('#cedingCompanyLOV #modalBtn').trigger('click');
        this.cedingLov.modal.openNoClose();
    }

    showLineLOV(){
        // $('#lineLOV #modalBtn').trigger('click');
        this.lineLov.modal.openNoClose();
    }

    //Method for DB query
    searchQuery(searchParams){
        console.log(searchParams);
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.retrieveQuoteListingMethod();
    }

    setLine(data){
        this.line = data.lineCd;
        this.description = data.description;
        this.ns.lovLoader(data.ev, 0);

        /*if(data.hasOwnProperty('fromLOV')){
            $('#addModal > #modalBtn').trigger('click');    
        }*/
    }

    nextBtnEvent() {
        //neco was here
        this.existingQuotationNo = [];
        this.exclude = [];

        for(let i of this.validationList) {
            if(this.line == i.lineCd && this.typeOfCession == i.cessionDesc && this.riskCd == i.project.riskId) { // add year
                this.existingQuotationNo.push(i.quotationNo);
                this.riskIdList.push(i); //used as object container
                this.exclude.push(i.quotationNo.split('-')[4]);
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
                    this.router.navigate(['/quotation', { line: qLine, addParams: JSON.stringify(addParams), from: 'quo-processing', exitLink:'/quotation-processing' }], { skipLocationChange: true });
                },100); 
            }
        //neco's influence ends here
        }
    }

    onRowClick(event) {    
        if(event != null){
            for(let i of this.validationList) {
               if(i.quotationNo == event.quotationNo) {               
                   this.tempCedingId = i.quotationNo.split('-')[4];

                   this.copyQuoteId = i.quoteId;
                   this.copyFromQuotationNo = i.quotationNo;
                   this.copyQuoteLineCd = i.quotationNo.split('-')[0];
                   this.copyQuoteYear = i.quotationNo.split('-')[1];
                   this.copyCessionDesc = i.cessionDesc;

                   this.copyIntCompRiskId = i.project.riskId;
                   this.copyIntCompRiskName = i.project.riskName;
               }
            }    
        }

        this.selectedQuotation = event;
        this.disabledEditBtn = false;
        this.disabledCopyBtn = false;
    }

    onRowDblClick() {
        var sel = this.selectedQuotation;
        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        
        this.quotationService.savingType = 'normal';

        setTimeout(() => {
            this.router.navigate(['/quotation', { line: sel.quotationNo.split("-")[0],
                                                  typeOfCession: sel.cessionDesc,
                                                  quoteId: sel.quoteId,
                                                  quotationNo : sel.quotationNo,
                                                  from: 'quo-processing',
                                                  exitLink:'/quotation-processing' }], { skipLocationChange: true });
        },100); 

    }

    showApprovalModal(content) {
        this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    }


    setCedingcompany(data){
        this.copyCedingId = data.cedingId;
        this.copyCedingName = data.cedingName;
        this.ns.lovLoader(data.ev, 0);

        /*if(data.hasOwnProperty('fromLOV')){
            this.onClickCopy(1);
        }  */      
    }

    setCedingIntCompCompany(data) {
        this.copyCedingId = data.cedingId;
        this.copyCedingName = data.cedingName;
        this.ns.lovLoader(data.ev, 0);

            /*if(data.hasOwnProperty('fromLOV')){
                 this.onClickIntCompCopy();
            }  */
    }

showCedingCompanyIntCompLOV() {
    this.cedingIntLov.modal.openNoClose();
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
                this.router.navigate(['/quotation', { line: qLine, addParams: JSON.stringify(addParams), quotationNo: this.existingQuotationNo, from: 'quo-processing' ,exitLink:'/quotation-processing'}], { skipLocationChange: true });
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
        // $('#typeOfCessionLOV #modalBtn').trigger('click');
        this.typeOfCessionLov.modal.openNoClose();
    }

    setTypeOfCession(data) {        
        this.typeOfCessionId = data.cessionId;
        this.typeOfCession = data.description;
        this.ns.lovLoader(data.ev, 0);
        
        /*if(data.hasOwnProperty('fromLOV')){
            this.onClickAdd('#typeOfCessionId');    
        } */
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
            }

            this.quotationService.savingType = savingType;

            setTimeout(() => {
                this.router.navigate(['/quotation', { line: qLine, addParams: JSON.stringify(addParams), quoteId: this.riskIdList[0].quoteId, quotationNo: this.existingQuotationNo[0], from: 'quo-processing', exclude: this.exclude, tempQuoteIdInternalComp: this.tempQuoteId, exitLink:'/quotation-processing' }], { skipLocationChange: true });
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
            this.cedingLov.checkCode(String(this.copyCedingId).padStart(3, '0'), ev);            
        } else if(field === 'cedingCoIntComp') {
            this.cedingIntLov.checkCode(String(this.copyCedingId).padStart(3, '0'), ev);
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
            "createUser": this.ns.getCurrentUser(), //JSON.parse(window.localStorage.currentUser).username,
            "lineCd": this.copyQuoteLineCd,
            "quoteId": this.copyQuoteId,
            "quoteYear": new Date().getFullYear().toString(),
            "riskId": this.copyRiskId,
            "updateDate": currentDate,
            "updateUser": this.ns.getCurrentUser(), //JSON.parse(window.localStorage.currentUser).username,
        }

        this.quotationService.saveQuotationCopy(JSON.stringify(params)).subscribe(data => {
            this.loading = false;
            
            if(data['returnCode'] == -1) {
                this.retrieveQuoteListingMethod();
                this.copyToQuotationNo = data['quotationNo'];
                this.routeNewQuoteId = data['quoteId'];

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
        // $('#copyRiskLOV #modalBtn').trigger('click');
        this.copyRiskLOV.modal.openNoClose();
    }

    setCopyRisks(data){
        this.copyRiskId = data.riskId;
        this.copyRiskName = data.riskName;
        this.ns.lovLoader(data.ev, 0);

        if(data.hasOwnProperty('fromLOV')){           
            this.onClickCopy(1);
        }
    }

    onClickIntCompCopy(fromScreen?) {
        if(fromScreen !== undefined) {
            this.exclude = [];

            var sq = this.selectedQuotation;

            for(let i of this.validationList) {
                if(sq.lineCd == i.lineCd && sq.quotationNo.split('T')[1] == i.quotationNo.split('T')[1] && sq.project.riskId == i.project.riskId && sq.cessionDesc == i.cessionDesc) {
                    this.exclude.push(i.quotationNo.split('-')[4]);
                }
            }    
        } else {
            this.copyQuoteId = this.riskIdList[0].quoteId;
            this.copyFromQuotationNo = this.riskIdList[0].quotationNo;
            this.copyQuoteLineCd = this.riskIdList[0].quotationNo.split('-')[0];
            this.copyQuoteYear = this.riskIdList[0].quotationNo.split('-')[1];
            this.copyCessionDesc = this.riskIdList[0].cessionDesc;
            this.copyIntCompRiskId = this.riskIdList[0].project.riskId;
            this.copyIntCompRiskName = this.riskIdList[0].project.riskName;
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
            this.loading = false;            

            if(data['returnCode'] == -1) {
                
                this.copyToQuotationNo = data['quotationNo'];
                this.routeNewQuoteId = data['quoteId'];

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

                // this.retrieveQuoteListingMethod();
            } else if (data['returnCode'] == 0) {
                this.dialogMessage = data['errorList'][0].errorMessage;
                this.dialogIcon = "error";

                $('#quoProcessing #successModalBtn').trigger('click');
            }
        });
    }

    copyModalToGenInfo(quotationNo) {
        this.line = quotationNo.split("-")[0];
        this.quotationNo = quotationNo;

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        
        this.quotationService.savingType = 'normal';

        setTimeout(() => {
            this.router.navigate(['/quotation', { line: this.line, quoteId: this.routeNewQuoteId, quotationNo: this.quotationNo, from: 'quo-processing', exitLink: '/quotation-processing' }], { skipLocationChange: true });
        },100); 
    }

    intCompToGenInfo() {
        this.line = this.copyToQuotationNo.split("-")[0];
        this.quotationNo = this.copyToQuotationNo;

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        
        this.quotationService.savingType = 'normal';

        setTimeout(() => {
            this.router.navigate(['/quotation', { line: this.line, quoteId: this.routeNewQuoteId, quotationNo: this.quotationNo, from: 'quo-processing', exitLink: '/quotation-processing' }], { skipLocationChange: true });
        },100); 
    }

export(){
        //do something
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'QuotationProcessing_'+currDate+'.xlsx'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

       alasql.fn.currency = function(currency) {
            var parts = parseFloat(currency).toFixed(2).split(".");
            var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
                (parts[1] ? "." + parts[1] : "");
            return num
      };

    alasql('SELECT quotationNo AS QuotationNo, cessionDesc AS TypeCession, lineClassCdDesc AS LineCLass, status AS STATUS, cedingName AS CedingCompany, principalName AS Principal, contractorName AS Contractor, insuredDesc AS Insured, riskName AS Risk, objectDesc AS Object, site AS Site, policyNo AS PolicyNo, currencyCd AS Currency, datetime(issueDate) AS QuoteDate, datetime(expiryDate) AS ValidUntil, reqBy AS RequestedBy, createUser AS CreatedBy INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
  }
}
