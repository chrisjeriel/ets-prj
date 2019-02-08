import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../../_services';
import { QuotationProcessing, Risks } from '../../_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';


@Component({
    selector: 'app-quotation-processing',
    templateUrl: './quotation-processing.component.html',
    styleUrls: ['./quotation-processing.component.css'],
    providers: [NgbModal, NgbActiveModal]
})
export class QuotationProcessingComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
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
    splittedLine: string[] = [];
    quoTypeOfCession = "";
    riskCd: string = "";
    riskName: string = "";
    riskNameList: string[] = [];
    //existingQuoteNoIndex: number = 0;
    existingQuotationNo: string = "";

    selectedQuotation: any = null;

    fetchedData: any;
    quotationNo = "";

    riskCodeFill: string = "";
    riskFill: string = "";
    mdlConfig = {
        mdlBtnAlign: 'center',
    }

    riskList: Risks = new Risks(null, null, null, null, null, null, null);

    passData: any = {
        tableData: [],
        tHeader: ['Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Insured', 'Risk', 'Object', 'Site', 'Policy No', 'Currency', 'Quote Date', 'Valid Until', 'Requested By', 'Created By'],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'date', 'date', 'text',],
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
            dataType: 'text'
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
        keys: ['quotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','policyNo','currencyCd','issueDate','expiryDate','reqBy','createUser']
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

    constructor(private quotationService: QuotationService, private modalService: NgbModal, private router: Router
        , public activeModal: NgbActiveModal, private titleService: Title
        ) { }


    ngOnInit() {
        this.titleService.setTitle("Quo | List Of Quotations");
        this.rowData = this.quotationService.getRowData();
        this.riskData.tableData = this.quotationService.getRisksLOV();

        this.quotationService.getQuoProcessingData().subscribe(data => {
            var records = data['quotationList'];
            this.fetchedData = records;
            console.log("fetched");
            console.log(this.fetchedData);
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

            this.table.refreshTable();
        });
    }

    onClickAdd(event) {
        $('#addModal > #modalBtn').trigger('click');
    }
    onClickEdit(event) {
        this.quotationNo = this.selectedQuotation.quotationNo;
        this.quoTypeOfCession = this.selectedQuotation.cessionDesc;
        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        // this.router.navigate(['/quotation']);
        // this.router.navigate(['/quotation', { typeOfCession: this.quoTypeOfCession, from: 'quo-processing' }]);
        /*this.router.navigate(['/quotation']);*/
        setTimeout(() => {
            this.router.navigate(['/quotation', { quotationNo: this.quotationNo, typeOfCession: this.quoTypeOfCession, from: 'quo-processing' }], { skipLocationChange: true });
        },100); 
    }

    onClickCopy(event) {
        $('#copyModal > #modalBtn').trigger('click');
    }

    showRiskLOV() {
        $('#riskLOV #modalBtn').trigger('click');
    }

    getRisk(event) {
        if (!Number.isNaN(event.path[2].rowIndex - 1)) {
            this.riskList = this.riskData.tableData[event.path[2].rowIndex - 1];
        }
    }

    nextBtnEvent() {
        //neco was here
        this.existingQuotationNo = "";
        for(var i = 0; i < this.splittedLine.length; i++){
            if(this.line == this.splittedLine[i][0] && this.riskName == this.riskNameList[i] && this.riskNameList[i] != ""){
                //this.existingQuoteNoIndex = i;
                this.existingQuotationNo = this.passData.tableData[i].quotationNo;
                break;
            }
        }

        if(this.existingQuotationNo != ""){
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
            setTimeout(() => {
                this.router.navigate(['/quotation', { line: qLine, typeOfCession: this.quoTypeOfCession, from: 'quo-processing' }], { skipLocationChange: true });
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

    console.log(this.selectedQuotation);
}

onRowDblClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
        this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }

    this.line = this.quotationService.rowData[0].split("-")[0];
    this.quotationNo = this.quotationService.rowData[0];
    this.quoTypeOfCession = event.target.closest('tr').children[1].innerText;

    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", this.line);
    /*  this.router.navigate(['/quotation']);*/
    setTimeout(() => {
        this.router.navigate(['/quotation', { line: this.line, typeOfCession: this.quoTypeOfCession,  quotationNo : this.quotationNo, from: 'quo-processing' }], { skipLocationChange: true });
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
//neco was here
    toInternalCompetition(){
        let data : any = {
            quoteId: 'test',
            things: 'test',
            reason: 'just want to see how this object stringifies',
        }
        this.quotationService.saveQuoteCompetition(data);
    }
//neco ends here

    setRisks(data){
        this.riskCd = data.riskId;
        this.riskName = data.riskName;
        this.onClickAdd();
    }

}
