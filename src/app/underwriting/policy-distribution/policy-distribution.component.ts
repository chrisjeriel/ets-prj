import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-policy-distribution',
  templateUrl: './policy-distribution.component.html',
  styleUrls: ['./policy-distribution.component.css']
})
export class PolicyDistributionComponent implements OnInit {

  constructor(private route: ActivatedRoute, private modalService: NgbModal) { }

  riskDistId: number;
  riskDistStatus: string;
  @ViewChild(NgbTabset) tabset: NgbTabset;

  sub:any;
  distTtitle:string;
  title:string = 'Policy Dist';

  /*inquiryFlag:boolean = false;
  previousRecordIsNotPosted:boolean = true;
  previousRecordIsNotPostedMsg:string = 'Modifications are not allowed. The previous distribution record is not yet posted.';

  previousRecordHasChanges:boolean = true;
  previousRecordHasChangesMsg:string = 'There are changes in the previous distribution records of this policy. The system will re-calculate this distribution record.';

  warningModalMsg:string = '';*/

  ngOnInit() {
  	this.sub = this.route.params.subscribe((data: any)=>{
    	if(parseInt(data.policyNo.substr(-3))>0){
    		this.distTtitle = "Alteration Distribution";
    	}else{
    		this.distTtitle = "Policy Distribution";
    	}

      if(data.fromNegate == 'true'){
        this.title = 'Negate Distribution'
      }else{
        this.title = 'Policy Dist'
      }
     
      setTimeout(a=>this.tabset.select("risk"),0);
    });
  }

}
