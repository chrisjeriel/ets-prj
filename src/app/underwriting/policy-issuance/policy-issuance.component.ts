import { Component, OnInit, ViewChild,AfterViewInit, Input } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';
import { UnderwritingService } from '@app/_services';

@Component({
  selector: 'app-policy-issuance',
  templateUrl: './policy-issuance.component.html',
  styleUrls: ['./policy-issuance.component.css']
})
export class PolicyIssuanceComponent implements OnInit {
  @ViewChild('contentEditPol') contentEditPol;
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
        lastAffectingPolId:undefined
  }
  @Input() fromSummary = false;

  alterFlag: boolean = false;
  fromInq:any = false;
  approveText: string = "For Approval";
  currentUserId: string = JSON.parse(window.localStorage.currentUser).username;
  approverList: any[];
  status: string = "";
  title: string = "Policy / Policy Issuance / Create Policy";
  exitLink:string;
  
  constructor(private route: ActivatedRoute,private modalService: NgbModal, private router: Router, private underwritingService: UnderwritingService) { }


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
            if(this.fromInq == 'true'){
              this.title = "Policy / Inquiry / Policy Inquiry";
            }
            this.policyInfo.fromSummary = this.fromSummary;
            this.exitLink = params['exitLink'] == undefined? '/policy-listing' : params['exitLink'];
            this.checkAlop();
            this.checkCoins();
        });   

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
      this.policyInfo.policyId = event.policyId;
      this.policyInfo.insuredDesc =  event.insuredDesc;
      this.policyInfo.riskId =  event.riskId;
      this.policyInfo.showPolAlop = event.showPolAlop;
      this.policyInfo.principalId = event.principalId;
      this.policyInfo.coInsuranceFlag = event.coInsuranceFlag;
      this.policyInfo.insuredDesc = event.insuredDesc;
      this.policyInfo.riskName = event.riskName;
      this.policyInfo.cedingName = event.cedingName;
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
  
}
