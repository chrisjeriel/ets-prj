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
    }

    alterFlag: boolean = false;
    sub:any;
    approveText: string = "For Approval";
    currentUserId: string = JSON.parse(window.localStorage.currentUser).username;
    approverList: any[];

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
        });

        console.log(this.policyInfo);
        this.showEditModal(JSON.parse(this.policyInfo.editPol));

        /* Test Data */
        /*this.policyInfo.policyId = 9; 
        this.policyInfo.policyNo = 'CAR-2019-00001-001-0001-001';
        this.policyInfo.insuredDesc = 'insured5';
        this.policyInfo.riskName = 'riskName';
        this.policyInfo.principalName = 'principal';
        this.policyInfo.contractorName = 'contractor';*/

    }

    showEditModal(obj : boolean){
        if (!obj){
          setTimeout(() => {
                 this.modalService.open(this.contentEditPol, { centered: true, backdrop: 'static', windowClass: "modal-size" });
          });
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
    }

    getPolInfo(event){      
        //this.policyInfo = event;
      this.policyInfo.policyId = event.policyId;
      this.policyInfo.insuredDesc =  event.insuredDesc;
      this.policyInfo.riskId =  event.riskId;
    }
  
}
