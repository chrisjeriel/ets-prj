import { Component, OnInit, ViewChild } from '@angular/core';
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
export class ClmChangeClaimStatusComponent implements OnInit {

  @ViewChild('queryMdl') queryModal : ModalComponent;
  @ViewChild('clmListMdl') clmListModal : ModalComponent;
  @ViewChild('polListMdl') polListModal : ModalComponent;
  @ViewChild('successDiagSave') successDiag: SucessDialogComponent;

  @ViewChild(MtnTypeOfCessionComponent) cessionModal: MtnTypeOfCessionComponent;
  @ViewChild(MtnRiskComponent) riskModal: MtnRiskComponent;
  @ViewChild(CedingCompanyComponent) cedCoModal: CedingCompanyComponent;

  @ViewChild('clmListTable') clmListTable : CustNonDatatableComponent;
  @ViewChild('polListTable') polListTable : CustNonDatatableComponent;
  @ViewChild('queryTbl') queryTable : CustNonDatatableComponent;

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

  batchOption: string = 'IP';
  dialogIcon: string = '';
  dialogMessage: string = '';

  selectedClaim: any = {};
  selectedPolicy: any = {};

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

  constructor(private titleService: Title, private modalService: NgbModal, private us: UnderwritingService,
              private cs: ClaimsService, private ms: MaintenanceService, private ns: NotesService) { }

  ngOnInit() {
    this.titleService.setTitle("Clm | Change Claim Status");
    setTimeout(()=>{$('#searchBtn').trigger('click');},0);
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
      //$('#riskLOV #modalBtn').trigger('click');
      this.riskModal.modal.openNoClose();
  }

  openCedingCompanyLOV() {
      //$('#cedingCompanyLOV #modalBtn').trigger('click');
      this.cedCoModal.modal.openNoClose();
  }

  openTypeOfCessionLOV(){
      //$('#typeOfCessionLOV #modalBtn').trigger('click');
      this.cessionModal.modal.openNoClose();
  }

  retrieveClaimList(){
    this.clmListTable.loadingFlag = true;
    this.cs.getClaimsListing([
                                {key: 'policyNo', search: Object.keys(this.selectedPolicy).length === 0 ? '' : this.selectedPolicy.policyNo},
                                {key: 'claimNo', search: this.tempClmNo.join('%-%')}
                             ]).subscribe(
      (data:any)=>{
        this.clmListData.tableData = data.claimsList;
        this.clmListTable.refreshTable();
        this.clmListTable.loadingFlag = false;
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
    console.log(data);
  }

  setClaim(){
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

  checkCode(ev, field){
      this.ns.lovLoader(ev, 1);

      if(field === 'typeOfCession'){
          this.cessionModal.checkCode(this.searchParams.cessionId, ev);
      } else if(field === 'risk') {
          this.riskModal.checkCode(this.searchParams.riskId, '#riskLOV', ev);
      } else if(field === 'cedingCo') {
          this.cedCoModal.checkCode(this.searchParams.cedingId === '' ? '' : String(this.searchParams.cedingId).padStart(3, '0'), ev, '#cedingCompanyLOV');
      } /*else if(field === 'reason'){
          this.mtnReason.checkCode(this.selectedData.reasonCd, ev);
      }*/
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
      this.retrieveQueryList();
    }else{
      this.dialogIcon = 'info';
      this.dialogMessage = 'No values were entered.';
      this.successDiag.open();
    }
  }

  clearSearchFields(){
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

}
