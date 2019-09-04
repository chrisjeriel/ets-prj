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
   @ViewChild('cummResDistTable') cummResDistTable: CustEditableNonDatatableComponent;
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
  	tHeader: ['Treaty','Treaty Company', 'Treaty Share(%)','Amount'],
  	dataTypes: ['text','text','percent','currency'],
    keys:['treatyAbbr','cedingAbbr','clmPctShare','reserveAmt'],
    total:[null,'Total','clmPctShare','reserveAmt'],
    uneditable:[true,true,true,true,true,true],
  	pageLength:'unli',
  	pageID:2,
    disableSort:true

  }

  poolDistPassData: any = {
  	tableData: [],
  	tHeader: ['Treaty','Treaty Company', '1st Ret Line','1st Ret Amount','2nd Ret Line', '2nd Ret Amount'],
  	dataTypes: ['text','text','number','currency','number','currency'],
    keys:['treatyAbbr','cedingAbbr','ret1Lines','ret1Amt','ret2Lines','ret2Amt'],
    total:[null,'Total','ret1Lines','ret1Amt','ret2Lines','ret2Amt'],
  	pageLength:'unli',
  	uneditable: [true,true,true,true,true,true,true,true,true],
  	pageID: 3,
    searchFlag: true
  }	

  reserveDistPassData: any = {
    tHeader: ['Distribution No','History No','Type','Amount','Curr','Curr Rt','Booking Date','Distribution Status'],
    dataTypes: ['sequence-6','number','text','currency','text','currencyRate','text','text'],
    keys:['clmDistNo','histNo','histTypeName','reserveAmt','currencyCd','currencyRt','bookingDate','clmDistStat'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    widths:[1,1,1,'auto',1,'auto',1,1,'auto',1],
    tableData: [],
    pageLength: 5,
    pageID: 4,
    paginateFlag: true,
    infoFlag: true,
    filterFlag:true,
    searchFlag:true,
    filters: [
        {
            key: 'histNo',
            title: 'History No.',
            dataType: 'text'
        },
        {
            key: 'histType',
            title: 'History Type',
            dataType: 'text'
        },
        {
            key: 'bookingMonth',
            title: 'Booking Month',
            dataType: 'text'
        },
        {
            key: 'bookingYear',
            title: 'Booking Year',
            dataType: 'text'
        },
        {
            key: 'distStatus',
            title: 'Dist. Status',
            dataType: 'text'
        },
        {
            key: 'histCategory',
            title: 'Type',
            dataType: 'text'
        },
        
    ]
  }

  paymentDistPassData: any = {
    tHeader: ['Distribution No','History No','Type','Amount','Curr','Curr Rt','Booking Date','Distribution Status'],
    dataTypes: ['sequence-6','number','text','currency','text','currencyRate','date','text'],
    keys:['clmDistNo','histNo','histTypeName','reserveAmt','currencyCd','currencyRt','bookingDate','clmDistStat'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    widths:[1,1,1,'auto',1,'auto',1,1,'auto',1],
    tableData: [],
    pageLength: 5,
    pageID: 5,
    paginateFlag: true,
    infoFlag: true
  }

  cummDistPassData:any = {
    tHeader: ['Distribution No','Reserve Amount','Payment Amount','Curr','Curr Rt','Distribution Status'],
    dataTypes: ['sequence-6','currency','currency','text','currencyRate','text'],
    keys:['clmDistNo','reserveAmt','paytAmt','currencyCd','currencyRt','clmDistStatName'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    widths:[1,'auto','auto',1,150,150],
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

   resTableData:any[];
   payTableData:any[];
   cummResTableData:any[];


   histTypeFilter:any = 'L';

   currTab:string = 'reserve';

  constructor(public modalService: NgbModal, private clmService : ClaimsService, private titleService: Title, private ns: NotesService, private router: Router) { }

  ngOnInit() {
     this.titleService.setTitle("Clm | Claim Distribution");
     this.getClmHist();
  }

  getClmHist(data?){
    let params: any = {
      claimId : this.claimInfo.claimId,
      projId  : this.claimInfo.projId
    }
    if(data != undefined){
      data.forEach(a=>params[a.key] = a.search)
    }
    this.clmService.getClaimDist(params).subscribe(a=>{
      this.resTableData = a['claimDist'];
      // this.payTableData = a['claimDist'].filter(a=>a.histType==4 || a.histType==5);
      this.resTableData.forEach(a=>{
        a.bookingDate = a.bookingMth.toUpperCase()+'-'+a.bookingYear;
        a.createDate = this.ns.toDateTimeString(a.createDate);
        a.updateDate = this.ns.toDateTimeString(a.updateDate);
      })
      // this.payTableData.forEach(a=>{
      //   a.bookingDate = a.bookingMth.toUpperCase()+'-'+a.bookingYear;
      //   a.createDate = this.ns.toDateTimeString(a.createDate);
      //   a.updateDate = this.ns.toDateTimeString(a.updateDate);
      // })
      this.filterTable(this.histTypeFilter);
    })

    this.clmService.getClaimReserveDist(this.claimInfo.claimId,this.claimInfo.projId).subscribe(a=>{
      this.cummResTableData = a['list'];
      this.cummResTableData.forEach(a=>{
        // a.bookingDate = a.bookingMth.toUpperCase()+'-'+a.bookingYear;
        a.createDate = this.ns.toDateTimeString(a.createDate);
        a.updateDate = this.ns.toDateTimeString(a.updateDate);
      })
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

  clickRowCumm(data){
    this.selected = data;
    if(data == null){
      this.treatyDistPassData.tableData = [];
    }else{
      this.treatyDistPassData.tableData = this.selected.treatyList;
    }
    this.treatyTable.refreshTable();
  }

  onTabChange(data){
    console.log(data)
    if(data.nextId=='cummReserve'){
      this.treatyDistPassData.tHeader =  ['Treaty','Treaty Company', 'Treaty Share(%)','Reserve Amount','Payment Amount'];
      this.treatyDistPassData.dataTypes =  ['text','text','percent','currency','currency'];
      this.treatyDistPassData.keys = ['treatyAbbr','cedingAbbr','clmPctShare','reserveAmt','paytAmt'];
      this.treatyDistPassData.total = [null,'Total','clmPctShare','reserveAmt','paytAmt'];

      this.poolDistPassData.tHeader =  ['Treaty','Treaty Company', '1st Ret Line','1st Ret Reserve Amount','1st Ret Payment Amount','2nd Ret Line', '2nd Ret Reserve Amount', '2nd Ret Payment Amount'];
      this.poolDistPassData.dataTypes =  ['text','text','number','currency','currency','number','currency','currency'];
      this.poolDistPassData.keys = ['treatyAbbr','cedingAbbr','ret1Lines','ret1Amt','ret1PaytAmt','ret2Lines','ret2Amt','ret2PaytAmt'];
      this.poolDistPassData.total = [null,'Total','ret1Lines','ret1Amt','ret1PaytAmt','ret2Lines','ret2Amt','ret2PaytAmt'];


    }else{
      this.treatyDistPassData.tHeader =  ['Treaty','Treaty Company', 'Treaty Share(%)','Reserve Amount'];
      this.treatyDistPassData.dataTypes =  ['text','text','percent','currency'];
      this.treatyDistPassData.keys = ['treatyAbbr','cedingAbbr','clmPctShare','reserveAmt'];
      this.treatyDistPassData.total = [null,'Total','clmPctShare','reserveAmt'];

      this.poolDistPassData.tHeader =  ['Treaty','Treaty Company', '1st Ret Line','1st Ret Amount','2nd Ret Line', '2nd Ret Amount'];
      this.poolDistPassData.dataTypes =  ['text','text','number','currency','number','currency'];
      this.poolDistPassData.keys = ['treatyAbbr','cedingAbbr','ret1Lines','ret1Amt','ret2Lines','ret2Amt'];
      this.poolDistPassData.total = [null,'Total','ret1Lines','ret1Amt','ret2Lines','ret2Amt'];
    }
    this.selected = null;
    //this.paymentDistTable.indvSelect = null;
    this.reserveDistTable.indvSelect = null;
    this.treatyDistPassData.tableData = [];
    this.treatyTable.refreshTable();
    this.poolTable.refreshTable();
    this.currTab = data.nextId;
    setTimeout(a=>
      this.filterTable(this.histTypeFilter),0)
  }

  getPoolDist(){
      if(this.currTab =='cummReserve')
        this.clmService.getClaimReserveDistPool(this.claimInfo.claimId,this.claimInfo.projId,this.selected.histCategory,this.selected.clmDistNo).subscribe(a=>{
          this.poolDistPassData.tableData = a['claimsDistCeding'];
          this.poolSum.ret1 = this.poolDistPassData.tableData.reduce((a,b)=>a+parseFloat(b.ret1Amt),0);
          this.poolSum.ret2 = this.poolDistPassData.tableData.reduce((a,b)=>a+parseFloat(b.ret2Amt),0);
          this.poolSum.total = this.poolSum.ret1 + this.poolSum.ret2;
          this.poolSum.ret1 = this.poolSum.ret1.toFixed(2);
          this.poolSum.ret2 = this.poolSum.ret2.toFixed(2);
          this.poolSum.total = this.poolSum.total.toFixed(2);
          this.poolTable.refreshTable();
        });
      else
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
    if(this.currTab =='cummReserve'){
       let params:any = {
           claimId:this.claimInfo.claimId,
           projId:this.claimInfo.projId,
           histCategory:this.histTypeFilter,
           createUser:this.ns.getCurrentUser(),
           createDate:this.ns.toDateTimeString(0),
           updateUser:this.ns.getCurrentUser(),
           updateDate:this.ns.toDateTimeString(0),
       }
      this.clmService.redistributeClaimReserveDist(params).subscribe(a=>{
        if(a['returnCode']==-1){
          this.diagIcon = 'nice';
          this.getClmHist();
        }else{
          this.diagIcon = 'error'
        }
        this.successDiag.open()
      })
    }else{
      let params:any = {
           claimId:this.claimInfo.claimId,
           projId:this.claimInfo.projId,
           histNo:this.selected.histNo,
           clmDistNo: this.selected.clmDistNo,
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

  filterTable(histCd){
    this.selected = null;
    this.histTypeFilter = histCd;
    if(this.currTab == 'reserve'){
      this.reserveDistPassData.tableData = this.resTableData.filter(a=>a.histCategory == histCd);
      if(this.reserveDistPassData.tableData.length > 0){
        this.reserveDistTable.onRowClick(null, this.reserveDistPassData.tableData[0])
      }else{
        this.treatyDistPassData.tableData = [];
      }
      this.reserveDistTable.refreshTable();
    }
    else if(this.currTab == 'payment'){
      this.paymentDistPassData.tableData = this.payTableData.filter(a=>a.histCategory == histCd);
      if(this.paymentDistPassData.tableData.length > 0){
        this.paymentDistTable.onRowClick(null, this.paymentDistPassData.tableData[0])
      }else{
        this.treatyDistPassData.tableData = [];
      }
      this.paymentDistTable.refreshTable();
    }else{
      this.cummDistPassData.tableData = this.cummResTableData.filter(a=>a.histCategory == histCd);
      if(this.cummDistPassData.tableData.length > 0){
        this.cummResDistTable.onRowClick(null, this.cummDistPassData.tableData[0])
      }else{
        this.treatyDistPassData.tableData = [];
      }
      this.cummResDistTable.refreshTable();
    }

    this.treatyTable.refreshTable();
  }

}
