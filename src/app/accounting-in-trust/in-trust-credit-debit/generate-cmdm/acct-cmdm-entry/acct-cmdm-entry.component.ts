import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountingService, MaintenanceService, NotesService, PrintService } from '@app/_services';
import { CMDM } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { MtnCurrencyComponent } from '@app/maintenance/mtn-currency/mtn-currency.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-acct-cmdm-entry',
  templateUrl: './acct-cmdm-entry.component.html',
  styleUrls: ['./acct-cmdm-entry.component.css']
})
export class AcctCmdmEntryComponent implements OnInit {
  @ViewChild('cancelMdl')cancelMdl: ModalComponent;
  @ViewChild('confirmPrintMdl')confirmPrintMdl: ModalComponent;
  @ViewChild('myForm') form:any;
  @Input()passData;
  @Output() updateData: EventEmitter<any> = new EventEmitter();
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
  passLov:any = {
  	selector:'',
  	params:{}
  };

  @ViewChild(LovComponent)lov: LovComponent;
  @ViewChild(MtnCurrencyComponent) currLov: MtnCurrencyComponent;


  @ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  @ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  @ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
  dialogIcon: string = '';
  dialogMessage: string = '';
  cancelFlag: boolean = false;

constructor(private accountingService: AccountingService, private titleService: Title, private mtnService: MaintenanceService, 
  private ns: NotesService, private ps: PrintService) { }

  ngOnInit() {
  	if(this.passData.memoId != undefined && this.passData.memoType != undefined){
	  	this.getTranTypes();
	  	this.getSeqDigits();
	  }else
		  this.clickNew();  
  }

  getSeqDigits(){
    this.mtnService.getMtnParameters('N','CMDM_NO_DIGITS').subscribe(a=>{
      this.passData.seqDigits = a['parameters'][0].paramValueN;
  	  this.getListing();
    })
  }

  getListing(){
  	$('.globalLoading').css('display','block');
    this.accountingService.getCMDMListing({tranId:this.passData.memoId}).subscribe(a=>{
   	  $('.globalLoading').css('display','none');
      this.memoInfo = a['cmdmList'][0];
      this.memoInfo.memoDate = this.ns.toDateTimeString(this.memoInfo.memoDate);
      this.memoInfo.createDate = this.ns.toDateTimeString(this.memoInfo.createDate);
      this.memoInfo.updateDate = this.ns.toDateTimeString(this.memoInfo.updateDate);
      this.memoInfo.refNoDate = this.ns.toDateTimeString(this.memoInfo.refNoDate);
      this.memoInfo.memoSeqNo = String(this.memoInfo.memoSeqNo).padStart(this.passData.seqDigits,'0');
      this.memoInfo.localCurrCd = 'PHP';
      this.passLov.params.groupTag = this.memoInfo.groupTag;

      if(this.memoInfo.autoTag == 'Y'){
        $('input,textarea').prop('readonly','readonly');
      }
      this.updateData.emit(this.memoInfo);
      this.updateReportsList(this.memoInfo.memoType,this.memoInfo.tranTypeCd);
    });
  }

  getTranTypes(memoType?){
  	if(memoType != undefined){
  		this.memoInfo.new = false;
  		this.mtnService.getMtnAcitTranType( memoType.target.value).subscribe(a=>{
	  		this.tranTypes = a['tranTypeList'];
	  		this.memoInfo.new = true;
	  	})
	  	return;
  	}

  	if(this.passData.memoType != undefined)
	  	this.mtnService.getMtnAcitTranType(this.passData.memoType).subscribe(a=>{
	  		this.tranTypes = a['tranTypeList'];
	  	})
  }

  save(){
  	this.memoInfo.createUser = this.ns.getCurrentUser();
  	this.memoInfo.createDate = this.ns.toDateTimeString(0);
  	this.memoInfo.updateUser = this.ns.getCurrentUser();
  	this.memoInfo.updateDate = this.ns.toDateTimeString(0);
  	this.accountingService.saveAcitCMDM(this.memoInfo).subscribe(a=>{
  		if(a['returnCode']==-1){
  			this.dialogIcon = 'success';
  			this.successDiag.open();
		    this.form.control.markAsPristine()
  			this.memoInfo = a['cmdm'][0];
  			this.memoInfo.memoDate = this.ns.toDateTimeString(this.memoInfo.memoDate);
		    this.memoInfo.createDate = this.ns.toDateTimeString(this.memoInfo.createDate);
		    this.memoInfo.updateDate = this.ns.toDateTimeString(this.memoInfo.updateDate);
		    this.memoInfo.refNoDate = this.ns.toDateTimeString(this.memoInfo.refNoDate);
		    this.memoInfo.memoSeqNo = String(this.memoInfo.memoSeqNo).padStart(this.passData.seqDigits,'0');
		    this.memoInfo.localCurrCd = 'PHP';
		    this.passLov.params.groupTag = this.memoInfo.groupTag;
        // this.passData.tranId = this.memoInfo.tranId;
        this.updateData.emit(this.memoInfo);
        this.updateReportsList(this.memoInfo.memoType,this.memoInfo.memoTranType);
  		}else{
  			this.dialogIcon = 'error';
  			this.successDiag.open();
  		}
  	});
  }

