import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionByRiskInfo } from '@app/_models';
import { UnderwritingService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-pol-distribution',
  templateUrl: './pol-distribution.component.html',
  styleUrls: ['./pol-distribution.component.css']
})
export class PolDistributionComponent implements OnInit, OnDestroy {

  //NECO 06/04/2019
  @ViewChild('mainTable') mainTable: CustEditableNonDatatableComponent;
  @ViewChild('poolTable') poolTable: CustEditableNonDatatableComponent;
  //END

  @ViewChild('confirmPost') confirmPostMdl: ModalComponent;
  @ViewChild('success') sucessMdl: ModalComponent;

  nData: DistributionByRiskInfo = new DistributionByRiskInfo(null, null, null, null, null, null);

  distFlag: any = 'treaty';

  //NECO 06/04/2019
    treatyDistData: any = {
      tHeader: ['Section', 'Treaty', 'Treaty Company', 'SI Amount', 'Premium Amount', 'Comm Rate (%)', 'Comm Amount', 'VAT on R/I Comm', 'Net Due'],
      tableData: [],
      dataTypes: ['text', 'text', 'text', 'currency', 'currency', 'percent', 'currency', 'currency', 'currency'],
      keys: ['section', 'treatyAbbr', 'trtyCedName', 'siAmt', 'premAmt', 'commRt', 'commAmt', 'vatRiComm', 'netDue'],
      uneditable: [true,true,true,true,true,true,true,true,true],
      widths: [1,1,'auto',150,150,150,150,150,150],
      // total: [null,null,'TOTAL', 'siAmt', 'premAmt', null, 'commAmt', 'vatRiComm', 'netDue'],
      searchFlag: true,
      paginateFlag: false,
      infoFlag: false,
      pageID: 'trtyDistTable',
      pageLength: 'unli'
    }

    poolDistributionData: any = {
      tableData: [],
      tHeader: ['Section', 'Treaty', 'Treaty Company', '1st Ret Line', '1st Ret SI Amt', '1st Ret Prem Amt', '2nd Ret Line', '2nd Ret SI Amt', '2nd Ret Prem Amt', 'Comm Rate (%)', 'Comm Amt', 'VAT on R/I Comm', 'Net Due'],
      dataTypes: ['text', 'text', 'text', 'number', 'currency', 'currency', 'number', 'currency', 'currency', 'percent', 'currency', 'currency', 'currency'],
      keys: ['section', 'treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
      widths: [1,1,250,1,140,140,1,140,140,1,140,140,140],
      uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true],
      total:[null, null,'TOTAL',null, 'retOneTsiAmt', 'retOnePremAmt', null, 'retTwoTsiAmt', 'retTwoPremAmt', null, 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
      paginateFlag: true,
      infoFlag: true,
      pageLength: 10,
      pageID: 'poolDistTable',
      searchFlag : true
    }

    sub: any;
    params: any;
    polDistributionData: any;
    @Input() riskDistId: number;
    @Input() riskDistStatus: string;
  //END

  ts1:any = {
    si: 0,
    prem: 0,
    comm: 0,
    vat: 0,
    net:0
  };

  ts2:any = {
    si: 0,
    prem: 0,
    comm: 0,
    vat: 0,
    net:0
  };

  total:any = {
    si: 0,
    prem: 0,
    comm: 0,
    vat: 0,
    net:0
  };

  constructor(private polService: UnderwritingService, private titleService: Title, private modalService: NgbModal, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Policy Distribution");

    //NECO 06/04/2019
    this.sub = this.route.params.subscribe((data: any)=>{
                  this.params = data;
                  this.retrievePolicyDistribution();
                });
    //END
  }
  getSums(){
    this.treatyDistData.tableData.forEach(a=>{
      if(a.section == 'I'){
        this.ts1.si   += a.siAmt;
        this.ts1.prem += a.premAmt;
        this.ts1.comm += a.commAmt;
        this.ts1.vat  += a.vatRiComm;
        this.ts1.net  += a.netDue;
      }else{
        this.ts2.si   += a.siAmt;
        this.ts2.prem += a.premAmt;
        this.ts2.comm += a.commAmt;
        this.ts2.vat  += a.vatRiComm;
        this.ts2.net  += a.netDue;
      }
    });
      this.total.si   +=  this.ts1.si +  this.ts2.si;
      this.total.prem += this.ts1.prem +  this.ts2.prem;
      this.total.comm += this.ts1.comm +  this.ts2.comm;
      this.total.vat  += this.ts1.vat +  this.ts2.vat;
      this.total.net  += this.ts1.net +  this.ts2.net;
  }

  //NECO 06/04/2019
  retrievePolicyDistribution(){
    this.polService.getPolDistribution(this.params.policyId).subscribe((data: any)=>{
      console.log(data);
      this.polDistributionData = data.polDistribution;
      this.treatyDistData.tableData = data.polDistribution.trtyListPerSec;
      this.mainTable.refreshTable();
      this.getSums();
      setTimeout(()=>{
         $('input[type=text]').focus();
         $('input[type=text]').blur();
      },0);
    })
  }

  retrievePoolDistribution(){
    this.poolTable.loadingFlag = true;
    this.polService.getPolPoolDistribution(this.polDistributionData.distNo,this.params.policyId ).subscribe((data:any)=>{
      this.poolDistributionData.tableData = data.poolDistList;
      this.poolTable.refreshTable();
      this.poolTable.loadingFlag = false;
    });
  }

  pad(str: string, key: string){
      return String(str).padStart(5, '0');
  }

  round(val: number){
    return Math.round(val * 10000000000) / 10000000000;
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  //END

  showConfirmPostMdl(){
    this.confirmPostMdl.openNoClose();

  }

  postDistribution(){
    let postData:any = {
      riskDistId: this.riskDistId,
      distId    : this.polDistributionData.distNo,
      policyId  : this.params.policyId
    }
    this.polService.postDistribution(postData).subscribe(a=>{
      if(a['returnCode'] == -1){
        this.sucessMdl.openNoClose();
        this.retrievePolicyDistribution();
      }
    });
    this.confirmPostMdl.closeModal();
  }

  padStart(s:string,l:number):String{
    return String(s).padStart(l,'0');
  }

  onClickCancel(){
    this.router.navigate([this.params.exitLink,{policyId:this.params.policyId}])
  }
}

