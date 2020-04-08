import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService, UserService, PrintService } from '@app/_services';
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

  constructor(private router: Router, private as: AccountingService, private ns: NotesService, private titleService: Title, private userService: UserService,private ps : PrintService) {
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

    this.as.getAcitMonthEnd(date).subscribe(data => {
      if(data['monthEnd'].length > 0) {
        this.eomDate = this.ns.toDateTimeString(data['monthEnd'][0].eomDate).split('T')[0];
        this.extLog = data['monthEnd'][0].batchProdReport;
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
    let params:any = {
                        prodDate : this.ns.toDateTimeString(this.eomDate)
                      };
    params.reportId=this.printReport;
    params.fileName = 'Monthly_Production_Report'+ this.ns.toDateTimeString(this.eomDate);
    this.ps.print(this.printDestination,this.printReport,params);
  }

}
