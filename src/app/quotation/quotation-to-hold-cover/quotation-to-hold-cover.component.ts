import { Component, OnInit,ViewChild } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService,NotesService } from '../../_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router } from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-quotation-to-hold-cover',
  templateUrl: './quotation-to-hold-cover.component.html',
  styleUrls: ['./quotation-to-hold-cover.component.css']
})
export class QuotationToHoldCoverComponent implements OnInit {
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
	@ViewChild('opt') opt: CustNonDatatableComponent;
	@ViewChild('tabset') tabset: any;

	passDataQuoteLOV : any = {
		tableData	: [],
		tHeader		: ["Quotation No.", "Ceding Company", "Insured", "Risk"],
		dataTypes	: ["text","text","text","text"],
		pageLength	: 10,
		resizable	: [false,false,false,false],
		tableOnly	: false,
		keys		: ['quotationNo','cedingName','insuredDesc','riskName'],
		pageStatus	: true,
		pagination	: true,
		colSize		: ['', '250px', '250px', '250px'],
		filters: [
			{key: 'quotationNo', title: 'Quotation No.',dataType: 'seq'},
			{key: 'cedingName',title: 'Ceding Co.',dataType: 'text'},
			{key: 'insuredDesc',title: 'Insured',dataType: 'text'},
			{key: 'riskName',title: 'Risk',dataType: 'text'},
		]
	};

	passDataQuoteOptionsLOV : any = {
		tableData	: [],
		tHeader		: ['Option No','Rate(%)','Conditions','Comm Rate Quota(%)','Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
		dataTypes	: ['number','percent','text','percent','percent','percent'],
		pageLength	: 10,
		resizable	: [false,false,false,false,false,false],
		tableOnly	: true,
		keys		: ['optionNo','rate','conditions','commRateQuota','commRateSurplus','commRateFac'],
		pageStatus	: true,
		pagination	: true,
		pageID		:10,
		// filters:[
		//   {key:'optionNo',title:'Option No',dataType:'text'},
		//   {key:'rate',title:'Option No',dataType:'text'},
		//   {key:'conditions',title:'Option No',dataType:'text'},
		//   {key:'commRateQuota',title:'Option No',dataType:'text'},
		//   {key:'commRateSurplus',title:'Option No',dataType:'text'},
		//   {key:'commRateFac',title:'Option No',dataType:'text'},
		// ]
	};

	holdCover : any = {
		approvedBy		 : '',
		compRefHoldCovNo : '',
		createDate		 : '',
		createUser		 : '',
		holdCoverId		 : '',
		holdCoverNo		 : '',
		holdCoverRevNo	 : '',
		optionId		 : '',
		holdCoverSeqNo	 : '',
		holdCoverYear	 : '',
		lineCd			 : '',
		lineCdDesc		 : '',
		periodFrom		 : '',
		periodTo		 : '',
		preparedBy		 : '',
		reqBy			 : '',
		reqDate			 : '',
		status			 : '',
		updateDate		 : '',
		updateUser		 : '',
	};

	quoteInfo : any = {
		quotationNo 	: [],
		cedingName		: '',
		insuredDesc		: '',
		riskName		: '',
	};

	searchArr 		: any[] = Array(5).fill('');
	searchParams	: any[] = [];

  	constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title,
				private ns : NotesService, private router: Router) { 
	}

  	ngOnInit() {
  		this.titleService.setTitle('Quo | Quotation to Hold Cover');
  		this.getQuoteList();
  	}

  	getQuoteList(param?){
  		var parameter;

		if(param !== undefined){
			parameter = param;		
		}else{
			parameter = this.searchParams;
		}

  		this.quotationService.getQuoProcessingData(parameter)
  		.subscribe(data => {
  			console.log(data);
  			var rec = data['quotationList'];
  			this.passDataQuoteLOV.tableData = rec.filter(i => i.status.toUpperCase() == 'RELEASED').map(i => {i.riskName = i.project.riskName; return i;});
			this.table.refreshTable();

			if(rec.length == 1){
				this.quoteInfo.quotationNo 	= this.splitQuoteNo(rec[0].quotationNo);
				this.quoteInfo.cedingName	= rec[0].cedingName;
				this.quoteInfo.insuredDesc	= rec[0].insuredDesc;
				this.quoteInfo.riskName		= rec[0].riskName;
			}else{
				this.clear();
			}
  		});
  	}

  	showQuoteLov(){
		$('#quoteMdl > #modalBtn').trigger('click');
	}

	search(key,ev) {
		this.quoteInfo.quotationNo[2] =  (this.quoteInfo.quotationNo[2] == undefined || this.quoteInfo.quotationNo[2] == '')?'':this.quoteInfo.quotationNo[2].padStart(5,'0');
		this.quoteInfo.quotationNo[3] =  (this.quoteInfo.quotationNo[3] == undefined || this.quoteInfo.quotationNo[3] == '')?'':this.quoteInfo.quotationNo[3].padStart(2,'0');
		this.quoteInfo.quotationNo[4] =  (this.quoteInfo.quotationNo[4] == undefined || this.quoteInfo.quotationNo[4] == '')?'':this.quoteInfo.quotationNo[4].padStart(3,'0');

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
		
		this.getQuoteList([{ key: 'quotationNo', search: this.searchArr.join('-') }]);

	}

	clear(){
		this.quoteInfo.cedingName		= '';
		this.quoteInfo.insuredDesc		= '';
		this.quoteInfo.riskName			= '';
	}

	splitQuoteNo(quotationNo){
		return quotationNo.split('-');
	}

}
