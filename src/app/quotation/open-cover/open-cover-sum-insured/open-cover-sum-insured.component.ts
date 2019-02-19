import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { QuotationService } from '@app/_services';
import { MaintenanceService } from '@app/_services';

@Component({
  selector: 'app-open-cover-sum-insured',
  templateUrl: './open-cover-sum-insured.component.html',
  styleUrls: ['./open-cover-sum-insured.component.css']
})
export class OpenCoverSumInsuredComponent implements OnInit {
  quotationNo: string;
  insuredName: string;
  risk: string;
  sub: any;
  quoteNo:string = '';
  quoteIdOc: any;
  riskId: any;

  coverageOcData: any = {
  	currencyCd: null,
  	currencyRt: null,
  	maxSi: null,
  	pctShare: null,
  	pctPml: null,
  	totalValue: null,
  	createUser: 'ETC',
  	createDate:  new Date().toISOString(),
  	updateUser:  'MBM',
  	updateDate:  new Date().toISOString()
  }

  constructor(private quotationService: QuotationService, private titleService: Title, private maintenanceService: MaintenanceService, 
  	private route: ActivatedRoute) { }

  ngOnInit() {
	  	/*this.sub = this.route.params.subscribe(params => {

	      this.quotationNo = params["quotationNo"];
	      this.quoteNo = this.quotationNo.split(/[-]/g)[0]
	      for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
	       this.quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
	     } 
	    });*/
	  	this.quotationService.getCoverageOc('2', 'OC-EAR-2018-1001-2-2323').subscribe((data: any) => {
	  		this.maintenanceService.getMtnCurrency(data.quotationOc[0].projectOc.coverageOc.currencyCd.toString()).subscribe((data2: any) =>{
	  			this.coverageOcData.currencyCd = data2.currency[0].currencyAbbr;
	  		});
	  	    //this.coverageOcData.currencyCd = data.quotationOc[0].projectOc.coverageOc.currencyCd;
	  	    this.coverageOcData.currencyRt = data.quotationOc[0].projectOc.coverageOc.currencyRt;
	  	    this.coverageOcData.maxSi = data.quotationOc[0].projectOc.coverageOc.maxSi;
	  	    this.coverageOcData.pctShare = data.quotationOc[0].projectOc.coverageOc.pctShare;
	  	    this.coverageOcData.pctPml = data.quotationOc[0].projectOc.coverageOc.pctPml;
	  	    this.coverageOcData.totalValue = data.quotationOc[0].projectOc.coverageOc.totalValue;
	  	    /*this.data = data.quotationOc[0].attachmentOc;
	  	    // this.passData.tableData = data.quotation.project.coverage.sectionCovers;
	  	    for (var i = 0; i < this.data.len
	  	    this.custEditableNonDatatableComponent.refreshTable();*/
	  		console.log()
	  	    this.quoteIdOc = data.quotationOc[0].quoteIdOc;
	  	    this.riskId = data.quotationOc[0].projectOc.riskId;
	  	});
  }

  saveData(){
  	this.coverageOcData.quoteIdOc = this.quoteIdOc;
  	this.coverageOcData.projId = 1;
  	this.coverageOcData.riskId = this.riskId;
    this.quotationService.saveQuoteCoverageOc(7,1,this.coverageOcData).subscribe();
    this.ngOnInit();
  }

  showCurrencyModal(){
  	$('#currencyModal #modalBtn').trigger('click');
  }

  setCurrency(data){
  	this.coverageOcData.currencyAbbr = data.currencyAbbr;
  	this.coverageOcData.currencyRt = data.currencyRt;
  	this.coverageOcData.currencyCd = data.currencyCd;
  }

}
