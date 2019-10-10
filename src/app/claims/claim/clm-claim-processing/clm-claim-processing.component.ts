import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ClaimsService, UnderwritingService, MaintenanceService, NotesService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';

@Component({
  selector: 'app-clm-claim-processing',
  templateUrl: './clm-claim-processing.component.html',
  styleUrls: ['./clm-claim-processing.component.css']
})
export class ClmClaimProcessingComponent implements OnInit, OnDestroy {
  @ViewChild('mainTable') table : LoadingTableComponent;
  @ViewChild('polListTbl') polListTbl : CustNonDatatableComponent;
  @ViewChild('add') addModal : ModalComponent;
  @ViewChild('polList') polListModal : ModalComponent;
  @ViewChild('riskLOV') riskLOV: MtnRiskComponent;
  @ViewChild('clmProcessingMdl') clmProcessingMdl: ModalComponent;
  @ViewChild('LOVTbl') LOVTbl : CustNonDatatableComponent;

  passData: any = {
    tableData: [],
    tHeader: ['Claim No', 'Status', 'Policy No', 'Ceding Company', 'Insured', 'Risk', 'Loss Date','Loss Cause' ,'Loss Details', 'Currency', 'Total Reserve', 'Total Payments', 'Adjusters', 'Processed By','Report Date'],
    dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'date','text', 'text','text', 'currency', 'currency', 'text', 'text','date'],
    sortKeys : ['CLAIM_NO','CLM_STATUS','POLICY_NO','CEDING_NAME','INSURED_DESC','RISK_NAME','LOSS_DATE','LOSS_ABBR','LOSS_DTL','CURRENCY_CD','T_LOSS_EXP_RES','T_LOSS_EXP_PD','ADJ_NAME','PROCESSED_BY','REPORT_DATE'],
    keys: ['claimNo', 'clmStatus', 'policyNo', 'cedingName', 'insuredDesc', 'riskName', 'lossDate','lossAbbr', 'lossDtl', 'currencyCd', 'totalLossExpRes', 'totalLossExpPd', 'adjName', 'processedBy','reportDate'],
    addFlag: true,
    editFlag: true,
    pagination: true,
    pageStatus: true,
    searchFlag: true,
    pageLength: 20,
    filters: [
       {
            key: 'claimNo',
            title:'Claim No.',
            dataType: 'text'
        },
        {
            key: 'clmStatus',
            title:'Status',
            dataType: 'text'
        },
        {
            key: 'policyNo',
            title:'Policy No.',
            dataType: 'text'
        },
        {
            key: 'cedingName',
            title:'Ceding Company',
            dataType: 'text'
        },
        {
            key: 'insuredDesc',
            title:'Insured',
            dataType: 'text'
        },
        {
            key: 'riskName',
            title:'Risk',
            dataType: 'text'
        },
        {
             keys: {
                  from: 'lossDateFrom',
                  to: 'lossDateTo'
              },
              title: 'Loss Date',
              dataType: 'datespan'
        },
        {
            key: 'currencyCd',
            title:'Currency',
            dataType: 'text'
        },
        {
             keys: {
                  from: 'totalResFrom',
                  to: 'totalResTo'
              },
              title: 'Total Reserve',
              dataType: 'textspan'
        },
        {
             keys: {
                  from: 'totalPaytFrom',
                  to: 'totalPaytTo'
              },
              title: 'Total Payment',
              dataType: 'textspan'
        },
        {
            key: 'adjName',
            title:'Adjuster',
            dataType: 'text'
        },
        {
            key: 'processedBy',
            title:'Processed By',
            dataType: 'text'
        }
    ],
  };

  passDataLOVTbl: any = {
    tableData: [],
    tHeader: ['Claim No', 'Loss Date','Loss Cause','Loss Details' ,'Currency', 'Total Reserve', 'Total Payments','Report Date'],
    dataTypes: ['text', 'date', 'text', 'text', 'text', 'currency', 'currency','date'],
    keys: ['claimNo', 'lossDate','lossAbbr','lossDtl', 'currencyCd', 'totalLossExpRes', 'totalLossExpPd','reportDate'],
    colSize: ['90px','70px','120px','120px','49px','110px','110px','70px'],
    addFlag: false,
    editFlag: false,
    pagination: true,
    pageStatus: true,
    searchFlag: true,
    pageLength: 10,
    pageID: 'passDataLOVTbl',
    filters: [
       {
            key: 'claimNo',
            title:'Claim No.',
            dataType: 'text'
        },
        {
             keys: {
                  from: 'lossDateFrom',
                  to: 'lossDateTo'
              },
              title: 'Loss Date',
              dataType: 'datespan'
        },
        {
            key: 'currencyCd',
            title:'Currency',
            dataType: 'text'
        },
        {
             keys: {
                  from: 'totalResFrom',
                  to: 'totalResTo'
              },
              title: 'Total Reserve',
              dataType: 'textspan'
        },
        {
             keys: {
                  from: 'totalPaytFrom',
                  to: 'totalPaytTo'
              },
              title: 'Total Payment',
              dataType: 'textspan'
        }
    ],
  };

  policyListingData: any = {
    tableData: [],
    tHeader: ['Policy No', 'Ceding Company', 'Insured', 'Risk'],
    sortKeys : ['POLICY_NO','CEDING_NAME','INSURED_DESC','RISK_NAME'],
    dataTypes: ['text', 'text', 'text', 'text'],
    keys: ['policyNo', 'cedingName', 'insuredDesc', 'riskName'],
    pageID: 'polList',
    pagination: true,
    pageStatus: true,
    pageLength: 10
  }

  searchParams: any = {
        'paginationRequest.count':20,
        'paginationRequest.position':1,   
    };

  tempPolNo: string[] = ['','','','','','000'];

  selected: any;
  selectedPolicyRow: any;

  noDataFound: boolean = false;
  isType: boolean = false;
  isIncomplete: boolean = true;
  loading: boolean = false;
  isFromRisk: boolean = false;
  disableRisk: boolean = false;

  policyDetails: any = {
    policyId: '',
    policyNo: '',
    cessionId: '',
    cessionDesc: '',
    cedingId: '',
    cedingName: '',
    insuredDesc: '',
    riskId: '',
    riskName: '',
    regionDesc: '',
    provinceDesc: '',
    cityDesc: '',
    districtDesc: '',
    blockDesc: ''
  }

  selectedLOVTbl: any = null;
  searchParamsLOVTbl: any[] = [];
  refPolNo: string = null;
  subscription: Subscription = new Subscription();

  constructor(private titleService: Title, private modalService: NgbModal, private router: Router, 
              private cs : ClaimsService, private us : UnderwritingService, private ms : MaintenanceService,
              private ns : NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim Processing");
    this.retrieveClaimsList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  retrieveClaimsList(){
    this.cs.newGetClaimsListing(this.searchParams).subscribe((data : any)=>{
      if(data != null){
        this.passData.count = data['length'];
        //data.claimsList = data.claimsList.filter(a=>{return a.clmStatCd !== 'TC' && a.clmStatCd !== 'CD' && (a.lossStatCd !== 'CD')});
        for(var i of data.claimsList){
          for(var j of i.clmAdjusterList){
            if(i.adjName === null){
              i.adjName = j.adjName;
            }else{
              i.adjName = i.adjName + '/' + j.adjName;
            }
          }
        }
        this.table.placeData(data.claimsList);
      }
    },
    (error)=>{
      
    });
  }

  openPolLOV(lovBtn?){
    this.isType = false;
    this.retrievePolList(lovBtn);
    this.polListModal.openNoClose();
  }

  openRiskLOV(){
    this.isType = false;
    this.riskLOV.modal.openNoClose();
  }

  retrievePolList(lovBtn?){
    console.log(this.noDataFound);
    console.log(this.tempPolNo);
    console.log(this.policyDetails.riskName);
    this.polListTbl.overlayLoader = true;
    this.policyListingData.tableData = [];
    this.us.getParListing([/*{key: 'statusDesc', search: 'IN FORCE'},*/ 
                           {key: 'statusArr' , search : ['3','2']},
                           {key: 'altNo' , search:'0'},
                           {key: 'policyNo', search: (this.noDataFound || this.isFromRisk) && lovBtn === undefined ? '' : this.tempPolNo.join('%-%')},
                           {key: 'riskName', search: !this.isFromRisk ? '' : String(this.policyDetails.riskName).toUpperCase()}]).subscribe((data: any)=>{
      //this.clearAddFields();
      console.log(data.policyList.length);
      if(data.policyList.length !== 0){
        this.noDataFound = false;
        for(var i of data.policyList){
          i.riskName = i.project.riskName;
          this.policyListingData.tableData.push(i);        
        }
        //this.policyListingData.tableData = this.policyListingData.tableData.filter(a=>{return a.distStatDesc === 'P'}); //retrieve pol no with dist status of P (posted)
        this.policyListingData.tableData = this.policyListingData.tableData.filter(a=>{return 'IN FORCE' === a.statusDesc.toUpperCase() || 'EXPIRED' === a.statusDesc.toUpperCase() }); //retrieve pol no with status of In Force and Expired
        this.polListTbl.refreshTable();
        this.polListTbl.overlayLoader = false;
        this.loading = false;
        if(this.isType && this.policyListingData.tableData.length === 0){
          this.noDataFound = true;
          this.openPolLOV();
          console.log(1);
          //this.polListTbl.overlayLoader = false;
        }else if(this.isType && this.policyListingData.tableData.length > 0){
          if(this.isFromRisk && this.policyListingData.tableData.length > 1){
            this.openPolLOV();
            console.log(2);
          }else if(this.isFromRisk && this.policyListingData.tableData.length === 1){
            this.setPolicyDetails(this.policyListingData.tableData[0].policyId, this.policyListingData.tableData[0].policyNo);
            this.isFromRisk = false;
            console.log(3);
          }else{
            this.setPolicyDetails(this.policyListingData.tableData[0].policyId, this.policyListingData.tableData[0].policyNo);
            console.log(4);
          }
        }
      }else{
        this.noDataFound = true;
        //this.isFromRisk = false;
        console.log(5);

        if(this.isFromRisk){
          setTimeout(()=>{
            if(this.polListModal.modalRef !== undefined){
              this.polListModal.closeModal();
            }
            this.polListModal.openNoClose();
          },0);
          this.polListTbl.refreshTable();
          this.polListTbl.overlayLoader = false;
          console.log(6);
        }else{
          if(lovBtn === undefined || this.isType ){
            setTimeout(()=>{this.openPolLOV();},0)
          }else{
            this.polListTbl.refreshTable();
            this.polListTbl.overlayLoader = false;
          }
        }
      }
    },
    (error)=>{
      this.polListTbl.overlayLoader = false;
    });
  }

  setPolicyDetails(policyId, policyNo){
    this.loading = true;
    this.isType = false;
    this.isFromRisk = false;

    var sub$ = forkJoin(this.us.getPolGenInfo(policyId, policyNo),
                        this.cs.getClaimsListing([{ key: 'policyNo', search: policyNo }])).pipe(map(([polGI, clmList]) => { return { polGI, clmList }; }));

    /*this.us.getPolGenInfo(policyId, policyNo).subscribe((data: any)=>{
      this.policyDetails.policyId = data.policy.policyId;
      this.policyDetails.policyNo = data.policy.policyNo;
      this.tempPolNo = this.policyDetails.policyNo.split('-');
      this.policyDetails.cessionId = data.policy.cessionId;
      this.policyDetails.cessionDesc = data.policy.cessionDesc;
      this.policyDetails.cedingId = data.policy.cedingId;
      this.policyDetails.cedingName = data.policy.cedingName;
      this.policyDetails.insuredDesc = data.policy.insuredDesc;
      this.policyDetails.riskId = data.policy.project.riskId;
      this.policyDetails.riskName = data.policy.project.riskName;
      this.policyDetails.regionDesc = data.policy.project.regionDesc;
      this.policyDetails.provinceDesc = data.policy.project.provinceDesc;
      this.policyDetails.cityDesc = data.policy.project.cityDesc;
      this.policyDetails.districtDesc = data.policy.project.districtDesc;
      this.policyDetails.blockDesc = data.policy.project.blockDesc;
      this.loading = false;
      this.disableRisk = true;
    },
    (error)=>{
      this.loading = false;
    });*/

    this.subscription = sub$.subscribe(data => {
      var pol = data['polGI']['policy'];
      var clmList = data['clmList']['claimsList'];

      this.refPolNo = pol.policyNo;
      this.policyDetails.policyId = pol.policyId;
      this.policyDetails.policyNo = pol.policyNo;
      this.tempPolNo = this.policyDetails.policyNo.split('-');
      this.policyDetails.cessionId = pol.cessionId;
      this.policyDetails.cessionDesc = pol.cessionDesc;
      this.policyDetails.cedingId = pol.cedingId;
      this.policyDetails.cedingName = pol.cedingName;
      this.policyDetails.insuredDesc = pol.insuredDesc;
      this.policyDetails.riskId = pol.project.riskId;
      this.policyDetails.riskName = pol.project.riskName;
      this.policyDetails.regionDesc = pol.project.regionDesc;
      this.policyDetails.provinceDesc = pol.project.provinceDesc;
      this.policyDetails.cityDesc = pol.project.cityDesc;
      this.policyDetails.districtDesc = pol.project.districtDesc;
      this.policyDetails.blockDesc = pol.project.blockDesc;
      this.loading = false;
      this.disableRisk = true;

      this.LOVTbl.overlayLoader = true;
      if(clmList.length > 0) {
        this.passDataLOVTbl.tableData = clmList.map(a => {
                                                           a.createDate = this.ns.toDateTimeString(a.createDate);
                                                           a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                                           return a;
                                                         });
        this.clmProcessingMdl.openNoClose();
        setTimeout(() => { this.LOVTbl.refreshTable(); });
      }
    },
    (error)=>{
      this.loading = false;
    });
  }

  navigateToGenInfo() {  
    this.router.navigate(
                    ['/claims-claim', {
                        from: 'add',
                        policyId: this.policyDetails.policyId,
                        policyNo: this.policyDetails.policyNo,
                        cessionId: this.policyDetails.cessionId,
                        cessionDesc: this.policyDetails.cessionDesc,
                        line: this.policyDetails.policyNo.split('-')[0],
                        exitLink: 'clm-claim-processing'
                    }],
                    { skipLocationChange: true }
      );
  }

  polListRowClick(data){
    this.selectedPolicyRow = data;
  }

  onRowClick(data){
    if((data !== null && Object.keys(data).length !== 0)){
      this.selected = data;
      this.passData.btnDisabled = false;
    }else{
      this.passData.btnDisabled = true;
    }
  }

  onClickAdd(event) {
    this.addModal.openNoClose();
  }

  onClickEdit(event){
    let line = this.selected.policyNo.split('-')[0];
    this.router.navigate(
                    ['/claims-claim', {
                        from: 'edit',
                        claimId: this.selected.claimId,
                        claimNo: this.selected.claimNo,
                        line: line,
                        exitLink: 'clm-claim-processing'
                    }],
                    { skipLocationChange: true }
      );
  }

  searchQuery(searchParams){
        for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }
        this.passData.btnDisabled = true;
        this.retrieveClaimsList();

   }

   policyNoChecker(event, key){
     this.isType = true;
     if(event.target.value.length === 0){
         this.isIncomplete = true;
         this.disableRisk = false;
         this.clearAddFields();
     }else{
         if(key === 'seqNo'){
             this.tempPolNo[2] = String(this.tempPolNo[2]).padStart(5, '0');
         }else if(key === 'cedingId'){
             this.tempPolNo[3] = String(this.tempPolNo[3]).padStart(3, '0');
         }else if(key ==='coSeriesNo'){
             this.tempPolNo[4] = String(this.tempPolNo[4]).padStart(4, '0');
         }else if(key ==='altNo'){
             this.tempPolNo[5] = String(this.tempPolNo[5]).padStart(3, '0');
         }else if(key === 'line'){
             this.tempPolNo[0] = String(this.tempPolNo[0]).toUpperCase();
         }
         for(var i of this.tempPolNo){
             if(i.length === 0){
                 this.isIncomplete = true;
                 this.disableRisk = false;
                 break;
             }else{
                 this.isIncomplete = false;
             }
         }
     }
     console.log(this.isIncomplete);
     if(!this.isIncomplete){
         //this.getQuoteListing();
         this.retrievePolList('lovBtn');
     }
   }

   clearAddFields(exception?){
     this.policyDetails = {
       policyId: '',
       policyNo: '',
       cedingId: '',
       cedingName: '',
       insuredDesc: '',
       riskId: '',
       riskName: '',
       regionDesc: '',
       provinceDesc: '',
       cityDesc: '',
       districtDesc: '',
       blockDesc: ''
     }
     this.isType = false;
     this.isFromRisk = false;
     this.disableRisk = false;
   }

   setRisks(data){
     console.log(data)
        this.policyDetails.riskId = String(data.riskId).padStart(3, '0');
        this.policyDetails.riskName = data.riskName;
        this.ns.lovLoader(data.ev, 0);
        this.isFromRisk = true;
        if(data.riskId.length !== 0 || data.riskName.length !== 0){
          //this.tempPolNo = ['','','','','',''];
          this.retrievePolList();
        }
    }

    checkCode(ev, field){
        this.isType = true;
        //this.loading = true;
        this.ns.lovLoader(ev, 1);
        if(field === 'risk') {
            this.riskLOV.checkCode(this.policyDetails.riskId, '#riskLOV', ev);
        }
    }

    onRowClickLOVTbl(data){
      if(data === null || (data !== null && Object.keys(data).length !== 0)){
        this.selectedLOVTbl = data
      } else {
        this.selectedLOVTbl = null;
      }
    }

    onClickViewLOVTbl(event) {
      // this.clmProcessingMdl.closeModal();
      this.modalService.dismissAll();
      let line = this.selectedLOVTbl.policyNo.split('-')[0];
      this.router.navigate(
                      ['/claims-claim', {
                          from: 'edit',
                          claimId: this.selectedLOVTbl.claimId,
                          claimNo: this.selectedLOVTbl.claimNo,
                          line: line,
                          exitLink: 'clm-claim-processing'
                      }],
                      { skipLocationChange: true }
        );
    }

    searchQueryLOVTbl(searchParams){
        this.searchParamsLOVTbl = searchParams;
        this.searchParamsLOVTbl.push({ key: 'policyNo', search: this.refPolNo });
        /*this.searchParamsLOVTbl.forEach(a => {
          if(a.key == 'policyNo') {
            a.search = this.refPolNo;
          }
        });*/
        this.passDataLOVTbl.tableData = [];
        // this.retrieveClaimsList();
        console.log(this.searchParamsLOVTbl);
        this.cs.getClaimsListing(this.searchParamsLOVTbl).subscribe(data => {
          this.passDataLOVTbl.tableData = data['claimsList'].map(a => {
                                                                        a.createDate = this.ns.toDateTimeString(a.createDate);
                                                                        a.updateDate = this.ns.toDateTimeString(a.updateDate);
                                                                        return a;
                                                                      });
          this.LOVTbl.refreshTable();
        });
   }
}
