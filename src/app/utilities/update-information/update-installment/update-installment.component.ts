import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-update-installment',
  templateUrl: './update-installment.component.html',
  styleUrls: ['./update-installment.component.css']
})
export class UpdateInstallmentComponent implements OnInit {

  passDataInstallmentInfo: any = {
    tableData: [["1", "2019-01-12", "01/01/2019", "300000", "3.2", "500000", "100000", "200000"]],
    tHeader: ["Inst No", "Due Date", "Booking Date", "Premium Amount", "Comm Rate(%)", "Comm Amount", "Other Charges", "Amount Due"],
    dataTypes: ["number", "date", "date", "currency", "percent", "currency", "currency", "currency"],
    addFlag: true,
    deleteFlag: true,
    pageID: 1,
    widths: ["1", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    nData: [null, null, null, null, null, null, null, null],
    pageLength: 5
  };

  passDataOtherCharges: any = {
    tableData: [["101", "Description 101", "50000"]],
    tHeader: ["Code", "Charge Description", "Amount"],
    dataTypes: ["text", "text", "currency"],
    addFlag: true,
    deleteFlag: true,
    pageID: 2,
    nData: [null, null, null],
    magnifyingGlass: ['0'],
    pageLength: 5
  };

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Update Installment");
  }

}
