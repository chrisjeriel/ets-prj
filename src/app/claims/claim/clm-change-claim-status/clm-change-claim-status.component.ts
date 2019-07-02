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
  @ViewChild('processPrompt') processModal : ModalComponent;
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
  batchOptionDesc: string = 'In Progress';
  dialogIcon: string = '';
  dialogMessage: string = '';
  reasonCd: string = '';
  reasonDesc: string = '';

  selectedClaim: any = {};
  selectedPolicy: any = {};
  selectedReason: any = null;

  tempClmNo: string[] = ['','',''];
  tempPolNo: string[] = ['','','','','',''];
  arrClaimStatus: any[] = [];

  searchParams: any = {
    claimId: '',
    claimNo: '',
    policyId: '',
    policyNo: '',
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
  polNoIsType: boolean = false;
  polNoIsIncomplete: boolean = false;
  batchOptionLoading: boolean = false;
  searchLoading: boolean = false;

  constructor(private titleService: Title, private modalService: NgbModal, private us: UnderwritingService,
              private cs: ClaimsService, private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Change Claim Status");
    this.retrieveClaimStatus();
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
    this.reasonTable.overlayLoader = true;
    this.ms.getMtnClaimReason(null,this.batchOption, 'Y').subscribe(
       (data:any)=>{
         this.reasonData.tableData = data.clmReasonList;
         this.reasonTable.refreshTable();
         this.reasonTable.overlayLoader = false;
       },
       (error:any)=>{
         this.reasonTable.overlayLoader = false;
       }
    );
    this.reasonModal.openNoClose();
  }

  retrieveClaimStatus(){
    this.batchOptionLoading = true;
    this.ms.getClaimStatus(null).subscribe(
      (data: any)=>{
        if(data.claimStatus.length !== 0){
          this.arrClaimStatus = data.claimStatus;
          this.batchOptionLoading = false;
        }
      },
      (error: any)=>{

      }
    );
  }

  retrieveClaimList(){
    this.clmListTable.overlayLoader = true;
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
          this.clmListTable.overlayLoader = false;
        }else{
          this.claimNoDataFound = true;
          if(this.claimNoIsType){
            this.claimNoIsType = false;
            this.openClmListing();
          }
        }
        this.clmListTable.overlayLoader = false;
      },
      (error: any)=>{
        this.clmListTable.overlayLoader = false;
      }
    );
  }

  retrievePolList(){
    this.polListTable.overlayLoader = true;
    this.us.getParListing([
                            {key: 'policyNo', search: this.polNoDataFound ? '' : this.tempPolNo.join('%-%')},
                            {key: 'cessionDesc', search: this.searchParams.cessionDesc.toUpperCase()},
                            {key: 'cedingName', search: this.searchParams.cedingName.toUpperCase()},
                            {key: 'riskName', search: this.searchParams.riskName.toUpperCase()}
                          ]).subscribe(
      (data: any)=>{
        if(data.policyList.length !== 0){
          this.polNoDataFound = false;
          this.polListData.tableData = [];
          for(var i of data.policyList){
            i.riskName = i.project.riskName;
            this.polListData.tableData.push(i);
          }
          this.polListTable.refreshTable();
          console.log('y')
          if(this.polNoIsType){
            console.log('yeet');
            this.selectedPolicy = this.polListData.tableData[0];
            this.setPolicy();
          }
        }else{
          this.polNoDataFound = true;
          if(this.polNoIsType){
            this.polNoIsType = false;
            this.openPolListing();
          }
        }
        this.polListTable.overlayLoader = false;
      },
      (error: any)=>{
        this.polListTable.overlayLoader = false;
      },
    );
  }

  retrieveQueryList(){
    this.queryTable.overlayLoader = true;
    this.queryData.tableData = [];
    this.searchParams.claimNo = this.tempClmNo.join('%-%');
    this.searchParams.policyNo = this.tempPolNo.join('%-%');
    console.log(this.searchParams);
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
         }else{
           this.queryData.tableData = [];
           this.queryTable.refreshTable();
         }
         this.queryTable.overlayLoader = false;
       },
       (error: any)=>{
         this.queryTable.overlayLoader = false;
       }
    );
  }

  onRowClickQuery(data){
    if(data !== null){
      this.claimDetails = data;
      this.reasonCd = data.reasonCd;
      this.reasonDesc = data.reasonDesc;
    }else{
      this.clearDetails();
    }
  }

  setClaim(){
    this.searchLoading = true;
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
        this.searchLoading = false;
      },
      (error: any)=>{
        this.searchLoading = false;
      }
    );
  }

  setPolicy(){
    this.searchLoading = true;
    this.polNoIsType = false;
    this.claimNoIsIncomplete = false;
    let polDone: boolean = false;
    let claimDone: boolean = false;
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
        polDone = true;
        if(polDone && claimDone){
          this.searchLoading = false;
        }
      },
      (error: any)=>{
        claimDone = true;
        if(polDone && claimDone){
          this.searchLoading = false;
        }
      }
    );

    this.cs.getClaimsListing([{key: 'policyNo', search: this.selectedPolicy.policyNo}]).subscribe(
      (data: any)=>{
        if(data.claimsList.length === 1){
          this.tempClmNo = data.claimsList[0].claimNo.split('-');
          this.searchParams.claimId = data.claimsList[0].claimId;
        }
        claimDone = true;
        if(polDone && claimDone){
          this.searchLoading = false;
        }
      },
      (error: any)=>{
        claimDone = true;
        if(polDone && claimDone){
          this.searchLoading = false;
        }
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
    }

    for(var i of this.tempClmNo){
       if(i.length === 0){
         this.claimNoIsIncomplete = true;
         break;
       }else{
         this.claimNoIsIncomplete = false;
       }
    }

    if(!this.claimNoIsIncomplete){
      this.retrieveClaimList();
    }
  }

  checkPol(key, event){
    this.polNoIsType = true;
    if(event.target.value.length === 0){
      this.polNoIsIncomplete = true;
      this.tempClmNo = ['','',''];
      this.searchParams.cessionId = '';
      this.searchParams.cessionDesc = '';
      this.searchParams.cedingId = '';
      this.searchParams.cedingName = '';
      this.searchParams.riskId = '';
      this.searchParams.riskName = '';
    }
    else if(key === 'seqNo'){
      this.tempPolNo[2] = String(this.tempPolNo[2]).padStart(5, '0');
    }else if(key === 'cedingId'){
      this.tempPolNo[3] = String(this.tempPolNo[3]).padStart(3, '0');
    }else if(key === 'coSeriesNo'){
      this.tempPolNo[4] = String(this.tempPolNo[4]).padStart(4, '0');
    }else if(key === 'altNo'){
      this.tempPolNo[5] = String(this.tempPolNo[5]).padStart(2, '0');
    }

    for(var i of this.tempPolNo){
      if(i.length === 0){
        this.polNoIsIncomplete = true;
        break;
      }else{
        this.polNoIsIncomplete = false;
      }
    }

    if(!this.polNoIsIncomplete){
      this.retrievePolList();
    }
  }

  checkSearchFields(): boolean{
    //check claim no fields if empty
    console.log(this.tempClmNo);
    console.log(this.tempPolNo);
    let clmPolEmpty: boolean = true;
    for(var i of this.tempClmNo){
      if(i.trim().length !== 0){
        clmPolEmpty = false; //return false if not empty
        break;
      }
    }
    //check policy no fields if empty
    for(var j of this.tempPolNo){
      if(j.trim().length !== 0){
        clmPolEmpty =  false; //return false if not empty
        break;
      }
    }
    if(!clmPolEmpty){
      return false;
    }else{
      //check cession type, ceding company, and risk fields if empty
      if((String(this.searchParams.cessionId).trim().length !== 0 && String(this.searchParams.cessionDesc).trim().length !== 0) ||
         (String(this.searchParams.cedingId).trim().length !== 0 && String(this.searchParams.cedingName).trim().length !== 0) ||
         (String(this.searchParams.riskId).trim().length !== 0 && String(this.searchParams.riskName).trim().length !== 0)){
        return false; //return false if one of the three fields are not empty
      }

      return true; //return true if all fields are empty, therefore triggering the popup
    }
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

  process(){
    switch(this.batchOption){
      case 'IP':
        this.dialogIcon = 'info';
        this.dialogMessage = 'Are you sure you want to re-open this claim?';
        this.processModal.openNoClose();
        break;
      default:
        this.dialogIcon = 'info';
        this.dialogMessage = 'Are you sure you want to '+ this.batchOptionDesc + ' this claim?';
        this.processModal.openNoClose();
    }
  }

  updateClaimStatus(){
    let updateClaimStatus: any[] = [];
    for(var i of this.queryTable.selected){
      updateClaimStatus.push({
        claimId: i.claimId,
        clmStatCd: this.batchOption,
        reasonCd: this.batchOption === 'IP' ? '' : this.reasonCd,
        updateUser: this.ns.getCurrentUser(),
        updateDate: this.ns.toDateTimeString(0)
      });
    }
    let params: any = {
      updateClaim: updateClaimStatus
    }
    this.cs.updateClaimStatus(JSON.stringify(params)).subscribe(
      (data: any)=>{
        if(data.returnCode === 0){
          this.dialogIcon = 'error';
          this.successDiag.open();
        }else{
          this.dialogIcon = '';
          this.successDiag.open();
          this.queryData.tableData = [];
          this.queryTable.selected = [];
          this.clearDetails();
          this.retrieveQueryList();
        }
      }
    );
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
    }
    this.reasonCd = '';
    this.reasonDesc = '';
  }
}

