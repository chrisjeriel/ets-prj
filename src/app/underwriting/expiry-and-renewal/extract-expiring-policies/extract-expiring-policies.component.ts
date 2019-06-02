import { Component, OnInit, ViewChild, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { ExpiryParameters, LastExtraction } from '../../../_models';
import { UnderwritingService, NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';

@Component({
  selector: 'app-extract-expiring-policies',
  templateUrl: './extract-expiring-policies.component.html',
  styleUrls: ['./extract-expiring-policies.component.css']
})
export class ExtractExpiringPoliciesComponent implements OnInit {

  constructor(private underWritingService: UnderwritingService, private modalService: NgbModal, private titleService: Title, private ns: NotesService) { }

  @ViewChild(MtnLineComponent) lineLov: MtnLineComponent;
  @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
  @ViewChild('ceding') cedingLov: CedingCompanyComponent;

  expiryParameters: ExpiryParameters = new ExpiryParameters();
  lastExtraction: LastExtraction = new LastExtraction();
  
  byDate: any = '';
  extractedPolicies: number = 0;

  policyId:string = "";
  polLineCd: string = "";
  polYear:string = "";
  polSeqNo:string = "";
  polCedingId:string = "";
  coSeriesNo:string = "";
  altNo:string = "";
  fromExpiryDate:string = "";
  toExpiryDate:string = "";
  cessionType:string = "";
  extractUser:string = "";


  lineCd: string = "";
  lineDescription: string = "";
  typeOfCessionId: string = "";
  typeOfCession: string = "";
  cedingId: string = "";
  cedingName: string = "";

  fromMonth: string = "";
  fromYear: string = "";
  toMonth: string = "";
  toYear: string = "";

  polNo: any[] = [];

  ngOnInit() {
    this.titleService.setTitle("Pol | Extract Expiring Policy");
  }

  extract() {
    // this.extractedPolicies = this.underWritingService.extractExpiringPolicies(this.expiryParameters);
    
    this.prepareExtractParameters();
    this.extractedPolicies = 0;
    console.log("this.expiryParameters : " + JSON.stringify(this.expiryParameters));

    this.underWritingService.extractExpiringPolicies(this.expiryParameters).subscribe(data => {
        console.log("extractExpiringPolicies: " + JSON.stringify(data));
        if (data['errorList'].length > 0) {

        } else {
          this.extractedPolicies = data['recordCount'];
        }
    });

  }

  prepareExtractParameters() {
    this.expiryParameters.policyId         = this.policyId; 
    this.expiryParameters.fromExpiryDate   = this.fromExpiryDate; 
    this.expiryParameters.toExpiryDate     = this.toExpiryDate; 
    this.expiryParameters.lineCd           = this.lineCd; 
    this.expiryParameters.cedingId         = this.cedingId; 
    this.expiryParameters.cessionType      = this.typeOfCessionId; 
    this.expiryParameters.extractUser      = JSON.parse(window.localStorage.currentUser).username; 
  }

  /*
  policyId:string;
  lineCd:string;
  polYear:string;
  polSeqNo:string;
  polCedingId:string;
  coSeriesNo:string;
  altNo:string;
  fromExpiryDate:string;
  toExpiryDate:string;
  cedingId:string;
  cessionType:string;
  extractUser:string;
  */

  clearPolicyNo() {
    this.expiryParameters.polLineCd = null;
    this.expiryParameters.polYear = null;
    this.expiryParameters.polSeqNo = null;
    this.expiryParameters.polCedingId = null;
    this.expiryParameters.coSeriesNo = null;
    this.expiryParameters.altNo = null;
  }

  clearDates() {
    this.fromExpiryDate = "";
    this.toExpiryDate = "";
    this.fromMonth = null;
    this.fromYear = null;
    this.toMonth = null;
    this.toYear = null;
    this.clearPolicyNo();
  }

  clearOptionals() {
    this.lineCd = null;
    this.typeOfCessionId = null;
    this.cedingId = null;
    this.lineDescription = null;
    this.typeOfCession = null;
    this.cedingName = null;
  }

  clearAll() {
    this.clearDates();
    this.clearPolicyNo();
    this.clearOptionals();
  }

  checkCode(ev, field){
        this.ns.lovLoader(ev, 1);

        if(field === 'line') {            
            this.lineLov.checkCode(this.lineCd, ev);
        } else if(field === 'typeOfCession'){
            this.typeOfCessionLov.checkCode(this.typeOfCessionId, ev);
        } else if(field === 'cedingCo') {
            this.cedingLov.checkCode(String(this.cedingId).padStart(3, '0'), ev);            
        } /*else if(field === 'risk') {
            this.riskLOV.checkCode(this.riskCd, '#riskLOV', ev);
        } else if(field === 'copyRisk') {
            this.copyRiskLOV.checkCode(this.copyRiskId, '#copyRiskLOV', ev);
        }  else if(field === 'cedingCoIntComp') {
            this.cedingIntLov.checkCode(String(this.copyCedingId).padStart(3, '0'), ev);
        } */
    }

  showLineLOV(){
        // $('#lineLOV #modalBtn').trigger('click');
        this.lineLov.modal.openNoClose();
  }

  setLine(data){
        this.lineCd = data.lineCd;
        this.lineDescription = data.description;
        this.ns.lovLoader(data.ev, 0);
    }

  showTypeOfCessionLOV(){
    this.typeOfCessionLov.modal.openNoClose();
  }

  setTypeOfCession(data) {        
        this.typeOfCessionId = data.cessionId;
        this.typeOfCession = data.description;
        this.ns.lovLoader(data.ev, 0);
  }

  showCedingCompanyLOV() {
    this.cedingLov.modal.openNoClose();
  }

  setCedingcompany(data){
    this.cedingId = data.cedingId;
    this.cedingName = data.cedingName;
    this.ns.lovLoader(data.ev, 0);   
  }



  pad(str, num?) {
    if(str === '' || str == null){
      return '';
    }
    
    return String(str).padStart(num != null ? num : 3, '0');
  }
}
