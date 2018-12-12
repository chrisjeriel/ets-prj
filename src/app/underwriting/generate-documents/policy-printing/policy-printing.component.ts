import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { PolicyPrinting } from '@app/_models';

@Component({
  selector: 'app-policy-printing',
  templateUrl: './policy-printing.component.html',
  styleUrls: ['./policy-printing.component.css']
})
export class PolicyPrintingComponent implements OnInit {

 	tableData: any[] = [];
  	tHeader: any[] = ["Document Type","Destination", "Printer Name", "No. of Copies"];
  	dataTypes: any[] =["select","select","select","select"];
  	opts: any[] = [];
  	nData: PolicyPrinting = new PolicyPrinting(null,null,null,null);
  constructor(private underwritingService: UnderwritingService) { }

  ngOnInit() {
  	 this.tableData = this.underwritingService.printingPolicy();
  	 var getPrinter = this.underwritingService.getPrinterName();

  	 this.opts.push({selector: "docType", vals:["Policy Schedule"]});
  	 this.opts.push({selector: "destination", vals:["Screen","Printer","Local Printer"]});
  	 for (var i in getPrinter){
  	 	this.opts.push({selector: "printerName", vals:[getPrinter[i].printerName.toString()]});
  	 }
  	 this.opts.push({selector: "noOfCopy", vals:["1", "2", "3","4","5"]});
  }

  onRowDblClick($event){
  	console.log(event.returnValue);
  }

} 
