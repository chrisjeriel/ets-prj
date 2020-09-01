import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService, UserService, PrintService, MaintenanceService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { environment } from '@environments/environment';
import { Title } from '@angular/platform-browser';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-mon-end-batch',
  templateUrl: './mon-end-batch.component.html',
  styleUrls: ['./mon-end-batch.component.css']
})
export class MonEndBatchComponent implements OnInit, OnDestroy {
  @ViewChild('txtArea') txtArea: ElementRef;
  @ViewChild('eomProdMdl') eomProdMdl: ModalComponent;

  eomDate: string = '';
  extLog: string = '';
  eomMessage: string = '';
  processing: boolean = false;
  returnCode: number = null
  webSocketEndPoint: string = environment.prodApiUrl + '/extractionLog';
  topic: string = "/prodLogs";
  stompClient: any;
  msg: number = 1;

  passDataCsv : any[] =[];

  constructor(private router: Router, private as: AccountingService, private ns: NotesService, private titleService: Title, private userService: UserService,private ps : PrintService, private ms: MaintenanceService) {
  }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Batch Processing");
    this.userService.emitModuleId("ACIT063");

    this.wsConnect();
    this.getAcitMonthEnd();
  }

  ngOnDestroy() {
    this.wsDisconnect();
  }

  wsConnect() {
      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      _this.stompClient.connect({}, function (frame) {
          _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
              _this.extLog += (_this.extLog == '' ? '' : '\n') + sdkEvent.body;
              _this.scrollDown();
          });
      }, this.errorCallBack);
  };

  wsDisconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
  }

  errorCallBack(error) {
      console.log("errorCallBack -> " + error)
      setTimeout(() => {
          this.wsConnect();
      }, 5000);
  }

  onTabChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'Exit') {
      this.router.navigateByUrl('/');
    }
  }

  getAcitMonthEnd(eomDate?) {
    var date = eomDate === undefined ? this.ns.toDateTimeString(0) : eomDate;
    this.processing = true;
    this.as.getAcitMonthEnd(date).subscribe(data => {
      this.processing = false;
      if(data['monthEnd'].length > 0) {
        this.eomDate = this.ns.toDateTimeString(data['monthEnd'][0].eomDate).split('T')[0];
        this.extLog = data['monthEnd'][0].batchProdReport;
      } else {
        this.extLog = '';
      }
    });
  }

  onClickGenerate(force?) {
    this.processing = true;
    this.extLog = '';

    var param = {
      force: force === undefined ? 'N' : 'Y',
      eomDate: this.eomDate,
      eomUser: this.ns.getCurrentUser()
    }
    
    this.as.saveAcitMonthEndBatchProd(param).subscribe(data => {
      this.processing = false;
      this.returnCode = data['returnCode'];
      if(this.returnCode == 1 || this.returnCode == 2) {
        this.eomMessage = data['eomMessage'];
        this.eomProdMdl.openNoClose();
      }
    });
  }

  scrollDown() {
    setTimeout(() => {
      this.txtArea.nativeElement.scrollTop = this.txtArea.nativeElement.scrollHeight;  
    }, 0);
  }

  printReport:any = 'ACITR063A';
  printDestination:any = 'screen';
  @ViewChild('printModal') printModal: ModalComponent;
   print(){
    if(this.printDestination == 'exl'){
      this.passDataCsv = [];
      this.getExtractToCsv();
      return;
    }

    if(this.printReport == 'ACITR063A') {
      let params:any = {
                          prodDate : this.ns.toDateTimeString(this.eomDate)
                        };
      params.reportId=this.printReport;
      params.fileName = 'Monthly_Production_Report'+ this.ns.toDateTimeString(this.eomDate);
      this.ps.print(this.printDestination,this.printReport,params);
    } else {
      this.as.getAcitMonthEndJV('PROD', this.eomDate).subscribe(data => {
        var jvList = data['monthEndJVList'];

        if(jvList.length > 0) {
          var name = 'MonthEndJVList_Production';
          var query = 'SELECT tranNo AS [Tran No], ' +
                             'tranTypeName AS [Tran Type], ' +
                             'datetime(acctEntDate) AS [Tran Date], ' +
                             'currCd AS [Currency], ' +
                             'currency(jvAmt) AS [Amount]';

          var x = jvList.map(a => Object.create(a));
          this.ns.export(name, query, x);
        } else {
          this.returnCode = 2;
          this.eomMessage = 'No record';
          this.eomProdMdl.openNoClose();
        }
      });
    }
  }

  checkMonth(ev) {
    if(ev !== '') {
      this.getAcitMonthEnd(ev);
    }
  }

  getExtractToCsv(){
    this.ms.getExtractToCsv(this.ns.getCurrentUser(),this.printReport,this.ns.toDateTimeString(this.eomDate))
    .subscribe(data => {
      console.log(data);
      var months = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",     
        "Oct", "Nov", "Dec");

        alasql.fn.myFormat = function(d){
          var date = new Date(d);
          var day = (date.getDate()<10)?"0"+date.getDate():date.getDate();
          var mos = months[date.getMonth()];
          return day+'-'+mos+'-'+date.getFullYear(); 
        };

        alasql.fn.negFmt = function(m){
          return (m==null || m=='') ? 0 : Number(m);
        };

        alasql.fn.isNull = function(n){
          return n==null?'':n;
        };

        alasql.fn.checkNullNo = function(o){
          return (o==null || o=='')?'': Number(o);
        };


        var name = this.printReport;
        var query = '';
        if(this.printReport == 'ACITR063A'){
          this.passDataCsv = data['listAcitr063a'];
          query = 'SELECT extractUser AS [EXTRACT USER],myFormat(fromDate) AS [FROM DATE], myFormat(toDate) AS [TO DATE],currencyCd AS [CURRENCY],'+
          'lineCd as [LINE],policyNo || "/" || instNo as [POLICY NO / INST NO],negFmt(currency(tsiAmt)) as [TOTAL SI],negFmt(currency(tsiQuota)) as [QUOTA SI],'+
          'negFmt(currency(tsi1stRet)) as [SI 1st RET],negFmt(currency(tsi2ndRet)) as [SI 2nd RET],negFmt(currency(tsi1stSurplus)) as [SI 1st SURPLUS],'+
          'negFmt(currency(tsi2ndSurplus)) as [SI 2nd SURPLUS],negFmt(currency(tsiFacul)) as [SI FACUL],'+
          'negFmt(currency(premAmt)) as [TOTAL PREM],negFmt(currency(premQuota)) as [QUOTA PREM],'+
          'negFmt(currency(prem1stRet)) as [PREM 1st RET],negFmt(currency(prem2ndRet)) as [PREM 2nd RET],negFmt(currency(prem1stSurplus)) as [PREM 1st SURPLUS],'+
          'negFmt(currency(prem2ndSurplus)) as [PREM 2nd SURPLUS],negFmt(currency(premFacul)) as [PREM FACUL],'+
          'negFmt(currency(commAmt)) as [TOTAL COMM],negFmt(currency(commQuota)) as [QUOTA COMM],'+
          'negFmt(currency(comm1stRet)) as [COMM 1st RET],negFmt(currency(comm2ndRet)) as [COMM 2nd RET],negFmt(currency(comm1stSurplus)) as [COMM 1st SURPLUS],'+
          'negFmt(currency(comm2ndSurplus)) as [COMM 2nd SURPLUS],negFmt(currency(commFacul)) as [COMM FACUL],'+
          'negFmt(currency(commVatAmt)) as [TOTAL COMM VAT],negFmt(currency(commVatQuota)) as [QUOTA COMM VAT],'+
          'negFmt(currency(commVat1stRet)) as [COMM VAT 1st RET],negFmt(currency(commVat2ndRet)) as [COMM VAT 2nd RET],negFmt(currency(commVat1stSurplus)) as [COMM VAT 1st SURPLUS],'+
          'negFmt(currency(commVat2ndSurplus)) as [COMM VAT 2nd SURPLUS],negFmt(currency(commVatFacul)) as [COMM VAT FACUL],'+
          'negFmt(currency(netDueAmt)) as [TOTAL NET DUE],negFmt(currency(netDueQuota)) as [QUOTA NET DUE],'+
          'negFmt(currency(netDue1stRet)) as [NET DUE 1st RET],negFmt(currency(netDue2ndRet)) as [NET DUE 2nd RET],negFmt(currency(netDue1stSurplus)) as [NET DUE 1st SURPLUS],'+
          'negFmt(currency(netDue2ndSurplus)) as [NET DUE 2nd SURPLUS],negFmt(currency(netDueFacul)) as [NET DUE FACUL]';
        }

        console.log(this.passDataCsv);
        this.ns.export(name, query, this.passDataCsv);
    });
  }

}
