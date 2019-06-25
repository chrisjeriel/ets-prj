import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService, MaintenanceService } from '@app/_services'
import { MtnTypeOfCessionComponent } from '@app/maintenance/mtn-type-of-cession/mtn-type-of-cession.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { MtnRiskComponent } from '@app/maintenance/mtn-risk/mtn-risk.component';

@Component({
  selector: 'app-clm-change-claim-status',
  templateUrl: './clm-change-claim-status.component.html',
  styleUrls: ['./clm-change-claim-status.component.css']
})
export class ClmChangeClaimStatusComponent implements OnInit {

  @ViewChild(CedingCompanyComponent) cedingCoLov: CedingCompanyComponent;
  @ViewChild(MtnTypeOfCessionComponent) typeOfCessionLov: MtnTypeOfCessionComponent;
  @ViewChild('riskLOV') riskLOV: MtnRiskComponent;

  passData: any = {
    tableData: [],
    tHeader: ["Claim No", "Status", "Policy No", "Ceding Company", "Insured"],
    dataTypes: ["text","text", "text", "text", "text"],
    paginateFlag: true,
    infoFlag: true,
    searchFlag: false,
    pageLength: 10,
    uneditable:[true,true,true,true,true,true],
    keys:['claimNo','status','policyNo','cedingCom','Insured'],
    widths: ['auto','auto','auto','auto','auto'],
    pageID: 1
  };

  params:any = {
    claimLine: null,
    claimYear:null,
    claimSeq: null,
    polLine: null,
    polYear:null,
    polSeq: null,
    polComp: null,
    polCoSeries: null,
    polAlt: null,
    cessionId: null,
    cessionDesc: null,
    cedingId: null,
    cedingDesc: null,
    riskId: null,
    riskName: null
  }

  first: boolean = true;
  constructor(private titleService: Title, private modalService: NgbModal, private ns: NotesService, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.getClaimStatus();
  }

  search(event) {
    $('#modalSearch > #modalBtn').trigger('click');
  }

  getClaimStatus(){

  }

  showPolicyLov(){

  }

  checkCode(ev, field){
    this.ns.lovLoader(ev, 1);

    if(field === 'riskId') {            
        this.riskLOV.checkCode(this.params.riskId,  '#riskLOV' ,ev);
    } else if(field === 'cessionId'){
        this.typeOfCessionLov.checkCode(this.params.cessionId, ev);
    } else if(field === 'cedingId') {         
        this.cedingCoLov.checkCode(this.params.cedingId, ev);
    }
  }

  setRisks(data){
    console.log(data);
    this.params.riskId = data.riskId;
    this.params.riskName = data.riskName;
    this.ns.lovLoader(data.ev, 0);
  }

  setTypeOfCession(data){
    this.params.cessionId = data.cessionId;
    this.params.cessionDesc = data.description;
    this.ns.lovLoader(data.ev, 0);
        
    if(data.hasOwnProperty('fromLOV')){
        this.onClickAdd('#typeOfCessionId');    
    }
  }

  setCedingcompany(event){
    console.log(event)
    this.params.cedingId = event.cedingId;
    this.params.cedingDesc = event.cedingName;
    this.ns.lovLoader(event.ev, 0);
  }

   onClickAdd(event) {
    if(this.first){
        this.maintenanceService.getMtnTypeOfCession(1).subscribe(data => {            
          this.params.cessionId = data['cession'][0].cessionId;
          this.params.cessionDesc = data['cession'][0].cessionAbbr;

          this.first = false;
        });
    }
    $('#addModal > #modalBtn').trigger('click');        
  }

  showTypeOfCessionLOV(){
    this.typeOfCessionLov.modal.openNoClose();
  }

  showCedingCompanyLOV(){
    this.cedingCoLov.modal.openNoClose();
  }

  showRiskLOV(){
    this.riskLOV.modal.openNoClose();
  }


}

