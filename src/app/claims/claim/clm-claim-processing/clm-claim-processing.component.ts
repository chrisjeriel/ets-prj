import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ClaimsService, UnderwritingService, MaintenanceService, NotesService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';

@Component({
  selector: 'app-clm-claim-processing',
  templateUrl: './clm-claim-processing.component.html',
  styleUrls: ['./clm-claim-processing.component.css']
})
export class ClmClaimProcessingComponent implements OnInit {
  @ViewChild('mainTable') table : CustNonDatatableComponent;
  @ViewChild('polListTbl') polListTbl : CustNonDatatableComponent;
  @ViewChild('add') addModal : ModalComponent;
  @ViewChild('polList') polListModal : ModalComponent;
  @ViewChild('riskLOV') riskLOV: MtnRiskComponent;

  passData: any = {
    tableData: [],
    tHeader: ['Claim No', 'Status', 'Policy No', 'Ceding Company', 'Insured', 'Risk', 'Loss Date', 'Loss Details', 'Currency', 'Total Reserve', 'Total Payments', 'Adjusters', 'Processed By'],
    dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'date', 'text','text', 'currency', 'currency', 'text', 'text'],
    keys: ['claimNo', 'clmStatus', 'policyNo', 'cedingName', 'insuredDesc', 'riskName', 'lossDate', 'lossDtl', 'currencyCd', 'totalLossExpRes', 'totalLossExpPd', 'adjName', 'processedBy'],
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
            key: 'cedingName',
            title:'Ceding Name',
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
            key: 'processedBy',
            title:'Processed By',
            dataType: 'text'
        },
    ],
  };

  policyListingData: any = {
    tableData: [],
    tHeader: ['Policy No', 'Ceding Company', 'Insured', 'Risk'],
    dataTypes: ['text', 'text', 'text', 'text'],
    keys: ['policyNo', 'cedingName', 'insuredDesc', 'riskName'],
    pageID: 'polList',
    pagination: true,
    pageStatus: true,
    pageLength: 10
  }

  searchParams: any[] = [];
  tempPolNo: string[] = ['','','','','',''];

  selected: any;
  selectedPolicyRow: any;

  noDataFound: boolean = false;
  isType: boolean = false;
  isIncomplete: boolean = true;
  loading: boolean = false;
  isFromRisk: boolean = false;

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

  constructor(private titleService: Title, private modalService: NgbModal, private router: Router, 
              private cs : ClaimsService, private us : UnderwritingService, private ms : MaintenanceService,
              private ns : NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Claim Processing");
    this.retrieveClaimsList();
  }

  retrieveClaimsList(){
    this.cs.getClaimsListing(this.searchParams).subscribe((data : any)=>{
      if(data != null){
        for(var i of data.claimsList){
          for(var j of i.clmAdjusterList){
            if(i.adjName === undefined){
              i.adjName = j.adjName;
            }else{
              i.adjName = i.adjName + '/' + j.adjName;
            }
          }
          this.passData.tableData.push(i);
        }
        this.table.refreshTable();
      }
    });
  }

  navigateToGenInfo() {
    // TEMPORARY
    this.modalService.dismissAll();
    this.router.navigate(['/claims-claim', { line: this.polLine.toUpperCase() }], { skipLocationChange: true });
  }

  openPolLOV(){
    this.isType = false;
    this.retrievePolList();
    this.polListModal.openNoClose();
  }

  openRiskLOV(){
    this.isType = false;
    this.riskLOV.modal.openNoClose();
  }

  retrievePolList(){
    this.polListTbl.loadingFlag = true;
    this.policyListingData.tableData = [];
    this.us.getParListing([{key: 'statusDesc', search: 'IN FORCE'}, 
                           {key: 'policyNo', search: this.noDataFound || this.isFromRisk ? '' : this.tempPolNo.join('%-%')},
                           {key: 'riskName', search: !this.isFromRisk ? '' : String(this.policyDetails.riskName).toUpperCase()}]).subscribe((data: any)=>{
      //this.clearAddFields();
      if(data.policyList.length !== 0){
        this.noDataFound = false;
        for(var i of data.policyList){
          i.riskName = i.project.riskName;
          this.policyListingData.tableData.push(i);        
        }
        this.policyListingData.tableData = this.policyListingData.tableData.filter(a=>{return a.distStatDesc === 'P'}); //retrieve pol no with dist status of P (posted)
        this.polListTbl.refreshTable();
        this.polListTbl.loadingFlag = false;
        this.loading = false;
        if(this.isType && this.policyListingData.tableData.length === 0){
          this.noDataFound = true;
          this.openPolLOV();
          //this.polListTbl.loadingFlag = false;
        }else if(this.isType && this.policyListingData.tableData.length > 0){
          if(this.isFromRisk && this.policyListingData.tableData.length > 1){
            this.openPolLOV();
          }else if(this.isFromRisk && this.policyListingData.tableData.length === 1){
            this.setPolicyDetails(this.policyListingData.tableData[0].policyId, this.policyListingData.tableData[0].policyNo);
            this.isFromRisk = false;
          }else{
            this.setPolicyDetails(this.policyListingData.tableData[0].policyId, this.policyListingData.tableData[0].policyNo);
          }
        }
      }else{
        this.noDataFound = true;
        this.isFromRisk = false;
        this.openPolLOV();
        //this.polListTbl.loadingFlag = false;
      }
    },
    (error)=>{
      this.polListTbl.loadingFlag = false;
    });
  }

  setPolicyDetails(policyId, policyNo){
    this.loading = true;
    this.isType = false;
    this.isFromRisk = false;
    this.us.getPolGenInfo(policyId, policyNo).subscribe((data: any)=>{
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
        this.searchParams = searchParams;
        this.passData.tableData = [];
        //this.passData.btnDisabled = true;
        this.retrieveClaimsList();

   }

   policyNoChecker(event, key){
     this.isType = true;
     if(event.target.value.length === 0){
         this.isIncomplete = true;
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
                 break;
             }else{
                 this.isIncomplete = false;
             }
         }
     }

     if(!this.isIncomplete){
         //this.getQuoteListing();
         this.retrievePolList();
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
   }

   setRisks(data){
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
}
