import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { QuotationService } from '@app/_services';
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
  	totalValue: null

  }

  constructor(private quotationService: QuotationService, private titleService: Title, private route: ActivatedRoute) { }

  ngOnInit() {
	  	/*this.sub = this.route.params.subscribe(params => {

	      this.quotationNo = params["quotationNo"];
	      this.quoteNo = this.quotationNo.split(/[-]/g)[0]
	      for (var i = 1; i < this.quotationNo.split(/[-]/g).length; i++) {
	       this.quoteNo += '-' + parseInt(this.quotationNo.split(/[-]/g)[i]);
	     } 
	    });*/
	  	this.quotationService.getCoverageOc('2', 'OC-EAR-2018-1001-2-2323').subscribe((data: any) => {
	  	    /*this.data = data.quotationOc[0].attachmentOc;
	  	    // this.passData.tableData = data.quotation.project.coverage.sectionCovers;
	  	    for (var i = 0; i < this.data.length; i++) {
	  	      this.passData.tableData.push(this.data[i]);
	  	    }
	  	    this.custEditableNonDatatableComponent.refreshTable();*/
	  	    console.log(data);
	  	    this.quoteIdOc = data.quotationOc[0].quoteIdOc;
	  	    this.riskId = data.quotationOc[0].projectOc.riskId;
	  	});

  }

  saveData(){
  	this.coverageOcData.quoteIdOc = this.quoteIdOc;
  	this.coverageOcData.projId = 1;
  	this.coverageOcData.riskId = this.riskId;
  	this.coverageOcData.createUser = 'ETC';
  	this.coverageOcData.createDate = new Date().toISOString();
  	this.coverageOcData.updateUser = 'MBM';
  	this.coverageOcData.updateDate = new Date().toISOString();
    this.quotationService.saveQuoteCoverageOc(7,1,this.coverageOcData).subscribe();
    this.ngOnInit();
  }

}
