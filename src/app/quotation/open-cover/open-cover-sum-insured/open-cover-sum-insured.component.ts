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

  data: any = {
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
	  	    this.data.currencyCd = data.quotationOc.projectOc.coverageOc.currencyCd;
	  	    this.data.currencyRt = data.quotationOc.projectOc.coverageOc.currencyRt;
	  	    this.data.maxSi = data.quotationOc.projectOc.coverageOc.maxSi;
	  	    this.data.pctShare = data.quotationOc.projectOc.coverageOc.pctShare;
	  	    this.data.pctPml = data.quotationOc.projectOc.coverageOc.pctPml;
	  	    this.data.totalValue = data.quotationOc.projectOc.coverageOc.totalValue;
	  	    console.log("sum insured data");
	  	    console.log(data);
	  	});
	  	console.log(this.data);

  }

  saveData(){
   console.log(this.data);
  }

}
