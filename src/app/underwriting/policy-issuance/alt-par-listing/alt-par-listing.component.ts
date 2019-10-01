import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService} from '../../../_services';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import * as alasql from 'alasql';


@Component({
    selector: 'app-alt-par-listing',
    templateUrl: './alt-par-listing.component.html',
    styleUrls: ['./alt-par-listing.component.css']
})
export class AltParListingComponent implements OnInit {
    @ViewChild(LoadingTableComponent) table: LoadingTableComponent;
    tableData: any[] = [];
    tHeader: any[] = [];
    dataTypes: any[] = [];
    filters: any[] = [];
    line: string = "";
    searchParams: any = {
        statusArr:['1','2','P','R'],
        'paginationRequest.count':20,
        'paginationRequest.position':1,   
        altNo:1        
    };

    selectedPolicy: any = null;
    fetchedData: any;
    policyNo: string = "";
    policyId: any;
    polLine: string = "";
    statusDesc: any;
    riskName: any;
    insuredDesc: any;
    prevPolicyId: any;

    altParListData: any = {
        tHeader: [
           "Alteration Policy No", "Type of Cession","Ceding Company", "Insured", "Risk", "Object", "Site", "Currency", "Sum Insured", "Premium" , "Issue Date", "Inception Date", "Expiry Date","Accounting Date","Status"
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
                title: 'Alt Policy No.',
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

    constructor(private uwService: UnderwritingService, private titleService: Title, private router: Router, private ns: NotesService) { }

    ngOnInit() {
        this.titleService.setTitle("Pol | Alteration List");
        this.retrievePolAltListing();
    }

    retrievePolAltListing(){
       this.uwService.newGetParListing(this.searchParams).subscribe(data => {
          var records = data['policyList'];
          let recs:any[] = [];
          this.fetchedData = records;
          this.altParListData.count = data['length'];
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
             this.table.placeData(recs);
       });
    }

     //Method for DB query
    searchQuery(searchParams){
        for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }

        this.selectedPolicy = {};
        this.altParListData.btnDisabled = true;
        this.retrievePolAltListing();
    }

    onClickAdd(event){
        setTimeout(() => {
               this.router.navigate(['/create-alteration'],{ skipLocationChange: true });
        },100); 
    }


     onClickEdit(event){

         //Sample code here

         console.log("testing new serve");
        this.polLine = this.selectedPolicy.policyNo.split('-')[0];
        this.policyNo = this.selectedPolicy.policyNo;
        this.policyId = this.selectedPolicy.policyId;
        this.statusDesc = this.selectedPolicy.status;
        this.riskName = this.selectedPolicy.riskName;
        this.insuredDesc = this.selectedPolicy.insured;

        this.uwService.getAlterationsPerPolicy(this.policyId, 'alteration').subscribe(data => {
            var polList = data['policyList'];
                  
            var a = polList.filter(p => p.statusDesc.toUpperCase() === 'IN PROGRESS' || p.statusDesc.toUpperCase() === 'IN FORCE');
            var b = polList.filter(p => p.statusDesc.toUpperCase() != 'IN PROGRESS' || p.statusDesc.toUpperCase() != 'IN FORCE');

            b.sort((a, b) => a.altNo - b.altNo);

            var param = {
                line: this.polLine, 
                policyNo: this.policyNo, 
                policyId: this.policyId, 
                statusDesc: this.statusDesc, 
                riskName: this.riskName, 
                insured: this.insuredDesc,
                exitLink:'/alt-policy-listing'
            }

            if ((b.length > 1)) {
                param['prevPolicyId'] = b[b.length-2].policyId;
            }

            if (this.selectedPolicy.status === 'In Progress' || this.selectedPolicy.status === 'Approved'){
                this.uwService.toPolInfo = [];
                this.uwService.toPolInfo.push("edit", this.polLine);
                param['editPol'] = true;
                this.router.navigate(['/policy-issuance-alt', param], { skipLocationChange: true });
            } else {
                param['editPol'] = false;
                this.router.navigate(['/policy-issuance-alt', param], { skipLocationChange: true }); 
            }
        });
    }

     onRowClick(event){
        if(this.selectedPolicy === event || event === null || event.filler || Object.keys(event).length == 0){
            this.selectedPolicy = {};
            this.altParListData.btnDisabled = true;
        }else{
            this.selectedPolicy = event;
            this.altParListData.btnDisabled = false;
        }
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
              }
        }
        this.polLine = this.uwService.rowData[0].split("-")[0];
        this.policyNo = this.uwService.rowData[0];

        this.uwService.getAlterationsPerPolicy(this.policyId, 'alteration').subscribe(data => {
            var polList = data['policyList'];
                  
            var a = polList.filter(p => p.statusDesc.toUpperCase() === 'IN PROGRESS' || p.statusDesc.toUpperCase() === 'IN FORCE');
            var b = polList.filter(p => p.statusDesc.toUpperCase() != 'IN PROGRESS' || p.statusDesc.toUpperCase() != 'IN FORCE');

            b.sort((a, b) => a.altNo - b.altNo);

            //this.prevPolicyId = (b.length > 1)? b[b.length-2].policyId : null;
            var param = {
                line: this.polLine, 
                policyNo: this.policyNo, 
                policyId: this.policyId, 
                statusDesc: this.statusDesc, 
                riskName: this.riskName, 
                insured: this.insuredDesc,
                exitLink:'/alt-policy-listing'
            }

            if ((b.length > 1)) {
                param['prevPolicyId'] = b[b.length-2].policyId;
            }

            if (this.statusDesc === 'In Progress' || this.statusDesc === 'Approved'){
                this.uwService.toPolInfo = [];
                this.uwService.toPolInfo.push("edit", this.polLine);
                param['editPol'] = true;
                this.router.navigate(['/policy-issuance-alt', param], { skipLocationChange: true });
            } else if (this.statusDesc === 'In Force' || this.statusDesc === 'Pending Approval' || this.statusDesc === 'Rejected') {
                param['editPol'] = false;
                this.router.navigate(['/policy-issuance-alt', param], { skipLocationChange: true }); 
            }

        });
    }

     isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
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
    var filename = 'PolicyAlterList_'+currDate+'.xlsx'
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

     alasql('SELECT policyNo AS PolicyNo, cessionDesc AS TypeCession, cedComp AS CedingCompany, insured AS Insured, risk AS Risk, object AS Object, site AS Site, currency AS Currency, currency(sumInsured) AS SumInsured,currency(premium) AS Premium, datetime(issueDate) AS IssueDate, datetime(inceptDate) AS InceptDate, datetime(expiryDate) AS ExpiryDate, datetime(accDate) AS AcctingDate, status AS Status  INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.altParListData.tableData]);
    }
}
