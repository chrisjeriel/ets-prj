import { Component, OnInit, OnDestroy, ViewChild,AfterViewInit, Input } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { UnderwritingService, PrintService, NotesService, UserService } from '@app/_services';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '@environments/environment';



@Component({
  selector: 'app-policy-issuance',
  templateUrl: './policy-issuance.component.html',
  styleUrls: ['./policy-issuance.component.css']
})
export class PolicyIssuanceComponent implements OnInit, OnDestroy {
  @ViewChild('contentEditPol') contentEditPol;
  @ViewChild('recordLock') recordLock;

  @ViewChild('tabset') tabset: any;
  line: string;
  sub: any;
  post:boolean = false;

  policyInfo = {
        policyId: '',
        policyNo: '',
        status:'',
        riskName:'',
        insured:'',
        editPol:'',
        insuredDesc:'',
        riskId: '',
        fromInq: '',
        showPolAlop: false,
        principalId: '',
        coInsuranceFlag: false,
        fromSummary:false,
        cedingName:'',
        lastAffectingPolId:undefined,
        quoteId:'',
        quotationNo: '',
        retDone: false,
        holdCoverTag: 'N',
        openCoverTag: 'N'
  }
  @Input() fromSummary = false;

  openTabs: boolean = false;
  alterFlag: boolean = false;
  fromInq:any = false;
  approveText: string = "For Approval";
  currentUserId: string = JSON.parse(window.localStorage.currentUser).username;
  approverList: any[];
  status: string = "";
  title: string = "Policy / Policy Issuance / Create Policy";
  exitLink:string;

  webSocketEndPoint: string = environment.prodApiUrl + '/moduleSecurity';
  topic: string = "/pol-issuance";
  stompClient: any;
  initLoad: boolean = true;
  lockModalShown: boolean = false;
  lockUser: string = "";
  lockMessage: string = "";

  accessibleModules:any[] = [];
  
  constructor(private route: ActivatedRoute,private modalService: NgbModal, private router: Router, 
              private underwritingService: UnderwritingService, private ps: PrintService, private ns: NotesService,
              private userService: UserService) { }


  ngOnDestroy() {
    if (!this.fromInq && this.stompClient != undefined) {
      this.wsDisconnect();
    }
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
            this.line = params['line'];
            this.alterFlag = params['alter'];
            this.fromInq = params['fromInq'];
            this.policyInfo.fromInq = params['fromInq'];
            this.policyInfo.editPol = JSON.parse(params['editPol']);
            this.policyInfo.status = params['statusDesc'];
            this.policyInfo.policyId = params['policyId'];
            this.policyInfo.policyNo = params['policyNo'];
            this.policyInfo.riskName = params['riskName'];
            this.policyInfo.insured = params['insured'];
            this.policyInfo.lastAffectingPolId = params['lastAffectingPolId'];
            this.policyInfo.insuredDesc = params['insured'];

            this.policyInfo.quoteId = params['quoteId'];
            this.policyInfo.quotationNo = params['quotationNo'];

            if(this.fromInq == 'true'){
              this.title = "Policy / Inquiry / Policy Inquiry";
            }
            this.policyInfo.fromSummary = this.fromSummary;
            this.exitLink = params['exitLink'] == undefined? '/policy-listing' : params['exitLink'];
            this.checkAlop();
            this.checkCoins();
            this.userService.accessibleModules.subscribe(data => this.accessibleModules = data);
        });
    if (!this.fromInq) {
      this.wsConnect();
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
      } else if($event.nextId === 'post'){
        $event.preventDefault();
        this.openPost();
      } else 
       if($('.ng-dirty.ng-touched:not([type="search"])').length != 0 ){
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

      if(this.fromInq=='true'){
        setTimeout(a=>{
          $('input:not([type="search"])').attr('readonly','readonly');
          $('textarea').attr('readonly','readonly');
          $('select:not(.print)').attr('readonly','readonly');
        },0)
      }
  
  }

  getPolInfo(event){      
      //this.policyInfo = event;
      // for (let i of Object.keys(event)) {
      //   if(this.policyInfo[i] == undefined || this.policyInfo[i]==null)
      //     this.policyInfo[i] = event[i]
      // }
      console.log(event)
      this.policyInfo.policyId = event.policyId != undefined ? event.policyId : this.policyInfo.policyId;
      this.policyInfo.insuredDesc =  event.insuredDesc != undefined ? event.insuredDesc : this.policyInfo.insuredDesc;
      this.policyInfo.insured =  event.insuredDesc != undefined ? event.insuredDesc : this.policyInfo.insuredDesc;
      this.policyInfo.riskId =  event.riskId != undefined ? event.riskId : this.policyInfo.riskId;
      this.policyInfo.showPolAlop = event.showPolAlop != undefined ? event.showPolAlop : this.policyInfo.showPolAlop;
      this.policyInfo.principalId = event.principalId != undefined ? event.principalId : this.policyInfo.principalId;
      this.policyInfo.coInsuranceFlag = event.coInsuranceFlag != undefined ? event.coInsuranceFlag : this.policyInfo.coInsuranceFlag;
      this.policyInfo.insuredDesc = event.insuredDesc != undefined ? event.insuredDesc : this.policyInfo.insuredDesc;
      this.policyInfo.riskName = event.riskName != undefined ? event.riskName : this.policyInfo.riskName;
      this.policyInfo.cedingName = event.cedingName != undefined ? event.cedingName : this.policyInfo.cedingName;
      this.policyInfo.holdCoverTag = event.holdCoverTag != undefined ? event.holdCoverTag : this.policyInfo.holdCoverTag;
      this.policyInfo.openCoverTag = event.openCoverTag != undefined ? event.openCoverTag : this.policyInfo.openCoverTag;
  }

  returnOnModal(){
     this.router.navigate(['/policy-listing'],{ skipLocationChange: true }); 
  }

  openPost(){
    this.post = true;
  }


  checkAlop(){
    this.underwritingService.getUWCoverageInfos(null, this.policyInfo.policyId).subscribe((data: any) => {
        if(data.policy !== null){
          let alopFlag = false;
          if(data.policy.project !== null){
            for(let sectionCover of data.policy.project.coverage.sectionCovers){
                  if(sectionCover.section == 'III' && (this.line == 'CAR' || this.line == 'EAR')){
                      alopFlag = true;
                     break;
                   }
            }
          }
            this.policyInfo.showPolAlop = alopFlag;
        }
      });
  }

  checkCoins(){
    this.underwritingService.getPolCoInsurance(this.policyInfo.policyId, '') .subscribe((data: any) => {
             this.policyInfo.coInsuranceFlag = (data.policy.length > 0)? true : false;
    });
  }


  printDestination:string = 'screen';
  printReport:string = 'POLR010';
  inclEndt:boolean = true;

  print(){
    let params:any = {
                        policyId:this.policyInfo.policyId,
                        updateUser:this.ns.getCurrentUser(),
                        inclEndt : this.inclEndt ? 'Y' : 'N'
                      };
    params.reportId=this.printReport;
    params.user
    this.ps.print(this.printDestination,this.printReport,params)
  }
  
}
