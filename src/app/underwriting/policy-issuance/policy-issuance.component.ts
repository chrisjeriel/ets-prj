import { Component, OnInit, ViewChild,AfterViewInit, Input } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-policy-issuance',
  templateUrl: './policy-issuance.component.html',
  styleUrls: ['./policy-issuance.component.css']
})
export class PolicyIssuanceComponent implements OnInit {
  @ViewChild('contentEditPol') contentEditPol;
  line: string;
  sub: any;
  
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
        fromSummary:false
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
  
  constructor(private route: ActivatedRoute,private modalService: NgbModal, private router: Router) { }

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
            if(this.fromInq == 'true'){
              this.title = "Policy / Inquiry / Policy Inquiry";
            }
            this.policyInfo.fromSummary = this.fromSummary;
            this.exitLink = params['exitLink'];
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
        this.router.navigate([this.exitLink,{policyId: this.policyInfo.policyId}]);
      } 
      if(this.fromInq=='true'){
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
      this.policyInfo.principalId = event.principalId;
      this.policyInfo.coInsuranceFlag = event.coInsuranceFlag;
      this.policyInfo.insuredDesc = event.insuredDesc;
      this.policyInfo.riskName = event.riskName
  }

  returnOnModal(){
     this.router.navigate(['/policy-listing'],{ skipLocationChange: true }); 
  }
  
}
