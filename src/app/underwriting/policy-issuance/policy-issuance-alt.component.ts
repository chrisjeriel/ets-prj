import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-policy-issuance-alt',
    templateUrl: './policy-issuance-alt.component.html',
    styleUrls: ['./policy-issuance-alt.component.css']
})
export class PolicyIssuanceAltComponent implements OnInit {

    /* Test Data */
    policyInfo:any = {};
    alterFlag: boolean = false;

    constructor(private route: ActivatedRoute, private modalService: NgbModal, private router: Router) {}

    ngOnInit() {
         this.sub = this.route.params.subscribe(params => {
            this.alterFlag = params['alter'];
        });

         console.log(this.alterFlag);
        /* Test Data */
        this.policyInfo.policyId = 2; 
        this.policyInfo.policyNo = 'EAR-2019-00002-002-0002-002';
        this.policyInfo.insuredDesc = 'insured5';
        this.policyInfo.riskName = 'riskName';

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
}
