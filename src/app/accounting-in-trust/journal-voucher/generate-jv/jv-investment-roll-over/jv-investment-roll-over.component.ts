import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'

@Component({
  selector: 'app-jv-investment-roll-over',
  templateUrl: './jv-investment-roll-over.component.html',
  styleUrls: ['./jv-investment-roll-over.component.css']
})
export class JvInvestmentRollOverComponent implements OnInit {
   
   @Input() jvDetail;
   @ViewChild('lov') lovMdl: LovComponent;
   @ViewChild('newLov') newlovMdl: LovComponent;
   @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

   passData: any = {
   	tHeaderWithColspan : [],
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value','Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency','text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','srcInvtAmt', 'srcIncomeAmt', 'srcBankCharge', 'srcWhtaxAmt', 'srcMaturityValue',null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
    magnifyingGlass: ['invtCode','srcInvtCode'],
    nData: {
      tranId : '',
      itemNo : '',
      invtId : '',
      invtCode : '',
      certNo : '',
      invtType : '',
      invtTypeDesc : '',
      invtSecCd : '',
      securityDesc : '',
      maturityPeriod : '',
      durationUnit : '',
      interestRate : '',
      purchasedDate : '',
      maturityDate : '',
      destInvtId : '',
      bank : '',
      bankName : '',
      bankAcct : '',
      pulloutType : '',
      currCd : '',
      currRate : '',
      invtAmt : '',
      incomeAmt : '',
      bankCharge : '',
      whtaxAmt : '',
      maturityValue : '',
      localAmt : '',
      createUser : this.ns.getCurrentUser(),
      createDate : '',
      updateUser : this.ns.getCurrentUser(),
      updateDate : '',
      showMG: 1
    },
    keys: ['srcInvtCode', 'srcCertNo', 'srcInvtTypeDesc', 'srcSecurityDesc', 'srcMaturityPeriod', 'srcDurationUnit', 'srcInterestRate', 'srcPurchasedDate', 'srcMaturityDate', 'srcCurrCd', 'srcCurrencyRt', 'srcInvtAmt', 'srcIncomeAmt', 'srcBankCharge', 'srcWhtaxAmt', 'srcMaturityValue', 'invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 'invtAmt', 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue'],
    uneditable: [false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true  ],
    checkFlag: true,
    pageID: 6,
    widths:[100, 150, 127, 130, 90, 83, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120, 100, 150, 127, 130, 90, 83, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120]
  };

  passLov: any = {
    selector: 'acitArInvPullout',
    searchParams: [],
    hide: []
  };

  invIndex:any;

  constructor(private ns: NotesService, private accountingService: AccountingService) { }

  ngOnInit() {
  	this.passData.tHeaderWithColspan.push({ header: "", span: 1 }, { header: "Investment Source", span: 16 }, { header: "Investment Source", span: 16 });
  	this.getInvRollOut();
  }


