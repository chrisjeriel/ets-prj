import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { QuotationService } from '@app/_services'
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-ready-for-printing',
  templateUrl: './ready-for-printing.component.html',
  styleUrls: ['./ready-for-printing.component.css']
})
export class ReadyForPrintingComponent implements OnInit {
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  records: any[] = [];

  constructor(private quotationService: QuotationService, private router: Router, private modalService: NgbModal, private er: ElementRef, private http: HttpClient) { }
  btnDisabled: boolean;
  selectPrinterDisabled: boolean = true;
  selectCopiesDisabled: boolean = true;
  selectedReport: string ="QUOTER009A";
  selectedOnOk: boolean;
  quoteNoCmp: any;
  quoteId: any;
  printType: any = "SCREEN";
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
  passData: any = {
    tHeader: [
      "Quotation No", "Approved By", "Type of Cession", "Line Class", "Status", "Ceding Company", "Principal", "Contractor", "Insured", "Risk", "Object", "Site", "Currency", "Quote Date", "Valid Until", "Requested By"
    ],
    resizable: [
      true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true
    ],
    dataTypes: [
      "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "text", "date", "date", "text"
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

    tableData: [],
    pageLength: 20,
    checkFlag: true,
    pagination: true,
    pageStatus: true,
    keys: ['quotationNo','approvedBy','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','insuredDesc','riskName','objectDesc','site','currencyCd','issueDate','expiryDate','reqBy']

  }

  searchParams: any[] = [];

  ngOnInit() {
    this.btnDisabled = true;
    this.retrieveQuoteListingMethod();
  }

  retrieveQuoteListingMethod(){
    this.quotationService.getQuoProcessingData(this.searchParams).subscribe(data => {
            this.records = data['quotationList'];
            for(let rec of this.records){
              if(rec.status === 'In Progress'){
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
                      reqBy: rec.reqBy
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
        this.passData.tableData = [];
        this.btnDisabled = true;
        this.retrieveQuoteListingMethod();
    }

  refresh(){       
       this.searchQuery(this.searchParams);
       this.table.refreshTable("first");
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
                     quotationNo: data.quotationNo
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
    if(this.isEmptyObject(this.saveData.changeQuoteStatus)){
       this.dialogIcon = "error-message";
       this.dialogMessage = "Please select quotation(s)";
       this.selectedOnOk = true;
       $('#readyPrinting #successModalBtn').trigger('click');
       setTimeout(()=>{$('.globalLoading').css('display','none');},0);
    } else {
       $('#showPrintMenu > #modalBtn').trigger('click');
    }
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

  cancelModal(){
    this.btnDisabled = false;
  }

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

  showPrintPreview(){         
      if (this.printType == 'SCREEN'){
         this.changeQuoteStatus();           
      }else if (this.printType == 'PRINTER'){
             if(this.validate(this.prepareParam())){
                 this.changeQuoteStatus();      
              } else {
                 this.dialogIcon = "error-message";
                 this.dialogMessage = "Please complete all the required fields.";
                 this.selectedOnOk = false;
                 $('#readyPrinting #successModalBtn').trigger('click');
                 setTimeout(()=>{$('.globalLoading').css('display','none');},0);
              }
      }else if (this.printType == 'PDF'){
          this.changeQuoteStatus();        
      }   
  }


  downloadPDF(reportName : string, quoteId : string, quotationNo: string){
     var fileName = "QUOTATION_LETTER" +'-'+ quotationNo;
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
              window.open(downloadURL, '_blank').print();
             
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
                        window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=' + this.selectedReport + '&quoteId=' + this.saveData.changeQuoteStatus[i].quoteId, '_blank');
                     }
                     this.printParams();
                     this.searchQuery(this.searchParams);
                }else if (this.printType == 'PRINTER'){
                    for(let i=0;i<this.saveData.changeQuoteStatus.length ;i++){ 
                      this.printPDF(this.selectedReport,this.saveData.changeQuoteStatus[i].quoteId);
                    }
                     this.printParams();
                     this.searchQuery(this.searchParams);
                }else if (this.printType == 'PDF'){
                   for(let i=0;i<this.saveData.changeQuoteStatus.length ;i++){ 
                     this.downloadPDF(this.selectedReport,this.saveData.changeQuoteStatus[i].quoteId,this.quotationData[i].quotationNo);
                   }
                     this.printParams();
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