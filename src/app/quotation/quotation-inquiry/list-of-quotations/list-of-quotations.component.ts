import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationList } from '@app/_models';
import { QuotationService, NotesService } from '../../../_services';
import { QuotationProcessing } from '@app/_models';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';
import * as alasql from 'alasql';

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
     /*reportsList: any[] = [
                                {val:"QUOTER009A", desc:"Quotation Letter" },
                                {val:"QUOTER009B", desc:"RI Preparedness to Support Letter and RI Confirmation of Acceptance Letter" },
                                {val:"QUOTER009C", desc:"Risk Not Commensurate" },
                                {val:"QUOTER009D", desc:"Treaty Exclusion Letter" }];*/
    i: number;
    //quoteList: QuotationList = new QuotationList(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    quoteList: any = {};
    searchParams: any[] = [];
    records: any[] = [];
    line: string = "";
    quotationNo: string = "";
    typeOfCession: string = "";
    quoteNoCmp: any;
    quoteId: any;
    errorCode: any;
    cessionDesc: any = null;
    status: any = null;

   /* dialogIcon:string  = "";
    dialogMessage:string  = "";
    selectPrinterDisabled: boolean = true;
    selectCopiesDisabled: boolean = true;
    btnDisabled: boolean;
    printType: string = "SCREEN";
    selectedReport: string ="QUOTER009A";*/
    
/*    printName: any = null;
    printCopies: any = null;
    wordingTxt: any = null;
    cessionDesc: any = null;
    status: any = null;
    defaultType: boolean = true;*/

    passData: any = {
        tableData: [],
        tHeader: ['Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Insured', 'Risk', 'Object', 'Site', 'Policy No', 'Currency'],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'],
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
            dataType: 'seq'
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
            key: 'currencyCd',
            title: 'Currency',
            dataType: 'text'
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
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, pageStatus: true, pagination: true, pageID: 1, exportFlag: true,
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
                this.cessionDesc = event.cessionDesc;
                this.status = event.status;
              }
           }
        }
    }

    //Method to get parameters from quotation lists used for other modules
    onRowDblClick(event) {
        for (var i = 0; i < event.target.closest("tr").children.length; i++) {
            this.quotationService.rowData[i] = event.target.closest("tr").children[i].innerText;
        }
        this.line = this.quotationService.rowData[0].split("-")[0];
        this.quotationNo = this.quotationService.rowData[0];
        this.quotationService.toGenInfo = [];
        this.quotationService.toGenInfo.push("edit", this.line);
        this.quotationService.savingType = 'normal';

         for(let rec of this.records){
          if(rec.quotationNo === this.quotationService.rowData[0] ){
             this.quoteId = rec.quoteId;
             this.quotationNo = rec.quotationNo;
             this.typeOfCession = rec.cessionDesc;
             this.status = rec.status;
          } 
        }
        this.router.navigate(['/quotation', { line: this.line, typeOfCession: this.typeOfCession,  quotationNo : this.quotationNo,quoteId: this.quoteId,status: this.status, from: 'quo-processing', inquiry: true,exitLink:'/quotation-inquiry'}], { skipLocationChange: true }); 
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
    var filename = 'QuotationInquiryList_'+currDate+'.xlsx'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

     alasql('SELECT quotationNo AS QuotationNo, cessionDesc AS TypeOfCession,lineClassCdDesc AS LineClass, status AS Status,cedingName AS CedingCompany,principalName AS Principal, contractorName AS Contractor, insuredDesc AS Insured, riskName AS Risk, objectDesc AS Object, site AS Site, policyNo AS PolicyNo, currencyCd AS Currency INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
    }


    dateParser(arr){
        return new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);   
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
