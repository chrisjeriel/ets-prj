import { Component, OnInit } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CMDM } from '@app/_models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-acct-cmdm-entry',
  templateUrl: './acct-cmdm-entry.component.html',
  styleUrls: ['./acct-cmdm-entry.component.css']
})
export class AcctCmdmEntryComponent implements OnInit {
  memoInfo:any = {
  	memoType:'',
  	autoTag:'',
  	tranTypeCd:'',
  	status:'',
  	memoTranType:'',
  	memoYear:'',
  	memoMm:'',
  	memoSeqNo:'',
  	memoDate:'',
  	refNoTranId:'',
  	refNo:'',
  	refNoDate:'',
  	payeeNo:'',
  	payee:'',
  	particulars:'',
  	currCd:'',
  	cmdmAmt:'',
  	currRate:'',
  	localCurrCd:'PHP',
  	localAmt:'',
  	createUser:'',
  	createDate:'',
  	updateUser:'',
  	updateDate:'',

  }

constructor(private accountingService: AccountingService, private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService) { }

seqDigits:number = 1;

  ngOnInit() {
  	this.getSeqDigits();
  }

  getSeqDigits(){
    this.mtnService.getMtnParameters('N','CMDM_NO_DIGITS').subscribe(a=>{
      this.seqDigits = a['parameters'][0].paramValueN;
  	  this.getListing();
    })
  }

  getListing(){
    this.accountingService.getCMDMListing({tranId:11}).subscribe(a=>{
      this.memoInfo = a['cmdmList'][0];
      this.memoInfo.memoDate = this.ns.toDateTimeString(this.memoInfo.memoDate);
      this.memoInfo.createDate = this.ns.toDateTimeString(this.memoInfo.createDate);
      this.memoInfo.updateDate = this.ns.toDateTimeString(this.memoInfo.updateDate);
      this.memoInfo.refNoDate = this.ns.toDateTimeString(this.memoInfo.refNoDate);
      this.memoInfo.memoSeqNo = String(this.memoInfo.memoSeqNo).padStart(this.seqDigits,'0');
    });
  }

}
