import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, ClaimsService, NotesService } from '../../../_services';
import { CreateAlterationParInfo } from '../../../_models/CreateAlterationPolicy';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';

@Component({
  selector: 'app-renew-exp-policy',
  templateUrl: './renew-exp-policy.component.html',
  styleUrls: ['./renew-exp-policy.component.css']
})
export class RenewExpPolicyComponent implements OnInit {
  @ViewChild('altPolLov') lovTable: LoadingTableComponent;

  private createAlterationPar: CreateAlterationParInfo;
  tableData: any[] = [];
  tHeader: any[] = [];
  dataTypes: any[] = [];
  fromQuotation: boolean = true;
  policyLine: any;

  polNo: any[] = [];
  searchArr: any[] = Array(6).fill('');
  cedingName: any = '';
  expiryDate: any = '';
  insuredDesc: any = '';
  riskName: any = '';
  selected: any = null;
  loading: boolean = false;
  warningMsg: any = null;

  searchParams: any = {
        statusArr:['2'],
        'paginationRequest.count':10,
        'paginationRequest.position':1    
    };


  passDataLOV: any = {
    tableData: [],
    tHeader:["Policy No", "Expiry Date", "Ceding Company", "Insured", "Risk"],  
    sortKeys : ['POLICY_NO','EXPIRY_DATE','CEDING_NAME','INSURED_DESC','RISK_NAME'],
    dataTypes: ["text","date","text","text","text"],
    pageLength: 10,
    resizable: [false,false,false,false],
    tableOnly: false,
    keys: ['policyNo','expiryDate','cedingName','insuredDesc','riskName'],
    pageStatus: true,
    pagination: true,
    filters: [
      {
          key: 'policyNo',
          title: 'Policy No.',
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
          key: 'expiryDate',
          title: 'Expiry Date',
          dataType: 'datespan'
      },
    ],
    pageID: 'renewExpPolLOV'
  }

  fromLOV: boolean = false;
  doneCheck: boolean = false;

  constructor(private underwritingService: UnderwritingService, private router: Router,
   public modalService: NgbModal, private titleService: Title, private cs: ClaimsService, private ns: NotesService) { }


  ngOnInit() {
    this.getPolListing();
  }


  fromHoldCover() {
    this.fromQuotation = false;
  }

  fromQuotationList() {
    this.fromQuotation = true;
  }

  navigateToGenInfo() {
    var pLine = this.policyLine.toUpperCase();

    if (pLine === 'CAR' ||
      pLine === 'EAR' ||
      pLine === 'EEI' ||
      pLine === 'CEC' ||
      pLine === 'MBI' ||
      pLine === 'BPV' ||
      pLine === 'MLP' ||
      pLine === 'DOS') {
      console.log(this.policyLine);
      //this.router.navigate(['/policy-issuance-alt', { line: pLine }], { skipLocationChange: true });
    }
  }

  getPolListing(param?) {
    if(param!=undefined){
      this.passDataLOV.filters[0].search = param[0].search;
      this.passDataLOV.filters[0].enabled =true;
      this.searchParams.policyNo = param[0].search;
      this.passDataLOV.p = 1;

      this.searchParams['paginationRequest.count']=10;
      this.searchParams['paginationRequest.position']=1;  
    }

    this.underwritingService.newGetParListing(this.searchParams).subscribe(data => {
      var polList = data['policyList'];

      polList = polList.filter(p => p.statusDesc.toUpperCase() === 'IN FORCE') //&& p.altNo == 0
                       .map(p => { p.riskName = p.project.riskName; return p; });

      this.passDataLOV.count = data['length'];                 
      this.lovTable.placeData(polList);

      if(param !== undefined) {
        if(polList.length === 1 && this.polNo.length == 6 && !this.searchArr.includes('%%')) {  
          this.selected = polList[0];

          var pNo = this.selected.policyNo.split('-');
          pNo[pNo.length-1] = '%';
          this.cs.getClaimsListing([{ key: 'policyNo', search: pNo.join('-') }]).subscribe(data => {
            if(data['claimsList'].length > 0) {
              this.warningMsg = 3;
              this.showWarningMdl();
            }

            this.doneCheck = true;

            if(!this.fromLOV) {
              this.setDetails();
            } else {
              this.fromLOV = false;
            }
          });
        } else if(polList.length === 0 && this.polNo.length == 6 && !this.searchArr.includes('%%')) {
          this.clearFields();
          this.getPolListing();
          this.showLOV();
        } else if(this.searchArr.includes('%%')) {     
          this.cedingName = '';
          this.expiryDate = '';
          this.insuredDesc = '';
          this.riskName = '';
          this.selected = null;
        }
      }
    });    
  }

