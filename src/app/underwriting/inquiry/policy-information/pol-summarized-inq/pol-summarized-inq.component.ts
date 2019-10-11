import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnderwritingService } from '@app/_services';

@Component({
  selector: 'app-pol-summarized-inq',
  templateUrl: './pol-summarized-inq.component.html',
  styleUrls: ['./pol-summarized-inq.component.css']
})
export class PolSummarizedInqComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private us: UnderwritingService) { }
  showPolicyNo:string;
  policyId:string;
  clmInfo: any = null;
  clmInq: boolean = false;

  ngOnInit() {
  	this.route.params.subscribe(params => {
          console.log(params);
  	        this.showPolicyNo = params['showPolicyNo'];
            this.policyId = params['policyId'];
            if(params['clmInfo']) {
              this.clmInfo = JSON.parse(params['clmInfo']);
              this.clmInq = params['isInquiry'];
            }
            this.us.showPolicyNo = this.showPolicyNo;
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
          routeParams['readonly'] = this.clmInq;

          this.clmInq = false;
        }

        this.router.navigate(['/policy-information', routeParams], { skipLocationChange: true });
     }
 }
}
