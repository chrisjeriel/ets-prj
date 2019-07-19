import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CMDM } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';

@Component({
  selector: 'app-acct-cmdm-entry',
  templateUrl: './acct-cmdm-entry.component.html',
  styleUrls: ['./acct-cmdm-entry.component.css']
})
export class AcctCmdmEntryComponent implements OnInit {
  @Input()passData;
  memoInfo:any = {
  	tranId:null,
  	memoType:'',
  	autoTag:'N',
  	tranTypeCd:'',
  	status:'New',
  	memoTranType:'',
  	memoYear:'',
  	memoMm:'',
  	memoSeqNo:'',
  	memoDate:this.ns.toDateTimeString(0),
  	refNoTranId:'',
  	refNo:'',
  	refNoDate:'',
  	payeeNo:'',
  	payee:'',
  	particulars:'',
  	currCd:'',
  	cmdmAmt:0,
  	currRate:'',
  	localCurrCd:'PHP',
  	localAmt:0,
  	createUser:this.ns.getCurrentUser(),
  	createDate:this.ns.toDateTimeString(0),
  	updateUser:this.ns.getCurrentUser(),
  	updateDate:this.ns.toDateTimeString(0),
  	new: true
  }

  newMemoInfo:any = {
  	tranId:null,
  	memoType:'',
  	autoTag:'N',
  	tranTypeCd:'',
  	status:'New',
  	memoStatus: 'N',
  	memoTranType:'',
  	memoYear:'',
  	memoMm:'',
  	memoSeqNo:'',
  	memoDate:this.ns.toDateTimeString(0),
  	refNoTranId:'',
  	refNo:'',
  	refNoDate:'',
  	payeeNo:'',
  	payee:'',
  	particulars:'',
  	currCd:'',
  	cmdmAmt:0,
  	currRate:'',
  	localCurrCd:'PHP',
  	localAmt:0,
  	createUser:this.ns.getCurrentUser(),
  	createDate:this.ns.toDateTimeString(0),
  	updateUser:this.ns.getCurrentUser(),
  	updateDate:this.ns.toDateTimeString(0),
  	new: true
  }

  tranTypes:any[] = [];

  @ViewChild(LovComponent)lov: LovComponent;
  @ViewChild(MtnCurrencyComponent) currLov: MtnCurrencyComponent;

constructor(private accountingService: AccountingService, private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService) { }

seqDigits:number = 1;

  ngOnInit() {
  	this.getTranTypes();
  	this.getSeqDigits();
  }

  getSeqDigits(){
    this.mtnService.getMtnParameters('N','CMDM_NO_DIGITS').subscribe(a=>{
      this.seqDigits = a['parameters'][0].paramValueN;
  	  this.getListing();
    })
  }

  getListing(){
    this.accountingService.getCMDMListing({tranId:this.passData.tranId}).subscribe(a=>{
      this.memoInfo = a['cmdmList'][0];
      this.memoInfo.memoDate = this.ns.toDateTimeString(this.memoInfo.memoDate);
      this.memoInfo.createDate = this.ns.toDateTimeString(this.memoInfo.createDate);
      this.memoInfo.updateDate = this.ns.toDateTimeString(this.memoInfo.updateDate);
      this.memoInfo.refNoDate = this.ns.toDateTimeString(this.memoInfo.refNoDate);
      this.memoInfo.memoSeqNo = String(this.memoInfo.memoSeqNo).padStart(this.seqDigits,'0');
      this.memoInfo.localCurrCd = 'PHP'
      this.getTranTypes();
    });
  }

  getTranTypes(){
  	this.mtnService.getMtnAcitTranType(this.passData.memoType).subscribe(a=>{
  		this.tranTypes = a['tranTypeList'];
  	})
  }

  save(){
  	this.memoInfo.updateUser = this.ns.getCurrentUser();
  	this.memoInfo.updateDate = this.ns.toDateTimeString(0);
  	this.accountingService.saveAcitCMDM(this.memoInfo).subscribe(a=>{
  	});
  }
  passLov:any = {
  	selector:'',
  	params:{}
  };
  openLov(selector){
  	if(selector == 'refNo'){
  		this.passLov.params.arTag = 'Y';
		this.passLov.params.cvTag = 'Y';
		this.passLov.params.jvTag = 'Y';
  		this.passLov.selector = 'refNo';
  	}

  	this.lov.openLOV();
  }

  setLov(data){
  	if(data.selector == 'refNo'){
  		this.memoInfo.refNoTranId = data.data.tranId;
  		this.memoInfo.refNoDate = this.ns.toDateTimeString(data.data.tranDate);
  		this.memoInfo.refNo = data.data.tranNo;
  	}
  }


  clickNew(){
  	this.memoInfo = JSON.parse(JSON.stringify(this.newMemoInfo))
  }

  setCurrency(data){
  	this.memoInfo.currCd = data.currencyCd;
  	this.memoInfo.currRate = data.currencyRt;
  	this.memoInfo.localAmt = this.memoInfo.cmdmAmt * data.currencyRt;
  }

}
