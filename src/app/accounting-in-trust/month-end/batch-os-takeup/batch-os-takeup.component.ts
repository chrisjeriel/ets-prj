import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService, UserService } from '@app/_services';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { environment } from '@environments/environment';
import { Title } from '@angular/platform-browser';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-batch-os-takeup',
  templateUrl: './batch-os-takeup.component.html',
  styleUrls: ['./batch-os-takeup.component.css']
})
export class BatchOsTakeupComponent implements OnInit, OnDestroy {
  @ViewChild('txtArea') txtArea: ElementRef;
  @ViewChild('eomOsMdl') eomOsMdl: ModalComponent;

  eomDate: string = '';
  dialogMsg: string = '';
  dialogIcon: string = '';
  eomMessage: string = '';
  processing: boolean = false;
  returnCode: number = null;
  extLog: string = '';
  webSocketEndPoint: string = environment.prodApiUrl + '/extractionLog';
  topic: string = "/osLogs";
  stompClient: any;

  constructor( private router: Router, private as: AccountingService, private ns: NotesService, private titleService: Title, private userService: UserService) { }

  ngOnInit() {
    this.titleService.setTitle("Acct-IT | Batch OS Losses");
    this.userService.emitModuleId("ACIT064");

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
        this.extLog = data['monthEnd'][0].batchOsReport;
      }
    });
  }

  onClickBookOS(force?) {
    this.processing = true;
    this.extLog = '';

    var param = {
      force: force === undefined ? 'N' : 'Y',
      eomDate: this.eomDate,
      eomUser: this.ns.getCurrentUser()
    }

    this.as.saveAcitMonthEndBatchOS(param).subscribe(data => {
      this.processing = false;
      this.returnCode = data['returnCode'];
      if(this.returnCode == 1 || this.returnCode == 2) {
        this.eomMessage = data['eomMessage'];
        this.eomOsMdl.openNoClose();
      }
    });
  }

  scrollDown() {
    setTimeout(() => {
      this.txtArea.nativeElement.scrollTop = this.txtArea.nativeElement.scrollHeight;  
    }, 0);
  }
}
