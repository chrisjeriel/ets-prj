import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationList } from '@app/_models';
import { QuotationService, NotesService } from '../../../_services';
import { QuotationProcessing } from '@app/_models';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';
import * as alasql from 'alasql';

@Component({
    selector: 'app-list-of-quotations',
    templateUrl: './list-of-quotations.component.html',
    styleUrls: ['./list-of-quotations.component.css']
})
export class ListOfQuotationsComponent implements OnInit {
    @ViewChild(LoadingTableComponent) table: LoadingTableComponent;
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
    searchParams: any = {
        'paginationRequest.count':10,
        'paginationRequest.position':1,   
        recount : 'Y'
    };
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
        tHeader: ['Quotation No.', 'Type of Cession', 'Line Class', 'Status', 'Ceding Company', 'Principal', 'Contractor', 'Risk', 'Object', 'Site', 'Currency', 'Sum Insured', '1st Option Rate (%)', 'Quote Date', 'Valid Until', 'Requested By', 'Created By'],
                 


        sortKeys:['QUOTATION_NO','CESSION_DESCRIPTION','CLASS_DESCRIPTION','STATUS','CEDING_NAME','PRINCIPAL_NAME','CONTRACTOR_NAME','RISK_NAME','OBJECT_DESCRIPTION','SITE','CURRENCY_CD','TOTAL_SI','OPTION_RT','ISSUE_DATE','EXPIRY_DATE','REQ_BY','CREATE_USER'],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'currency', 'percent', 'date', 'date', 'text', 'text'],     
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
                key: 'currencyCd',
                title: 'Currency',
                dataType: 'text'
            },


            { keys: {
                from: 'siFrom',
                to: 'siTo'
            },                        title: 'Sum Insured',         dataType: 'textspan'},
            { keys: {
                from: 'rateFrom',
                to: 'rateTo'
            },                        title: '1st Option Rate',         dataType: 'textspan'},

            // {
            //     key: 'policyNo',
            //     title: 'Policy No.',
            //     dataType: 'seq'
            // },
            {
                keys: {
                        from: 'issueDateFrom',
                        to: 'issueDateTo'
                    },
                title: 'Quote Date',
                dataType: 'datespan'
            },
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
        pageLength: 10,
        expireFilter: false, checkFlag: false, tableOnly: false, fixedCol: false, printBtn: false, pageStatus: true, pagination: true, pageID: 1, exportFlag: true,
        keys: ['quotationNo','cessionDesc','lineClassCdDesc','status','cedingName','principalName','contractorName','riskName','objectDesc','site','currencyCd', 'sumInsured', 'firstOptionRt', 'issueDate', 'expiryDate', 'reqBy', 'createUser'],
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
        if(this.table != undefined)
            this.table.lengthFirst = false;
        if(this.searchParams.recount != 'N'){
          this.quotationService.newGetQuoProcessingDataLength(this.searchParams).subscribe(data=>{
            this.passData.count = data;
            console.log(data)
            this.table.setLength(1);
          })
          this.searchParams.recount = 'N';
        }

        this.quotationService.newGetQuoProcessingData(this.searchParams).subscribe(data => {
            this.records = data['quotationList'];
            // this.passData.count = data['length'] == null ? this.passData.count : data['length']  ;
            let recs: any[] = [];
            for(let rec of this.records){
                recs.push({
                            quotationNo: rec.quotationNo,
                            cessionDesc: rec.cessionDesc,
                            lineClassCdDesc: rec.lineClassCdDesc,
                            status: rec.status,
                            cedingId: rec.cedingId,
                            cedingName: rec.cedingName,
                            prinId: rec.principalId,
                            principalName: rec.principalName,
                            contractorId: rec.contractorId,
                            contractorName: rec.contractorName,
                            insuredDesc: rec.insuredDesc,
                            riskId: (rec.project == null) ? '' : rec.project.riskId,
                            riskName: (rec.project == null) ? '' : rec.project.riskName,
                            objectDesc: (rec.project == null) ? '' : rec.project.objectDesc,
                            site: (rec.project == null) ? '' : rec.project.site,
                            policyNo: rec.policyNo,
                            currencyCd: rec.currencyCd,
                            issueDate: new Date(rec.issueDate),
                            expiryDate: new Date(rec.expiryDate),
                            reqBy: rec.reqBy,
                            createUser: rec.createUser,
                            preparedBy: rec.preparedBy,
                            approvedBy: rec.approvedBy,
                            firstOptionRt: rec.firstOptionRt,
                            sumInsured: rec.sumInsured
                        });
            }

            this.table.placeData(recs,1);
               //this.table.forEach(table => { table.refreshTable() });
        });
    }

    pad(str, field) {
    if(str === '' || str == null){
      return '';
    }else{
      if(field === 'cedingId'){
        return String(str).padStart(3, '0');
      }else if(field === 'insured'){
        return String(str).padStart(6, '0');
      }
    }
    
  }

    //Method for DB query
    searchQuery(searchParams){
        for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }
        this.retrieveQuoteListingMethod();
        this.quoteList = {};
        this.passData.btnDisabled = true;
        console.log(this.searchParams);
    }

        //Method for print on/off and getting of quoteId used for Reports generation
    onRowClick(event) {
        console.log(event);
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

    // export(){
    //     //do something
    //  var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();
    // var hr = String(today.getHours()).padStart(2,'0');
    // var min = String(today.getMinutes()).padStart(2,'0');
    // var sec = String(today.getSeconds()).padStart(2,'0');
    // var ms = today.getMilliseconds()
    // var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    // var filename = 'QuotationInquiryList_'+currDate+'.xls'
    // var mystyle = {
    //     headers:true, 
    //     column: {style:{Font:{Bold:"1"}}}
    //   };

    //   alasql.fn.datetime = function(dateStr) {
    //         var date = new Date(dateStr);
    //         return date.toLocaleString();
    //   };

    //  alasql('SELECT quotationNo AS QuotationNo, cessionDesc AS TypeOfCession,lineClassCdDesc AS LineClass, status AS Status,cedingName AS CedingCompany,principalName AS Principal, contractorName AS Contractor, insuredDesc AS Insured, riskName AS Risk, objectDesc AS Object, site AS Site, policyNo AS PolicyNo, currencyCd AS Currency INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passData.tableData]);
    // }


    export(){
        //do something
        let paramsCpy = JSON.parse(JSON.stringify(this.searchParams));
        
        delete paramsCpy['paginationRequest.count'];
        delete paramsCpy['paginationRequest.position'];
        console.log(paramsCpy);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var hr = String(today.getHours()).padStart(2,'0');
        var min = String(today.getMinutes()).padStart(2,'0');
        var sec = String(today.getSeconds()).padStart(2,'0');
        var ms = today.getMilliseconds()
        var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
        var filename = 'QuotationInquiryList_'+currDate+'.xls'
        var mystyle = {
            headers:true, 
            column: {style:{Font:{Bold:"1"}}}
          };

          alasql.fn.datetime = function(dateStr) {
                var date = new Date(dateStr);
                return date.toLocaleString().split(',')[0];
          };

           alasql.fn.currency = function(currency) {
                var parts = parseFloat(currency).toFixed(2).split(".");
                var num = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + 
                    (parts[1] ? "." + parts[1] : "");
                var num = num == 'NaN' ? '' : num;
                return num
          };

          this.quotationService.newGetQuoProcessingData(paramsCpy).subscribe(data => {
                var records = data['quotationList'];
                //this.table.refreshTable();
                records = records.map(i => {
                                         if(i.project != null){
                                             i.riskId = i.project.riskId;
                                             i.riskName = i.project.riskName;
                                             i.objectDesc = i.project.objectDesc;
                                             i.site = i.project.site;
                                         }
                                         i.issueDate = this.notes.toDateTimeString(i.issueDate);
                                         i.expiryDate = this.notes.toDateTimeString(i.expiryDate);
                                         for(let key of Object.keys(i)){
                                             i[key] = i[key]==null ? '' : i[key];
                                         }

                                         return i;
                                     });
                alasql('SELECT quotationNo AS QuotationNo, cessionDesc AS TypeOfCession, lineClassCdDesc AS LineClass, status AS Status, cedingName AS CedingCompany, principalName AS Principal,'+
                        ' contractorName AS Contractor, riskName AS Risk, objectDesc AS Object, site AS Site, currencyCd AS Currency, currency(sumInsured) AS SumInsured, firstOptionRt AS FirstOptnRt,'+
                        'datetime(issueDate) AS QuoteDate, datetime(expiryDate) AS ValidUntil, reqBy AS RequestedBy, createUser AS CreatedBy INTO XLSXML("'+filename+'",?) FROM ?',
                        [mystyle,records]);
            });

        
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
