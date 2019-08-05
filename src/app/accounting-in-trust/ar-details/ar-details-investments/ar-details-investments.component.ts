import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccARInvestments } from '@app/_models';
import { AccountingService, MaintenanceService, NotesService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
 
@Component({
  selector: 'app-ar-details-investments',
  templateUrl: './ar-details-investments.component.html',
  styleUrls: ['./ar-details-investments.component.css']
})
export class ArDetailsInvestmentsComponent implements OnInit {

  @Input() record: any;

  @ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  
  passDataInvestment: any = {
    tableData:[],
    tHeader:['Investment Code','Certificate No.','Investment Type','Security', 'Maturity Period', 'Duration Unit','Interest Rate','Date Purchased','Maturity Date','Curr','Curr Rate','Investment','Investment Income','Bank Charge','Withholding Tax','Maturity Value'],
    dataTypes:['text','text','text','text','number','text','percent','date','date','text','percent','currency','currency','currency','currency','currency'],
    total:[null,null,null,null,null,null,null,null,null,null,'Total','invtAmt','incomeAmt','bankCharge','whtaxAmt','maturityValue'],
    addFlag:true,
    deleteFlag:true,
    infoFlag:true,
    paginateFlag:true, 
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
    },
    keys: ['invtCode', 'certNo', 'invtTypeDesc', 'securityDesc', 'maturityPeriod', 'durationUnit', 'interestRate', 'purchasedDate', 'maturityDate', 'currCd', 'currRate', 
           'invtAmt' , 'incomeAmt', 'bankCharge', 'whtaxAmt', 'maturityValue'],
    uneditable: [false, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true ],
    checkFlag: true,
    pageID: 6,
    widths:[220, 150, 1, 150, 1, 1, 85, 1, 1, 1, 85, 120, 120, 120, 120, 120, 120]
  }

  constructor(private accountingService: AccountingService, private ns: NotesService, private ms: MaintenanceService) { }

  ngOnInit() {
    console.log(this.record.tranId);
    this.passDataInvestment.nData.tranId = this.record.tranId;
    this.retrieveFullPullout();
  }

  retrieveFullPullout(){
    this.accountingService.getAcitArInvPullout(this.record.tranId, 1, 'F').subscribe(  //F is pullout type for this screen. Bill Id is always 1 for Investment Pullout
      (data: any)=>{
        this.passDataInvestment.tableData = data.invPulloutList;
        this.table.refreshTable();
      }
    );
  }

}
