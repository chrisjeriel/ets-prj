import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-acct-or-official-receipt',
  templateUrl: './acct-or-official-receipt.component.html',
  styleUrls: ['./acct-or-official-receipt.component.css']
})
export class AcctOrOfficialReceiptComponent implements OnInit {

  @Input() paymentType: string = "type";

  constructor() { }

  ngOnInit() {
  	if(this.paymentType == null){
      this.paymentType = "";
    }
  }

}
