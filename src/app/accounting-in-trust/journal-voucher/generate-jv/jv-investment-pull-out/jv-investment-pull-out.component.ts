import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountingService, NotesService, MaintenanceService } from '@app/_services';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component'

@Component({
  selector: 'app-jv-investment-pull-out',
  templateUrl: './jv-investment-pull-out.component.html',
  styleUrls: ['./jv-investment-pull-out.component.css']
})
export class JvInvestmentPullOutComponent implements OnInit {
  
  @Input() jvDetail;
  @ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;

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
  bankAccts : any[] =[];
  forkSub: any;
  selectedBank:any;
  selectedBankCd:any;
  selectedBankAcct:any;
  accountNo:any;

  constructor(private ms: MaintenanceService, private ns: NotesService, private accService: AccountingService) { }

  ngOnInit() {
    //this.getInvPullout();
    this.getBank();
    //this.getInvPullout();
  }

  getBank(){
    this.banks = [];
    this.bankAccts = [];

    this.ms.getMtnBank().subscribe((data:any) => {
      for (var i = 0; i < data.bankList.length; ++i) {
        this.banks.push(data.bankList[i]);
      }
      console.log(this.banks)
    });
  }

  //   var sub$ = forkJoin(this.ms.getMtnBank(),
  //                       this.ms.getMtnBankAcct()).pipe(map(([bank, bankAcct]) => { return {bank, bankAcct }; }));

  //   this.forkSub = sub$.subscribe((data:any) =>{

      

  //     for (var j = 0; j < data.bankAcct.bankAcctList.length; j++) {
  //       this.bankAccts.push( data.bankAcct.bankAcctList[j]);
  //     }

  //   });
  // }

  changeBank(data){
    this.passData.tableData = [];
    this.table.refreshTable();
    //this.selectedBank = data;
    this.selectedBankCd = data.bankCd;
    this.getBankAcct();
  }

  getBankAcct(){
    this.bankAccts = [];
    this.ms.getMtnBankAcct(this.selectedBankCd).subscribe((data:any)=>{
      if(data.bankAcctList.length !== 0){
        this.bankAccts = data.bankAcctList;
        this.bankAccts = this.bankAccts.filter(a=>{return a.bankCd == this.selectedBankCd && a.currCd == this.jvDetail.currCd && a.acSeGlDepNo === null && a.acItGlDepNo !== null });
      }
    });
  }

  changeBankAcct(data){
    this.accountNo = data.accountNo;
    this.getInvPullout();
  }

  getInvPullout(){
    this.accService.getJvInvPullout(this.jvDetail.tranId/*,this.selectedBankCd,this.accountNo*/).subscribe((data:any) => {
      console.log(data)
      this.passData.tableData = [];
      if(data.pullOut.length !== 0){
        /*this.selectedBank = data.pullOut[0];
        this.selectedBankAcct = data.pullOut[0];*/
        for (var i = 0; i < data.pullOut.length; i++) {
          this.passData.tableData.push(data.pullOut[i]);
        }
      }
      this.table.refreshTable();
      console.log(this.selectedBank)
    });
  }

  /*compareBankFn(c1: any, c2: any): boolean {
      return c1.bank === c2.bankCd;
  }*/

}
