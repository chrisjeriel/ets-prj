import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-policy-distribution',
  templateUrl: './policy-distribution.component.html',
  styleUrls: ['./policy-distribution.component.css']
})
export class PolicyDistributionComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  riskDistId: number;
  riskDistStatus: string;
  @ViewChild(NgbTabset) tabset: NgbTabset;

  sub:any;
  distTtitle:string;
  title:string = 'Policy Dist';
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
