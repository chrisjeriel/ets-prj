import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { QuotationService } from '@app/_services'
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';
import { PrintModalComponent } from '@app/_components/common/print-modal/print-modal.component';

@Component({
  selector: 'app-ready-for-printing',
  templateUrl: './ready-for-printing.component.html',
  styleUrls: ['./ready-for-printing.component.css']
})
export class ReadyForPrintingComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @ViewChild(PrintModalComponent) printModal: PrintModalComponent;



  records: any[] = [];

  constructor(private quotationService: QuotationService, private router: Router, private modalService: NgbModal, private er: ElementRef, private http: HttpClient) { }
  reportsList: any[] = [
                                {val:"QUOTER009A", desc:"Quotation Letter" },
                                {val:"QUOTER009B", desc:"RI Preparedness to Support Letter and RI Confirmation of Acceptance Letter" },
                                {val:"QUOTER009C", desc:"Risk Not Commensurate" },
                                {val:"QUOTER009D", desc:"Treaty Exclusion Letter" }];
  defaultType: boolean = false;
  btnDisabled: boolean;
  selectPrinterDisabled: boolean = true;
  selectCopiesDisabled: boolean = true;
  selectedReport: string;
  selectedOnOk: boolean;
  quoteNoCmp: any;
  quoteId: any;
  printType: any;
  selectedData:any;
  printName: any = null;
  printCopies: any = null;
  dialogIcon:string;
  dialogMessage:string;
  changeQuoteError: any;
  quotationData: any [] = [];
  saveData: any = {
        changeQuoteStatus: [],
        statusCd: "3",
        reasonCd: ""
    };
  line: any = null;    
  quotationNo: any = null;
  typeOfCession: any = null;



  passData: any = {
    tHeader: [
      "Quotation No", "Approved By", "Type of Cession", "Line Class", "Status", "Ceding Company", "Principal", "Contractor", "Insured", "Risk", "Object", "Site", "Currency", "Quote Date", "Valid Until", "Requested By","Created By"
    ],
    resizable: [
      true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,true
    ],
    dataTypes: [
      "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "date", "date", "text","text"
    ],
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
            keys: {
                    from: 'issueDateFrom',
                    to: 'issueDateTo'
                },
            title: 'Quote Date',
            dataType: 'datespan'
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

    tableData: [],
    pageLength: 20,
    checkFlag: true,
    pagination: true,
    pageStatus: true,
    keys: ['quotationNo','approvedBy','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','currencyCd','issueDate','expiryDate','reqBy','createdBy']

  }

  searchParams: any[] = [];

  ngOnInit() {
    this.printModal.default = false;
    this.printModal.reports = true;
    this.btnDisabled = true;
    this.retrieveQuoteListingMethod();
  }

  retrieveQuoteListingMethod(){
    this.quotationService.getQuoProcessingData(this.searchParams).subscribe(data => {
            this.records = data['quotationList'];
            for(let rec of this.records){
              if(rec.status === 'Approved'){
                this.passData.tableData.push(
                    {
                      quoteId: rec.quoteId,
                      quotationNo: rec.quotationNo,
                      approvedBy: rec.approvedBy,
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
                      currencyCd: rec.currencyCd,
                      issueDate:  this.dateParser(rec.issueDate),
                      expiryDate: this.dateParser(rec.expiryDate),
                      reqBy: rec.reqBy,
                      createdBy: rec.createUser
                    }
                );
              }  
            }

            this.table.refreshTable();
        });

  }

  //Method for DB query
  searchQuery(searchParams){
        this.searchParams = searchParams;
        console.log(this.searchParams);
        this.passData.tableData = [];
        this.btnDisabled = true;
        this.retrieveQuoteListingMethod();
  }

  refresh(){       
       this.searchQuery(this.searchParams);
       this.table.refreshTable("first");
  }

  onRowDblClick(event) {
    this.line = event.quotationNo.split("-")[0];
    this.quotationNo = event.quotationNo;
    this.typeOfCession = event.cessionDesc;
    this.quotationService.toGenInfo = [];
    this.quotationService.toGenInfo.push("edit", this.line);
    this.quotationService.savingType = 'normal';

    setTimeout(() => {
        this.router.navigate(['/quotation', { line: this.line, typeOfCession: this.typeOfCession,  quotationNo : this.quotationNo, from: 'quo-processing' }], { skipLocationChange: true });
    },100); 

}


  dateParser(arr){
    var dateString = new Date(arr).toLocaleDateString();
    return dateString ;   
  }


  onRowClick(event){
    if (this.isEmptyObject(event)){
         this.btnDisabled = true;
       } else {
         this.btnDisabled = false;
       }
  }

  prepareData(){
     this.saveData.changeQuoteStatus =[];
     this.quotationData = [];
     for(let data of this.passData.tableData){
            if(data.checked){
                this.saveData.changeQuoteStatus.push({
                    quoteId: data.quoteId
                })
                this.quotationData.push({
                     quotationNo: data.quotationNo,
                     cessionDesc: data.cessionDesc
                })
            }
     }     
  }

  isEmptyObject(obj) {
    for(var prop in obj) {
       if (obj.hasOwnProperty(prop)) {
          return false;
       }
    }
    return true;
  }

  cancel() {
    this.router.navigateByUrl('');
  }
  
  plainQuotationNo(data: string){
    var arr = data.split('-');
    return arr[0] + '-' + arr[1] + '-' + parseInt(arr[2]) + '-' + parseInt(arr[3]) + '-' + parseInt(arr[4]);
  }

  //Method for modal printing openning
  showPrintModal(){
    this.prepareData();
    console.log(this.saveData);
    console.log(this.quotationData);
    if(this.isEmptyObject(this.saveData.changeQuoteStatus)){
       this.dialogIcon = "error-message";
       this.dialogMessage = "Please select quotation(s)";
       this.selectedOnOk = true;
       $('#readyPrinting #successModalBtn').trigger('click');
       setTimeout(()=>{$('.globalLoading').css('display','none');},0);
    } else {
       $('#readyPrintingList > #printModalBtn').trigger('click');
    }
  }


  cancelModal(){
    this.btnDisabled = false;
  }

  showPrintPreview(data){   
     this.printType = data[0].printType;
     this.printDestination(this.printType);
     
  }

  printDestination(obj){
     this.changeQuoteStatus();      
  }

  downloadPDF(reportName : string, quoteId : string, quotationNo: string){
    if (reportName === this.reportsList[0].val){
     var fileName = "QUOTATION_LETTER" +'-'+ quotationNo;
    }else {
     var fileName = "RI_PREPAREDNESS_SUPPORT_LETTER" +'-'+ quotationNo;
    }
     var errorCode;
     this.quotationService.downloadPDF(reportName,quoteId)
     .subscribe( data => {
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
                         this.modalService.dismissAll()
                         this.dialogIcon = "error-message";
                         this.dialogMessage = "Error generating PDF file(s)";
                         this.selectedOnOk = true;
                         $('#readyPrinting #successModalBtn').trigger('click');
                         setTimeout(()=>{$('.globalLoading').css('display','none');},0);
        }    
     });   
  }

  printPDF(reportName : string, quoteId : string){
         this.quotationService.downloadPDF(reportName,quoteId).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              downloadURL = downloadURL + downloadURL;
              window.open(downloadURL, '_blank').print();    
       },
        error => {
            if (this.isEmptyObject(error)) {
            } else {
               this.dialogIcon = "error-message";
               this.dialogMessage = "Error printing file";
                this.selectedOnOk = true;
               $('#readyPrinting #successModalBtn').trigger('click');
               setTimeout(()=>{$('.globalLoading').css('display','none');},0);
            }          
       });


  }

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

  changeQuoteStatus() {
    this.quotationService.saveChangeQuoteStatus(this.saveData).subscribe( data => {
        this.changeQuoteError = data['returnCode'];
        if(data['returnCode'] == 0) {
                console.log(data['errorList'][0].errorMessage);
                this.dialogIcon = "error-message";
                this.dialogMessage = "Error on issuing selected quotation(s)";
                this.selectedOnOk = false;
                $('#readyPrinting #successModalBtn').trigger('click');
            } else {
                if (this.printType == 'SCREEN'){  
                     for(let i=0;i<this.saveData.changeQuoteStatus.length ;i++){ 
                         if(this.quotationData[i].cessionDesc.toUpperCase() === 'DIRECT'){
                           var selectedReport = this.reportsList[0].val
                           window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=' + selectedReport + '&quoteId=' + this.saveData.changeQuoteStatus[i].quoteId, '_blank');
                         } else {
                            var selectedReport = this.reportsList[1].val
                            window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=' + selectedReport + '&quoteId=' + this.saveData.changeQuoteStatus[i].quoteId, '_blank');
                         }
                     }
                     this.searchQuery(this.searchParams);
                }else if (this.printType == 'PRINTER'){
                    for(let i=0;i<this.saveData.changeQuoteStatus.length ;i++){ 
                      if(this.quotationData[i].cessionDesc.toUpperCase() === 'DIRECT'){
                        var selectedReport = this.reportsList[0].val
                        this.printPDF(selectedReport,this.saveData.changeQuoteStatus[i].quoteId);
                      } else {
                        var selectedReport = this.reportsList[1].val
                        this.printPDF(selectedReport,this.saveData.changeQuoteStatus[i].quoteId);
                      }
                    }
                     this.searchQuery(this.searchParams);
                }else if (this.printType == 'PDF'){
                   for(let i=0;i<this.saveData.changeQuoteStatus.length ;i++){ 
                     if(this.quotationData[i].cessionDesc.toUpperCase() === 'DIRECT'){
                        var selectedReport = this.reportsList[0].val
                        this.downloadPDF(selectedReport,this.saveData.changeQuoteStatus[i].quoteId,this.quotationData[i].quotationNo);
                     } else {
                        var selectedReport = this.reportsList[1].val
                        this.downloadPDF(selectedReport,this.saveData.changeQuoteStatus[i].quoteId,this.quotationData[i].quotationNo);
                     }
                   }
                     this.searchQuery(this.searchParams);
                }
                 this.table.refreshTable("first");
        }
        this.btnDisabled = true;
    });
  }

  modalOnOk(){
    if (this.selectedOnOk){
      this.modalService.dismissAll();
    } else{
      this.showPrintModal();
    }
  }


}