import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-policy-issuance-alt',
    templateUrl: './policy-issuance-alt.component.html',
    styleUrls: ['./policy-issuance-alt.component.css']
})
export class PolicyIssuanceAltComponent implements OnInit {
     @ViewChild('contentEditPol') contentEditPol;

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
        prevPolicyId: '',
        fromInq:''
    }

    alterFlag: boolean = false;
    sub:any;
    approveText: string = "For Approval";
    currentUserId: string = JSON.parse(window.localStorage.currentUser).username;
    approverList: any[];
    status: string = "";
    title:string = "Policy / Policy Issuance / Create Alteration"

    constructor(private route: ActivatedRoute, private modalService: NgbModal, private router: Router) {}

    ngOnInit() {
         this.sub = this.route.params.subscribe(params => {
            this.alterFlag = params['alteration'];
            this.policyInfo.editPol = JSON.parse(params['editPol']);
            this.policyInfo.status = params['statusDesc'];
            this.policyInfo.policyId = params['policyId'];
            this.policyInfo.policyNo = params['policyNo'];
            this.policyInfo.riskName = params['riskName'];
            this.policyInfo.insured = params['insured'];
            this.policyInfo.prevPolicyId = params['prevPolicyId'];
            this.policyInfo.fromInq = params['fromInq'];
            if(this.policyInfo.fromInq == 'true'){
              this.title = "Policy / Inquiry / Policy Inquiry";
            }
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
            this.router.navigateByUrl('');
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
      this.policyInfo.insuredDesc =  event.insuredDesc;
      this.policyInfo.riskId =  event.riskId;
      this.policyInfo.showPolAlop = event.showPolAlop;
      this.policyInfo.coInsuranceFlag = event.coInsuranceFlag;
    }

   returnOnModal(){
     this.router.navigate(['/alt-policy-listing'],{ skipLocationChange: true }); 
   }
  
}