  showLOV() {
    $('#altPolLovMdl > #modalBtn').trigger('click');
  }

  onRowClick(event) {    
    if(Object.entries(event).length === 0 && event.constructor === Object){
      this.selected = null;
    } else {
      this.selected = event;
    }    
  }

  setDetails(fromMdl?) {
    if(this.selected != null) {
      this.polNo = this.selected.policyNo.split('-');
      this.cedingName = this.selected.cedingName;
      this.expiryDate = this.ns.toDateTimeString(this.selected.expiryDate);
      this.insuredDesc = this.selected.insuredDesc;
      this.riskName = this.selected.riskName;

      if(fromMdl !== undefined) {
        this.fromLOV = true;
        this.searchArr = this.polNo.map((a, i) => {
          return (i == 0) ? a + '%' : (i == this.polNo.length - 1) ? '%' + a : '%' + a + '%';
        });

        this.search('forceSearch',{ target: { value: '' } });
      }
    }
  }

  search(key,ev) {
    this.selected = null;
    // if(!this.searchArr.includes('%%')) {
    //   this.selected = null;
    // }

    var a = ev.target.value;

    if(key === 'lineCd') {
      this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
    } else if(key === 'year') {
      this.searchArr[1] = '%' + a + '%';
    } else if(key === 'seqNo') {
      this.searchArr[2] = '%' + a + '%';
    } else if(key === 'cedingId') {
      this.searchArr[3] = a === '' ? '%%' : '%' + a.padStart(3, '0') + '%';
    } else if(key === 'coSeriesNo') {
      this.searchArr[4] = '%' + a + '%';
    } else if(key === 'altNo') {
      this.searchArr[5] = a === '' ? '%%' : '%' + a;
    }

    if(this.searchArr.includes('')) {
      this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
    }
    
    this.getPolListing([{ key: 'policyNo', search: this.searchArr.join('-') }]);
  }

  clearFields() {
    this.searchArr = Array(6).fill('');
    this.polNo = Array(6).fill('');
    this.cedingName = '';
    this.insuredDesc = '';
    this.riskName = '';
    this.selected = null;

    this.getPolListing();
  }

  renewPolicy() {
    this.loading = true;
    this.warningMsg = null;
    console.log(this.selected)

    var renewParam:any = {
      policyId : this.selected.policyId,
      procBy : this.ns.getCurrentUser()
    };
    this.underwritingService.extGenRenExpPolicy(renewParam).subscribe(data => {
      console.log(data);

      /*for (var i = 0; i < event.target.closest("tr").children.length; i++) {
        this.uwService.rowData[i] = event.target.closest("tr").children[i].innerText;
        }

        for(let rec of this.fetchedData){
              if(rec.policyNo === this.uwService.rowData[0]) {
                this.policyId = rec.policyId;
                this.statusDesc = rec.statusDesc;
                this.riskName = rec.project.riskName;
                this.insuredDesc = rec.insuredDesc;
                this.quoteId = rec.quoteId;
                this.quotationNo = rec.quotationNo;
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
        
        });*/

      this.loading = false;
    });
  }

  showWarningMdl() {
    this.searchParams = {
        statusArr:['2'],
        'paginationRequest.count':10,
        'paginationRequest.position':1,   
        altNo:0        
    }
    $('#altWarningModal > #modalBtn').trigger('click');
  }

  pad(ev,num) {
    var str = ev.target.value;    

    return str === '' ? '' : String(str).padStart(num, '0');
  }

  searchQuery(searchParams){
      for(let key of Object.keys(searchParams)){
          this.searchParams[key] = searchParams[key]
      }
      this.getPolListing();
    }
}
