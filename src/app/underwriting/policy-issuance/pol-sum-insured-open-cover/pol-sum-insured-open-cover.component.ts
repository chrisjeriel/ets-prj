import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UnderwritingService, NotesService } from '@app/_services';
import { FormsModule }   from '@angular/forms';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { DecimalPipe } from '@angular/common'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  @ViewChild(ModalComponent) mdl : ModalComponent;
  
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
  loading: boolean = false;
  firstBlur: boolean = false;
  @Input() policyInfo:any;
  @Input() inqFlag: boolean;

  promptMessage: string = "";
  promptType: string = "";

  constructor(private uw: UnderwritingService, private ns: NotesService, private dp: DecimalPipe, private modalService: NgbModal) { }

  ngOnInit() {
	this.policyId = this.policyInfo.policyIdOc;
	this.coverageInfo.policyId = this.policyId;
	this.coverageInfo.updateUser = JSON.parse(window.localStorage.currentUser).username;
	this.coverageInfo.updateDate = this.ns.toDateTimeString(0);
	this.fetchData();

  }

  fetchData(save?){
  	if(save === undefined){
  		this.loading = true;
  	}
	this.uw.getSumInsOc(this.policyId).subscribe(data=>{
		this.coverageInfo.currencyCd	= data['policyOc'].projectOc.coverageOc.currencyCd;
		this.coverageInfo.currencyRt	= data['policyOc'].projectOc.coverageOc.currencyRt;
		this.coverageInfo.totalSi		= data['policyOc'].projectOc.coverageOc.totalSi;
		this.coverageInfo.pctShare		= data['policyOc'].projectOc.coverageOc.pctShare;
		this.coverageInfo.pctPml		= data['policyOc'].projectOc.coverageOc.pctPml;
		this.coverageInfo.totalValue	= data['policyOc'].projectOc.coverageOc.totalValue;
		setTimeout(a=>{
			this.loading = false;
      this.firstBlur = true;
			$('[appCurrency]').focus()
			$('[appCurrency]').blur()
			$('[appOtherRates]').focus()
			$('[appOtherRates]').blur()
			$('[appCurrencyRate]').focus()
			$('[appCurrencyRate]').blur()
      this.firstBlur = false;
		},0);
	});
  }

  save(){
  	this.coverageInfo.pctShare = parseFloat(this.coverageInfo.pctShare.toString().split(',').join(''));
  	this.coverageInfo.totalValue = parseFloat(this.coverageInfo.totalValue.toString().split(',').join(''));
  	this.coverageInfo.pctPml = this.coverageInfo.pctPml === '' || this.coverageInfo.pctPml === null ? '0': parseFloat(this.coverageInfo.pctPml.toString().split(',').join(''));
	this.uw.saveSumInsOC(this.coverageInfo).subscribe((data:any)=>{
	if(data.returnCode == -1){
		this.dialogIcon = 'success';
		this.successDiag.open();
		this.myForm.control.markAsPristine();
		this.fetchData('save');
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
  	//this.checkTotalValueRange();
    if(data !== 0 ){
      this.coverageInfo.pctShare = (parseFloat(this.coverageInfo.totalSi) / parseFloat(data.toString().split(',').join('')) * 100).toFixed(10);
      this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');
    }else{
      this.coverageInfo.pctShare = 0;
      this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare, '1.10-10');
    }
  	
  }

  cmptValue(data){
  	//this.checkPctShareRange();
    if(data.length !== 0 ){
      this.coverageInfo.totalValue = (parseFloat(this.coverageInfo.totalSi) / parseFloat(data.toString().split(',').join('')) * 100).toFixed(2);
      this.coverageInfo.totalValue = this.dp.transform(this.coverageInfo.totalValue, '1.2-2');
    }else{
      this.coverageInfo.totalValue = 0;
      this.coverageInfo.totalValue = this.dp.transform(this.coverageInfo.totalValue, '1.2-2');
    }
  	
  }

  checkPctShareRange(){
  	if(parseFloat(this.coverageInfo.pctShare.toString().split(',').join('')) > parseFloat('100.0000000000')){
  		/*this.coverageInfo.pctShare = parseFloat('100');
  		this.cmptValue(this.coverageInfo.pctShare);
  		this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');*/
      if(!this.firstBlur){
        this.promptMessage = "Share (%) will exceed 100%";
        this.promptType = "pctshare";
        this.mdl.open();
      }
  	}else{
  		this.coverageInfo.pctShare = this.dp.transform(this.coverageInfo.pctShare,'1.10-10');
  	}
  }

  checkPMLRange(){
  	/*if(parseFloat(this.coverageInfo.pctPml.toString().split(',').join('')) > parseFloat('100.0000000000')){
  		this.coverageInfo.pctPml = parseFloat('100');
  		this.coverageInfo.pctPml = this.dp.transform(this.coverageInfo.pctPml,'1.10-10');
  	}else{
  		this.coverageInfo.pctPml = this.dp.transform(this.coverageInfo.pctPml,'1.10-10');
  	}*/
  }

  checkTotalValueRange(){
  	if(parseFloat(this.coverageInfo.totalValue.toString().split(',').join('')) < parseFloat(this.coverageInfo.totalSi)){
  		/*this.coverageInfo.totalValue = this.coverageInfo.totalSi;
  		this.cmptShrPct(this.coverageInfo.totalValue);
  		this.coverageInfo.totalValue = this.dp.transform(this.coverageInfo.totalValue, '1.2-2');*/
      if(!this.firstBlur){
        this.promptMessage = "Max sum insured of the policy exceeded the total contract value of the project.";
        this.promptType = "totalval";
        this.mdl.open();
      }
  	}
  }

}
