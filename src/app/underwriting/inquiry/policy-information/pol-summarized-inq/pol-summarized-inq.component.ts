import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pol-summarized-inq',
  templateUrl: './pol-summarized-inq.component.html',
  styleUrls: ['./pol-summarized-inq.component.css']
})
export class PolSummarizedInqComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  showPolicyNo:string;
  policyId:string;
  clmInfo: any = null;

  ngOnInit() {
  	this.route.params.subscribe(params => {
          console.log(params);
  	        this.showPolicyNo = params['showPolicyNo'];
            this.policyId = params['policyId'];
            if(params['clmInfo']) {
              this.clmInfo = JSON.parse(params['clmInfo']);
            }
  	});   
  }

  onTabChange($event) {
     // if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
     //     $event.preventDefault();
   //   }                     
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        // this.router.navigate(['/policy-information', {policyId:this.policyId, showPolicyNo:this.showPolicyNo}], { skipLocationChange: true });

        var routeParams = {
          policyId: this.policyId,
          showPolicyNo: this.showPolicyNo
        }

        if(this.clmInfo != null) {
          routeParams['clmInfo'] = JSON.stringify(this.clmInfo);
        }

        this.router.navigate(['/policy-information', routeParams], { skipLocationChange: true });
     }
 }
}
