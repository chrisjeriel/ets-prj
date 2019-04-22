import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-policy-information',
  templateUrl: './policy-information.component.html',
  styleUrls: ['./policy-information.component.css']
})
export class PolicyInformationComponent implements OnInit {
  @ViewChild('alterationTable') alterationTable : CustEditableNonDatatableComponent;
  policyInfo:any = {
  	policyId:null,
  	policyNo:null,
  	lineCd:null,
  	lineCdDesc:null,
  	cedingName:null,
  	cessionId:null,
  	cessionDesc:null,
  	lineClassCd:null,
  	lineClassDesc:null,
  	quoteId:null,
  	quotationNo:null,
  	status:null,
  	statusDesc:null,
  	coRefNo:null,
  	reinsurerId:null,
  	reinsurerName:null,
  	riBinderNo:null,
  	intmName:null,
  	inceptDate:null,
  	expiryDate:null,
  	lapseFrom:null,
  	lapseTo:null,
  	maintenanceFrom:null,
  	maintenanceTo:null,
  	issueDate:null,
  	effDate:null,
  	distDate:null,
  	acctDate:null,
    };

  passData:any = {
  	tHeader: ['Policy No / Alt No','Effective Date','Issue Date','Quotation No','Sum Insured','Premium','Status'],
  	tableData:[],
  	dataTypes:['text','datetime','datetime','text','currency','currency','text'],
  	pageLength:10,
  	infoFlag:true,
  	paginateFlag:true,
  	uneditable:[true,true,true,true,true,true,true],
  	keys:['policyNo','effDate','issueDate','quotationNo','sumInsured','premAmt','status']
  }
  policyId:string;
  constructor(private UwService : UnderwritingService, private ns : NotesService, private route: ActivatedRoute, private router: Router) { }
  selectedPol:any = null;

  ngOnInit() {
    this.route.params.subscribe(data=>{
      this.fetchInfo(data.policyId);
      this.policyId = data.policyId;
    })

  	
  }


  fetchInfo(policyId){
    this.UwService.getPolicyInformation(policyId).subscribe((data:any)=>{
      console.log(data);
      this.policyInfo = data.policy;
      this.policyInfo.inceptDate = this.ns.toDateTimeString(data.policy.inceptDate);
      this.policyInfo.expiryDate = this.ns.toDateTimeString(data.policy.expiryDate);
      this.policyInfo.lapseFrom = this.ns.toDateTimeString(data.policy.lapseFrom);
      this.policyInfo.lapseTo = this.ns.toDateTimeString(data.policy.lapseTo);
      this.policyInfo.lapseFrom = this.ns.toDateTimeString(data.policy.lapseFrom);
      this.policyInfo.maintenanceFrom = this.ns.toDateTimeString(data.policy.maintenanceFrom);
      this.policyInfo.maintenanceTo = this.ns.toDateTimeString(data.policy.maintenanceTo);
      this.policyInfo.issueDate = this.ns.toDateTimeString(data.policy.issueDate);
      this.policyInfo.distDate = this.ns.toDateTimeString(data.policy.distDate);
      this.policyInfo.effDate = this.ns.toDateTimeString(data.policy.effDate);
      this.policyInfo.acctDate = this.ns.toDateTimeString(data.policy.acctDate);
      this.passData.tableData = data.policy.alterationHist;
      this.alterationTable.refreshTable();
    })
  }

  goToPolicy(){
    this.router.navigate(['/policy-issuance', {policyId:this.selectedPol.policyId,
                                              fromInq:true,
                                              policyNo: this.selectedPol.policyNo,
                                              line: this.policyInfo.lineCd,
                                              statusDesc:this.policyInfo.statusDesc,
                                              riskName: this.policyInfo.project.riskName,
                                              insured: this.selectedPol.insured,
                                              editPol: true,
                                              status: this.selectedPol.status
                                              }], { skipLocationChange: true });


   // line: this.polLine, policyNo: this.policyNo, policyId: this.policyId, editPol: true, statusDesc: this.statusDesc, riskName: this.riskName, insured: this.insuredDesc }], { skipLocationChange: true });
  }
  
  rowLick(data){
    this.selectedPol = data;
  }

  onTabChange($event:NgbTabChangeEvent) {
     // if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
     //     $event.preventDefault();
   //   }                     
   console.log($event)
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('/policy-inquiry');
   }
 }


}