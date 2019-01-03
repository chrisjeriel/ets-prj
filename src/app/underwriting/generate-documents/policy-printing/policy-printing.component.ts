import { Component, OnInit } from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { PolicyPrinting } from '@app/_models';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-policy-printing',
	templateUrl: './policy-printing.component.html',
	styleUrls: ['./policy-printing.component.css']
})
export class PolicyPrintingComponent implements OnInit {

	tableData: any[] = [];
	tHeader: any[] = [];
	dataTypes: any[] = [];
	opts: any[] = [];
	selectFlag;
	addFlag;
	deleteFlag;

	passData: any = {
		tableData: [],
		tHeader: [],
		dataTypes: [],
		opts: [],
		nData: {},
		addFlag: true,
		deleteFlag: true,
		widths: []
	};

	// tHeader: any[] = ["Document Type", "Destination", "Printer Name", "No. of Copies"];
	// dataTypes: any[] = ["select", "select", "select", "select"];

	nData: PolicyPrinting = new PolicyPrinting(null, null, null, null);
	constructor(private underwritingService: UnderwritingService, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Pol | Policy Printing");

		this.passData.tHeader.push("Document Type", "Destination", "Printer Name", "No. of Copies");
		this.passData.dataTypes.push("select", "select", "select", "select");
		this.passData.tableData = this.underwritingService.printingPolicy();

		var getPrinter = this.underwritingService.getPrinterName();

		this.passData.opts.push({ selector: "docType", vals: ["Policy Schedule"] });
		this.passData.opts.push({ selector: "destination", vals: ["Screen", "Printer", "Local Printer"] });
		for (var i in getPrinter) {
			this.passData.opts.push({ selector: "printerName", vals: [getPrinter[i].printerName.toString()] });
		}
		this.passData.opts.push({ selector: "noOfCopy", vals: ["1", "2", "3", "4", "5"] });
	}

} 
