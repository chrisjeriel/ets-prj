import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { UnderwritingService, ClaimsService, MaintenanceService, NotesService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-clm-change-claim-status',
  templateUrl: './clm-change-claim-status.component.html',
  styleUrls: ['./clm-change-claim-status.component.css']
})
export class ClmChangeClaimStatusComponent implements OnInit, AfterViewInit {


  @ViewChild('queryMdl') queryModal : ModalComponent;
  @ViewChild('clmListMdl') clmListModal : ModalComponent;
  @ViewChild('polListMdl') polListModal : ModalComponent;
  @ViewChild('reasonMdl') reasonModal : ModalComponent;
  @ViewChild('successDiagSave') successDiag: SucessDialogComponent;

  @ViewChild(MtnTypeOfCessionComponent) cessionModal: MtnTypeOfCessionComponent;
  @ViewChild(MtnRiskComponent) riskModal: MtnRiskComponent;
  @ViewChild(CedingCompanyComponent) cedCoModal: CedingCompanyComponent;

  @ViewChild('clmListTable') clmListTable : CustNonDatatableComponent;
  @ViewChild('polListTable') polListTable : CustNonDatatableComponent;
  @ViewChild('queryTbl') queryTable : CustNonDatatableComponent;
  @ViewChild('reasonListTable') reasonTable : CustNonDatatableComponent;

  queryData: any = {
    tableData: [],
    tHeader: ['Claim No', 'Status', 'Policy No', 'Ceding Company', 'Insured'],
    dataTypes: ['text', 'text', 'text', 'text', 'text'],
    keys: ['claimNo', 'clmStatus', 'policyNo', 'cedingName', 'insuredDesc'],
    uneditable: [true,true,true,true,true],
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    pageLength: 10,
    checkFlag: true,
    pageID: 'queryTable'
  };

  clmListData: any = {
    tableData: [],
    tHeader: ['Claim No', 'Status', 'Policy No', 'Ceding Company', 'Insured'],
    dataTypes: ['text', 'text', 'text', 'text', 'text'],
    keys: ['claimNo', 'clmStatus', 'policyNo', 'cedingName', 'insuredDesc'],
    pagination: true,
    pageStatus: true,
    pageLength: 10,
    pageID: 'clmListTable'
  };

  polListData: any = {
    tableData: [],
    tHeader: ['Policy No.', 'Ceding Company', 'Insured', 'Risk'],
    dataTypes: ['text', 'text', 'text', 'text'],
    pageLength: 10,
    pagination: true,
    pageStatus: true,
    keys: ['policyNo','cedingName', 'insuredDesc', 'riskName'],
    pageID: 'polListData'
  }

  reasonData: any = {
    tableData: [],
    tHeader: ['Reason Code', 'Description'],
    dataTypes: ['text', 'text'],
    pageLength: 10,
    pagination: true,
    pageStatus: true,
    keys: ['reasonCd','description'],
    pageID: 'reasonData'
  }

  batchOption: string = 'IP';
  dialogIcon: string = '';
  dialogMessage: string = '';
  reasonCd: string = '';
  reasonDesc: string = '';

  selectedClaim: any = {};
  selectedPolicy: any = {};
  selectedReason: any = null;

  tempClmNo: string[] = ['','',''];
  tempPolNo: string[] = ['','','','','',''];

  searchParams: any = {
    claimId: '',
    policyId: '',
    riskName:'',
    riskId: '',
    cedingName: '',
    cedingId: '',
    cessionDesc: '',
    cessionId: ''
  }

  claimDetails: any = {
    claimNo: '',
    clmStatus: '',
    policyNo: '',
    cedingName: '',
    insuredDesc: '',
    riskName: '',
    lossDate: '',
    currencyCd: '',
    lossDtl: '',
    totalLossExpRes: '',
    totalLossExpPd: '',
    adjName: '',
    processedBy: '',
    reasonCd: '',
    reasonDesc: ''
  }

  processBtnDisabled: boolean = true;
  claimNoDataFound: boolean = false;
  polNoDataFound: boolean = false;
  claimNoIsType: boolean = false;
  claimNoIsIncomplete: boolean = true;

  constructor(private titleService: Title, private modalService: NgbModal, private us: UnderwritingService,
              private cs: ClaimsService, private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Change Claim Status");
    setTimeout(()=>{$('#searchBtn').trigger('click');},0);
  }

  ngAfterViewInit(){
    setTimeout(()=>{
        this.processBtnDisabled = false;
    });
  }

  search(event) {
    this.queryModal.openNoClose();
  }

  openClmListing(){
    this.retrieveClaimList();
    this.clmListModal.openNoClose();
  }

  openPolListing(){
    this.retrievePolList();
    this.polListModal.openNoClose();
  }

  openRiskLOV() {
      this.riskModal.modal.openNoClose();
  }

  openCedingCompanyLOV() {
      this.cedCoModal.modal.openNoClose();
  }

  openTypeOfCessionLOV(){
      this.cessionModal.modal.openNoClose();
  }

