import { Component, OnInit , ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { QuotationService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { HoldCoverMonitoringList } from '@app/_models/quotation-list';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-hold-cover-monitoring-list',
    templateUrl: './hold-cover-monitoring-list.component.html',
    styleUrls: ['./hold-cover-monitoring-list.component.css']
})
export class HoldCoverMonitoringListComponent implements OnInit {
    @ViewChild(CustNonDatatableComponent) table:CustNonDatatableComponent; 
    private holdCoverMonitoringList: HoldCoverMonitoringList;

    tableData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    pageLength: number;
    line: string = "";
    filterDataTypes: any[] = [];
    btnDisabled: boolean;
    printType: any = "SCREEN";
    selectPrinterDisabled: boolean = true;
    selectCopiesDisabled: boolean = true;
    selectedReport: string ="QUOTER012";
    holdNoCmp: any;
    printName: any = null;
    printCopies: any = null;
    dialogIcon:string;
    dialogMessage:string;
    printQuoteParams: any = {};
    quoteId: any;
    holdCoverId: any;
    holdCoverList: any = {};
    records: any[] = [];

    constructor(private quotationService: QuotationService, private router: Router, private titleService: Title, private modalService: NgbModal) {
        this.pageLength = 10;
    }

    passData: any = {
        tableData: [],
        tHeader: ['Hold Cover No.', 'Status', 'Ceding Company', 'Quotation No.', 'Risk', 'Insured', 'Period From', 'Period To', 'Comp. Ref. Hold Cover No.', 'Requested By', 'Request Date'],
        dataTypes: [],
        resizable: [false, false, true, false, true, true, false, false, false, true, false],
        filters: [
            {
                key: 'holdCoverNo',
                title: 'Hold Cover No.',
                dataType: 'text'
            },
            {
                key: 'status',
                title: 'Status',
                dataType: 'text'
            },
            {
                key: 'cedingName',
                title: 'Ceding Co',
                dataType: 'text'
            },
            {
                key: 'quotationNo',
                title: 'Quotation No',
                dataType: 'seq'
            },
            {
                key: 'riskName',
                title: 'Risk',
                dataType: 'text'
            },
            {
                key: 'insuredDesc',
                title: 'Insured',
                dataType: 'text'
            },
            {
                keys: {
                    from: 'periodFrom',
                    to: 'periodTo'
                },
                title: 'Period',
                dataType: 'datespan'
            },
           /* {
                key: 'periodTo',
                title: 'Period To',




                dataType: 'datespan'
            },*/
            {
                key: 'compRefHoldCovNo',
                title: 'CR Hold Cov No.',
                dataType: 'seq'
            },
            {
                key: 'reqBy',
                title: 'Requested By',
                dataType: 'text'
            },
            {
                key: 'reqDate',
                title: 'Request Date',
                dataType: 'date'
            },
            {
                key: 'expiringInDays',
                title: 'Expires in (Days)',
                dataType: 'expire'
            },

        ],
        pageLength: 10,
        expireFilter: true, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: true, pagination: true, pageStatus: true,
        keys: ['holdCoverNo','status','cedingName','quotationNo','riskName',
            'insuredDesc','periodFrom','periodTo','compRefHoldCovNo','reqBy','reqDate']
    }

    searchParams: any[] = [];

    ngOnInit() {
        this.titleService.setTitle("Quo | Hold Cover Monitoring");
        this.tHeader.push("Hold Cover No.");
        this.tHeader.push("Status");
        this.tHeader.push("Ceding Company");
        this.tHeader.push("Quotation No.");
        this.tHeader.push("Risk");
        this.tHeader.push("Insured");
        this.tHeader.push("Period From");
        this.tHeader.push("Period To");
        this.tHeader.push("Comp. Ref. Hold Cover No.");
        this.tHeader.push("Requested By");
        this.tHeader.push("Request Date");

        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("date");
        this.passData.dataTypes.push("date");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("text");
        this.passData.dataTypes.push("date");

        //this.passData.tableData = this.quotationService.getQuotationHoldCoverInfo();
    
        //this.holdCoverMonitoringList = new HoldCoverMonitoringList(null,null,null,null,null,null,null,null,null,null,null);
       
       this.retrieveQuoteHoldCoverListingMethod();
    }

