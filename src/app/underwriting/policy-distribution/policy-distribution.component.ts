import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policy-distribution',
  templateUrl: './policy-distribution.component.html',
  styleUrls: ['./policy-distribution.component.css']
})
export class PolicyDistributionComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  riskDistId: number;
  riskDistStatus: string;

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
      }
    });
  }

}
