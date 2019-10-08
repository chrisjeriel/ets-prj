import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService, NotesService, WebsocketService } from '@app/_services';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-mon-end-batch',
  templateUrl: './mon-end-batch.component.html',
  styleUrls: ['./mon-end-batch.component.css']
})
export class MonEndBatchComponent implements OnInit {
  @ViewChild('txtArea') txtArea: ElementRef;

  eomDate: string = '';
  extLog: string = '';
  webSocketEndPoint: string = 'http://localhost:8888/api/socket';
  topic: string = "/extractionLog";
  stompClient: any;

  constructor(private router: Router, private as: AccountingService, private ns: NotesService) {
  }

  ngOnInit() {
  }

  wsConnect() {
      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      _this.stompClient.connect({}, function (frame) {
          _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
              // _this.appendLog(sdkEvent);
              _this.extLog += (_this.extLog == '' ? '' + sdkEvent.body : '\n' + sdkEvent.body) ;
              // _this.txtArea.nativeElement.scrollTop = _this.txtArea.nativeElement.scrollHeight;
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

  onClickGenerate() {
    this.extLog = '';
    var param = {
      eomDate: this.eomDate,
      eomUser: this.ns.getCurrentUser()
    }

    this.wsConnect();
    this.as.saveAcitMonthEndBatchProd(param).subscribe(data => {
      /*if(data['returnCode'] == -1) {
        this.extLog = 'Initializing . . . \nClosing Valid Transaction . . . \nInward Production Processing . . . \nDistributing Inward Production . . . \nFunds Held Extraction . . . \nComputing Interest on Overdue Accounts \nFinished . . .'
      } else {
        this.extLog = 'Initializing . . . \n' + data['errorList'][0].errorMessage;
      }*/
      // this.wsDisconnect();
    });
  }

}