  openReasonLOV(){
    this.reasonTable.loadingFlag = true;
    this.ms.getMtnClaimReason(null,this.batchOption, 'Y').subscribe(
       (data:any)=>{
         this.reasonData.tableData = data.clmReasonList;
         this.reasonTable.refreshTable();
         this.reasonTable.loadingFlag = false;
       },
       (error:any)=>{
         this.reasonTable.loadingFlag = false;
       }
    );
    this.reasonModal.openNoClose();
  }

  retrieveClaimList(){
    this.clmListTable.loadingFlag = true;
    this.cs.getClaimsListing([
                                {key: 'policyNo', search: Object.keys(this.selectedPolicy).length === 0 || this.claimNoDataFound ? '' : this.selectedPolicy.policyNo},
                                {key: 'claimNo', search: this.claimNoDataFound ? '' : this.tempClmNo.join('%-%')}
                             ]).subscribe(
      (data:any)=>{
        if(data.claimsList.length !== 0){
          this.claimNoDataFound = false;
          this.clmListData.tableData = data.claimsList;
          this.clmListTable.refreshTable();
          if(this.claimNoIsType){
            this.selectedClaim = this.clmListData.tableData[0];
            this.setClaim();
          }
          this.clmListTable.loadingFlag = false;
        }else{
          this.claimNoDataFound = true;
          console.log('yeet');
          if(this.claimNoIsType){
            this.claimNoIsType = false;
            this.openClmListing();
          }
        }
      },
      (error: any)=>{
        this.clmListTable.loadingFlag = false;
      }
    );
  }

  retrievePolList(){
    this.polListTable.loadingFlag = true;
    this.us.getParListing([
                            {key: 'policyNo', search: this.tempPolNo.join('%-%')},
                            {key: 'cessionDesc', search: this.searchParams.cessionDesc.toUpperCase()},
                            {key: 'cedingName', search: this.searchParams.cedingName.toUpperCase()},
                            {key: 'riskName', search: this.searchParams.riskName.toUpperCase()}
                          ]).subscribe(
      (data: any)=>{
        this.polListData.tableData = [];
        for(var i of data.policyList){
          i.riskName = i.project.riskName;
          this.polListData.tableData.push(i);
        }
        this.polListTable.refreshTable();
        this.polListTable.loadingFlag = false;
      },
      (error: any)=>{
        this.polListTable.loadingFlag = false;
      }
    );
  }

  retrieveQueryList(){
    this.queryTable.loadingFlag = true;
    this.queryData.tableData = [];
    this.cs.getChangeClaimStatus(this.searchParams).subscribe(
       (data: any)=>{
         console.log(data);
         if(data.claimList.length !== 0){
           for(var i of data.claimList){
             for(var j of i.clmAdjusterList){
               if(i.adjName === undefined){
                 i.adjName = j.adjName;
               }else{
                 i.adjName = i.adjName + '/' + j.adjName;
               }
             }
             this.queryData.tableData.push(i);
           }
           this.queryTable.refreshTable();
         }
         this.queryTable.loadingFlag = false;
       },
       (error: any)=>{
         this.queryTable.loadingFlag = false;
       }
    );
  }

  onRowClickQuery(data){
    if(data !== null){
      this.claimDetails = data;
    }else{
      this.clearDetails();
    }
  }

  setClaim(){
    this.claimNoIsType = false;
    this.claimNoIsIncomplete = false;
    this.tempClmNo = this.selectedClaim.claimNo.split('-');
    this.tempPolNo = this.selectedClaim.policyNo.split('-');
    this.searchParams.claimId = this.selectedClaim.claimId;
    this.selectedPolicy.policyNo = this.selectedClaim.policyNo;
    this.us.getPolGenInfo(null,this.selectedClaim.policyNo).subscribe(
      (data: any)=>{
        this.searchParams.policyId = data.policy.policyId;
        this.searchParams.cessionId = data.policy.cessionId;
        this.searchParams.cessionDesc = data.policy.cessionDesc;
        this.searchParams.cedingId = data.policy.cedingId;
        this.searchParams.cedingName = data.policy.cedingName;
        this.searchParams.riskId = data.policy.project.riskId;
        this.searchParams.riskName = data.policy.project.riskName;
      },
      (error: any)=>{

      }
    );
  }

  setPolicy(){
    this.tempPolNo = this.selectedPolicy.policyNo.split('-');
    this.searchParams.policyId = this.selectedPolicy.policyId;
    this.us.getPolGenInfo(this.selectedPolicy.policyId).subscribe(
      (data: any)=>{
        this.searchParams.cessionId = data.policy.cessionId;
        this.searchParams.cessionDesc = data.policy.cessionDesc;
        this.searchParams.cedingId = data.policy.cedingId;
        this.searchParams.cedingName = data.policy.cedingName;
        this.searchParams.riskId = data.policy.project.riskId;
        this.searchParams.riskName = data.policy.project.riskName;
      },
      (error: any)=>{

      }
    );

    this.cs.getClaimsListing([{key: 'policyNo', search: this.selectedPolicy.policyNo}]).subscribe(
      (data: any)=>{
        if(data.claimsList.length === 1){
          this.tempClmNo = data.claimsList[0].claimNo.split('-');
          this.searchParams.claimId = data.claimsList[0].claimId;
        }
      },
      (error: any)=>{
        console.log('error')
      }
    );
  }

