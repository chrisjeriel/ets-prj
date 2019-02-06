import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../../_services';
import { QuotationProcessing, Risks } from '../../_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'app-quotation-processing',
    templateUrl: './quotation-processing.component.html',
    styleUrls: ['./quotation-processing.component.css'],
    providers: [NgbModal, NgbActiveModal]
})
export class QuotationProcessingComponent implements OnInit {
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
    quoTypeOfCession = "";
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
            key: 'cessionType',
            title: 'Type of Cession',
            dataType: 'text'
        },
        {
            key: 'lineClass',
            title: 'Line Class',
            dataType: 'text'
        },
        {
            key: 'quoteStatus',
            title: 'Quote Status',
            dataType: 'text'
        },
        {
            key: 'cedingCompany',
            title: 'Ceding Co.',
            dataType: 'text'
        },
        {
            key: 'principal',
            title: 'Principal',
            dataType: 'text'
        },
        {
            key: 'insured',
            title: 'Insured',
            dataType: 'text'
        },
        {
            key: 'risk',
            title: 'Risk',
            dataType: 'text'
        },
        {
            key: 'object',
            title: 'Object',
            dataType: 'text'
        },
        {
            key: 'location',
            title: 'Site',
            dataType: 'text'
        },
        {
            key: 'policyNo',
            title: 'Policy No.',
            dataType: 'text'
        },
        {
            key: 'currency',
            title: 'Currency.',
            dataType: 'text'
        },
        {
            key: 'quoteDate',
            title: 'Quote Date.',
            dataType: 'date'
        },
        {
            key: 'validUntil',
            title: 'Valid Until',
            dataType: 'date'
        },
        {
            key: 'requestedBy',
            title: 'Requested By',
            dataType: 'text'
        },
        {
            key: 'createdBy',
            title: 'Created By',
            dataType: 'text'
        },
        ],
        pageLength: 10,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, addFlag: true, editFlag: true, copyFlag: true, pageStatus: true, pagination: true, pageID: 1
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
        this.passData.tableData = this.quotationService.getQuoProcessingData();
        this.riskData.tableData = this.quotationService.getRisksLOV();
    }

    onClickAdd(event) {
        $('#addModal > #modalBtn').trigger('click');
    }
    onClickEdit(event) {
        this.line = this.quotationService.rowData[0].split("-")[0];
        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        // this.router.navigate(['/quotation']);
        this.router.navigate(['/quotation', { typeOfCession: this.quoTypeOfCession, from: 'quo-processing' }]);
        /*this.router.navigate(['/quotation']);*/
        setTimeout(() => {
            this.router.navigate(['/quotation', { line: this.line, typeOfCession: this.quoTypeOfCession, from: 'quo-processing' }], { skipLocationChange: true });
        },100); 
    }

    onClickCopy(event) {
        $('#copyModal > #modalBtn').trigger('click');
    }

    riskLOV() {
        $('#riskModal > #modalBtn').trigger('click');
    }

    getRisk(event) {
        if (!Number.isNaN(event.path[2].rowIndex - 1)) {
            this.riskList = this.riskData.tableData[event.path[2].rowIndex - 1];
        }
    }

    nextBtnEvent() {
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
}

onRowClick(event) {
    for (var i = 0; i < event.target.closest("tr").children.length; i++) {
        this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
    }

    this.quoTypeOfCession = event.target.closest("tr").children[1].innerText;
    this.disabledEditBtn = false;
    this.disabledCopyBtn = false;
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
}
