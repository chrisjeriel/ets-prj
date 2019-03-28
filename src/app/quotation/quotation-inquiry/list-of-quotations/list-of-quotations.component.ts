import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationList } from '@app/_models';
import { QuotationService, NotesService } from '../../../_services';
import { QuotationProcessing } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-list-of-quotations',
    templateUrl: './list-of-quotations.component.html',
    styleUrls: ['./list-of-quotations.component.css']
})
export class ListOfQuotationsComponent implements OnInit {
    @ViewChildren(CustNonDatatableComponent) table: QueryList<CustNonDatatableComponent>;
    //Table Parameters
    tableData: any[] = [];
    allData: any[] = [];
    tHeader: any[] = [];
    resizables: boolean[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    pageLength: number;

    //Variable Parameters
    i: number;
    //quoteList: QuotationList = new QuotationList(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    quoteList: any = {};
    searchParams: any[] = [];
    records: any[] = [];
    line: string = "";
    quotationNo: string = "";
    typeOfCession: string = "";
    dialogIcon:string  = "";
    dialogMessage:string  = "";
    selectPrinterDisabled: boolean = true;
    selectCopiesDisabled: boolean = true;
    btnDisabled: boolean;
    printType: string = "SCREEN";
    selectedReport: string ="QUOTER009A";
    quoteNoCmp: any;
    quoteId: any;
    errorCode: any;
    printName: any = null;
    printCopies: any = null;

    /*passData: any = {
        tablData: [], 
        tHeader: ['Quotation No.','Type of Cession','Line Class','Status','Ceding Company','Principal','Contractor','Insured','Risk','Object','Site','Policy No','Currency'],
        dataTypes: [],
        resizable: [false, false, true, true, true, true, true, true, true, true, false, false],
        filters: [
            {
                key: 'quotationNo',
                title:'Quotation No.',
                dataType: 'text'
            },
            {
                key: 'cessionType',
                title:'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'lineClass',
                title:'Line Class',
                dataType: 'text'
            },
            {
                key: 'quoteStatus',
                title:'Quote Status',
                dataType: 'text'
            },
            {
                key: 'cedingCompany',
                title:'Ceding Company',
                dataType: 'text'
            },
            {
                key: 'principal',
                title:'Principal',
                dataType: 'text'
            },
            {
                key: 'insured',
                title:'Insured',
                dataType: 'text'
            },
            {
                key: 'risk',
                title:'Risk',
                dataType: 'text'
            },
            {
                key: 'object',
                title:'Object',
                dataType: 'text'
            },
            {
                key: 'location',
                title:'Insured',
                dataType: 'text'
            },
            {
                key: 'quoteDate',
                title:'Period From',
                dataType: 'date'
            },
        ],
        pageLength: 10,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: true, printBtn: true, pagination: true, pageStatus: true,
    }*/

    passData: any = {
        tableData: [],
        tHeader: ['Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Insured', 'Risk', 'Object', 'Site', 'Policy No', 'Currency'],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'],
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
        pageLength: 15,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: true, pageStatus: true, pagination: true, pageID: 1,
        keys: ['quotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','policyNo','currencyCd'],
    }

    constructor(private quotationService: QuotationService, private router: Router, private modalService: NgbModal, private notes: NotesService) { 
    }

    ngOnInit() {
        this.retrieveQuoteListingMethod();
        /*this.passData.tableData = this.quotationService.getQuotationListInfo();
        this.passData.tableData.forEach(function(e){
            delete e.quoteDate;
            delete e.validityDate;
            delete e.createdBy;
            delete e.requestedBy;
            delete e.approvedBy;
        });
        this.allData = this.quotationService.getQuotationListInfo();*/
    }

    retrieveQuoteListingMethod(){
        this.quotationService.getQuoProcessingData(this.searchParams).subscribe(data => {
            this.records = data['quotationList'];
            //this.fetchedData = records;
            for(let rec of this.records){
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
                                                new Date(rec.issueDate),
                                                new Date(rec.expiryDate),
                                                rec.reqBy,
                                                rec.createUser
                                            ));
            }


               this.table.forEach(table => { table.refreshTable() });
        });
    }

    //Method for DB query
    searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.retrieveQuoteListingMethod();
        this.quoteList = {};
        this.passData.btnDisabled = true;
        console.log(this.searchParams);
    }

    //Method for print on/off and getting of quoteId used for Reports generation
    onRowClick(event) {
        if(this.quoteList == event || event === null){
            this.quoteList = {};
            this.passData.btnDisabled = true;
        }else{
           this.passData.btnDisabled = false;
           this.quoteList = event;
           this.quoteNoCmp = event.quotationNo;
           for(let rec of this.records){
              if(rec.quotationNo === event.quotationNo) {
                this.quoteId = rec.quoteId;
              }
           }
        }
    }

    //Method to get parameters from quotation lists used for other modules
    onRowDblClick(event) {
        /*for(var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }

        this.line = this.quotationService.rowData[0].split("-")[0]; 
        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        console.log(this.line);
        setTimeout(() => {
               this.router.navigate(['/quotation', { line: this.line }], { skipLocationChange: true });
        },100); */
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
            this.router.navigate(['/quotation', { line: this.line, typeOfCession: this.typeOfCession,  quotationNo : this.quotationNo, from: 'quo-processing', inquiry: true}], { skipLocationChange: true });
        },100); 
    }


    dateParser(arr){
        return new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);   
    }

    //Method for modal printing openning
    print(){
        $('#printListQuotation > #printModalBtn').trigger('click');
    }

    //Method used to get value of dropsdown button
    tabController(event) {
        if (this.printType == 'SCREEN'){
          this.refreshPrintModal(true);
        } else if (this.printType == 'PRINTER'){
          this.refreshPrintModal(false);
        } else if (this.printType == 'PDF'){
          this.refreshPrintModal(true);
        }
    }

    //Cancel modal click
    cancelModal(){
        this.btnDisabled = false;
    }

    //Function used to manipulate modal buttons and text boxes properties 
    refreshPrintModal(condition : boolean){
         if (condition){
            this.selectPrinterDisabled = true;
            this.selectCopiesDisabled = true;
            this.btnDisabled = false;
            $("#noOfCopies").val("");
            $("#noOfCopies").css({"box-shadow": ""});
            $("#printerName").css({"box-shadow":""});
            $("#printerName").val("");
            this.printName = null;
            this.printCopies = null;
         } else {
            this.selectPrinterDisabled = false;
            this.selectCopiesDisabled = false;
            this.btnDisabled = false;
            $("#noOfCopies").val("");
            $("#noOfCopies").css({"box-shadow": ""});
            $("#printerName").css({"box-shadow":""});
            $("#printerName").val("");
            this.printName = null;
            this.printCopies = null;

         }
        
    }

    //Function used for printing of reports
    showPrintPreview() {
         if (this.printType == 'SCREEN'){
           window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=' + this.selectedReport + '&quoteId=' + this.quoteId, '_blank');
           this.printParams();
         }else if (this.printType == 'PRINTER'){
           if(this.validate(this.prepareParam())){
                this.printPDF(this.selectedReport,this.quoteId);
                this.printParams();
           } else {
                this.dialogIcon = "error-message";
                this.dialogMessage = "Please complete all the required fields.";
                $('#listQuotation #successModalBtn').trigger('click');
                setTimeout(()=>{$('.globalLoading').css('display','none');},0);
           }
         }else if (this.printType == 'PDF'){
           this.downloadPDF(this.selectedReport,this.quoteId);
           this.printParams();
         }   
    }

    //Function to download PDF and call web service for downloading of PDF files
    downloadPDF(reportName : string, quoteId : string){
       var fileName = this.quoteNoCmp;
       this.quotationService.downloadPDF(reportName,quoteId).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              var link = document.createElement('a');
              link.href = downloadURL;
              link.download = fileName;
              link.click();
       },
       error => {
            if (this.isEmptyObject(error)) {
            } else {
               this.dialogIcon = "error-message";
               this.dialogMessage = "Error generating PDF file";
               $('#listQuotation #successModalBtn').trigger('click');
               setTimeout(()=>{$('.globalLoading').css('display','none');},0);
            }          
       });
    }

    //Function to print PDF 
    printPDF(reportName : string, quoteId : string){
       var fileName = this.quoteNoCmp;
       this.quotationService.downloadPDF(reportName,quoteId).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = downloadURL;
              document.body.appendChild(iframe);
              iframe.contentWindow.print();
       },
        error => {
            if (this.isEmptyObject(error)) {
            } else {
               this.dialogIcon = "error-message";
               this.dialogMessage = "Error printing file";
               $('#listQuotation #successModalBtn').trigger('click');
               setTimeout(()=>{$('.globalLoading').css('display','none');},0);
            }          
       });
    }

    //Validation of required fields on printing
    validate(obj){
          var req = ['printerName','noOfcopies'];
          var entries = Object.entries(obj);
            for(var [key, val] of entries) {
                if((val === '' || val == null) && req.includes(key)){
                    return false;
                }
            }
        return true;
    }

    prepareParam() {
        var printQuoteParam = {
            "printerName"    : this.printName,
            "noOfcopies"    : this.printCopies
        }

        return printQuoteParam;
    }

    printParams(){
         this.printType = "SCREEN";
         this.printName = null;
         this.printCopies = null;
         this.selectPrinterDisabled = true;
         this.selectCopiesDisabled = true;
    }

    isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

}
