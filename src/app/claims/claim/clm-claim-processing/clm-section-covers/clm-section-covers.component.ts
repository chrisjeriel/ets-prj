import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ClaimsService, NotesService, MaintenanceService } from '@app/_services'
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-clm-section-covers',
  templateUrl: './clm-section-covers.component.html',
  styleUrls: ['./clm-section-covers.component.css']
})
export class ClmSectionCoversComponent implements OnInit {

  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
  @ViewChild('myForm') form:any;
  passData: any = {
    tableData: [],
    tHeader: ["Deductible Level","Deductible Code", "Deductible Title", "Rate (%)", "Amount", "Deductible Text"],
    dataTypes: ["text","text", "text", "percent", "currency", "text"],
    paginateFlag: true,
    infoFlag: true,
    searchFlag: true,
    pageLength: 5,
    uneditable:[true,true,true,true,true,true],
    keys:['deductibleLevel','deductibleCd','deductibleTitle','deductibleRt','deductibleAmt','deductibleTxt'],
    widths: ['auto',1,'auto','auto','auto','auto'],
    pageID: 1
  };

  coverageData : any = {
    sectionISi: null,
    sectionIISi: null,
    sectionIIISi: null,
    currencyCd: null,
    currencyRt: null,
    allowMaxSi: null,
    totalSi: null
  }
  secI: any
  secII:any;
  secIII:any;
  
  dialogIcon:string = '';
  dialogMessage:string;
  cancelFlag:boolean;
  claimId:any;
  projId:any;
  clmHistrory: boolean = false;
  secTag: any;
  parameters:boolean = false;
  event:any;
  orgSecI: any;
  orgSecII: any;
  orgSecIII: any;

  @Input() claimInfo = {
    claimId: '',
    claimNo: '',
    policyNo: '',
    riskId: '',
    riskName:'',
    insuredDesc:''
  }

  @Output() disableClmHistory = new EventEmitter<any>();
  @Input() isInquiry: boolean = false;

  constructor(private claimService: ClaimsService, private ns: NotesService, private route: ActivatedRoute, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.route.params.subscribe((data:any)=>{
      console.log(data)
      this.claimId = data.claimId;
    });
    
    this.getClmSec();
    this.check();
  }

  getClmSec(){
    this.claimService.getClaimSecCover(this.claimInfo.claimId, this.claimInfo.claimNo).subscribe((data:any)=>{
      this.coverageData = data.claims.project.clmCoverage;
      this.orgSecI = this.coverageData.secISiTag;
      this.orgSecII = this.coverageData.secIISiTag;
      this.orgSecIII = this.coverageData.secIIISiTag;
      this.projId = data.claims.project.projId;
      var deductibles = data.claims.clmDeductibles;
      this.passData.tableData = [];
      for(var i = 0 ; i < deductibles.length;i++){
        this.passData.tableData.push(deductibles[i]);
      }
      this.table.refreshTable();
      this.getSum();
    });
  }

  getSum(){
    var totalClaim =0;
    if(this.coverageData.secISiTag === 'Y'){
      totalClaim += this.coverageData.sectionISi;
    }
    if(this.coverageData.secIISiTag === 'Y'){
      totalClaim += this.coverageData.sectionIISi;
    }
    if(this.coverageData.secIIISiTag === 'Y'){
      totalClaim += this.coverageData.sectionIIISi;
    }
    this.coverageData.allowMaxSi = totalClaim;
  }

  onClickSave(){
    this.form.control.markAsDirty();
    $('#confirm-save #modalBtn2').trigger('click');
  }

  saveData(cancelFlag?){
    this.cancelFlag = cancelFlag !== undefined;
    console.log(this.coverageData)
    this.coverageData.createDate = this.ns.toDateTimeString(this.coverageData.createDate);
    this.coverageData.updateDate = this.ns.toDateTimeString(this.coverageData.updateDate);
    this.coverageData.updateUser = this.ns.getCurrentUser();
    this.coverageData.secISiTag = this.coverageData.secISiTag=='Y' ? 'Y':'N';
    this.coverageData.secIISiTag = this.coverageData.secIISiTag=='Y' ? 'Y':'N';
    this.coverageData.secIIISiTag = this.coverageData.secIIISiTag=='Y' ? 'Y':'N';
    this.claimService.saveClaimSecCover(this.coverageData).subscribe((data: any) => {
      if(data['returnCode'] == 0) {
        this.dialogMessage = data['errorList'][0].errorMessage;
        this.dialogIcon = "error";
        this.successDiag.open();
      } else{
        this.dialogMessage = "";
        this.dialogIcon = "success";
        this.successDiag.open();
        this.getClmSec();
        this.form.control.markAsPristine();
        this.disableClmHistory.emit(false);
      }
    });
  }

  cancel(){
    this.cancelBtn.clickCancel();
  }

  validate(data){
    if(this.clmHistrory || this.parameters){
      if(this.secTag == 'secISiTag'){
        this.coverageData.secISiTag = (this.coverageData.secISiTag === 'Y') ? 'N' : 'Y';
        this.dialogMessage = 'Unable to change the tag. Allowable Maximum Claim will be less than the current reserve setup.';
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }else if(this.secTag == 'secIISiTag'){
        this.coverageData.secIISiTag = (this.coverageData.secIISiTag === 'Y') ? 'N' : 'Y';
        this.dialogMessage = 'Unable to change the tag. Allowable Maximum Claim will be less than the current reserve setup.';
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }else{
        this.coverageData.secIIISiTag = (this.coverageData.secIIISiTag === 'Y') ? 'N' : 'Y';
        this.dialogMessage = 'Unable to change the tag. Allowable Maximum Claim will be less than the current reserve setup.';
        this.dialogIcon = "error-message";
        this.successDiag.open();
      }
    }
  }

  check(){
    this.claimService.getClaimHistory(this.claimId,'',this.projId,'').subscribe((data:any) => {
      console.log(data)
      if(data.claimReserveList.length !== 0){
        this.clmHistrory = true;
      }
    });
    this.maintenanceService.getMtnParameters('V').subscribe((data:any) => {
      console.log(data)
      for(var i = 0; i < data.parameters.length;i++){
        if(data.parameters[i].paramName == 'ALLOW_MAX_SI' && data.parameters[i].paramValueV == 'Y'){
          this.parameters = true;
        }
      }
    });
  }
}
