import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { UnderwritingService } from '@app/_services';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-policy-issuance-alt',
    templateUrl: './policy-issuance-alt.component.html',
    styleUrls: ['./policy-issuance-alt.component.css']
})
export class PolicyIssuanceAltComponent implements OnInit {
    @ViewChild('contentEditPol') contentEditPol;
    @ViewChild('tabset') tabset: any;

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
        cedingName:''
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

    constructor(private route: ActivatedRoute, private modalService: NgbModal, private router: Router, private us: UnderwritingService) {}

    ngOnInit() {
         this.sub = this.route.params.subscribe(params => {
            this.alterFlag = params['alteration'];
            this.policyInfo.editPol = JSON.parse(params['editPol']);
            this.policyInfo.status = params['statusDesc'];
            // this.policyInfo.policyId = params['policyId'];
            // this.policyInfo.policyNo = params['policyNo'];
            this.policyInfo.riskName = params['riskName'];
            this.policyInfo.insured = params['insured'];

            this.policyInfo.fromInq = params['fromInq'];
            if(this.policyInfo.fromInq == 'true'){
              this.title = "Policy / Inquiry / Policy Inquiry";
            }
            this.exitLink = params['exitLink'];
            this.policyInfo.prevPolicyId = params['prevPolicyId'];

            // if(this.us.fromCreateAlt) {

            // }
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
      this.policyInfo.policyId = event.policyId;
      this.policyInfo.policyNo = event.policyNo;
      this.policyInfo.insuredDesc = event.insuredDesc;
      this.policyInfo.riskId =  event.riskId;
      this.policyInfo.riskName =  event.riskName;
      this.policyInfo.showPolAlop = event.showPolAlop;
      this.policyInfo.coInsuranceFlag = event.coInsuranceFlag;
      this.policyInfo.cedingName = event.cedingName;
    }

   returnOnModal(){
     this.router.navigate(['/alt-policy-listing'],{ skipLocationChange: true }); 
   }
  
}
