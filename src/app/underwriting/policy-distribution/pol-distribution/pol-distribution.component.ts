import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionByRiskInfo } from '@app/_models';
import { UnderwritingService, NotesService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import * as alasql from 'alasql';

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
  @ViewChild('confirmNegate') confirmNegMdl: ModalComponent;
  @ViewChild('success') sucessMdl: ModalComponent;
  @ViewChild('successNegate') sucessnegMdl: ModalComponent;
  @ViewChild('successNegateWCoIns') sucessNegWCoMdl: ModalComponent;

  @ViewChild('inProgCoinsMdl') inProgCoinsMdl: ModalComponent;
  @ViewChild('missingCoinsMdl') missingCoinsMdl: ModalComponent;

  missingCoins:any[] = [];
  inProgCoins:any[] = [];

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
      pageLength: 'unli',
      exportFlag: true,
    }

    poolDistributionData: any = {
      tableData: [],
      tHeader: ['Section', 'Treaty', 'Treaty Company', '1st Ret Line', '1st Ret SI Amt', '1st Ret Prem Amt', '2nd Ret Line', '2nd Ret SI Amt', '2nd Ret Prem Amt', 'Comm Rate (%)', 'Comm Amt', 'VAT on R/I Comm', 'Net Due'],
      dataTypes: ['text', 'text', 'text', 'number', 'currency', 'currency', 'number', 'currency', 'currency', 'percent', 'currency', 'currency', 'currency'],
      keys: ['section', 'treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
      widths: [1,1,250,1,140,140,1,140,140,1,140,140,140],
      uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true],
      paginateFlag: true,
      infoFlag: true,
      pageLength: 'unli',
      pageID: 'poolDistTable',
      searchFlag : true,
      exportFlag: true,
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


  pts1:any = {
    ret: 0.00,
    ret1si: 0.00,
    ret1prem: 0.00,
    ret2si: 0.00,
    ret2prem: 0.00,
    comAmt:0.00,
    vat:0.00,
    net:0.00
  };

  pts2:any = {
    ret: 0.00,
    ret1si: 0.00,
    ret1prem: 0.00,
    ret2si: 0.00,
    ret2prem: 0.00,
    comAmt:0.00,
    vat:0.00,
    net:0.00
  };

  ptotal:any = {
    ret: 0.00,
    ret1si: 0.00,
    ret1prem: 0.00,
    ret2si: 0.00,
    ret2prem: 0.00,
    comAmt:0.00,
    vat:0.00,
    net:0.00
  };

  @Input() inquiryFlag: boolean = false;

  constructor(private polService: UnderwritingService, private titleService: Title, private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private ns: NotesService) { }

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
        this.ts1.si   +=a.siAmt;
        this.ts1.prem +=a.premAmt;
        this.ts1.comm +=a.commAmt;
        this.ts1.vat  +=a.vatRiComm;
        this.ts1.net  +=a.netDue;
      }else{
        this.ts2.si   +=a.siAmt;
        this.ts2.prem +=a.premAmt;
        this.ts2.comm +=a.commAmt;
        this.ts2.vat  +=a.vatRiComm;
        this.ts2.net  +=a.netDue;
      }
    });
      this.total.si   +=  this.ts1.si +  this.ts2.si;
      this.total.prem += this.ts1.prem +  this.ts2.prem;
      this.total.comm += this.ts1.comm +  this.ts2.comm;
      this.total.vat  += this.ts1.vat +  this.ts2.vat;
      this.total.net  += this.ts1.net +  this.ts2.net;

      this.ts1.si = Number(this.ts1.si).toFixed(2);
      this.ts1.prem = Number(this.ts1.prem).toFixed(2);
      this.ts1.comm = Number(this.ts1.comm).toFixed(2);
      this.ts1.vat = Number(this.ts1.vat).toFixed(2);
      this.ts1.net = Number(this.ts1.net).toFixed(2);
      this.ts2.si = Number(this.ts2.si).toFixed(2);
      this.ts2.prem = Number(this.ts2.prem).toFixed(2);
      this.ts2.comm = Number(this.ts2.comm).toFixed(2);
      this.ts2.vat = Number(this.ts2.vat).toFixed(2);
      this.ts2.net = Number(this.ts2.net).toFixed(2);
      this.total.si = Number(this.total.si).toFixed(2);
      this.total.prem = Number(this.total.prem).toFixed(2);
      this.total.comm = Number(this.total.comm).toFixed(2);
      this.total.vat = Number(this.total.vat).toFixed(2);
      this.total.net = Number(this.total.net).toFixed(2);
  }

  getSumsPool(){
      this.pts1 = {
      ret: 0.00,
      ret1si: 0.00,
      ret1prem: 0.00,
      ret2si: 0.00,
      ret2prem: 0.00,
      comAmt:0.00,
      vat:0.00,
      net:0.00
    };
    this.pts2 = {
      ret: 0.00,
      ret1si: 0.00,
      ret1prem: 0.00,
      ret2si: 0.00,
      ret2prem: 0.00,
      comAmt:0.00,
      vat:0.00,
      net:0.00
    };

    this.ptotal = {
      ret: 0.00,
      ret1si: 0.00,
      ret1prem: 0.00,
      ret2si: 0.00,
      ret2prem: 0.00,
      comAmt:0.00,
      vat:0.00,
      net:0.00
    };

    this.poolDistributionData.tableData.forEach(a=>{
      if(a.section == 'I'){
        this.pts1.ret += a.retOneLines + a.retTwoLines;
        this.pts1.ret1si += a.retOneTsiAmt;
        this.pts1.ret1prem += a.retOnePremAmt;
        this.pts1.ret2si += a.retTwoTsiAmt;
        this.pts1.ret2prem += a.retTwoPremAmt;
        this.pts1.comAmt += a.totalCommAmt;
        this.pts1.vat += a.totalVatRiComm;
        this.pts1.net += a.totalNetDue;
      }else{
        this.pts2.ret += a.retOneLines + a.retTwoLines;
        this.pts2.ret1si += a.retOneTsiAmt;
        this.pts2.ret1prem += a.retOnePremAmt;
        this.pts2.ret2si += a.retTwoTsiAmt;
        this.pts2.ret2prem += a.retTwoPremAmt;
        this.pts2.comAmt += a.totalCommAmt;
        this.pts2.vat += a.totalVatRiComm;
        this.pts2.net += a.totalNetDue;
      }
    });
      this.ptotal.ret = this.pts1.ret + this.pts2.ret;
      this.ptotal.ret1si = this.pts1.ret1si + this.pts2.ret1si;
      this.ptotal.ret1prem = this.pts1.ret1prem + this.pts2.ret1prem;
      this.ptotal.ret2si = this.pts1.ret2si + this.pts2.ret2si;
      this.ptotal.ret2prem = this.pts1.ret2prem + this.pts2.ret2prem;
      this.ptotal.comAmt = this.pts1.comAmt + this.pts2.comAmt;
      this.ptotal.vat = this.pts1.vat + this.pts2.vat;
      this.ptotal.net = this.pts1.net + this.pts2.net;

      this.pts1.ret =Number(this.pts1.ret).toFixed(2);
      this.pts1.ret1si =Number(this.pts1.ret1si).toFixed(2);
      this.pts1.ret1prem =Number(this.pts1.ret1prem).toFixed(2);
      this.pts1.ret2si =Number(this.pts1.ret2si).toFixed(2);
      this.pts1.ret2prem =Number(this.pts1.ret2prem).toFixed(2);
      this.pts1.comAmt =Number(this.pts1.comAmt).toFixed(2);
      this.pts1.vat =Number(this.pts1.vat).toFixed(2);
      this.pts1.net =Number(this.pts1.net).toFixed(2);
      this.pts2.ret =Number(this.pts2.ret).toFixed(2);
      this.pts2.ret1si =Number(this.pts2.ret1si).toFixed(2);
      this.pts2.ret1prem =Number(this.pts2.ret1prem).toFixed(2);
      this.pts2.ret2si =Number(this.pts2.ret2si).toFixed(2);
      this.pts2.ret2prem =Number(this.pts2.ret2prem).toFixed(2);
      this.pts2.comAmt =Number(this.pts2.comAmt).toFixed(2);
      this.pts2.vat =Number(this.pts2.vat).toFixed(2);
      this.pts2.net =Number(this.pts2.net).toFixed(2);
      this.ptotal.ret =Number(this.ptotal.ret).toFixed(2);
      this.ptotal.ret1si =Number(this.ptotal.ret1si).toFixed(2);
      this.ptotal.ret1prem =Number(this.ptotal.ret1prem).toFixed(2);
      this.ptotal.ret2si =Number(this.ptotal.ret2si).toFixed(2);
      this.ptotal.ret2prem =Number(this.ptotal.ret2prem).toFixed(2);
      this.ptotal.comAmt =Number(this.ptotal.comAmt).toFixed(2);
      this.ptotal.vat =Number(this.ptotal.vat).toFixed(2);
      this.ptotal.net =Number(this.ptotal.net).toFixed(2);
  }

  //NECO 06/04/2019
  retrievePolicyDistribution(){
    this.polService.getPolDistribution(this.params.policyId).subscribe((data: any)=>{
      this.missingCoins = data.missingCoins;
      this.inProgCoins = data.inProgCoins;
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
      this.getSumsPool();
      setTimeout(()=>{
         $('input[type=text]').focus();
         $('input[type=text]').blur();
      },0);
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
    if(this.missingCoins.length != 0){
      this.missingCoinsMdl.openNoClose();
      console.log(this.missingCoins)
      return;
    }else if(this.inProgCoins.length != 0){
      this.inProgCoinsMdl.openNoClose();
      return;
    }
    this.confirmPostMdl.openNoClose();
  }

  showConfirmNegMdl(){
    this.confirmNegMdl.openNoClose();
  }

  postDistribution(){
    let postData:any = {
      riskDistId: this.riskDistId,
      distId    : this.polDistributionData.distNo,
      policyId  : this.params.policyId,
      user      : this.ns.getCurrentUser()
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


 // negate part

  postedList:any[] = [];

  negateDistribution(){
    let params:any = {
      riskDistId: this.riskDistId,
      distId    : this.polDistributionData.distNo,
      policyId  : this.params.policyId,
      updateUser: JSON.parse(window.localStorage.currentUser).username
    };
    this.polService.negateDist(params).subscribe(a=>{

      console.log(a);

      if(a['returnCode'] == -1 && a['postedDist'].length == 0){
        this.sucessnegMdl.openNoClose();
      }else if(a['returnCode'] == -1 && a['postedDist'].length > 0){
        this.postedList = a['postedDist'];
        this.sucessNegWCoMdl.open();
      }
    })
    this.confirmNegMdl.closeModal();
  }

  goToNegateScreen(){
    this.router.navigate([this.params.exitLink])
  }

  goToRiskDistribution(){
    // this.params.writable = true;
    // this.params.fromNegate = false;
    // this.router.navigate(['policy-dist', this.params]);

    this.router.navigate(['policy-dist', {policyId:this.params.policyId,
                                                 policyNo: this.params.policyNo,
                                                 lineCd:this.params.lineCd,
                                                 lineClassCd: this.params.lineClassCd,
                                                 cedingName: this.params.cedingName,
                                                 insured: this.params.insuredDesc,
                                                 riskName: this.params.riskName,
                                                 exitLink: '/pol-dist-list',
                                                 fromNegate : false
                                                 }], { skipLocationChange: true });
  }

  exportTreatyDistPerSection(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'TreatyDistPerSection_'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };

      //keys: ['treatyName', 'trtyCedName', 'pctShare', 'siAmt', 'premAmt', 'commRt', 'commAmt', 'vatRiComm', 'netDue'],
     alasql('SELECT section as Section, treatyAbbr as TreatyName, trtyCedName as CedingName, siAmt as SiAmt, premAmt as PremAmt, commRt as CommRt, commAmt as CommAmt, vatRiComm as VatRiComm, netDue as NetDue INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.treatyDistData.tableData]);
  }

  exportPoolDistPerSection(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hr = String(today.getHours()).padStart(2,'0');
    var min = String(today.getMinutes()).padStart(2,'0');
    var sec = String(today.getSeconds()).padStart(2,'0');
    var ms = today.getMilliseconds()
    var currDate = yyyy+'-'+mm+'-'+dd+'T'+hr+'.'+min+'.'+sec+'.'+ms;
    var filename = 'PoolDistPerSection_'+currDate+'.xls'
    var mystyle = {
        headers:true, 
        column: {style:{Font:{Bold:"1"}}}
      };

      alasql.fn.datetime = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleString();
      };
      //tHeader: ['Treaty', 'Treaty Company', '1st Ret Line', '1st Ret SI Amt', '1st Ret Prem Amt', '2nd Ret Line', '2nd Ret SI Amt', '2nd Ret Prem Amt', 'Comm Rate (%)', 'Comm Amount', 'VAT on R/I Comm', 'Net Due'],
      //keys: ['treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue'],
     
     //['section', 'treatyAbbr', 'cedingName', 'retOneLines', 'retOneTsiAmt', 'retOnePremAmt', 'retTwoLines', 'retTwoTsiAmt', 'retTwoPremAmt', 'commRt', 'totalCommAmt', 'totalVatRiComm', 'totalNetDue',];


     alasql('SELECT section AS Section, treatyAbbr AS TreatyName, cedingName AS CedingName, retOneLines AS RetentionOneLines, retOneTsiAmt AS RetentionOneTsiAmt, retOnePremAmt AS RetentionOnePremAmt, retTwoLines AS RetentionTwoLines, retTwoTsiAmt AS RetentionTwoTsiAmt, retTwoPremAmt AS RetentionTwoPremAmt, commRt AS CommRt, totalCommAmt AS TotalCommAmt, totalVatRiComm AS TotalVatRiComm, totalNetDue AS TotalNetDue ' +
            'INTO XLSXML("'+filename+'",?) FROM ?',[mystyle,this.poolDistributionData.tableData]);
  }
}

