import { Component, OnInit,ViewChild,OnDestroy } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService,NotesService } from '../../_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router } from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-quotation-to-hold-cover',
  templateUrl: './quotation-to-hold-cover.component.html',
  styleUrls: ['./quotation-to-hold-cover.component.css']
})
export class QuotationToHoldCoverComponent implements OnInit, OnDestroy {
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
		holdCoverNo		 : [],
		approvedBy		 : '',
  		compRefHoldCovNo : '',
  		createDate		 : '',
  		createUser		 : '',
  		holdCoverId		 : '',
  		holdCoverRevNo	 : '',
  		holdCoverSeqNo	 : '',
  		holdCoverYear	 : '',
  		lineCd			 : '',
  		optionId		 : '',
  		periodFrom		 : [],
  		periodTo		 : [],
  		preparedBy		 : '',
  		quoteId			 : '',
  		reqBy			 : '',
  		reqDate			 : '',
  		status			 : '',
  		updateDate		 : '',
  		updateUser		 : ''
	};

	quoteInfo : any = {
		quotationNo 	: [],
		cedingName		: '',
		insuredDesc		: '',
		riskName		: '',
	};

	searchArr 		: any[] = Array(5).fill('');
	searchParams	: any[] = [];
	subs			: Subscription = new Subscription();
	rowRec			: any;
	typeDate 		: string = '';
	typeTime 		: string = '';
	fieldIconDsbl	: boolean = true;

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

  		const subRes =  forkJoin(this.quotationService.getQuoProcessingData(parameter),this.quotationService.getQuotationHoldCoverList([]))
  								.pipe(map(([quo, hc]) => { return { quo, hc };}));

  		this.subs = subRes.subscribe(data => {
  			console.log(data);
  			var quoList = data['quo']['quotationList'];
  			var hcList 	= data['hc']['quotationList'];
  			this.passDataQuoteLOV.tableData = quoList.filter(i => i.status.toUpperCase() == 'RELEASED').map(i => {i.riskName = i.project.riskName; return i;});
			this.table.refreshTable();

			if(quoList.length == 1){
				this.quoteInfo.quotationNo 	= this.splitQuoteNo(quoList[0].quotationNo);
				this.quoteInfo.cedingName	= quoList[0].cedingName;
				this.quoteInfo.insuredDesc	= quoList[0].insuredDesc;
				this.quoteInfo.riskName		= quoList[0].riskName;
				this.newHc(false);

				var selectedRow = hcList.filter(i => i.quotationNo == quoList[0].quotationNo);
				if(selectedRow.length != 0){
					this.holdCover.holdCoverNo 		 = selectedRow[0].holdCover.holdCoverNo;
					this.holdCover.approvedBy		 = selectedRow[0].holdCover.approvedBy;
			  		this.holdCover.compRefHoldCovNo  = selectedRow[0].holdCover.compRefHoldCovNo;
			  		// this.holdCover.createDate		 = this.ns.toDateTimeString(selectedRow[0].holdCover.createDate);
			  		// this.holdCover.createUser		 = selectedRow[0].holdCover.createUser;
			  		this.holdCover.holdCoverId		 = selectedRow[0].holdCover.holdCoverId;
			  		this.holdCover.holdCoverRevNo	 = selectedRow[0].holdCover.holdCoverRevNo;
			  		this.holdCover.holdCoverSeqNo	 = selectedRow[0].holdCover.holdCoverSeqNo;
			  		this.holdCover.holdCoverYear	 = selectedRow[0].holdCover.holdCoverYear;
			  		this.holdCover.lineCd			 = selectedRow[0].holdCover.lineCd;
			  		this.holdCover.optionId		 	 = selectedRow[0].holdCover.optionId;
			  		this.holdCover.periodFrom		 = this.ns.toDateTimeString(selectedRow[0].holdCover.periodFrom).split('T');
			  		this.holdCover.periodTo		 	 = this.ns.toDateTimeString(selectedRow[0].holdCover.periodTo).split('T');
			  		this.holdCover.preparedBy		 = selectedRow[0].holdCover.preparedBy;
			  		this.holdCover.quoteId			 = selectedRow[0].holdCover.quoteId;
			  		this.holdCover.reqBy			 = selectedRow[0].holdCover.reqBy;
			  		this.holdCover.reqDate			 = (selectedRow[0].holdCover.reqDate == null)?'':this.ns.toDateTimeString(selectedRow[0].holdCover.reqDate).split('T')[0];
			  		this.holdCover.status			 = selectedRow[0].holdCover.status;
			  		// this.holdCover.updateDate		 = this.ns.toDateTimeString(selectedRow[0].holdCover.updateDate);
			  		// this.holdCover.updateUser		 = selectedRow[0].holdCover.updateUser;
				}else{
					this.clear();
				}

			}else{
				this.quoteInfo.cedingName	= '';
				this.quoteInfo.insuredDesc	= '';
				this.quoteInfo.riskName		= '';
				this.newHc(true);
				this.clear();
			}
  		});

  	}

  	onSaveHoldCover(){
  		console.log(this.holdCover);
  		// this.quotationService.saveQuoteHoldCover(JSON.stringify(this.holdCover))
  		// .subscribe(data => {
  			
  		// });
  	}
	
  	onClickOkQuoteLov(){
  		var quoteNoArr = this.rowRec.quotationNo.split('-');
  		var quoNo = '';

  		quoteNoArr.forEach(function(data,index){
  			if(index == quoteNoArr.length-1){
  				quoNo += data;
  			}else if(index == 0){
  				quoNo += data + '%-';	
  			}else{
  				quoNo += '%'+ parseInt(data) + '%-';
  			}
  		});

  		this.getQuoteList([{ key: 'quotationNo', search: quoNo }]);
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
		this.holdCover.holdCoverNo 		 = '';
		this.holdCover.approvedBy		 = '';
		this.holdCover.compRefHoldCovNo  = '';
		this.holdCover.holdCoverId		 = '';
		this.holdCover.holdCoverRevNo	 = '';
		this.holdCover.holdCoverSeqNo	 = '';
		this.holdCover.holdCoverYear	 = '';
		this.holdCover.lineCd			 = '';
		this.holdCover.optionId		 	 = '';
		this.holdCover.periodFrom		 = '';
		this.holdCover.periodTo		 	 = '';
		this.holdCover.preparedBy		 = '';
		this.holdCover.quoteId			 = '';
		this.holdCover.reqBy			 = '';
		this.holdCover.reqDate			 = '';
		this.holdCover.status			 = '';
	}

	newHc(isNew:boolean){
		if(isNew == true){
			this.typeDate = 'text';
			this.typeTime = 'text';
			this.disableFieldsHc(true);
		}else{
			this.typeDate = 'date';
			this.typeTime = 'time';	
			this.disableFieldsHc(false);
		}
	}

	disableFieldsHc(isDisabled:boolean){
		if(isDisabled == true){
			$(".r-only").prop('readonly', true);
			this.fieldIconDsbl = true;
		}else{
			$(".r-only").prop('readonly', false);
			this.fieldIconDsbl = false;
		}
	}

	onRowClick(event){
    	this.rowRec = event;
    }

	showQuoteLov(){
		$('#quoteMdl > #modalBtn').trigger('click');
	}

	splitQuoteNo(quotationNo){
		return quotationNo.split('-');
	}

	ngOnDestroy(){
		this.subs.unsubscribe();
	}

}
