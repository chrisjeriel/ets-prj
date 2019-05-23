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

	passDataOptionsLOV : any = {
		tableData	: [],
		tHeader		: ['Option No','Rate(%)','Conditions','Comm Rate Quota(%)','Comm Rate Surplus(%)', 'Comm Rate Fac(%)'],
		dataTypes	: ['number','percent','text','percent','percent','percent'],
		pageLength	: 10,
		resizable	: [false,false,false,false,false,false],
		tableOnly	: true,
		keys		: ['optionId','optionRt','condition','commRtQuota','commRtSurplus','commRtFac'],
		pageStatus	: true,
		pagination	: true,
		pageID		: 10,
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
		approvedBy			: "", 
		compRefHoldCovNo	: "", 
		createDate			: "", 
		createUser			: "", 
		holdCoverId			: "", 
		holdCoverRevNo		: "", 
		holdCoverSeqNo		: "", 
		optionId			: "", 
		holdCoverYear		: "", 
		lineCd				: "", 
		periodFrom			: "", 
		periodTo			: "", 
		preparedBy			: "", 
		quoteId				: "", 
		reqBy				: "", 
		reqDate				: "", 
		status				: "", 
		updateDate			: "", 
		updateUser			: "", 
	};

	quoteInfo : any = {
		quotationNo 	: [],
		cedingName		: '',
		insuredDesc		: '',
		riskName		: '',
	};

	subs			: Subscription = new Subscription();
	searchArr 		: any[] = Array(5).fill('');
	searchParams	: any[] = [];
	rowRec			: any;
	rowRecOpt		: any;
	fieldIconDsbl	: boolean = true;
	holdCoverNo		: string = '';
	periodFromArr	: any[] = Array(2).fill('');
	periodToArr		: any[] = Array(2).fill('');
	dialogMessage	: string = '';
	dialogIcon		: string = '';
	cancelFlag		: boolean;

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
				this.holdCover.quoteId		= quoList[0].quoteId;
				this.quoteInfo.cedingName	= quoList[0].cedingName;
				this.quoteInfo.insuredDesc	= quoList[0].insuredDesc;
				this.quoteInfo.riskName		= quoList[0].riskName;
				this.holdCover.lineCd		= quoList[0].lineCd;
				this.newHc(false);
				this.getQuoteOptions();

				var selectedRow = hcList.filter(i => i.quotationNo == quoList[0].quotationNo);
				if(selectedRow.length != 0){
					this.holdCoverNo 		 		 = selectedRow[0].holdCover.holdCoverNo;
					this.holdCover.approvedBy		 = selectedRow[0].holdCover.approvedBy;
			  		this.holdCover.compRefHoldCovNo  = selectedRow[0].holdCover.compRefHoldCovNo;
			  		this.holdCover.createDate		 = this.ns.toDateTimeString(selectedRow[0].holdCover.createDate);
			  		this.holdCover.createUser		 = selectedRow[0].holdCover.createUser;
			  		this.holdCover.holdCoverId		 = selectedRow[0].holdCover.holdCoverId;
			  		this.holdCover.holdCoverRevNo	 = selectedRow[0].holdCover.holdCoverRevNo;
			  		this.holdCover.holdCoverSeqNo	 = selectedRow[0].holdCover.holdCoverSeqNo;
			  		this.holdCover.holdCoverYear	 = selectedRow[0].holdCover.holdCoverYear;
			  		this.holdCover.lineCd			 = selectedRow[0].holdCover.lineCd;
			  		this.holdCover.optionId		 	 = selectedRow[0].holdCover.optionId;
			  		this.periodFromArr		 		 = this.ns.toDateTimeString(selectedRow[0].holdCover.periodFrom).split('T');
			  		this.periodToArr		 	 	 = this.ns.toDateTimeString(selectedRow[0].holdCover.periodTo).split('T');
			  		this.holdCover.preparedBy		 = selectedRow[0].holdCover.preparedBy;
			  		this.holdCover.reqBy			 = selectedRow[0].holdCover.reqBy;
			  		this.holdCover.reqDate			 = (selectedRow[0].holdCover.reqDate == null)?'':this.ns.toDateTimeString(selectedRow[0].holdCover.reqDate).split('T')[0];
			  		this.holdCover.status			 = selectedRow[0].holdCover.status;
			  		console.log('entered here');
				}else{
					this.clear();
					console.log('entered else');
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

  	onSaveHoldCover(cancelFlag?){
  		this.dialogIcon = '';
		this.dialogMessage = '';
		this.cancelFlag = cancelFlag !== undefined;

		if(this.quoteInfo.quotationNo.some(i => i == '') == true || this.periodFromArr.some(pf => pf == '') == true ||
		   this.periodToArr.some(pt => pt == '') == true || this.holdCover.optionId == ''){
			setTimeout(()=>{
				this.dialogIcon = 'error';
				$('.globalLoading').css('display','none');
				$('app-sucess-dialog #modalBtn').trigger('click');
				$('.warn').focus();
				$('.warn').blur();
			},500);
		}else{
			this.holdCover.holdCoverYear	= (this.holdCover.holdCoverYear == '')?String(new Date().getFullYear()):this.holdCover.holdCoverYear;
	  		this.holdCover.status			= (this.holdCover.status == '')?'In Force':this.holdCover.status;
	  		this.holdCover.periodFrom		= this.periodFromArr.join('T');
	  		this.holdCover.periodTo			= this.periodToArr.join('T');
	  		this.holdCover.createDate		= (this.holdCover.createDate == '')?this.ns.toDateTimeString(0):this.holdCover.createDate;
			this.holdCover.createUser		= (this.holdCover.createUser == '')?this.ns.getCurrentUser():this.holdCover.createUser;
			this.holdCover.preparedBy		= (this.holdCover.createUser == '')?this.ns.getCurrentUser():this.holdCover.createUser;
	  		this.holdCover.updateDate		= this.ns.toDateTimeString(0);
			this.holdCover.updateUser		= this.ns.getCurrentUser();

	  		this.quotationService.saveQuoteHoldCover(JSON.stringify(this.holdCover))
	  		.subscribe(data => {
	  			console.log(data);
	  			this.holdCoverNo = data['holdCoverNo'];
	  			this.dialogIcon = '';
				this.dialogMessage = '';
				$('app-sucess-dialog #modalBtn').trigger('click');
	  		});
		}
  	}
	
  	onClickOkQuoteLov(){
  		if(Object.keys(this.rowRec).length != 0){
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
	  		this.modalService.dismissAll();
  		}
  	}

  	getQuoteOptions(){
  		console.log(this.holdCover.quoteId);
  		this.quotationService.getQuoteOptions(this.holdCover.quoteId,'')
  		.subscribe(data => {
  			var rec = data['quotation']['optionsList'];
  			this.passDataOptionsLOV.tableData = rec;
  			this.opt.refreshTable();
  		});
  	}

  	onClickOkOptionsLov(){
  		this.holdCover.optionId = this.rowRecOpt.optionId;
  		this.modalService.dismissAll();
  	}

  	onRowClickOpt(event){
  		this.rowRecOpt = event;
  	}

  	searchQuoteId(){
  		(this.passDataOptionsLOV.tableData.some(i => i.optionId == this.holdCover.optionId) == true)?'':this.holdCover.optionId='';
  		this.holdCover.optionId == ''?this.showOptionsLov():'';
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
		this.holdCoverNo 		 		 = '';
		this.holdCover.approvedBy		 = '';
		this.holdCover.compRefHoldCovNo  = '';
		this.holdCover.holdCoverId		 = '';
		this.holdCover.holdCoverRevNo	 = '';
		this.holdCover.holdCoverSeqNo	 = '';
		this.holdCover.holdCoverYear	 = '';
		this.holdCover.optionId		 	 = '';
		this.holdCover.periodFrom		 = '';
		this.holdCover.periodTo		 	 = '';
		this.holdCover.preparedBy		 = '';
		this.holdCover.reqBy			 = '';
		this.holdCover.reqDate			 = '';
		this.holdCover.status			 = '';
	}

	setPeriodTo(){
		var d = new Date(this.periodFromArr[0]);
		var s = d.setDate(d.getDate()+30);
		this.periodToArr[0] = (isNaN(s) == true)?'':this.ns.toDateTimeString(s).split('T')[0];
	}

	newHc(isNew:boolean){
		if(isNew == true){
			this.disableFieldsHc(true);
		}else{
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

	onClickSave(){
		$('#confirm-save #modalBtn2').trigger('click');
	}

	onRowClick(event){
    	this.rowRec = event;
    }

	showQuoteLov(){
		$('#quoteMdl > #modalBtn').trigger('click');
	}

	showOptionsLov(){
		$('#optionMdl > #modalBtn').trigger('click');
	}

	splitQuoteNo(quotationNo){
		return quotationNo.split('-');
	}

	ngOnDestroy(){
		//this.subs.unsubscribe();  // uncomment after coding
	}

}
