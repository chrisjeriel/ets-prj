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

  coverageOc: any = {
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
	  	    console.log("sum insured data");
	  	    console.log(data);
	  	});

  }

  saveData(){
   
  }

}
