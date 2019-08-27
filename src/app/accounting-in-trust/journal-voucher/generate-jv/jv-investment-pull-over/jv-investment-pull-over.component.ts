import { Component, OnInit } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';

@Component({
  selector: 'app-jv-investment-pull-over',
  templateUrl: './jv-investment-pull-over.component.html',
  styleUrls: ['./jv-investment-pull-over.component.css']
})
export class JvInvestmentPullOverComponent implements OnInit {
  
  passData: any = {
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true,
    magnifyingGlass: ['invtCode'],
    nData: {
      tranId: '',
      billId: 1,
      itemNo: '',
      invtId: '',
      invtCode: '',
      certNo: '',
      invtType: '',
      invtTypeDesc: '',
      invtSecCd: '',
      securityDesc: '',
      maturityPeriod: '',
      durationUnit: '',
      interestRate: '',
      purchasedDate: '',
      maturityDate: '',
      pulloutType: '',
      currCd: '',
      currRate: '',
      invtAmt: '',
      incomeAmt: '',
      bankCharge: '',
      whtaxAmt: '',
      maturityValue: '',
      createUser: '',
      createDate: '',
      updateUser: '',
      updateDate: '',
      showMG: 1
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue'],
    uneditable: [false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ],
    checkFlag: true,
    pageID: 6,
    widths:[220, 150, 1, 150, 1, 1, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120]
  };

  banks: any[] = [];
  bankAccts: any[] = [];
  
  selectedBank: any = {
    bankCd: '',
    officialName: ''
  }

  selectedBankAcct: any = {
    bankAcctCd: '',
    accountNo: ''
  }

  jvDetails: any = {

  };

  constructor(private ms: MaintenanceService, private ns: NotesService, private accService: AccountingService) { }

  ngOnInit() {
  	
  }
}
