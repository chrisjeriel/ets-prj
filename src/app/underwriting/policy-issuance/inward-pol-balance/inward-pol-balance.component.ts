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

  passData: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    nData: {},
    addFlag: true,
    deleteFlag: true,
    widths: [],
    pageLength: 5
  };

  passData2: any = {
    tableData: [],
    tHeader: [],
    dataTypes: [],
    magnifyingGlass: [],
    addFlag: true,
    deleteFlag: true,
    widths: [],
    pageLength: 4
  };

  nData: PolicyInwardPolBalance = new PolicyInwardPolBalance(null, null, null, null, null, null);
  //nData2: PolInwardPolBalanceOtherCharges = new PolInwardPolBalanceOtherCharges(null, null, null);

  constructor(private underwritingservice: UnderwritingService, private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Inward Pol Balance");

    this.passData.tHeader.push("Inst No");
    this.passData.tHeader.push("Due Date");
    this.passData.tHeader.push("Booking Date");
    this.passData.tHeader.push("Premium");
    this.passData.tHeader.push("Other Charges");
    this.passData.tHeader.push("Amount Due");

    this.passData.dataTypes.push("text");
    this.passData.dataTypes.push("date");
    this.passData.dataTypes.push("date");
    this.passData.dataTypes.push("currency");
    this.passData.dataTypes.push("currency");
    this.passData.dataTypes.push("currency");

    this.passData.widths.push("1", "1", "1", "auto", "auto", "auto");

    this.passData.tableData = this.underwritingservice.getInwardPolBalance();

    this.passData2.tHeader.push("Code");
    this.passData2.tHeader.push("Charge Description");
    this.passData2.tHeader.push("Amount");

    this.passData2.dataTypes.push("text");
    this.passData2.dataTypes.push("text");
    this.passData2.dataTypes.push("currency");

    this.passData2.widths.push("auto", "auto", "auto");
    this.passData2.magnifyingGlass.push("code");

    this.passData2.tableData = this.underwritingservice.getInwardPolBalanceOtherCharges();
  }

}
