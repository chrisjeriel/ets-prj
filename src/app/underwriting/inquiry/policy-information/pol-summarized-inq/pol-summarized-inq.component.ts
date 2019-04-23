import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pol-summarized-inq',
  templateUrl: './pol-summarized-inq.component.html',
  styleUrls: ['./pol-summarized-inq.component.css']
})
export class PolSummarizedInqComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  policyNo:string;
  policyId:string;

  ngOnInit() {
  	this.route.params.subscribe(params => {

  	        this.policyNo = params['policyNo'];
            this.policyId = params['policyId'];
  	});   
  }

  onTabChange($event) {
     // if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
     //     $event.preventDefault();
   //   }                     
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigate(['/policy-information', {policyId:this.policyId, policyNo:this.policyNo}], { skipLocationChange: true });
     }
 }
}
