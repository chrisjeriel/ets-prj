import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-policy-issuance',
  templateUrl: './policy-issuance.component.html',
  styleUrls: ['./policy-issuance.component.css']
})
export class PolicyIssuanceComponent implements OnInit {
  line: string;
  sub: any;
  policyInfo:any = {};
  alterFlag: boolean = false;
  fromInq:boolean = false;
  
  constructor(private route: ActivatedRoute,private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
            this.line = params['line'];
            this.alterFlag = params['alter'];
            this.fromInq = params['fromInq'];
        });

     /* Test Data */
        this.policyInfo.policyId = 9; 
        this.policyInfo.policyNo = 'CAR-2019-00001-001-0001-001';
        this.policyInfo.principalName = 'principal';
        this.policyInfo.contractorName = 'contractor';
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
