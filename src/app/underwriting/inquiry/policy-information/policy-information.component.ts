import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute } from '@angular/router';

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
  	tHeader: ['Alt No','Effective Date','Issue Date','Quotation No','Sum Insured','Premium','Status'],
  	tableData:[],
  	dataTypes:['text','datetime','datetime','text','currency','currency','text'],
  	pageLength:10,
  	infoFlag:true,
  	paginateFlag:true,
  	uneditable:[true,true,true,true,true,true,true],
  	keys:['policyNo','effDate','issueDate','quotationNo','sumInsured','premAmt','status']
  }

  constructor(private UwService : UnderwritingService, private ns : NotesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(data=>{
      this.fetchInfo(data.policyId);
    })

  	
  }


  fetchInfo(policyId){
    this.UwService.getPolicyInformation(policyId).subscribe((data:any)=>{
      console.log(data);
      this.policyInfo = data.policy;
      // this.policyInfo.inceptDate = this.ns.toDateTimeString(data.policy.inceptDate);
      // this.policyInfo.expiryDate = this.ns.toDateTimeString(data.policy.expiryDate);
      // this.policyInfo.lapseFrom = this.ns.toDateTimeString(data.policy.lapseFrom);
      // this.policyInfo.lapseTo = this.ns.toDateTimeString(data.policy.lapseTo);
      // this.policyInfo.lapseFrom = this.ns.toDateTimeString(data.policy.lapseFrom);
      // this.policyInfo.maintenanceFrom = this.ns.toDateTimeString(data.policy.maintenanceFrom);
      // this.policyInfo.maintenanceTo = this.ns.toDateTimeString(data.policy.maintenanceTo);
      // this.policyInfo.issueDate = this.ns.toDateTimeString(data.policy.issueDate);
      // this.policyInfo.distDate = this.ns.toDateTimeString(data.policy.distDate);
      // this.policyInfo.effDate = this.ns.toDateTimeString(data.policy.effDate);
      // this.policyInfo.acctDate = this.ns.toDateTimeString(data.policy.acctDate);
      this.passData.tableData = data.policy.alterationHist;
      this.alterationTable.refreshTable();
    })
  }

}