  openLov(selector){
  	if(selector == 'refNo'){
  		this.passLov.params.arTag = 'Y';
  		this.passLov.params.cvTag = 'Y';
  		this.passLov.params.jvTag = 'Y';
  		this.passLov.selector = 'refNo';
  	}else if(selector == 'payee'){
      this.passLov.selector = 'payee';
    }

  	this.lov.openLOV();
  }

  setLov(data){
    console.log(data)
  	if(data.selector == 'refNo'){
      if (data.data == null){
        this.memoInfo.refNoTranId = '';
        this.memoInfo.refNoDate = '';
        this.memoInfo.refNo = '';
      }else{
    		this.memoInfo.refNoTranId = data.data.tranId;
    		this.memoInfo.refNoDate = this.ns.toDateTimeString(data.data.tranDate);
    		this.memoInfo.refNo = data.data.tranNo;
      }
  	}else if(data.selector == 'payee'){
      this.memoInfo.payeeNo = data.data.payeeNo;
      this.memoInfo.payee = data.data.payeeName;
    }
    this.ns.lovLoader(data.ev, 0);
    this.form.control.markAsDirty();
  }


  clickNew(){
  	this.memoInfo = JSON.parse(JSON.stringify(this.newMemoInfo));
  	this.passLov.params.groupTag = '';
    this.updateData.emit(this.memoInfo);
  }

  setCurrency(data){
  	this.memoInfo.currCd = data.currencyCd;
  	this.memoInfo.currRate = data.currencyRt;
  	this.memoInfo.localAmt = this.memoInfo.cmdmAmt * this.memoInfo.currRate;
    this.ns.lovLoader(data.ev, 0);
  }


	changeTranType(data){
		let selectedTran = this.tranTypes.filter(a=>a.tranTypeCd == data.target.value)[0];
		this.passLov.params.groupTag = selectedTran.groupTag;
	}

	onClickSave(){
    if($('[appRequired]').toArray().some((a:any)=>a.value.length == 0)){
    	this.dialogIcon = 'error';
    	this.successDiag.open()
    	return;
    }

    this.confirmSave.confirmModal()
  }

  checkCode(ev, field) {
      this.ns.lovLoader(ev, 1);
      if(field === 'currency') {
        this.currLov.checkCode(this.memoInfo.currCd, ev);
      }else if(field=='refNo'){
        this.passLov.params.arTag = 'Y';
        this.passLov.params.cvTag = 'Y';
        this.passLov.params.jvTag = 'Y';
        this.passLov.selector = "refNo";
        this.lov.checkCdOthers(field,ev);
        console.log('component')
      }
    }

   openCancelMdl(){
     this.cancelMdl.openNoClose();
   }

   openConfirmPrintMdl(){
     this.confirmPrintMdl.openNoClose();
   }

   cancelCMDM(){
     let params:any = {
       tranId : this.memoInfo.memoId,
       updateUser : this.ns.getCurrentUser(),
       updateDate : this.ns.toDateTimeString(0)
     }
     this.accountingService.cancelCMDM(params).subscribe(a=>{
       if(a['returnCode'] == -1){
         this.getListing();
       }
     });
   }

   printCMDM(){
     let params:any = {
       tranId : this.memoInfo.memoId,
       updateUser : this.ns.getCurrentUser(),
       updateDate : this.ns.toDateTimeString(0)
     }
     this.accountingService.printCMDM(params).subscribe(a=>{
       if(a['returnCode'] == -1){
         this.getListing();
       }
     });
   }

  printReport:any = '';
  printDestination:any = 'screen';

  reportsList:any[] = [];

  @ViewChild('printModal') printModal: ModalComponent;

  updateReportsList(memoType, memoTranType){
    this.reportsList = [];
    if(this.memoInfo.refNo.substring(0,2) == 'JV'){
     this.accountingService.getJVEntry(this.memoInfo.refNoTranId).subscribe((a:any)=>{
        if(a.transactions.tranTypeCd == 7){
          this.reportsList = [{reportId: 'ACITR046F', reportName:'CMDM-Losses Offsetting'}]
        }else if(memoTranType== '1'){
          this.reportsList = [{reportId: 'ACITR046A', reportName:'CMDM-Policy'}]
        }else if(memoTranType == '3' || memoTranType == '4'){
          this.reportsList = [{reportId: 'ACITR046E', reportName:'CMDM-Offsetting of Receivables In-Trust'}]
        }else if(memoType == 'DM' && memoTranType== '5'){
          this.reportsList = [{reportId: 'ACITR046C', reportName:'CMDM-Interest Penalty'}]
        }else if(memoType == 'DM' && memoTranType== '6'){
          this.reportsList = [{reportId: 'ACITR046D', reportName:'CMDM-Service Feee'}]
        }else{
          this.reportsList = [{reportId: 'ACITR046B', reportName:'CMDM-Others'}]
        }
        this.printReport = this.reportsList[0].reportId;
     })
    }else{
      if(memoTranType== '1'){
        this.reportsList = [{reportId: 'ACITR046A', reportName:'CMDM-Policy'}]
      }
      this.printReport = this.reportsList[0].reportId;
    }

  }

  print(){
    let params:any = {
                        memoId:this.memoInfo.memoId
                     }
    params.reportId = this.printReport;
    params.fileName = this.memoInfo.memoType + '-' + this.memoInfo.memoTranType + '-' + this.memoInfo.memoYear + '-' + this.memoInfo.memoMm + '-' + this.memoInfo.memoSeqNo;

    
    this.ps.print(this.printDestination,this.printReport,params);
  }

}
