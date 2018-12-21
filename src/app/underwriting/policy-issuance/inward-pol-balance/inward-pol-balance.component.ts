import { Component, OnInit, Input } from '@angular/core';
import { UnderwritingService } from '@app/_services/underwriting.service';
import { PolicyInwardPolBalance, InvoiceInformation } from '@app/_models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inward-pol-balance',
  templateUrl: './inward-pol-balance.component.html',
  styleUrls: ['./inward-pol-balance.component.css']
})
export class InwardPolBalanceComponent implements OnInit {

  tableData: any[] = [];
  tableData2: any[] = [];
  tHeader2: any[] = [];
  options: any[] = [];
  pageLength: number = 5;
  pageLength_Invoice: number = 5;

  dtOptions: DataTables.Settings = {};

  // tableData_taxInfo: any[] = [
  //   new PolicyInwardPolBalance("TEST", "TEST", 1, "TEST"),
  //   new PolicyInwardPolBalance("TEST", "TEST", 1, "TEST"),
  //   new PolicyInwardPolBalance("TEST", "TEST", 1, "TEST"),
  // ];

  

  tHeader: any[] = ["Code", "Charge Description", "Amount"];
  dataTypes: any[] = ["text", "text", "text"];
  tableData_taxInfo: any[] = [
    ["","",""],
  ];

  tHeader_Invoice: any[] = ["Inst No", "Due Date", "Booking Date", "Prenium", "Other Charges","Amount Due"];
  dataTypes_Invoice: any[] = ["text", "date", "date", "currency", "currency","currency"];
  tableData_Invoice: any[] = [
    ["","","","","",""],
  ];
  constructor(private underwritingservice: UnderwritingService, private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Pol | Inward Pol Balance");
    this.tHeader2.push("");
    this.tHeader2.push("");
    this.tHeader2.push("");
    this.tHeader2.push("");
    this.tHeader2.push("");

    this.options.push({ selector: "taxCode", vals: ["", "EXE-CODE", "EXC-CODE", "EXC-CODE"] });
    this.options.push({ selector: "taxAllocation", vals: ["", "Fire", "Flood", "Calamity"] });



  }

}
