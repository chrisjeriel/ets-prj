import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { FormsModule }   from '@angular/forms';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';

@Component({
  selector: 'app-pol-sum-insured-open-cover',
  templateUrl: './pol-sum-insured-open-cover.component.html',
  styleUrls: ['./pol-sum-insured-open-cover.component.css']
})
export class PolSumInsuredOpenCoverComponent implements OnInit {
  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  @ViewChild(CancelButtonComponent) cancel : CancelButtonComponent;
  @ViewChild('myForm') myForm : any;
  
  policyId: string;
  coverageInfo:any = {
	currencyCd : '',
	currencyRt : '',
	totalSi : '',
	pctShare : '',
	pctPml : '',
	totalValue : '',

  };
  dialogIcon: string = "";
  cancelFlag : boolean = false;
  @Input() policyInfo:any;
  @Input() inqFlag: boolean;

  constructor(private uw: UnderwritingService, private ns: NotesService) { }

  ngOnInit() {
	this.policyId = this.policyInfo.policyIdOc;
	this.coverageInfo.policyId = this.policyId;
	this.coverageInfo.updateUser = JSON.parse(window.localStorage.currentUser).username;
	this.coverageInfo.updateDate = this.ns.toDateTimeString(0);
	console.log(this.inqFlag);
	this.fetchData();

  }

  fetchData(){
	this.uw.getSumInsOc(this.policyId).subscribe(data=>{
		this.coverageInfo.currencyCd	= data['policyOc'].projectOc.coverageOc.currencyCd;
		this.coverageInfo.currencyRt	= data['policyOc'].projectOc.coverageOc.currencyRt;
		this.coverageInfo.totalSi		= data['policyOc'].projectOc.coverageOc.totalSi;
		this.coverageInfo.pctShare		= data['policyOc'].projectOc.coverageOc.pctShare;
		this.coverageInfo.pctPml		= data['policyOc'].projectOc.coverageOc.pctPml;
		this.coverageInfo.totalValue	= data['policyOc'].projectOc.coverageOc.totalValue;
		setTimeout(a=>{
			$('[appCurrency]').focus()
			$('[appCurrency]').blur()
			$('[appOtherRates]').focus()
			$('[appOtherRates]').blur()
			$('[appCurrencyRate]').focus()
			$('[appCurrencyRate]').blur()
		},0);
	});
  }

  save(){
	this.uw.saveSumInsOC(this.coverageInfo).subscribe((data:any)=>{
	if(data.returnCode == -1){
		this.dialogIcon = 'success';
		this.successDiag.open();
		this.myForm.control.markAsPristine();
		this.fetchData();
	  }else{
		this.dialogIcon = 'error';
		this.successDiag.open();
	  }
	})
  }

  onClickSave(){
	this.confirmSave.confirmModal();
  }

  onClickCancel(){
	this.cancel.clickCancel();
  }

  cmptShrPct(data){
	this.coverageInfo.pctShare = parseFloat(this.coverageInfo.totalSi) / parseFloat(data) * 100;
  }

}
