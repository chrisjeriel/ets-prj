import { Component, OnInit, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';


@Component({
  selector: 'app-pol-oc-information',
  templateUrl: './pol-oc-information.component.html',
  styleUrls: ['./pol-oc-information.component.css']
})
export class PolOcInformationComponent implements OnInit {

  @ViewChild('alterationTable') alterationTable : CustEditableNonDatatableComponent;
  @ViewChild('subPolTable') subPolTable : CustEditableNonDatatableComponent;
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
  	tHeader: ['Open Policy No / Alt No','Effective Date','Issue Date','Quotation No','Sum Insured','Premium','Status'],
  	tableData:[],
  	dataTypes:['text','datetime','datetime','text','currency','currency','text'],
  	pageLength:10,
  	infoFlag:true,
  	paginateFlag:true,
  	uneditable:[true,true,true,true,true,true,true],
  	keys:['policyNo','effDate','issueDate','quotationNo','totalSi','totalPrem','statusDesc'],
    pageID: 3
  }

  passDataSubPol:any = {
    tHeader: ['Policy No / Alt No','Effective Date','Issue Date','Quotation No','Sum Insured','Premium','Status'],
    tableData:[],
    dataTypes:['text','datetime','datetime','text','currency','currency','text'],
    pageLength:10,
    infoFlag:true,
    paginateFlag:true,
    uneditable:[true,true,true,true,true,true,true],
    keys:['policyNo','effDate','issueDate','quotationNo','sumInsured','premAmt','status'],
    pageID: 2
  }

  policyId:string;
  constructor(private UwService : UnderwritingService, private ns : NotesService, private route: ActivatedRoute, private router: Router, private location: Location) { }
  selectedPol:any = null;
  policyNo:string;
  fromClm: boolean = false;
  clmInfo: any = null;
  clmInq: boolean = false;
  exitLink: string = '';

  ngOnInit() {
    this.route.params.subscribe(data=>{
      console.log(data);
      this.fetchInfo(data.policyIdOc, data.policyNo);
      this.policyId = data.policyIdOc;
      this.exitLink = data.exitLink !== undefined ? data.exitLink:'/pol-oc-inquiry';

      if(data['clmInfo']) {
        this.fromClm = true;
        this.clmInfo = JSON.parse(data['clmInfo']);
        this.clmInq = data['isInquiry'];
      }
    })

  	
  }


  fetchInfo(policyId, policyNo?){
    this.UwService.getPolOcInfo({policyId:policyId}).subscribe((data:any)=>{
      this.policyInfo = data.policy;
      this.policyNo = data.policy.policyNo;
      this.policyInfo.inceptDate = this.ns.toDateTimeString(data.policy.inceptDate);
      this.policyInfo.expiryDate = this.ns.toDateTimeString(data.policy.expiryDate);
      this.policyInfo.lapseTo = data.policy.lapseTo == null ? '' : this.ns.toDateTimeString(this.setSec(data.policy.lapseTo));
      this.policyInfo.lapseFrom == data.policy.lapseFrom == null ? '' : this.ns.toDateTimeString(this.setSec(data.policy.lapseFrom));
      
      this.policyInfo.issueDate = this.ns.toDateTimeString(data.policy.issueDate);
      this.policyInfo.distDate = this.ns.toDateTimeString(data.policy.distDate);
      this.policyInfo.effDate = this.ns.toDateTimeString(data.policy.effDate);
      this.policyInfo.acctDate = this.ns.toDateTimeString(data.policy.acctDate);
      this.passData.tableData = data.policy.altList;
      this.alterationTable.refreshTable();
      this.subPolTable.refreshTable();
    })
  }

  goToPolicy(data?){    
    this.selectedPol = !data ? this.selectedPol : data; 
      this.router.navigate(['/create-open-cover-letter',{ 
                                  line: this.policyInfo.lineCd,
                                  policyIdOc:this.selectedPol.policyId,
                                  insured: this.selectedPol.insured,
                                  riskName: this.policyInfo.riskName,
                                  policyNo: this.selectedPol.policyNo,
                                  inqFlag: true,
                                  fromInq:true,
                                  exitLink: '/pol-oc-information' }], { skipLocationChange: true });
  }

  goToSubPolicy(data){
    this.router.navigate(['/policy-information', {policyId:data.policyId, policyNo:data.policyNo,exitLink: '/pol-oc-information', policyIdOc: this.policyId}], { skipLocationChange: true });
  }
  
  rowLick(data){
    this.selectedPol = data;
    if(data == null){
      this.passDataSubPol.tableData = [];
    }else{
      this.passDataSubPol.tableData = this.selectedPol.subPolList;
    }

    this.subPolTable.refreshTable();
  }

  onTabChange($event:NgbTabChangeEvent) {
      if ($event.nextId === 'Exit') {
        $event.preventDefault();

        if(!this.fromClm) {
          this.router.navigate([this.exitLink],{ skipLocationChange: true });
        } else {

          this.router.navigate(
                    ['/claims-claim', {
                        from: this.clmInfo.claimId == '' ? 'add' : 'edit',
                        readonly: this.clmInq,
                        claimId: this.clmInfo.claimId,
                        claimNo: this.clmInfo.claimNo,
                        policyId: this.policyInfo.policyId,
                        policyNo: this.policyInfo.policyNo,
                        cessionId: this.policyInfo.cessionId,
                        cessionDesc: this.policyInfo.cessionDesc,
                        line: this.policyInfo.policyNo.split('-')[0]
                    }],
                    { skipLocationChange: true }
          );

        }
      }
 }

 gotoSum(){
   /*this.router.navigate(['/pol-summarized-inq', {policyId:this.policyInfo.policyId,
                                             fromInq:true,
                                             showPolicyNo: this.policyInfo.policyNo,
                                             line: this.policyInfo.lineCd,
                                             statusDesc:this.policyInfo.statusDesc,
                                             riskName: this.policyInfo.project.riskName,
                                             insured: this.policyInfo.insuredDesc,
                                             editPol: true,
                                             status: this.policyInfo.status,
                                             }], { skipLocationChange: true });*/

   var routeParam = {
     policyId:this.policyInfo.policyId,
     fromInq:true,
     showPolicyNo: this.policyInfo.policyNo,
     line: this.policyInfo.lineCd,
     statusDesc:this.policyInfo.statusDesc,
     riskName: this.policyInfo.project.riskName,
     insured: this.policyInfo.insuredDesc,
     editPol: true,
     status: this.policyInfo.status,
     lastAffectingPolId: this.policyInfo.lastAffectingPolId
    }

    if(this.fromClm) {
      routeParam['clmInfo'] = JSON.stringify(this.clmInfo);
    }

    this.router.navigate(['/pol-summarized-inq', routeParam], { skipLocationChange: true });
 }

 setSec(d) {
    d = new Date(d);
    return d.setSeconds(0);
  }


}