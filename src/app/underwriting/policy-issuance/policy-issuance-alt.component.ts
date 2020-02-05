import { Component, OnInit,ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { UnderwritingService, NotesService, PrintService, UserService } from '@app/_services';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '@environments/environment';


@Component({
    selector: 'app-policy-issuance-alt',
    templateUrl: './policy-issuance-alt.component.html',
    styleUrls: ['./policy-issuance-alt.component.css']
})
export class PolicyIssuanceAltComponent implements OnInit, OnDestroy {
    @ViewChild('contentEditPol') contentEditPol;
    @ViewChild('tabset') tabset: any;
    @ViewChild('recordLock') recordLock;

    policyInfo = {
        policyId: '',
        policyNo: '',
        status:'',
        riskName:'',
        insured:'',
        editPol:'',
        insuredDesc:'',
        riskId:'',
        showPolAlop: false,
        coInsuranceFlag: false,
        fromInq:'',
        prevPolicyId: '',
        cedingName:'',
        principalId: '',
        extensionTag:'',
        holdCoverTag: 'N'
    }

    alterFlag: boolean = false;
    sub:any;
    approveText: string = "For Approval";
    currentUserId: string = JSON.parse(window.localStorage.currentUser).username;
    approverList: any[];
    status: string = "";
    title:string = "Policy / Policy Issuance / Create Alteration"
    exitLink:string;
    post:boolean = false;
    line:string = ""; /*Line added. TRBT#PROD_GRADE*/

    disableCov:boolean = false;

    webSocketEndPoint: string = environment.prodApiUrl + '/moduleSecurity';
    topic: string = "/pol-alteration";
    stompClient: any;
    initLoad: boolean = true;
    lockModalShown: boolean = false;
    lockUser: string = "";
    lockMessage: string = "";
    accessibleModules: any[] = [];

    constructor(private route: ActivatedRoute, private modalService: NgbModal, private router: Router, public us: UnderwritingService,
        private ps:PrintService, private ns: NotesService, private userService: UserService) {}

    ngOnInit() {
         this.sub = this.route.params.subscribe(params => {
            this.alterFlag = params['alteration'];
            this.policyInfo.editPol = JSON.parse(params['editPol']);
            this.policyInfo.status = params['statusDesc'];
            // this.policyInfo.policyId = params['policyId'];
            // this.policyInfo.policyNo = params['policyNo'];

            this.policyInfo.riskName = params['riskName'];
            this.policyInfo.insured = params['insured'];
            this.policyInfo.insuredDesc = params['insured'];
            this.policyInfo.fromInq = params['fromInq'];
            if(this.policyInfo.fromInq == 'true'){
              this.title = "Policy / Inquiry / Policy Inquiry";
            }
            this.exitLink = params['exitLink'];
            /* If not new alt */
            console.log(this.us.fromCreateAlt);
            if(!this.us.fromCreateAlt) {
              this.policyInfo.policyId = params['policyId'];
              this.policyInfo.policyNo = params['policyNo'];
              this.policyInfo.prevPolicyId = params['prevPolicyId'] ;
            }
            this.line = this.policyInfo.policyNo.split('-')[0];

            this.disableCov = params['sumInsured'] == null;

            // if(this.us.fromCreateAlt) {

            // }

            this.userService.accessibleModules.subscribe(data => this.accessibleModules = data);
        });

      if (this.policyInfo.fromInq != 'true') {
        this.wsConnect();
      }
    }

    ngOnDestroy() {
      if (this.policyInfo.fromInq != 'true' && this.stompClient != undefined) {
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
                if (_this.policyInfo.policyId == obj.refId) {
                  if (_this.ns.getCurrentUser() == obj.user) {
                    //Proceed because same user.
                    console.log("Same user with same record, proceed.");
                  } else {
                    _this.stompClient.send(_this.topic, {}, JSON.stringify({ user: _this.ns.getCurrentUser(), refId: _this.policyInfo.policyId, message: "This record is currently being updated by " }));
                  }
                }
              } else {
                if (_this.policyInfo.policyId == obj.refId) {
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
    this.stompClient.send(this.topic, {}, JSON.stringify({ user: this.ns.getCurrentUser(), refId: this.policyInfo.policyId, message: "" }));
  }

  errorCallBack(error) {
      console.log("errorCallBack -> " + error)
      setTimeout(() => {
          this.wsConnect();
      }, 5000);
  }

    ngAfterViewInit(){
        this.status = this.policyInfo.status;
        setTimeout(() => {
             this.showEditModal(JSON.parse(this.policyInfo.editPol));
         });
    }  

    showEditModal(obj : boolean){
        if (!obj){
            this.modalService.open(this.contentEditPol, { centered: true, backdrop: 'static', windowClass: "modal-size" });
        }
    }


    public beforeChange($event: NgbTabChangeEvent) {
        if ($event.nextId === 'print-tab') {
            $event.preventDefault();
        }
    }

    showApprovalModal(content) {
        this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
    }

    onTabChange($event: NgbTabChangeEvent) {
        if ($event.nextId === 'Exit') {
            $event.preventDefault();
            this.router.navigate([this.exitLink,{policyId: this.policyInfo.policyId}]);
        } else if($event.nextId === 'Post'){
            $event.preventDefault();
            this.post = true;
        } else
          if($('.ng-dirty.ng-touched').length != 0 ){
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


        if(this.policyInfo.fromInq=='true'){
            setTimeout(a=>{
              $('input').attr('readonly','readonly');
              $('textarea').attr('readonly','readonly');
              $('select').attr('readonly','readonly');
            },0)
          }
    }

    getPolInfo(event){      
        //this.policyInfo = event;
      // for (let i of Object.keys(event)) {
      //   if(this.policyInfo[i] == undefined || this.policyInfo[i]==null)
      //     this.policyInfo[i] = event[i]
      // }

      this.policyInfo.policyId = event.policyId != undefined ? event.policyId : this.policyInfo.policyId;
      this.policyInfo.policyNo = event.policyNo != undefined ? event.policyNo : this.policyInfo.policyNo;
      this.policyInfo.insuredDesc =  event.insuredDesc != undefined ? event.insuredDesc : this.policyInfo.insuredDesc;
      this.policyInfo.riskId =  event.riskId != undefined ? event.riskId : this.policyInfo.riskId;
      this.policyInfo.riskName =  event.riskName != undefined ? event.riskName : this.policyInfo.riskName;
      this.policyInfo.showPolAlop = event.showPolAlop != undefined ? event.showPolAlop : this.policyInfo.showPolAlop;
      this.policyInfo.coInsuranceFlag = event.coInsuranceFlag != undefined ? event.coInsuranceFlag : this.policyInfo.coInsuranceFlag;
      this.policyInfo.cedingName = event.cedingName != undefined ? event.cedingName : this.policyInfo.cedingName;
      this.policyInfo.extensionTag = event.extensionTag != undefined ? event.extensionTag : this.policyInfo.extensionTag;
      this.policyInfo.principalId = event.principalId != undefined ? event.principalId : this.policyInfo.principalId;
      this.policyInfo.insured =  event.insuredDesc != undefined ? event.insuredDesc : this.policyInfo.insuredDesc;
      this.line = this.policyInfo.policyNo.split('-')[0];
      console.log(this.us.fromCreateAlt);
      if(this.us.fromCreateAlt) {
        this.policyInfo.prevPolicyId = event.refPolicyId;
      }
      this.policyInfo.holdCoverTag = event.holdCoverTag != undefined ? event.holdCoverTag : this.policyInfo.holdCoverTag;
      console.log(event.extensionTag)
    }

   returnOnModal(){
     this.router.navigate(['/alt-policy-listing'],{ skipLocationChange: true }); 
   }
   
  printDestination:string = 'screen';
  printReport:string = 'POLR010B';
  inclEndt:boolean = true;

   print(){
    let params:any = {
                        policyId:this.policyInfo.policyId,
                        updateUser:this.ns.getCurrentUser(),
                        inclEndt : this.inclEndt ? 'Y' : 'N'
                      };
    params.reportId=this.printReport;
    this.ps.print(this.printDestination,this.printReport,params)
  }
  
}
