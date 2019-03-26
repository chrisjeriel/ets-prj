import { Component, OnInit, Input } from '@angular/core';
import { UnderwritingService } from '@app/_services/underwriting.service';
import { PolicyInwardPolBalance, PolInwardPolBalanceOtherCharges } from '@app/_models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inward-pol-balance',
  templateUrl: './inward-pol-balance.component.html',
  styleUrls: ['./inward-pol-balance.component.css']
})
export class InwardPolBalanceComponent implements OnInit {


  tableData: any[] = [];
  tHeader: any[] = [];
  magnifyingGlass: any[] = ['code'];
  dataTypes: any[] = [];
  addFlag;
  deleteFlag;

  passDataInstallmentInfo: any = {
    tableData: [],
    tHeader: ["Inst No","Due Date","Booking Date","Premium","Other Charges","Amount Due"],
    dataTypes: ["text","date","date","currency","currency","currency"],
    nData:  new PolicyInwardPolBalance(null, null, null, null, null, null),
    addFlag: true,
    deleteFlag: true,
    widths: ["1", "1", "1", "auto", "auto", "auto"],
    pageLength: 5,
    keys: ['instNo','dueDate','bookingDate','premium','otherCharges','amountDue'],
    total : [null,null,'Total','premium','otherCharges','amountDue']
  };

  passDataOtherCharges: any = {
    tableData: [],
    tHeader: ["Code","Charge Description","Amount"],
    dataTypes: ["text","text","currency"],
    nData: new PolInwardPolBalanceOtherCharges(null,null,null),
    magnifyingGlass: ["code"],
    addFlag: true,
    deleteFlag: true,
    widths: ["auto", "auto", "auto"],
    pageLength: 4,
    keys: ['code','chargeDesc','amount'],
    total: [null,'Total','amount']
  };

 constructor(private underwritingservice: UnderwritingService, private titleService: Title) { 
 }


 ngOnInit() {
   
    this.titleService.setTitle("Pol | Inward Pol Balance");
    this.getInstallmentInfo();
    this.getOtherCharges();
      
 }

 getInstallmentInfo(){
   this.underwritingservice.getInwardPolBalance()
      .subscribe(data => {
        var rec = data['policyList'];
        for(let i of rec){
           this.passDataInstallmentInfo.tableData.push({
             instNo:             i.inwPolBalance.instNo,
             dueDate:            i.inwPolBalance.dueDate,
             bookingDate:        i.inwPolBalance.bookingDate,
             premium:            i.inwPolBalance.premAmt,
             otherCharges:       i.inwPolBalance.otherChargesInw,
             amountDue:          i.inwPolBalance.amtDue
           });
        }
      });
 }

 getOtherCharges(){
   this.underwritingservice.getInwardPolBalance()
      .subscribe(data => {
        var rec = data['policyList'];
        for(let i of rec){
           this.passDataOtherCharges.tableData.push({
              code:             i.inwPolBalance.otherCharges.chargeCd,
              chargeDesc:       'column under maintenance',
              amount:           i.inwPolBalance.otherCharges.amount
           });
        }
      });
 }

}

