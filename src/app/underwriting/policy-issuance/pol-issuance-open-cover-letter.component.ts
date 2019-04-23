import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-issuance-open-cover-letter',
  templateUrl: './pol-issuance-open-cover-letter.component.html',
  styleUrls: ['./pol-issuance-open-cover-letter.component.css']
})
export class PolIssuanceOpenCoverLetterComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  policyInfo:any;
  inqFlag:any;
  title:string = "Policy / Issuance / Create Open Cover /";

  ngOnInit() {
  	this.route.params.subscribe(a=>{
  		this.policyInfo = a;
      this.inqFlag = a['inqFlag'] == 'true';
      if(this.inqFlag){
        this.title = "Policy / Inquiry / Open Cover Inquiry /"
      }

  	})    
  }

  onTabChange($event: NgbTabChangeEvent) {
     // if($('.ng-dirty:not([type="search"]):not(.not-form)').length != 0){
     //     $event.preventDefault();
   //   }                     
      if ($event.nextId === 'Exit') {
        $event.preventDefault();
        this.router.navigateByUrl('');
      }
    }

}
