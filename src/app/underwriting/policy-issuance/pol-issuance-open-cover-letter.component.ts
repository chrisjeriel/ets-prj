import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pol-issuance-open-cover-letter',
  templateUrl: './pol-issuance-open-cover-letter.component.html',
  styleUrls: ['./pol-issuance-open-cover-letter.component.css']
})
export class PolIssuanceOpenCoverLetterComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  policyInfo:any;
  inqFlag:any;

  ngOnInit() {
  	this.route.params.subscribe(a=>{
  		this.policyInfo = a;
      this.inqFlag = a['inqFlag'] == 'true';
      console.log(this.inqFlag == 'true')
  	})    
  }

}
