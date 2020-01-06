import { Component, OnInit, ViewChild } from '@angular/core';
import { PARListing } from '@app/_models'
import { UnderwritingService, NotesService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as alasql from 'alasql';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';


@Component({
    selector: 'app-par-listing',
    templateUrl: './par-listing.component.html',
    styleUrls: ['./par-listing.component.css']
})
export class ParListingComponent implements OnInit {
    @ViewChild(LoadingTableComponent) table: LoadingTableComponent;
    tableData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    line: string = "";
    slctd: string = "";
    slctdArr: any[] = [];
    polLine: string = "";
    selectedPolicy: any = null;
    policyNo: string = "";
    policyId: any;
    searchParams: any = {
        statusArr:['1'],
        'paginationRequest.count':20,
        'paginationRequest.position':1,   
        altNo:0
    };

    fetchedData: any;
    btnDisabled: boolean;
    statusDesc: any;
    riskName: any;
    insuredDesc: any;
    showPolAlop: boolean;
    quoteId: any;
    quotationNo: any;
    theme =  window.localStorage.getItem("selectedTheme");

    constructor(private uwService: UnderwritingService, private titleService: Title, private router: Router, private ns: NotesService) { }
    passDataListing: any = {
        tHeader: [
           "Policy No", "Type of Cession","Ceding Company", "Insured", "Risk", "Object", "Site", "Currency", "Sum Insured", "Premium" , "Issue Date", "Inception Date", "Expiry Date","Booking Date","Status"
        ],
        sortKeys : ['POLICY_NO','CESSION_DESC','CEDING_NAME','INSURED_DESC','RISK_NAME','OBJECT_DESC','SITE','CURRENCY_CD','TOTAL_SI','TOTAL_PREM','ISSUE_DATE','INCEPT_DATE','EXPIRY_DATE','ACCT_DATE','STATUS_DESC'],
        resizable: [
            false, false, true, true, true, true, true, false, true, true, false,
            false, false, false, false
        ],
        dataTypes: [
            "text", "text", "text", "text", "text", "text", "text",
            "text", "currency", "currency", "date", "date", "date", "date", "text"
        ],
        tableData: [],
        addFlag: true,
        editFlag: true,
        pageStatus: true,
        pagination: true,
        pageLength: 20,
        filters: [
            {
                key: 'policyNo',
                title: 'Policy No.',
                dataType: 'text'
            },
            {
                key: 'cessionDesc',
                title: 'Type of Cession',
                dataType: 'text'
            },
            {
                key: 'cedingName',
                title: 'Ceding Company',
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
                key: 'currencyCd',
                title: 'Currency',
                dataType: 'text'
            },
            {
               keys: {
                    from: 'totalSiLess',
                    to: 'totalSiGrt'
                },
                title: 'Sum Insured',
                dataType: 'textspan'
            },
            {
                keys: {
                    from: 'totalPremLess',
                    to: 'totalPremGrt'
                },
                title: 'Premium',
                dataType: 'textspan'
            },
            {
                 keys: {
                    from: 'issueDateFrom',
                    to: 'issueDateTo'
                },
                title: 'Issue Date',
                dataType: 'datespan'
            },
            {

                 keys: {
                    from: 'inceptDateFrom',
                    to: 'inceptDateTo'
                },
                title: 'Inception Date',
                dataType: 'datespan'
            },
            {
                keys: {
                    from: 'expiryDateFrom',
                    to: 'expiryDateTo'
                },
                title: 'Expiry Date',
                dataType: 'datespan'
            },
            {
                keys: {
                    from: 'acctDateFrom',
                    to: 'acctDateTo'
                },
                title: 'Booking Date',
                dataType: 'datespan'
            },
            {
                key: 'statusDesc',
                title: 'Status',
                dataType: 'text'
            },
        ],
        keys: ['policyNo','cessionDesc','cedComp','insured','risk','object','site','currency','sumInsured','premium','issueDate','inceptDate','expiryDate','accDate','status'],
        exportFlag: true
    }




    ngOnInit() {
        this.titleService.setTitle("Pol | Policy List");
        this.retrievePolListing();
    }

   // retrievePolListing(){
   //     this.uwService.newGetParListing(this.searchParams).subscribe(data => {
          // var records = data['policyList'];
          // let recs:any[] = [];
          // this.fetchedData = records;
          // this.passDataListing.count = data['length'];
          // for(let rec of records){
          //   recs.push(
          //               {
          //                   policyId: rec.policyId,
          //                   policyNo: rec.policyNo,
          //                   cessionDesc: rec.cessionDesc,
          //                   cedComp: rec.cedingName, 
          //                   insured: rec.insuredDesc,
          //                   risk: (rec.project == null) ? '' : rec.project.riskName,
          //                   object: (rec.project == null) ? '' : rec.project.objectDesc,
          //                   site: (rec.project == null) ? '' : rec.project.site,
          //                   currency: rec.currencyCd,
          //                   sumInsured: (rec.project.coverage == null) ? '' : rec.project.coverage.totalSi,
          //                   premium: (rec.project.coverage == null) ? '' : rec.project.coverage.totalPrem,
          //                   issueDate: this.ns.toDateTimeString(rec.issueDate),
          //                   inceptDate: this.ns.toDateTimeString(rec.inceptDate),
          //                   expiryDate: this.ns.toDateTimeString(rec.expiryDate),
          //                   accDate: this.ns.toDateTimeString(rec.acctDate),
          //                   status: rec.statusDesc
          //               }
          //           );  
          //  }
   //         this.table.placeData(recs);

   //     }
   //     );
   // }

   retrievePolListing(){
       if(this.table != undefined)
           this.table.lengthFirst = false;
       if(this.searchParams.recount != 'N'){
         this.uwService.getPolicyListingLength(this.searchParams).subscribe(data=>{
           this.passDataListing.count = data;
           console.log(data)
           this.table.setLength(1);
         })
         this.searchParams.recount = 'N';
       }

       this.uwService.newGetParListing(this.searchParams).subscribe((data:any)=>{
         
             // a.lineCd = a.policyNo.substring(0,3);
             // a.totalSi = a.project.coverage.totalSi;
             // a.riskName = a.project.riskName;
             // a.objectDesc = a.project.objectDesc;
             // a.site = a.project.site;
             // a.totalPrem = a.project.coverage.totalPrem;
             var records = data['policyList'];
             let recs:any[] = [];
             this.fetchedData = records;
             for(let rec of records){
               recs.push(
                           {
                               policyId: rec.policyId,
                               policyNo: rec.policyNo,
                               cessionDesc: rec.cessionDesc,
                               cedComp: rec.cedingName, 
                               insured: rec.insuredDesc,
                               risk: (rec.project == null) ? '' : rec.project.riskName,
                               object: (rec.project == null) ? '' : rec.project.objectDesc,
                               site: (rec.project == null) ? '' : rec.project.site,
                               currency: rec.currencyCd,
                               sumInsured: (rec.project.coverage == null) ? '' : rec.project.coverage.totalSi,
                               premium: (rec.project.coverage == null) ? '' : rec.project.coverage.totalPrem,
                               issueDate: this.ns.toDateTimeString(rec.issueDate),
                               inceptDate: this.ns.toDateTimeString(rec.inceptDate),
                               expiryDate: this.ns.toDateTimeString(rec.expiryDate),
                               accDate: this.ns.toDateTimeString(rec.acctDate),
                               status: rec.statusDesc
                           }
                       );  
              }
              this.table.placeData(recs,1);
         
       })
   }
    //Method for DB query
    searchQuery(searchParams){
        for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }
        this.passDataListing.btnDisabled = true;
        this.retrievePolListing();
    }

    onRowDblClick(event) {
        for (var i = 0; i < event.target.closest("tr").children.length; i++) {
        this.uwService.rowData[i] = event.target.closest("tr").children[i].innerText;
        }

        for(let rec of this.fetchedData){
              if(rec.policyNo === this.uwService.rowData[0]) {
                this.policyId = rec.policyId;
                this.statusDesc = rec.statusDesc;
                this.riskName = rec.project.riskName;
                this.insuredDesc = rec.insuredDesc;
                this.quoteId = rec.quoteId; /*Added by CJS for WFM Services*/
                this.quotationNo = rec.quotationNo; /*Added by CJS for WFM Services*/
              }
        }
        this.polLine = this.uwService.rowData[0].split("-")[0];
        this.policyNo = this.uwService.rowData[0];

        this.uwService.getPolAlop(this.policyId, this.policyNo).subscribe((data: any) => {
            this.uwService.fromCreateAlt = false;
            if (this.statusDesc === 'In Progress' || this.statusDesc === 'Approved'){
                this.uwService.toPolInfo = [];
                this.uwService.toPolInfo.push("edit", this.polLine);
                this.router.navigate(['/policy-issuance', {exitLink:'/policy-listing', line: this.polLine, policyNo: this.policyNo, policyId: this.policyId, editPol: true, statusDesc: this.statusDesc ,riskName: this.riskName, insured: this.insuredDesc, quoteId: this.quoteId, quotationNo: this.quotationNo }], { skipLocationChange: true });
            } else if (this.statusDesc === 'In Force' || this.statusDesc === 'Pending Approval' || this.statusDesc === 'Rejected') {
                this.router.navigate(['/policy-issuance', {exitLink:'/policy-listing', line: this.polLine, policyNo: this.policyNo, policyId: this.policyId, editPol: false, statusDesc: this.statusDesc, riskName: this.riskName, insured: this.insuredDesc, quoteId: this.quoteId, quotationNo: this.quotationNo }], { skipLocationChange: true }); 
            }
        
        });
        
    }

    onClickAdd(event){
        setTimeout(() => {
               this.router.navigate(['/create-policy'],{ skipLocationChange: false });
        },100); 
    }

    onClickEdit(event){
        this.polLine = this.selectedPolicy.policyNo.split('-')[0];
        this.policyNo = this.selectedPolicy.policyNo;
        this.policyId = this.selectedPolicy.policyId;
        this.statusDesc = this.selectedPolicy.status;
        this.riskName = this.selectedPolicy.riskName;
        this.insuredDesc = this.selectedPolicy.insured;

        this.uwService.getPolAlop(this.policyId, this.policyNo).subscribe((data: any) => {
            this.uwService.fromCreateAlt = false;
            if (this.selectedPolicy.status === 'In Progress' || this.selectedPolicy.status === 'Approved') {
             this.uwService.toPolInfo = [];
             this.uwService.toPolInfo.push("edit", this.polLine);
             this.router.navigate(['/policy-issuance', {exitLink:'/policy-listing', line: this.polLine, policyNo: this.policyNo, policyId: this.policyId, editPol: true, statusDesc: this.statusDesc, riskName: this.riskName, insured: this.insuredDesc, showPolAlop: this.showPolAlop}], { skipLocationChange: true });
            } else {
                 this.router.navigate(['/policy-issuance', {exitLink:'/policy-listing', line: this.polLine, policyNo: this.policyNo, policyId: this.policyId, editPol: false, statusDesc: this.statusDesc, riskName: this.riskName, insured: this.insuredDesc, showPolAlop: this.showPolAlop}], { skipLocationChange: true }); 
            }

        });

    }

    onRowClick(event){
      if(this.selectedPolicy === event || event === null || event.filler || Object.keys(event).length == 0){
            this.selectedPolicy = {};
            this.passDataListing.btnDisabled = true;
        }else{
            this.selectedPolicy = event;
            this.passDataListing.btnDisabled = false;
        }
    }

    export(){
        //do something

        let paramsCpy = JSON.parse(JSON.stringify(this.searchParams));
        
        delete paramsCpy['paginationRequest.count'];
        delete paramsCpy['paginationRequest.position'];
        
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var hr = String(today.getHours()).padStart(2,'0');
        var min = String(today.getMinutes()).padStart(2,'0');
        var sec = String(today.getSeconds()).padStart(2,'0');
        var ms = today.getMilliseconds()
        var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
        var filename = 'PolicyList_'+currDate+'.xls'
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
            if(num == 'NaN'){
                num = '0';
            }
            return num
        };


          this.uwService.newGetParListing(paramsCpy).subscribe(data => {
             var records = data['policyList'];
             let recs:any[] = [];
             for(let rec of records){

                 
               recs.push(
                           {
                               policyId: rec.policyId,
                               policyNo: rec.policyNo,
                               cessionDesc: rec.cessionDesc,
                               cedComp: rec.cedingName, 
                               insured: rec.insuredDesc,
                               risk: (rec.project == null) ? '' : rec.project.riskName,
                               object: (rec.project == null) ? '' : rec.project.objectDesc,
                               site: (rec.project == null) ? '' : rec.project.site,
                               currency: rec.currencyCd,
                               sumInsured: (rec.project.coverage == null) ? '' : rec.project.coverage.totalSi,
                               premium: (rec.project.coverage == null) ? '' : rec.project.coverage.totalPrem,
                               issueDate: this.ns.toDateTimeString(rec.issueDate),
                               inceptDate: this.ns.toDateTimeString(rec.inceptDate),
                               expiryDate: this.ns.toDateTimeString(rec.expiryDate),
                               accDate: this.ns.toDateTimeString(rec.acctDate),
                               status: rec.statusDesc

                           }
                       );
              }
              recs = recs.map(rec=>{
                  for(let key of Object.keys(rec)){
                      rec[key] = rec[key]==null ? '' : rec[key];
                  }  
                  return rec;
              })
              

              alasql('SELECT policyNo AS PolicyNo, cessionDesc AS TypeCession, cedComp AS CedingCompany, insured AS Insured, risk AS Risk, object AS Object, site AS Site, currency AS Currency, currency(sumInsured) AS SumInsured ,currency(premium) AS Premium, datetime(issueDate) AS IssueDate, datetime(inceptDate) AS InceptDate, datetime(expiryDate) AS ExpiryDate, datetime(accDate) AS BookingDate, status AS Status  INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,recs]);

          }
        );

     
    }

}
