import { Component, OnInit, ViewChildren,QueryList } from '@angular/core';
import { PARListing } from '@app/_models'
import { UnderwritingService, NotesService } from '../../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import * as alasql from 'alasql';

@Component({
    selector: 'app-par-listing',
    templateUrl: './par-listing.component.html',
    styleUrls: ['./par-listing.component.css']
})
export class ParListingComponent implements OnInit {
    @ViewChildren(CustNonDatatableComponent) table: QueryList<CustNonDatatableComponent>;
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
    searchParams: any[] = [];
    fetchedData: any;
    btnDisabled: boolean;

    constructor(private uwService: UnderwritingService, private titleService: Title, private router: Router, private ns: NotesService) { }
    passDataListing: any = {
        tHeader: [
           "Policy No", "Type Cession","Ceding Company", "Insured", "Risk", "Object", "Site", "Currency", "Sum Insured", "Premium" , "Issue Date", "Inception Date", "Expiry Date","Accounting Date","Status"
        ],
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
                key: 'cedingCompany',
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
                title: 'Accounting Date',
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

   retrievePolListing(){
       this.uwService.getParListing(this.searchParams).subscribe(data => {
          var records = data['policyList'];
          this.fetchedData = records;
               for(let rec of records){
                     if (rec.statusDesc === 'In Force' || rec.statusDesc === 'In Progress' && rec.altNo === 0) {
                         this.passDataListing.tableData.push(
                                                    {
                                                        policyId: rec.policyId,
                                                        policyNo: rec.policyNo,
                                                        cessionDesc: rec.cessionDesc,
                                                        cedComp: rec.cedingName, 
                                                        insured: rec.intmName,
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
               }
                this.table.forEach(table => { table.refreshTable() });
       });

   }
    //Method for DB query
    searchQuery(searchParams){
        this.searchParams = searchParams;
        this.passDataListing.tableData = [];
        console.log(this.searchParams);
        this.selectedPolicy = {};
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
              }
        }
        this.polLine = this.uwService.rowData[0].split("-")[0];
        this.policyNo = this.uwService.rowData[0];

        if (this.selectedPolicy.status === '1'){
             this.uwService.toPolInfo = [];
             this.uwService.toPolInfo.push("edit", this.polLine);
             setTimeout(() => {
               this.router.navigate(['/policy-issuance', { line: this.polLine, policyNo: this.policyNo, policyId: this.policyId }], { skipLocationChange: true });
             },100); 
        } else {
            console.log("status is in-forced!");
        }
    }

    onClickAdd(event){
        setTimeout(() => {
               this.router.navigate(['/create-policy'],{ skipLocationChange: true });
        },100); 
    }

    onClickEdit(event){
        this.polLine = this.selectedPolicy.policyNo.split('-')[0];
        this.policyNo = this.selectedPolicy.policyNo;
        this.policyId = this.selectedPolicy.policyId;

        if (this.selectedPolicy.status === '1'){
             this.uwService.toPolInfo = [];
             this.uwService.toPolInfo.push("edit", this.polLine);
             setTimeout(() => {
               this.router.navigate(['/policy-issuance', { line: this.polLine, policyNo: this.policyNo, policyId: this.policyId }], { skipLocationChange: true });
             },100); 
        } else {
            console.log("status is in-forced!");
        }

    }

    onRowClick(event){
      if(this.selectedPolicy === event || event === null){
            this.selectedPolicy = {};
            this.passDataListing.btnDisabled = true;
        }else{
            this.selectedPolicy = event;
            this.passDataListing.btnDisabled = false;
        }
    }

    export(){
        //do something
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var currDate = mm + dd+ yyyy;
    var filename = 'PolicyList_'+currDate+'.xlsx'
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

     alasql('SELECT policyNo AS PolicyNo, cessionDesc AS TypeCession, cedComp AS CedingCompany, insured AS Insured, risk AS Risk, object AS Object, site AS Site, currency AS Currency, currency(sumInsured) AS SumInsured,   datetime(periodFrom) AS PeriodFrom,currency(premium) AS Premium, datetime(issueDate) AS IssueDate, datetime(inceptDate) AS InceptDate, datetime(expiryDate) AS ExpiryDate, datetime(accDate) AS AcctingDate, status AS Status  INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.passDataListing.tableData]);
    }

}
