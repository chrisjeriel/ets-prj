import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { UnderwritingService, NotesService, PrintService} from '@app/_services';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-pol-issuance-open-cover-letter',
  templateUrl: './pol-issuance-open-cover-letter.component.html',
  styleUrls: ['./pol-issuance-open-cover-letter.component.css']
})
export class PolIssuanceOpenCoverLetterComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,private router: Router, private modalService: NgbModal, 
              private uw: UnderwritingService, private ns: NotesService, private ps: PrintService) { }

  @ViewChild('tabset') tabset: any;
  @ViewChild('recordLock') recordLock;
  policyInfo:any;
  inqFlag:any;
  title:string = "Policy / Issuance / Create Open Cover /";
  exitLink:string;

  webSocketEndPoint: string = environment.prodApiUrl + '/moduleSecurity';
  topic: string = "/pol-oc";
  stompClient: any;
  initLoad: boolean = true;
  lockModalShown: boolean = false;
  lockUser: string = "";
  lockMessage: string = "";

  @ViewChild('activeComp') activeComp : any;

  ngOnInit() {
  	this.route.params.subscribe((a:any)=>{
  		this.policyInfo = JSON.parse(JSON.stringify(a));
      console.log(this.policyInfo);
      this.inqFlag = a['inqFlag'] == 'true';
      if(this.inqFlag){
        this.title = "Policy / Inquiry / Open Cover Inquiry /"
      }
      this.exitLink = !a['exitLink'] ? '/open-cover-list' : a['exitLink'];

      if(!this.inqFlag){
        this.wsConnect();
      }
  	})    
  }

  ngOnDestroy() {
    if (!this.inqFlag && this.stompClient != undefined) {
      this.wsDisconnect();
    }
  }

  wsConnect() {
      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      _this.stompClient.connect({}, function (frame) {
          if (_this.initLoad) {
            _this.sendMessage();
            _this.initLoad = false;
          }

          _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
              var obj = JSON.parse(sdkEvent.body);
              if (obj.message == "") {
                if (_this.policyInfo.policyIdOc == obj.refId) {
                  if (_this.ns.getCurrentUser() == obj.user) {
                    //Proceed because same user.
                    console.log("Same user with same record, proceed.");
                  } else {
                    _this.stompClient.send(_this.topic, {}, JSON.stringify({ user: _this.ns.getCurrentUser(), refId: _this.policyInfo.policyIdOc, message: "This record is currently being updated by " }));
                  }
                }
              } else {
                if (_this.policyInfo.policyIdOc == obj.refId) {
                  if (_this.ns.getCurrentUser() != obj.user) {
                    setTimeout(() => {
                        if (_this.lockModalShown == false) {
                         _this.modalService.open(_this.recordLock, { centered: true, backdrop: 'static', windowClass: "modal-size" });
                         _this.lockModalShown = true;
                         _this.lockUser = obj.user;
                         _this.lockMessage = obj.message;
                        }
                     });
                  }
                }
              }
          });
      }, this.errorCallBack);
  }; 

  wsDisconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
  }

  sendMessage() {
    this.stompClient.send(this.topic, {}, JSON.stringify({ user: this.ns.getCurrentUser(), refId: this.policyInfo.policyIdOc, message: "" }));
  }

  errorCallBack(error) {
      console.log("errorCallBack -> " + error)
      setTimeout(() => {
          this.wsConnect();
      }, 5000);
  }

  returnOnModal(){
      this.router.navigateByUrl(this.exitLink);
  }

  onTabChange($event: NgbTabChangeEvent) {
     // if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
     //     $event.preventDefault();
   //   }                     
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigate([this.exitLink,{policyIdOc:this.policyInfo.policyIdOc}]);
      }
      else if ($event.nextId === 'print-tab') {
          $event.preventDefault();
      }
      else if($('.ng-dirty.ng-touched:not([type="search"])').length != 0 ){
         $event.preventDefault();
         const subject = new Subject<boolean>();
         const modal = this.modalService.open(ConfirmLeaveComponent,{
             centered: true, 
             backdrop: 'static', 
             windowClass : 'modal-size'
         });
         modal.componentInstance.subject = subject;

         subject.subscribe(a=>{
           if(a){
             $('.ng-dirty').removeClass('ng-dirty');
             this.tabset.select($event.nextId)
           }
         })


       }
    }

    disableDraft:boolean = false;
    draftTag:boolean = true;
    polOcFinalTag: boolean = false;

    showApprovalModal(content) {
      this.uw.getPolGenInfoOc(this.policyInfo.policyIdOc,null).subscribe(a=>{
        this.polOcFinalTag = a['policyOc'].status == '1';
        if(a['policyOc'].status == '1'){
          this.disableDraft = false;
          this.draftTag = true;
        }else{
          this.disableDraft = true;
          this.draftTag = false;
        }
      })
      this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    }

    printDestination:string = 'screen';
    printReport:string = 'POLR010C';

    changeOpenCovStatus(){
      let params:any = {
                          policyIdOc:this.policyInfo.policyIdOc,
                          updateUser:this.ns.getCurrentUser(),
                          policyId: this.policyInfo.policyIdOc,
                        };

      params.reportId=this.printReport;
      console.log(this.draftTag);
      console.log(this.polOcFinalTag);
      if(this.draftTag || !this.polOcFinalTag){
        this.ps.print(this.printDestination,this.printReport,params);
      }else{ 
        this.inqFlag = true;
        console.log(this.policyInfo);
        this.policyInfo.fromInq = 'true';
        this.policyInfo.inqFlag = 'true';
        this.inqFlag = true;
        this.uw.updateOCStatus(params).subscribe(a=>{
          this.ps.print(this.printDestination,this.printReport,params);
          if(this.activeComp != undefined){
            this.activeComp.ngOnInit();
          }
        });
      }
    }


}
