import { Component, OnInit, ViewChild } from '@angular/core';
import { QuotationService, NotesService, UserService } from '@app/_services';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-quote-modification',
  templateUrl: './quote-modification.component.html',
  styleUrls: ['./quote-modification.component.css']
})
export class QuoteModificationComponent implements OnInit {
	@ViewChild('quModifLov') lovTable: LoadingTableComponent;
	@ViewChild(ModalComponent) mmdl: ModalComponent;

	passDataLOV: any = {
	  tableData: [],
	  tHeader:["Quotation No", "Ceding Company", "Insured", "Risk"],  
	  sortKeys:['QUOTATION_NO','CEDING_NAME','INSURED_DESC','RISK_NAME'],
	  dataTypes: ["text","text","text","text"],
	  pageLength: 10,
	  resizable: [false,false,false,false],
	  tableOnly: false,
	  keys: ['quotationNo','cedingName','insuredDesc','riskName'],
	  pageStatus: true,
	  pagination: true,
	  filters: [
	 				{key: 'quotationNo', title: 'Quotation No', dataType: 'text'},
                    {key: 'cedingName',  title: 'Ceding Co',    dataType: 'text'},
                    {key: 'insuredDesc', title: 'Insured',      dataType: 'text'},
                    {key: 'riskName',    title: 'Risk',         dataType: 'text'}],
	  pageID: 'quModifLov'
	}

	searchParams: any = {
        statusArr:['3'],
        'paginationRequest.count':10,
        'paginationRequest.position':1,   
    };

	selected: any = null;
	quList: any[] = [];
	searchArr: any[] = Array(5).fill('');
	filtSearch: any[] = [];
	quNo: any[] = [];
	cedingName: any = '';
	insuredDesc: any = '';
	riskName: any = '';

	constructor(public modalService: NgbModal, private router: Router, private qs: QuotationService, private ns: NotesService, private userService: UserService) { 
		
	}

	ngOnInit() {
		this.getQuoteListing();
		this.userService.emitModuleId("QUOTE011");
	}

	getQuoteListing(param?) {
		console.log(param)
		this.lovTable.overlayLoader = true;
		this.qs.newGetQuoProcessingData(this.searchParams).subscribe(data => {
			this.passDataLOV.count = data['length'];
		  	this.quList = data['quotationList'];
			// this.passDataLOV.filters = [{key: 'quotationNo', title: 'Quotation No', dataType: 'text'},
		 //                                {key: 'cedingName',  title: 'Ceding Co',    dataType: 'text'},
		 //                                {key: 'insuredDesc', title: 'Insured',      dataType: 'text'},
		 //                                {key: 'riskName',    title: 'Risk',         dataType: 'text'}];

		    this.quList = this.quList.map(qu => { qu.riskName = qu.project!= null ? qu.project.riskName:null; return qu; });
		    //this.passDataLOV.tableData = this.quList;
		    this.lovTable.placeData(this.quList);
		    //this.lovTable.refreshTable();

		    if(param !== undefined) {
		    	if(this.quList.length == 1 && this.quNo.length == 5 && !this.searchArr.includes('%%')) {  
		        	this.selected = this.quList[0];
		        	this.setDetails();
		      	} else if(this.quList.length == 0 && this.quNo.length == 5 && !this.searchArr.includes('%%')) {
		        	this.clearFields();
		        	this.clearParams();
		        	this.getQuoteListing();
		        	this.showLOV();
		      	} else if(this.quList.length == 0 && this.searchArr.includes('%%')) {
		      		this.clearParams();
		      		this.getQuoteListing();
		      	} else if(this.searchArr.includes('%%')) {
		      		this.selected = null;
			        this.cedingName = '';
			        this.insuredDesc = '';
			        this.riskName = '';
		      	}
		    }
		});
	}

	clearParams(){
		this.searchParams= {
						        statusArr:['3'],
						        'paginationRequest.count':10,
						        'paginationRequest.position':1,   
						    };
	}

	search(key,ev) {
		console.log(ev)
    	var a = ev.target.value;

    	if(ev != 'forceSearch' && a == '') {
    		this.cedingName = "";
	    	this.insuredDesc = "";
	    	this.riskName = "";
    	}

    	if(key === 'lineCd') {
    	  this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
    	} else if(key === 'year') {
    	  this.searchArr[1] = a === '' ? '%%' : '%' + a + '%';
    	} else if(key === 'seqNo') {
    	  this.searchArr[2] = a == '' ? '%%' : '%' + String(a).padStart(5, '0') + '%';
    	} else if(key === 'revNo') {
    	  this.searchArr[3] = a == '' ? '%%' : '%' + String(a).padStart(2, '0') + '%';
    	} else if(key === 'cedingId') {
    	  this.searchArr[4] = a == '' ? '%%' : '%' + String(a).padStart(3, '0');
    	}

    	if(this.searchArr.includes('')) {
    	  this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
    	}
    	this.searchParams.quotationNo = this.searchArr.join('-');
    	this.passDataLOV.tableData = [];
    	this.passDataLOV.filters[0].search = this.searchArr.join('-');
    	this.passDataLOV.filters[0].enabled =true;
    	this.getQuoteListing('manual');
	}

	pad(ev,num) {
		var str = ev.target.value;    

		return str === '' ? '' : String(str).padStart(num, '0');
	}

	showLOV() {
		//this.searchParams = 
		//$('#quModifLovMdl > #modalBtn').trigger('click');
		this.lovTable.p = 1;
		this.mmdl.openNoClose();
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
		//this.filtSearch = searchParams;
		for(let key of Object.keys(searchParams)){
			//if(key == 'quotationNo' && this.searchParams[key] != undefined)
            this.searchParams[key] = searchParams[key]
        }

	  	//this.passDataLOV.tableData = [];
	  	this.getQuoteListing();
	}

	clearFields() {
    	this.searchArr = Array(5).fill('');
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
