import { Component, OnInit, Input } from '@angular/core';
import { UnderwritingService } from '@app/_services/underwriting.service';
import { PolicyInwardPolBalance, InvoiceInformation } from '@app/_models';

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
  pageLength_Invoice: number = 3;

  dtOptions: DataTables.Settings = {};
  
  tableData_taxInfo: any[] = [
        new PolicyInwardPolBalance("TEST","TEST",1,"TEST"),
        new PolicyInwardPolBalance("TEST","TEST",1,"TEST"),
        new PolicyInwardPolBalance("TEST","TEST",1,"TEST"),
   ];

   tHeader: any[] = ["Tax Code","Tax Description","Tax Amount","Tax Allocation"];
   dataTypes: any[] = ["select","text","currency","select"];
   
   tableData_InvoiceInformation: any[] = [
   		new InvoiceInformation("TEST","TEST","TEST",1,1),
   		new InvoiceInformation("TEST","TEST","TEST",1,1),
   		new InvoiceInformation("TEST","TEST","TEST",1,1),
   ]

    tHeader_Invoice: any[] = ["Takeup Seq No","Booking Date","Premium","Total Tax","Amount Due"];
    dataTypes_Invoice: any[] = ["text","text","text","currency","currency"];

  constructor(private underwritingservice: UnderwritingService) { }

  ngOnInit() {

    this.tHeader2.push("");
    this.tHeader2.push("");
    this.tHeader2.push("");
    this.tHeader2.push("");
    this.tHeader2.push("");

    this.options.push({ selector: "taxCode", vals: ["","EXE-CODE", "EXC-CODE", "EXC-CODE"] });
    this.options.push({ selector: "taxAllocation", vals: ["","Fire", "Flood", "Calamity"] });

    

  }

}