  setRisks(data){
      this.searchParams.riskId = data.riskId;
      this.searchParams.riskName = data.riskName;
      this.ns.lovLoader(data.ev, 0);
  }

  setTypeOfCession(data) {    
      this.searchParams.cessionId = data.cessionId;
      this.searchParams.cessionDesc = data.description;
      this.ns.lovLoader(data.ev, 0);
  }

  setCedingcompany(data){
      this.searchParams.cedingId = data.cedingId;
      this.searchParams.cedingName = data.cedingName;
      this.ns.lovLoader(data.ev, 0);    
  }

  setReason(){
    this.reasonCd = this.selectedReason.reasonCd;
    this.reasonDesc = this.selectedReason.description;
  }

  checkCode(ev, field){
      this.ns.lovLoader(ev, 1);

      if(field === 'typeOfCession'){
          this.cessionModal.checkCode(this.searchParams.cessionId, ev);
      } else if(field === 'risk') {
          this.riskModal.checkCode(this.searchParams.riskId, '#riskLOV', ev);
      } else if(field === 'cedingCo') {
          this.cedCoModal.checkCode(this.searchParams.cedingId === '' ? '' : String(this.searchParams.cedingId).padStart(3, '0'), ev, '#cedingCompanyLOV');
      } else if(field === 'reason'){
          if(this.reasonCd.trim() === ''){
            this.reasonCd = '';
            this.reasonDesc = '';
            this.ns.lovLoader(ev, 0);
            this.openReasonLOV();
          } else {
            this.ms.getMtnClaimReason(this.reasonCd,this.batchOption, 'Y').subscribe(data => {
              if(data['clmReasonList'].length > 0) {
                this.reasonCd = data['clmReasonList'][0].reasonCd;
                this.reasonDesc = data['clmReasonList'][0].description;
              } else {
                this.reasonCd = '';
                this.reasonDesc = '';
                this.openReasonLOV();
              }
               this.ns.lovLoader(ev, 0);
            });
          }
      }
  }

  checkClaim(key, event){
    this.claimNoIsType = true;
    if(event.target.value.length === 0){
      this.claimNoIsIncomplete = true;
      this.tempPolNo = ['','','','','',''];
      this.searchParams.cessionId = '';
      this.searchParams.cessionDesc = '';
      this.searchParams.cedingId = '';
      this.searchParams.cedingName = '';
      this.searchParams.riskId = '';
      this.searchParams.riskName = '';
    }
    else if(key === 'seqNo'){
      this.tempClmNo[2] = String(this.tempClmNo[2]).padStart(5, '0');
      for(var i of this.tempClmNo){
        if(i.length === 0){
          this.claimNoIsIncomplete = true;
          break;
        }else{
          this.claimNoIsIncomplete = false;
        }
      }
    }
    if(!this.claimNoIsIncomplete){
      this.retrieveClaimList();
    }
  }

  checkSearchFields(): boolean{
    //check claim no fields if empty
    for(var i of this.tempClmNo){
      if(i.trim().length !== 0){
        return false; //return false if not empty
      }
    }
    //check policy no fields if empty
    for(var j of this.tempPolNo){
      if(i.trim().length !== 0){
        return false; //return false if not empty
      }
    }

    //check cession type, ceding company, and risk fields if empty
    if((String(this.searchParams.cessionId).trim().length !== 0 && String(this.searchParams.cessionDesc).trim().length !== 0) ||
       (String(this.searchParams.cedingId).trim().length !== 0 && String(this.searchParams.cedingName).trim().length !== 0) ||
       (String(this.searchParams.riskId).trim().length !== 0 && String(this.searchParams.riskName).trim().length !== 0)){
      return false; //return false if one of the three fields are not empty
    }

    return true; //return true if all fields are empty, therefore triggering the popup

  }

  validateSearch(){
    if(!this.checkSearchFields()){
      this.queryModal.closeModal();
      this.searchParams.batchOpt = this.batchOption;
      this.clearDetails();
      this.retrieveQueryList();
    }else{
      this.dialogIcon = 'info';
      this.dialogMessage = 'No values were entered.';
      this.successDiag.open();
    }
  }

  clearSearchFields(){
   this.claimNoIsIncomplete = true;
    this.searchParams =  {
                            riskName:'',
                            riskId: '',
                            cedingName: '',
                            cedingId: '',
                            cessionDesc: '',
                            cessionId: ''
                          };
   this.tempClmNo = ['','',''];
   this.tempPolNo = ['','','','','',''];
   this.selectedPolicy = {};
   this.selectedClaim = {};
  }

  clearDetails(){
    this.claimDetails = {
      claimNo: '',
      clmStatus: '',
      policyNo: '',
      cedingName: '',
      insuredDesc: '',
      riskName: '',
      lossDate: '',
      currencyCd: '',
      lossDtl: '',
      totalLossExpRes: '',
      totalLossExpPd: '',
      adjName: '',
      processedBy: '',
      reasonCd: '',
      reasonDesc: ''
    }
  }
}

