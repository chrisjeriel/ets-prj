import { Component, OnInit, ViewChild } from '@angular/core';
import { QuotationService, NotesService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quote-modification',
  templateUrl: './quote-modification.component.html',
  styleUrls: ['./quote-modification.component.css']
})
export class QuoteModificationComponent implements OnInit {
	@ViewChild('quModifLov') lovTable: CustNonDatatableComponent;

	passDataLOV: any = {
	  tableData: [],
	  tHeader:["Quotation No", "Ceding Company", "Insured", "Risk"],  
	  dataTypes: ["text","text","text","text"],
	  pageLength: 10,
	  resizable: [false,false,false,false],
	  tableOnly: false,
	  keys: ['quotationNo','cedingName','insuredDesc','riskName'],
	  pageStatus: true,
	  pagination: true,
	  filters: [
	  /*{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
	  {key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
	  {key: 'insuredDesc',title: 'Insured',dataType: 'text'},
	  {key: 'riskName',title: 'Risk',dataType: 'text'}*/],
	  pageID: 'quModifLov'
	}

	selected: any = null;
	quList: any[] = [];
	searchArr: any[] = Array(5).fill('');
	filtSearch: any[] = [];
	quNo: any[] = [];
	cedingName: any = '';
	insuredDesc: any = '';
	riskName: any = '';

	constructor(private modalService: NgbModal, private router: Router, private qs: QuotationService, private ns: NotesService) { }

	ngOnInit() {
		this.getQuoteListing();
	}

	getQuoteListing(param?) {
		this.lovTable.loadingFlag = true;
		this.qs.getQuoProcessingData(param === undefined ? [] : param).subscribe(data => {
		  	this.quList = data['quotationList'];
			this.passDataLOV.filters = [{key: 'quotationNo', title: 'Quotation No', dataType: 'text'},
		                                {key: 'cedingName',  title: 'Ceding Co',    dataType: 'text'},
		                                {key: 'insuredDesc', title: 'Insured',      dataType: 'text'},
		                                {key: 'riskName',    title: 'Risk',         dataType: 'text'}];

		    this.quList = this.quList.filter(qu => qu.status.toUpperCase() === 'RELEASED')
		                             .map(qu => { qu.riskName = qu.project.riskName; return qu; });
		    this.passDataLOV.tableData = this.quList;
		    this.lovTable.refreshTable();

		    if(param !== undefined) {
		    	if(this.quList.length == 1 && this.quNo.length == 5 && !this.searchArr.includes('%%')) {  
		        	this.selected = this.quList[0];
		        	this.setDetails();
		        	// this.noSelected = false;
		      	} else if(this.quList.length == 0 && this.quNo.length == 5 && !this.searchArr.includes('%%')) {
		        	this.clearFields();
		        	this.getQuoteListing();
		        	this.showLOV();
		      	} else if(this.searchArr.includes('%%')) {
			        this.cedingName = '';
			        this.insuredDesc = '';
			        this.riskName = '';
		      	}
		    }
		});
	}

	search(key,ev) {
    	var a = ev.target.value;

    	if(key === 'lineCd') {
    	  this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
    	} else if(key === 'year') {
    	  this.searchArr[1] = '%' + a + '%';
    	} else if(key === 'seqNo') {
    	  this.searchArr[2] = '%' + a + '%';
    	} else if(key === 'revNo') {
    	  this.searchArr[3] = '%' + a + '%';
    	} else if(key === 'cedingId') {
    	  this.searchArr[4] = a === '' ? '%%' : '%' + a.padStart(3, '0');
    	}

    	if(this.searchArr.includes('')) {
    	  this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
    	}

    	this.getQuoteListing([{ key: 'quotationNo', search: this.searchArr.join('-') }]);
	}

	pad(ev,num) {
		var str = ev.target.value;    

		return str === '' ? '' : String(str).padStart(num, '0');
	}

	showLOV() {
		$('#quModifLovMdl > #modalBtn').trigger('click');
	}

	setDetails(fromMdl?) {
		if(this.selected != null) {
	  		this.quNo = this.selected.quotationNo.split('-');
	  		this.cedingName = this.selected.cedingName;
	  		this.insuredDesc = this.selected.insuredDesc;
	  		this.riskName = this.selected.riskName;

		  	if(fromMdl !== undefined) {
			  	this.searchArr = this.quNo.map((a, i) => {
			  	  return (i == 0) ? a + '%' : (i == this.quNo.length - 1) ? '%' + a : '%' + a + '%';
			  	});

		  	  	this.search('forceSearch',{ target: { value: '' } });
		  	}
	  	}
	}

	onRowClick(event) {    
		if(Object.entries(event).length === 0 && event.constructor === Object){
			this.selected = null;
	  	} else {
	    	this.selected = event;
	  	}
	}

	searchQuery(searchParams){
		this.filtSearch = searchParams;
	  	this.passDataLOV.tableData = [];
	  	this.getQuoteListing(this.filtSearch);
	}

	clearFields() {
    	this.searchArr = [];
    	this.quNo = [];
    	this.cedingName = "";
    	this.insuredDesc = "";
    	this.riskName = "";
  	}

  	toQuoteGenInfo() {
  		this.qs.toGenInfo = [];
        this.qs.toGenInfo.push("edit", this.selected.lineCd);
        this.qs.savingType = 'modification';

        setTimeout(() => {
            this.router.navigate(['/quotation', { line: this.selected.lineCd, quoteId: this.selected.quoteId, quotationNo: this.selected.quotationNo, from: 'quo-processing', exitLink: '/quotation-processing' }], { skipLocationChange: true });
        },100);
  	}
}
