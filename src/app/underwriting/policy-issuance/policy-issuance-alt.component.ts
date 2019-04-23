import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

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
        fromInq:''
    }

    alterFlag: boolean = false;
    sub:any;
    approveText: string = "For Approval";
    currentUserId: string = JSON.parse(window.localStorage.currentUser).username;
    approverList: any[];
    theme =  window.localStorage.getItem("selectedTheme");
    status: string = "";
    title:string = "Policy / Policy Issuance / Create Alteration"

    constructor(private route: ActivatedRoute, private modalService: NgbModal, private router: Router,private app: AppComponent) {}

    ngOnInit() {
         this.sub = this.route.params.subscribe(params => {
            this.alterFlag = params['alteration'];
            this.policyInfo.editPol = JSON.parse(params['editPol']);
            this.policyInfo.status = params['statusDesc'];
            this.policyInfo.policyId = params['policyId'];
            this.policyInfo.policyNo = params['policyNo'];
            this.policyInfo.riskName = params['riskName'];
            this.policyInfo.insured = params['insured'];
            this.policyInfo.fromInq = params['fromInq'];
            if(this.policyInfo.fromInq == 'true'){
              this.title = "Policy / Inquiry / Policy Inquiry";
            }
        });
        /* Test Data */
        /*this.policyInfo.policyId = 9; 
        this.policyInfo.policyNo = 'CAR-2019-00001-001-0001-001';
        this.policyInfo.insuredDesc = 'insured5';
        this.policyInfo.riskName = 'riskName';
        this.policyInfo.principalName = 'principal';
        this.policyInfo.contractorName = 'contractor';*/

    }

    ngAfterViewInit(){
        this.status = this.policyInfo.status;
        setTimeout(() => {
             this.showEditModal(JSON.parse(this.policyInfo.editPol));
             this.app.changeTheme(this.theme);
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
    }

   returnOnModal(){
     this.router.navigate(['/alt-policy-listing'],{ skipLocationChange: true }); 
   }
  
}
