import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { UnderwritingService, NotesService } from '@app/_services';

@Component({
  selector: 'app-policy-distribution',
  templateUrl: './policy-distribution.component.html',
  styleUrls: ['./policy-distribution.component.css']
})
export class PolicyDistributionComponent implements OnInit {

  constructor(private route: ActivatedRoute, private modalService: NgbModal, private uw: UnderwritingService, private ns: NotesService) { }

  riskDistId: number;
  riskDistStatus: string;
  @ViewChild(NgbTabset) tabset: NgbTabset;

  sub:any;
  distTtitle:string;
  title:string = 'Policy Dist';
  subtitle:string = "Distribution";

  acctDetails:any = {
    instTag:'N',
    acctDate: ''
  }

  inquiryFlag:boolean = false;

  /*
  previousRecordIsNotPosted:boolean = true;
  previousRecordIsNotPostedMsg:string = 'Modifications are not allowed. The previous distribution record is not yet posted.';

  previousRecordHasChanges:boolean = true;
  previousRecordHasChangesMsg:string = 'There are changes in the previous distribution records of this policy. The system will re-calculate this distribution record.';

  warningModalMsg:string = '';*/
  params:any;

  ngOnInit() {
  	this.sub = this.route.params.subscribe((data: any)=>{
      this.params = data;
      console.log(this.params)
    	if(parseInt(data.policyNo.substr(-3))>0){
    		this.distTtitle = "Alteration Distribution";
    	}else{
    		this.distTtitle = "Policy Distribution";
    	}

      if(data.fromNegate == 'true'){
        this.title = 'Negate Distribution'
      }else if(this.params.fromInq=='true'){
        this.title = 'Distribution'
      }else{
        this.title = 'Distribution Processing'
      }

      if(this.params.fromInq=='true'){
        this.subtitle = 'Inquiry'
      }

      this.inquiryFlag = this.params.fromInq=='true';
      console.log(this.inquiryFlag);
      console.log(this.params.fromInq=='true')
     this.getInstInfo();
      setTimeout(a=>this.tabset.select("risk"),0);
    });
  }

  getInstInfo(){
    this.uw.getInstTagAcctEntDate(this.params.policyId).subscribe(a=>{
      this.acctDetails = a;
      this.acctDetails.acctDate = this.ns.toDateTimeString(this.acctDetails.acctDate);
    })
  }

}
