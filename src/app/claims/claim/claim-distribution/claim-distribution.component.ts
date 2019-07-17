import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PoolDistribution } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaimsService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';

@Component({
  selector: 'app-claim-distribution',
  templateUrl: './claim-distribution.component.html',
  styleUrls: ['./claim-distribution.component.css']
})
export class ClaimDistributionComponent implements OnInit {

   @ViewChild('reserveDistTable') reserveDistTable: CustEditableNonDatatableComponent;
   @ViewChild('paymentDistTable') paymentDistTable: CustEditableNonDatatableComponent;
   @ViewChild('treatyTable') treatyTable: CustEditableNonDatatableComponent;
   @ViewChild('poolTable') poolTable: CustEditableNonDatatableComponent;

  distHeaderPassData: any = {
  	tableData: [],
  	tHeader: ['Distribution Header','History No', 'Amount','Distribution Status'],
  	dataTypes: ['text','number','currency','text'],
  	pageLength:5,
  	resizable:[true,true,true,true],
  	pageID:1,
    pagination:true,
    pageStatus: true
  }

  treatyDistPassData: any = {
  	tableData: [],
  	tHeader: ['Treaty','Treaty Company', 'Treaty Share(%)','Claim Amount'],
  	dataTypes: ['text','text','percent','currency'],
    keys:['treatyAbbr','cedingAbbr','clmPctShare','clmAmt'],
    total:[null,'Total','clmPctShare','clmAmt'],
    uneditable:[true,true,true,true,],
  	pageLength:'unli',
  	pageID:2,

  }

  poolDistPassData: any = {
  	tableData: [],
  	tHeader: ['Treaty','Treaty Company', '1st Ret Line','1st Ret Amount','2nd Ret Line', '2nd Ret Amount'],
  	dataTypes: ['text','text','number','currency','number','currency'],
    keys:['treatyAbbr','cedingAbbr','ret1Lines','ret1Amt','ret2Lines','ret2Amt'],
  	pageLength:'unli',
  	resizable: [true,true,true,true,true,true],
  	pageID: 3,
  }	

  reserveDistPassData: any = {
    tHeader: ['Distribution No','History No','Hist. Type','Type','Reserve','Payment','Distribution Status'],
    dataTypes: ['sequence-9','number','text','text','currency','currency','text'],
    keys:['clmDistNo','histNo','histCategory','histType','reserveAmt','paytAmt','clmDistStat'],
    uneditable: [true,true,true,true,true,true,true],
    widths:[1,1,'auto','auto',150,150,'auto'],
    tableData: [],
    pageLength: 5,
    pageID: 5,
    pagination: true,
    pageStatus: true
  }

  paymentDistPassData: any = {
    tHeader: ['Distribution No','History No','Hist. Type','Type','Reserve','Payment','Distribution Status'],
    dataTypes: ['sequence-9','number','text','text','currency','currency','text'],
    keys:['clmDistNo','histNo','histCategory','histType','reserveAmt','paytAmt','clmDistStat'],
    uneditable: [true,true,true,true,true,true,true],
    widths:[1,1,'auto','auto',150,150,'auto'],
    tableData: [],
    pageLength: 5,
    pageID: 6,
    pagination: true,
    pageStatus: true
  }

   @Input() claimInfo = {
    claimId     : '',
    claimNo     : '',
    projId      : '',
    riskName    : '',
    insuredDesc : '',
    policyNo    : '',
    clmStatus   : ''
   };

   selected: any;

   poolSum: any = {};

  constructor(private modalService: NgbModal, private clmService : ClaimsService, private titleService: Title, private ns: NotesService) { }

  ngOnInit() {
     this.titleService.setTitle("Clm | Claim Distribution");
     this.getClmHist();
  }

  getClmHist(){
    this.clmService.getClaimDist(this.claimInfo.claimId,this.claimInfo.projId).subscribe(a=>{
      this.reserveDistPassData.tableData = a['claimDist'].filter(a=>a.histType.indexOf('Payment') == -1);
      this.reserveDistPassData.tableData.forEach(a=>{
        a.createDate = this.ns.toDateTimeString(a.createDate);
        a.updateDate = this.ns.toDateTimeString(a.updateDate);
      })
      this.paymentDistPassData.tableData = a['claimDist'].filter(a=>a.histType.indexOf('Payment') != -1);
      this.paymentDistPassData.tableData.forEach(a=>{
        a.createDate = this.ns.toDateTimeString(a.createDate);
        a.updateDate = this.ns.toDateTimeString(a.updateDate);
      })
      this.reserveDistTable.refreshTable();
      this.treatyTable.refreshTable();
    })
  }

  clickRow(data){
    this.selected = data;
    if(data == null){
      this.treatyDistPassData.tableData = [];
    }else{
      this.treatyDistPassData.tableData = this.selected.claimDistTreaty;

    }
    this.treatyTable.refreshTable();
  }

  onTabChange(data){
    console.log(data)
    this.selected = null;
    this.paymentDistTable.indvSelect = null;
    this.reserveDistTable.indvSelect = null;
    this.treatyDistPassData.tableData = [];
    this.treatyTable.refreshTable();
  }

  getPoolDist(){
    console.log('proc');
    this.clmService.getClaimDistPool(this.claimInfo.claimId,this.claimInfo.projId,this.selected.histNo,this.selected.clmDistNo).subscribe(a=>{
      this.poolDistPassData.tableData = a['claimsDistCeding'];
      this.poolSum.ret1 = this.poolDistPassData.tableData.reduce((a,b)=>a+parseFloat(b.ret1Amt),0);
      this.poolSum.ret2 = this.poolDistPassData.tableData.reduce((a,b)=>a+parseFloat(b.ret2Amt),0);
      this.poolSum.total = this.poolSum.ret1 + this.poolSum.ret2;
      this.poolSum.ret1 = this.poolSum.ret1.toFixed(2);
      this.poolSum.ret2 = this.poolSum.ret2.toFixed(2);
      this.poolSum.total = this.poolSum.total.toFixed(2);
      this.poolTable.refreshTable();
    });
  }

  redistribute(){
       let params:any = {
           claimId:this.claimInfo.claimId,
           projId:this.claimInfo.projId,
           histNo:this.selected.histNo,
           clmDistNo:this.selected.clmDistNo,
           createUser:this.ns.getCurrentUser(),
           createDate:this.ns.toDateTimeString(0),
           updateUser:this.ns.getCurrentUser(),
           updateDate:this.ns.toDateTimeString(0),
       }
      this.clmService.redistributeClaimDist(params).subscribe(a=>{
      this.getClmHist();
    })
  }

}
