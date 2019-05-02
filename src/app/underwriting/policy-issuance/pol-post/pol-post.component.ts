import { Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { NgbModalConfig, NgbModal, NgbProgressbarConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService } from '@app/_services';
import { Router } from '@angular/router'

@Component({
  selector: 'app-pol-post',
  templateUrl: './pol-post.component.html',
  styleUrls: ['./pol-post.component.css'],
  providers: [NgbModalConfig, NgbModal, NgbProgressbarConfig]
})
export class PolPostComponent implements OnInit {

  //TabName:  any[] = ["Gen Info","Coverage","OtherRates","Endorsement","CoInsurance","Distribution","Attachment"];
  //showTab: number = 0;
  progress: number = 0;	
  alterNum: number = 0;
  loadMsg: string ="";
  @ViewChild('alterationFlag') alteration;
  @ViewChild('content') content;
  @ViewChild('successinfo') successinfo;
  @Input() alterationFlag ;
  @Input() policyInfo;
  lineCd :string;
  loadModal: NgbModalRef;
  alopSi: number;
  @Output() showPost: EventEmitter<boolean> = new EventEmitter<boolean>();
  postBtn: boolean = false;
  altSign: string;

  constructor(config: NgbModalConfig, configprogress: NgbProgressbarConfig, private modalService: NgbModal,
   private uwService: UnderwritingService, private ns: NotesService, private router: Router) {
  	config.backdrop = 'static';
    config.keyboard = false;
    configprogress.max = 100;
    configprogress.striped = true;
    configprogress.animated = true;
    configprogress.height = '20px';
   }

  ngOnInit() {


    this.alterNum = this.policyInfo.policyNo.split('-').pop()
    this.loadMsg = "Policy No: "+this.policyInfo.policyNo;
    this.lineCd = this.policyInfo.policyNo.split('-')[0];
    setTimeout(() => {
      this.loadModal = this.modalService.open(this.content,  { centered: true, windowClass : 'modal-size'});
      // this.fakeProgress(); 
    });


  }

   // fakeProgress(){
   //    setTimeout(() => {
   //         if(this.progress < 100 || this.showTab <= this.TabName.length ){
   //           this.progress +=25;
   //           this.showTab = ++this.showTab;
   //           this.fakeProgress();
   //         } else { 
   //           this.showTab = 0;
   //           this.progress = 0;
   //           this.modalService.dismissAll(true);
   //               this.modalService.open(this.successinfo,  { centered: true , windowClass : 'modal-size'});
   //         }
   //    },50);

   //  }

    checkAcctDate(){
      this.postBtn = true;
      this.progress = 0;
      this.loadMsg = "Checking Accounting date";
      this.progress +=25;
      this.checkCoverage();
    }

    checkSign(secCvrs):string{
      
      return "";
    }

    checkCoverage(){
      const coveragaAmts: string[] = ['totalValue','cumSecISi','cumSecIISi','cumSecIIISi','cumTSi','cumSecIPrem','cumSecIIPrem','cumSecIIIPrem','cumTPrem'];
      this.loadMsg = "Checking Coverage"
      this.uwService.getUWCoverageInfos(null,this.policyInfo.policyId).subscribe(a=>{
        if(a['policy'] == null){
          this.loadMsg = 'No Data for Coverage.';
          return;
        }
        let covData = a['policy'].project.coverage;
        let secCvrs = covData.sectionCovers;
        if(this.alterationFlag){
          if(secCvrs.every(a=>a.premAmt>=0 && a.sumInsured>=0)){
            this.altSign = 'positive';
          }else if(secCvrs.every(a=>a.premAmt<=0 && a.sumInsured<=0)){
            this.altSign = 'negative';
          }else{
            this.loadMsg = 'Invalid amounts. Please create separate alteration for positive and negative amounts in Coverage tab.';
            return;
          }
        }

        if(!this.alterationFlag && !coveragaAmts.every(a=>covData[a]>=0)){
          this.loadMsg = 'Invalid amounts. All amounts must be positive. Please go to Coverage tab';
        }else if(
            ((this.lineCd=='CAR'|| this.lineCd=='EAR') && secCvrs.reduce((a,b)=>a+( (b.section=="I" || b.section=="III") && b.addSi == 'Y' ?b.cumSi:0) , 0) != covData.cumTSi) ||
            ((this.lineCd=='EEI') && secCvrs.reduce((a,b)=>a+(b.addSi == 'Y' ? b.cumSi:0) , 0)  != covData.cumTSi) ||
            (['CAR','EAR','EEI'].indexOf(this.lineCd)== -1 && secCvrs.reduce((a,b)=>a+(b.section=="I" && b.addSi == 'Y' ? b.cumSi:0 ), 0) != covData.cumTSi)
          ){
          this.loadMsg = 'Total sum insured of Section Covers is not equal to the Total Sum Insured of the policy coverage. Please check Coverage tab.';
        }else if(covData.pctShare >100){
          this.loadMsg = 'Share % must be less than or equal to 100%. Please check Coverage tab.';
        }else if(covData.totalValue<covData.cumTSi){
          this.loadMsg = '100% Value must be greater than or equal to the Total Sum Insured. Please check Coverage tab.';
        }else{
          if((secCvrs.filter(a=>(a.lineCd == 'CAR' && a.coverCd == '16')|| (a.lineCd == 'EAR' && a.coverCd == '31'))).length > 0){
            this.alopSi = secCvrs.filter(a=>(a.lineCd == 'CAR' && a.coverCd == '16')|| (a.lineCd == 'EAR' && a.coverCd == '31'))[0].cumSi;
            this.checkAlop();
          }
          else{
            this.checkInwBal();
            this.progress +=25;
          }
          this.progress +=25;
        }
      });
    }

    checkAlop(){
      this.loadMsg = 'Checking ALOP';
      this.uwService.getPolAlop(this.policyInfo.policyId, this.policyInfo.policyNo).subscribe((data: any) => {
        if(data.policy == null){
          this.loadMsg = 'No Data for ALOP.';
        }else if(data.policy.alop.annSi != this.alopSi){
          this.loadMsg = 'Annual Sum Insured must be equal to Sum Insured of ALOP. Please check ALOP tab.';
        }else{
          this.progress += 25;
          this.checkInwBal();
        }
      });
    }

    checkInwBal(){
      this.loadMsg = 'Checking Policy Inward Balance';
      const inwAmts: string[] = ['premAmt','otherChargesInw','amtDue','commAmt'];
      this.uwService.getInwardPolBalance(this.policyInfo.policyId).subscribe(a=>{
        let inwBals = a['policyList'][0].inwPolBalance;
        if(!this.alterationFlag){
          for(let inwBal of inwBals){
            if(!inwAmts.every(a=> inwBal[a]>=0) || !inwBal.otherCharges.every(a=>a.amount >= 0)){
              this.loadMsg = 'Invalid amounts. All amounts must be positive. Please go to Inward Pol Balance tab';
              return;
            }
          }
        }else{
          console.log(this.altSign)
          console.log(inwBals);
          if(this.altSign=='positive'){
            for(let inwBal of inwBals){
              if(!inwAmts.every(a=> inwBal[a]>=0) || !inwBal.otherCharges.every(a=>a.amount >= 0)){
                this.loadMsg = 'Invalid premium amount. Please create separate alteration for positive and negative amounts in Inward Pol Balance tab.';
                return;
              }
            }
          }else if(this.altSign=='negative'){
            for(let inwBal of inwBals){
              if(!inwAmts.every(a=> inwBal[a]<=0) || !inwBal.otherCharges.every(a=>a.amount <= 0)){
                this.loadMsg = 'Invalid premium amount. Please create separate alteration for positive and negative amounts in Inward Pol Balance tab.';
                return;
              }
            }
          }

        }
        if(inwBals.reduce((a,b)=>a+b.premAmt,0) != a['policyList'][0].project.coverage.totalPrem){
          this.loadMsg = 'Total Premium is not equal to the sum of premium per installment. Please check Inward Pol balance tab.';
        }else{
          this.loadMsg = 'Saving Successful.'
          this.progress +=25;
          this.post();
        }
      })
    }

    post(){
      let params:any = {
        policyId : this.policyInfo.policyId,
        updateUser : this.ns.getCurrentUser()
      }
      this.uwService.post(params).subscribe(a=>{
        this.showSuccess()
      });
    }

    showSuccess(){
      this.loadModal.dismiss();
      this.modalService.open(this.successinfo,  { centered: true , windowClass : 'modal-size'});
    }

    close(){
      this.loadModal.dismiss();
      this.showPost.emit(false);
    }

    goToListing(){
      this.modalService.dismissAll();
      if(this.alterationFlag)
        this.router.navigate(['alt-policy-listing']);
      else
        this.router.navigate(['policy-listing'])
    }
}
