import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UnderwritingService, NotesService, AccountingService } from '@app/_services';
import { PolicyInwardPolBalance, PolInwardPolBalanceOtherCharges } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-premium-coll',
  templateUrl: './premium-coll.component.html',
  styleUrls: ['./premium-coll.component.css']
})
export class PremiumCollComponent implements OnInit {

  @ViewChild('instllmentTable')instllmentTable:CustEditableNonDatatableComponent;
  @ViewChild('paytsTable')paytsTable:CustEditableNonDatatableComponent;
  @Input()fromInq: boolean = false;
  @Input() policyInfo: any;
  @Output() showAlop = new EventEmitter<any>();

  passData: any = {
    tableData: [],
    tHeader: ['Alt No','Inst No','Due Date','Booking Date','Memo No','Acct. Entry Date','Premium','Comm Rate(%)','Comm Amt','VAT on R/I Comm','Other Charges','Amount Due'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,],
    total:[null,null,null,null,null,'Total','premAmt',null,'commAmt','vatRiComm','otherChargesInw','amtDue'],
    dataTypes: ["number","number","date","date",'text',"date","currency","percent","currency","currency","currency","currency",],
    keys:['altNo','instNo','dueDate','bookingDate','memoNo','acctEntDate','premAmt','commRt','commAmt','vatRiComm','otherChargesInw','amtDue'],
    nData: {},
    widths:[1,"1", "1", "1", "1","1", "auto", "auto", "auto", "auto", "auto", "auto"],
    pageID:'installment',
    pageLength: 'unli-5',
  };

  passData2: any = {
    tableData: [],
    tHeader: ['Reference No','Transaction Date','Premium Amount','Comm Amount','VAT on R/I Comm','Other Charges','Collection Ammount'],
    uneditable: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,],
    total:[null,'Total','premAmt','riComm','riCommVat','charges','paytAmt'],
    dataTypes: ["text","date","currency","currency","currency","currency","currency"],
    keys:['tranNo','tranDate','premAmt','riComm','riCommVat','charges','paytAmt'],
    nData: {},
    widths:[1,"1", "auto", "auto", "auto", "auto" ,"auto"],
    pageID:'payts',
    pageLength: 'unli-5',
  };
 

  totalPrem: string = "";
  currency: string = "";
  dialogMsg: string = "";
  cancelFlag : boolean = false;

  inwPolInfo: any = {
    currCd:'',
    totalAmtDue:0,
    totalColl:0,
    outstanding:0
  }

  constructor(private underwritingservice: UnderwritingService, private titleService: Title, private ns : NotesService, private as: AccountingService
  ) { }

 ngOnInit() {
    this.fetchData();  

    this.titleService.setTitle("Pol | Inward Pol Balance");
  }

  fetchData(){
    this.policyInfo.policyNo = this.underwritingservice.showPolicyNo;
    let polNo = this.policyInfo.policyNo.substring(0,this.policyInfo.policyNo.lastIndexOf('-'))+'%';

    forkJoin(this.underwritingservice.getInwardPolBalance(null,polNo),this.as.getAcitInwPolPayts(null,polNo))
          .pipe(map(([inwPol,payts]) => { return { inwPol,payts}; })).subscribe((data:any)=>{
              let inwPol = data.inwPol;
              let payts:any[] = data.payts.list;
              console.log(payts)
              this.inwPolInfo.currCd = data.inwPol.policyList[0].project.coverage.currencyCd;
              this.inwPolInfo.totalColl = payts.reduce((a,b)=>a+b.paytAmt,0);

              for(let pol of inwPol.policyList){
                if(pol.inwPolBalance.length !=0){
                  this.passData.tableData = this.passData.tableData.concat(pol.inwPolBalance.map(a=>{
                      a.dueDate     = this.ns.toDateTimeString(a.dueDate);
                      a.bookingDate = this.ns.toDateTimeString(a.bookingDate);
                      a.otherCharges = a.otherCharges.filter(a=>a.chargeCd!=null);
                      a.altNo        = parseInt(pol.policyNo.split('-').pop());
                      a.policyId    = pol.policyId;
                      a.payts = data.payts.list.filter(b=>a.policyId==b.policyId && a.instNo==b.instNo);
                      return a;
                    }));
                 }
              }
              this.inwPolInfo.totalAmtDue = this.passData.tableData.reduce((a,b)=>a+b.amtDue,0);
              this.inwPolInfo.outstanding = this.inwPolInfo.totalAmtDue - this.inwPolInfo.totalColl;
              this.instllmentTable.onRowClick(null,this.passData.tableData[0]);
              this.instllmentTable.refreshTable();
            });
  }

  onInstClick(data){
    if(data!=null)
      this.passData2.tableData = data.payts;
    else
      this.passData2.tableData = [];
    this.paytsTable.refreshTable();
  }
  
}


