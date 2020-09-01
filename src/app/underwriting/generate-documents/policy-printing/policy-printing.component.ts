import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UnderwritingService } from '@app/_services';
import { PolicyPrinting } from '@app/_models';
import { Title } from '@angular/platform-browser';
import { CustEditableNonDatatableComponent } from '@app/_components/common'

@Component({
	selector: 'app-policy-printing',
	templateUrl: './policy-printing.component.html',
	styleUrls: ['./policy-printing.component.css']
})
export class PolicyPrintingComponent implements OnInit, AfterViewInit {

	tableData: any[] = [];
	tHeader: any[] = [];
	dataTypes: any[] = [];
	opts: any[] = [];
	selectFlag;
	addFlag;
	deleteFlag;

	passData: any = {
		tableData: [],
		tHeader: ["Document Type", "Destination"],
		dataTypes: ["select", "select"],
		keys:['docType','destination'],
		opts: [],
		nData: {},
		addFlag: true,
		deleteFlag: true,
	};

	@ViewChild(CustEditableNonDatatableComponent) table:CustEditableNonDatatableComponent;

	// tHeader: any[] = ["Document Type", "Destination"];
	// dataTypes: any[] = ["select", "select", "select", "select"];

	nData: PolicyPrinting = new PolicyPrinting(null, null, null, null);
	constructor(private underwritingService: UnderwritingService, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Pol | Policy Printing");
		this.passData.tableData = this.underwritingService.printingPolicy();

		this.passData.opts.push({ selector: "docType", 
									  vals: ["Policy Schedule"],
									  prev: ["POL012"]});
		this.passData.opts.push({ selector: "destination",
									  prev: ["Screen", "PDF", "Printer"],
								  	  vals: ["screen", "dlPdf", "printPdf"] });
	}

	ngAfterViewInit(){
		this.table.loadingFlag = false;
	}



} 
