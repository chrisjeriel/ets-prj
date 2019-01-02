import { Component, OnInit } from '@angular/core';
import { PurgeExtractedPolicy } from '@app/_models';

@Component({
  selector: 'app-purge-extracted-policy',
  templateUrl: './purge-extracted-policy.component.html',
  styleUrls: ['./purge-extracted-policy.component.css']
})
export class PurgeExtractedPolicyComponent implements OnInit {
  passData:any={
  	tableData:[new PurgeExtractedPolicy("pol no",102023,2142124,new Date(),true,false)],
  	tHeader: ['Policy No', 'TSI Amount', 'Premium Amount', 'Expiry Date', 'P', 'X'],
  	dataTypes:['text','currency','currency','date', 'checkbox', 'checkbox'],
  	paginateFlag:true,
  	infoFlag:true

  }

  constructor() { }

  ngOnInit() {
  }

}