  invstLOV(data){
  	if(data.key === 'srcInvtCode'){
  		this.passLov.searchParams = [{key:'invtStatus', search: 'MATURED'}];
  		this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.srcInvtCode});
  		console.log(this.passLov.hide);
  		this.invIndex = data.index;
  		this.lovMdl.openLOV();
  	}else if(data.key === 'invtCode'){
  		this.passLov.searchParams = [{key:'invtStatus', search: 'MATURED'}];
  		this.passLov.hide = this.passData.tableData.filter((a)=>{return !a.deleted}).map((a)=>{return a.invtCode});
  		this.invIndex = data.index;
  		this.newlovMdl.openLOV();
  	}
  }

  setSelectedData(data){
  	console.log(data)
  	let selected = data.data;
	  this.passData.tableData[this.invIndex].srcInvtId 			= selected[0].invtId; 
      this.passData.tableData[this.invIndex].srcInvtCode 		= selected[0].invtCd; 
      this.passData.tableData[this.invIndex].srcCertNo 			= selected[0].certNo;
      this.passData.tableData[this.invIndex].srcInvtType 		= selected[0].invtType;
      this.passData.tableData[this.invIndex].srcInvtTypeDesc 	= selected[0].invtTypeDesc;
      this.passData.tableData[this.invIndex].srcInvtSecCd 		= selected[0].invtSecCd;
      this.passData.tableData[this.invIndex].srcSecurityDesc 	= selected[0].securityDesc;
      this.passData.tableData[this.invIndex].srcMaturityPeriod 	= selected[0].matPeriod;
      this.passData.tableData[this.invIndex].srcDurationUnit 	= selected[0].durUnit;
      this.passData.tableData[this.invIndex].srcPurchasedDate 	= selected[0].purDate;
      this.passData.tableData[this.invIndex].srcMaturityDate 	= selected[0].matDate;
      this.passData.tableData[this.invIndex].srcCurrCd 			= selected[0].currCd;
      this.passData.tableData[this.invIndex].srcCurrRate 		= selected[0].currRate;
      this.passData.tableData[this.invIndex].srcInterestRate 	= selected[0].intRt;
      this.passData.tableData[this.invIndex].srcInvtAmt 		= selected[0].invtAmt;
      this.passData.tableData[this.invIndex].srcIncomeAmt 		= selected[0].incomeAmt;
      this.passData.tableData[this.invIndex].srcBankCharge 		= selected[0].bankCharge;
      this.passData.tableData[this.invIndex].srcWhtaxAmt 		= selected[0].whtaxAmt;
      this.passData.tableData[this.invIndex].srcMaturityValue 	= selected[0].matVal;

      this.table.refreshTable();
  }

  setSelectedDataInv(data){
  	console.log(data)
  	let selected = data.data;
	  this.passData.tableData[this.invIndex].invtId 			= selected[0].invtId; 
      this.passData.tableData[this.invIndex].invtCode 			= selected[0].invtCd; 
      this.passData.tableData[this.invIndex].certNo 			= selected[0].certNo;
      this.passData.tableData[this.invIndex].invtType 			= selected[0].invtType;
      this.passData.tableData[this.invIndex].invtTypeDesc 		= selected[0].invtTypeDesc;
      this.passData.tableData[this.invIndex].invtSecCd 			= selected[0].invtSecCd;
      this.passData.tableData[this.invIndex].securityDesc 		= selected[0].securityDesc;
      this.passData.tableData[this.invIndex].maturityPeriod 	= selected[0].matPeriod;
      this.passData.tableData[this.invIndex].durationUnit 		= selected[0].durUnit;
      this.passData.tableData[this.invIndex].purchasedDate 		= selected[0].purDate;
      this.passData.tableData[this.invIndex].maturityDate 		= selected[0].matDate;
      this.passData.tableData[this.invIndex].currCd 			= selected[0].currCd;
      this.passData.tableData[this.invIndex].currRate 			= selected[0].currRate;
      this.passData.tableData[this.invIndex].interestRate 		= selected[0].intRt;
      this.passData.tableData[this.invIndex].invtAmt 			= selected[0].invtAmt;
      this.passData.tableData[this.invIndex].incomeAmt 			= selected[0].incomeAmt;
      this.passData.tableData[this.invIndex].bankCharge 		= selected[0].bankCharge;
      this.passData.tableData[this.invIndex].whtaxAmt 			= selected[0].whtaxAmt;
      this.passData.tableData[this.invIndex].maturityValue 		= selected[0].matVal;

    this.table.refreshTable();
  }

  getInvRollOut(){
  	this.accountingService.getJvInvRollOver(this.jvDetail.tranId).subscribe((data:any) => {
  		console.log(data);
  		this.passData.tableData = [];
  		for (var i = 0; i < data.invtRollOver.length; i++) {
  			this.passData.tableData.push(data.invtRollOver[i]);
  		}
  		this.table.refreshTable();
  	});
  }


  prepareData(){
  	for(var i = 0 ; i < this.passData.tableData.length; i++){
  		if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
  			
  		}
  	}
  }

  saveData(){
  	this.prepareData();
  }
}
