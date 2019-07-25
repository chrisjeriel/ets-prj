import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PoolDistribution } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaimsService, NotesService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { Router } from '@angular/router';

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
   @ViewChild('confirmRedist') confirmRedist: ModalComponent;
   @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;

   @Input()isInquiry;
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
    paginateFlag: true,
    infoFlag: true
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
    paginateFlag: true,
    infoFlag: true
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

   diagIcon:string;

  constructor(private modalService: NgbModal, private clmService : ClaimsService, private titleService: Title, private ns: NotesService, private router: Router) { }

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
   this.confirmRedist.closeModal();
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
        if(a['returnCode']==-1){
          this.diagIcon = 'nice';
          this.getClmHist();
        }else{
          this.diagIcon = 'error'
        }
        this.successDiag.open()
    })
  }

  confirmRedsitribute(){
    this.confirmRedist.openNoClose();
  }

  cancel(){
    if (this.isInquiry) {
        this.router.navigateByUrl('/claims-inquiry');
      } else if( !this.isInquiry){
        this.router.navigateByUrl('/clm-claim-processing');
      }
  }

}