    retrieveQuoteHoldCoverListingMethod(){
         this.quotationService.getQuotationHoldCoverInfo(this.searchParams)
            .subscribe((val:any) =>
                {
                    console.log(val);
                    var list = val.quotationList;
                    for(var i = 0; i < list.length;i++){
                        this.passData.tableData.push( new HoldCoverMonitoringList(
                             list[i].holdCover.holdCoverNo,
                             list[i].holdCover.status,
                             list[i].cedingName,
                             list[i].quotationNo,
                             (list[i].project == null) ? '' : list[i].project.riskName,
                             list[i].insuredDesc,
                             new Date(this.formatDate(list[i].holdCover.periodFrom)),
                             new Date(this.formatDate(list[i].holdCover.periodTo)),
                             list[i].holdCover.compRefHoldCovNo,
                             list[i].holdCover.reqBy,
                             new Date(this.formatDate(list[i].holdCover.reqDate))
                            ))
                    }

                    /*for(var i = val['quotationList'].length -1 ; i >= 0 ; i--){
                    this.records = val['quotationList'];
                    console.log(this.records);
                    for(var i = val['quotationList'].length -1 ; i >= 0 ; i--){
                         var list = val['quotationList'][i]
                         this.passData.tableData.push(new HoldCoverMonitoringList(
                            list.holdCover.holdCoverNo,
                            list.holdCover.status,
                            list.cedingName,
                            list.quotationNo,
                            (list.project == null) ? '' : list.project.riskName,
                            list.insuredDesc,
                            new Date(list.holdCover.periodFrom[0],list.holdCover.periodFrom[1]-1,list.holdCover.periodFrom[2]),
                            new Date(list.holdCover.periodTo[0],list.holdCover.periodTo[1]-1,list.holdCover.periodTo[2]),
                            list.holdCover.compRefHoldCovNo,
                            list.holdCover.reqBy,
                            new Date(list.holdCover.reqDate[0],list.holdCover.reqDate[1]-1,list.holdCover.reqDate[2])
                         ));
                         console.log(list.holdCover.periodFrom[1]-1)
                    }*/
                    this.table.refreshTable();
                }
            );
    }

     //Method for DB query
    searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passData.tableData = [];
        this.retrieveQuoteHoldCoverListingMethod();
    }

    onRowClick(event) {
        /*for (var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }*/
        /*if(this.holdCoverList == event || event === null){
            this.holdCoverList = {};
        }else{
           this.holdCoverList = event;
           this.holdNoCmp = event.holdCoverNo;
           for(let rec of this.records){
              if(rec.holdCover.holdCoverNo === event.holdCoverNo) {
                this.quoteId = rec.quoteId;
                this.holdCoverId = rec.holdCover.holdCoverId;
              }
           }
        }*/
        if (event != null) {
            this.quotationService.getHoldCoverInfo('',event.holdCoverNo).subscribe((data:any) =>
                {
                    this.quoteId = data.quotation.quoteId;
                    this.holdCoverId = data.quotation.holdCover.holdCoverId;
                }
            );
        }

    }

    onRowDblClick(event) {
        for (var i = 0; i < event.target.parentElement.children.length; i++) {
            this.quotationService.rowData[i] = event.target.parentElement.children[i].innerText;
        }

        this.line = this.quotationService.rowData[0].split("-")[0];

        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        this.router.navigate(['/quotation']);
    }

    formatDate(date){
       var dt = new Date(date);
       return (dt.getMonth()+1) + '-' + dt.getDate() + '-' + dt.getFullYear(); 
    }

    print(){
        //do something
        $('#showPrintMenu > #modalBtn').trigger('click');
    }

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

    showPrintPreview() {
         if (this.printType == 'SCREEN'){
           window.open('http://localhost:8888/api/util-service/generateReport?reportName=' + this.selectedReport + '&quoteId=' + this.quoteId + '&holdCovId=' + this.holdCoverId, '_blank');
           this.printParams();
         }else if (this.printType == 'PRINTER'){
           if(this.validate(this.prepareParam())){
                this.printPDF(this.selectedReport,this.quoteId,this.holdCoverId);
                this.printParams();
           } else {
                this.dialogIcon = "error";
                this.dialogMessage = "Please complete all the required fields.";
                $('#listHoldCover #successModalBtn').trigger('click');
                setTimeout(()=>{$('.globalLoading').css('display','none');},0);
           }
         }else if (this.printType == 'PDF'){
           this.downloadPDFHC(this.selectedReport,this.quoteId,this.holdCoverId);
           this.printParams();
         }   
    }

    downloadPDFHC(reportName : string, quoteId : string, holdCoverId : string ){
       var fileName = this.holdNoCmp;
       this.quotationService.downloadPDFHC(reportName,quoteId,holdCoverId).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              var link = document.createElement('a');
              link.href = downloadURL;
              link.download = fileName;
              link.click();
       });
    }

    printPDF(reportName : string, quoteId : string, holdCoverId : string){
       this.quotationService.downloadPDFHC(reportName,quoteId,holdCoverId).subscribe( data => {
              var newBlob = new Blob([data], { type: "application/pdf" });
              var downloadURL = window.URL.createObjectURL(data);
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = downloadURL;
              document.body.appendChild(iframe);
              iframe.contentWindow.print();
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
         this.selectCopiesDisabled = true;
    }


}
