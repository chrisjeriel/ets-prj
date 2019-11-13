import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { ConfirmLeaveComponent,CancelButtonComponent, CustEditableNonDatatableComponent,ConfirmSaveComponent, ModalComponent, SucessDialogComponent } from '@app/_components/common';
import { NgForm } from '@angular/forms';
import { QuotationService, NotesService} from '@app/_services';

@Component({
  selector: 'app-update-quote-attachment',
  templateUrl: './update-quote-attachment.component.html',
  styleUrls: ['./update-quote-attachment.component.css']
})
export class UpdateQuoteAttachmentComponent implements OnInit {

  quoteInfo:any = {
  	quotationNo:[]

  };

  searchParams: any = {
        'paginationRequest.count':10,
        'paginationRequest.position':1,   
  };

  passDataQuoteLOV : any = {
		tableData	: [],
		tHeader		: ["Quotation No.", "Ceding Company", "Insured", "Risk"],
	  	sortKeys:['QUOTATION_NO','CEDING_NAME','INSURED_DESC','RISK_NAME'],
		dataTypes	: ["text","text","text","text"],
		pageLength	: 10,
		resizable	: [false,false,false,false],
		tableOnly	: false,
		keys		: ['quotationNo','cedingName','insuredDesc','riskName'],
		pageStatus	: true,
		pagination	: true,
		colSize		: ['', '250px', '250px', '250px'],
		filters: [
			{key: 'quotationNo', title: 'Quotation No.',dataType: 'text'},
			{key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
			{key: 'insuredDesc',title: 'Insured',dataType: 'text'},
			{key: 'riskName',title: 'Risk',dataType: 'text'},
		]
	};

  completeSearch:boolean = false;

  @ViewChild('quoteMdl') quoteMdl: ModalComponent;
  @ViewChild(LoadingTableComponent) quoteTable: LoadingTableComponent;

  constructor(private qs: QuotationService) { } 

  ngOnInit() {
  }

  search(key,ev) {
  		this.quoteInfo.quotationNo[0] =  (this.quoteInfo.quotationNo[0] == undefined || this.quoteInfo.quotationNo[0] == '')?'':this.quoteInfo.quotationNo[0];
  		this.quoteInfo.quotationNo[1] =  (this.quoteInfo.quotationNo[1] == undefined || this.quoteInfo.quotationNo[1] == '')?'':this.quoteInfo.quotationNo[1];
		this.quoteInfo.quotationNo[2] =  (this.quoteInfo.quotationNo[2] == undefined || this.quoteInfo.quotationNo[2] == '')?'':this.quoteInfo.quotationNo[2].padStart(5,'0');
		this.quoteInfo.quotationNo[3] =  (this.quoteInfo.quotationNo[3] == undefined || this.quoteInfo.quotationNo[3] == '')?'':this.quoteInfo.quotationNo[3].padStart(2,'0');
		this.quoteInfo.quotationNo[4] =  (this.quoteInfo.quotationNo[4] == undefined || this.quoteInfo.quotationNo[4] == '')?'':this.quoteInfo.quotationNo[4].padStart(3,'0');
		
		
		if(this.quoteInfo.quotationNo.includes('')) {
			//this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
			this.completeSearch = false;
			this.quoteInfo  = {
				quotationNo 	: this.quoteInfo.quotationNo,
				cedingName		: '',
				insuredDesc		: '',
				riskName		: '',
				totalSi			: '',
				status			: ''
			};
			this.searchParams.quotationNo = this.quoteInfo.quotationNo.join('%-%');
		}else{
			this.searchParams.quotationNo = this.quoteInfo.quotationNo.join('%-%');
			this.passDataQuoteLOV.filters[0].search = this.searchParams.quotationNo;
	    	this.passDataQuoteLOV.filters[0].enabled =true;
			this.getQuoteList();
		}


		
	}


	getQuoteList(){
		this.qs.newGetQuoProcessingData(this.searchParams).subscribe(a=>{
			this.passDataQuoteLOV.count = a['length'];
			this.quoteTable.placeData(a['quotationList']); 

		});
	}

	showQuoteLov(){
		this.quoteMdl.openNoClose();
		this.getQuoteList();
	}
}
