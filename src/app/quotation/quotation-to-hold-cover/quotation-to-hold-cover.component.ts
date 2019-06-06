import { Component, OnInit,ViewChild } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService,NotesService,UserService } from '../../_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router } from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';

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
		pageID		: 10
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
		totalSi			: '',
		status			: ''
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
	disableCancelHc	: boolean = true;
	disableApproval	: boolean = true;
	disableSave		: boolean = false;
	isApproved	 	: boolean = false;
	loading			: boolean = false;
	aprrovalBtnTxt	: string = 'For Approval';
	reportName 		: string = 'QUOTER012';
	destination		: string = '';
	report			: string = '';

  	constructor(private quotationService: QuotationService, private modalService: NgbModal, private titleService: Title,
				private ns : NotesService, private router: Router, private userService : UserService) { 
	}

  	ngOnInit() {
  		this.titleService.setTitle('Quo | Quotation to Hold Cover');
  		this.getQuoteList();
  	}

  	getQuoteList(param?){
  		this.table.loadingFlag = true;
  		var parameter;
		if(param !== undefined){
			parameter = param;
			console.log('not undefined');		
		}else{
			parameter = this.searchParams;
			console.log('undefined');
		}

		console.log(parameter);
  		const subRes =  forkJoin(this.quotationService.getQuoProcessingData(parameter),this.quotationService.getQuotationHoldCoverList([]))
  								.pipe(map(([quo, hc]) => { return { quo, hc };}));

  		this.subs = subRes.subscribe(data => {
  			console.log(data);
  			var quoList = data['quo']['quotationList'];
  			var hcList 	= data['hc']['quotationList'];
  			quoList = quoList.filter(i => i.status.toUpperCase() == 'RELEASED' || i.status.toUpperCase() == 'ON HOLD COVER').map(i => {i.riskName = i.project.riskName; return i;});
  			
  			this.passDataQuoteLOV.tableData = quoList;
			this.table.refreshTable();
			if(quoList.length == 1){
				this.quoteInfo.quotationNo 	= this.splitQuoteNo(quoList[0].quotationNo);
				this.holdCover.quoteId		= quoList[0].quoteId;
				this.quoteInfo.cedingName	= quoList[0].cedingName;
				this.quoteInfo.insuredDesc	= quoList[0].insuredDesc;
				this.quoteInfo.riskName		= quoList[0].riskName;
				this.holdCover.lineCd		= quoList[0].lineCd;
				this.quoteInfo.status		= quoList[0].status;
				this.newHc(false);
				this.getQuoteOptions();

				var selectedRow = hcList.filter(i => i.quotationNo == quoList[0].quotationNo);
				if(selectedRow.length != 0 && selectedRow[0].holdCover.status.toUpperCase() != 'REPLACED VIA HOLD COVER MODIFICATION'){
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
			  		this.quoteInfo.totalSi			 = selectedRow[0].holdCover.totalSi;
			  		$('.warn').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
			  		this.disableApproval = (this.holdCoverNo == '')?true:false;
			  		this.disableSave = false;

					if(this.holdCover.status.toUpperCase() == 'EXPIRED' || this.holdCover.status.toUpperCase() == 'CONVERTED'){
						this.newHc(true);
						this.disableCancelHc = true;
						this.disableApproval = true;
						this.disableSave	 = true;
					}else{
						 this.disableCancelHc = false;
						 this.holdCover.status.toUpperCase() == 'RELEASED' ? this.showModifLov():'';
					}
					
				}else{
					this.clearHc();
				}

			}else{
				this.newHc(true);
				this.clearAll();
				if(quoList.length == 0){
					this.showQuoteLov();
					this.getQuoteList();
					console.log('abc');
				}
			}
  		});

  	}

  	onSaveHoldCover(cancelFlag?){
  		this.dialogIcon = '';
		this.dialogMessage = '';
		this.cancelFlag = cancelFlag !== undefined;
		this.periodFromArr[0]	= (this.periodFromArr[0] == '' || this.periodFromArr[0] == null || this.periodFromArr[0] == undefined)? '' : this.periodFromArr[0];
		this.periodFromArr[1]	= (this.periodFromArr[1] == '' || this.periodFromArr[1] == null || this.periodFromArr[1] == undefined)? '' : this.periodFromArr[1];
		this.periodToArr[0]	 	= (this.periodToArr[0] == '' || this.periodToArr[0] == null || this.periodToArr[0] == undefined)? '' : this.periodToArr[0];
		this.periodToArr[1]	 	= (this.periodToArr[1] == '' || this.periodToArr[1] == null || this.periodToArr[1] == undefined)? '' : this.periodToArr[1];

		if(this.quoteInfo.quotationNo.some(i => i == '') == true || this.holdCover.optionId == '' ||
			this.periodFromArr.some(pf => pf == '') == true ||  this.periodFromArr.length == 0 ||
			this.periodToArr.some(pt => pt == '') == true ||  this.periodToArr.length == 0){
			setTimeout(()=>{
				this.dialogIcon = 'error';
				$('.globalLoading').css('display','none');
				$('app-sucess-dialog #modalBtn').trigger('click');
				$('.warn').focus();
				$('.warn').blur();
				this.periodFromArr[0] == '' ? $('.pf0').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
				this.periodFromArr[1] == '' ? $('.pf1').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
				this.periodToArr[0] == '' ? $('.pt0').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
				this.periodToArr[1] == '' ? $('.pt1').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
			},500);
		}else{
			this.holdCover.holdCoverYear	= (this.holdCover.holdCoverYear == '')?String(new Date().getFullYear()):this.holdCover.holdCoverYear;
	  		this.holdCover.periodFrom		= this.periodFromArr.join('T');
	  		this.holdCover.periodTo			= this.periodToArr.join('T');
	  		this.holdCover.createDate		= (this.holdCover.createDate == '')?this.ns.toDateTimeString(0):this.holdCover.createDate;
			this.holdCover.createUser		= (this.holdCover.createUser == '')?this.ns.getCurrentUser():this.holdCover.createUser;
			this.holdCover.preparedBy		= (this.holdCover.preparedBy == '')?'':this.holdCover.createUser;
	  		this.holdCover.updateDate		= this.ns.toDateTimeString(0);
			this.holdCover.updateUser		= this.ns.getCurrentUser();
			this.holdCover.status			= (this.holdCover.status == '' || this.holdCover.status.toUpperCase() == 'APPROVED' || this.holdCover.status.toUpperCase() == 'REJECTED')?'In Force':this.holdCover.status;

	  		this.quotationService.saveQuoteHoldCover(JSON.stringify(this.holdCover))
	  		.subscribe(data => {
	  			console.log(data);
	  			this.holdCoverNo = data['holdCoverNo'];
	  			this.dialogIcon = '';
				this.dialogMessage = '';
				$('app-sucess-dialog #modalBtn').trigger('click');
				var qNo = this.quoteInfo.quotationNo.map((a,i) => (isNaN(a) == false && i!=4)? parseInt(a):(i==4)?a.padStart(3,'0'):a);;
				this.getQuoteList([{ key: 'quotationNo', search: qNo.join('%-%') }]);
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
  		this.opt.loadingFlag = true;
  		this.quotationService.getQuoteOptions(this.holdCover.quoteId,'')
  		.subscribe(data => {
  			this.passDataOptionsLOV.tableData = [];
  			console.log('Entered in Quote Options');
  			var rec = data['quotation']['optionsList'];
  			this.passDataOptionsLOV.tableData = rec;
  			this.opt.refreshTable();
  		});
  	}

  	onCancelHc(){
  		var ids = {
			quoteId     : this.holdCover.quoteId,
			holdCoverId : this.holdCover.holdCoverId,
			updateUser  : this.ns.getCurrentUser(),
			hcStatus	: 6,
			quoStatus	: 3
		};
		$('.globalLoading').css('display','block');
  		this.quotationService.updateHoldCoverStatus(JSON.stringify(ids))
  		.subscribe(data => {
  			console.log(data);
  			this.dialogIcon = 'success-message';
  			this.dialogMessage = 'Cancelled Successfully!';
  			$('app-sucess-dialog #modalBtn').trigger('click');
  			this.clearHc();
  			this.newHc(false);
  			this.disableApproval = true;
  		});
  		this.modalService.dismissAll();
  	}

  	onClickView(){
  		this.newHc(true);
  		this.disableSave = true;
  		this.disableApproval = true;
  		this.modalService.dismissAll();
  	}

  	validateUser(){
  			//$('.globalLoading').css('display','block');
  			this.loading = true;
  			const subRes =  forkJoin(this.userService.retMtnUsers(this.ns.getCurrentUser()),this.userService.retMtnUserAmtLmt('',''))
  								.pipe(map(([usr, usrAmtLmt]) => { return { usr, usrAmtLmt };}));
	  		subRes.subscribe(data => {
	  			console.log(data);
	  			var usrGrp 		  = data['usr']['usersList'][0].userGrp;
	  			var curRow		  = data['usrAmtLmt']['userAmtLmtList'].filter(a => a.userGrp == usrGrp && a.lineCd.toUpperCase() == this.holdCover.lineCd.toUpperCase());
	  			var rec			  = curRow[0];
	  			this.loading      = false;
				this.destination  = 'SCREEN';
				this.report		  = 'Hold Cover Letter';

	  			if(rec.allAmtSw == 'Y' || this.quoteInfo.totalSi <= rec.amtLimit){
	  				this.aprrovalBtnTxt = 'Approve';
	  				this.isApproved = true;
	  			}else{
	  				this.aprrovalBtnTxt = 'For Approval';
	  				this.isApproved = false;
	  			}
	  		});
  	}

  	onClickPrint(){
  		this.loading = true;
  		setTimeout(()=>{
  			if(this.destination.toUpperCase() == 'SCREEN'){
	  			this.printPDFHC('SCREEN');
	  		}else if(this.destination.toUpperCase() == 'PDF'){
	  			this.printPDFHC('PDF');
	  		}else{
	  			this.printPDFHC('PRINTER');
	  		}
	  		this.holdCover.preparedBy = this.ns.getCurrentUser();
  		},500);
  		
  	}

  	updateHcStatus(from){
  		var ids = {
			holdCoverId	: this.holdCover.holdCoverId,
			quoteId		: this.holdCover.quoteId,
			updateUser	: this.ns.getCurrentUser(),
			hcStatus	: '',
			quoStatus	: ''
		};

  		if(from.toUpperCase() == 'APPROVE'){
  			ids.hcStatus = 'A';
  			this.holdCover.status = 'Approved';
  			this.holdCover.approvedBy = this.ns.getCurrentUser(); 
  		}else if(from.toUpperCase() == 'FOR APPROVAL'){
  			ids.hcStatus	= 'P';
  			this.holdCover.status 	= 'Pending Approval'; 
  		}else if(from.toUpperCase() == 'REJECTED'){
  			ids.hcStatus = 'R';
  			this.holdCover.status = 'Rejected';
  		}else{
  			ids.hcStatus = this.holdCover.status;
  			if(this.holdCover.status.toUpperCase() == 'APPROVED'){
	  			ids.hcStatus = '2';
	  			this.holdCover.status = 'Released';
	  			console.log(ids.hcStatus);
  			}
  		}
		console.log(ids);
  		this.quotationService.updateHoldCoverStatus(JSON.stringify(ids))
	  	.subscribe(data => {
	  		console.log(data);
	  	});
  	}

  	printPDFHC(param){
  		var fileName = this.holdCoverNo;
  		this.quotationService.downloadPDFHC(this.reportName,this.holdCover.quoteId,this.holdCover.holdCoverId)
	  	.subscribe(data => {
	  		console.log(data);
	  		this.loading = false;
	  		var newBlob = new Blob([data], { type: "application/pdf" });
            var downloadURL = window.URL.createObjectURL(data);
            if(param == 'PRINTER'){
            	const iframe = document.createElement('iframe');
	            iframe.style.display = 'none';
	            iframe.src = downloadURL;
	            document.body.appendChild(iframe);
	            iframe.contentWindow.print();
            }else if(param == 'PDF'){
            	var link = document.createElement('a');
	            link.href = downloadURL;
	            link.download = fileName;
	            link.click();
            }else{
            	window.open(environment.prodApiUrl + '/util-service/generateReport?reportName=' + this.reportName + '&quoteId=' + this.holdCover.quoteId + '&holdCovId=' + this.holdCover.holdCoverId + '&userId=' + this.ns.getCurrentUser(), '_blank');
            }
  		},
  		error => {
            if (this.isEmptyObject(error)) {
            } else {
               this.dialogIcon = "error-message";
               this.dialogMessage = "Error printing file";
               $('#quotation #successModalBtn').trigger('click');
               setTimeout(()=>{$('.globalLoading').css('display','none');},0);
            }          
        });
  		this.updateHcStatus('print-btn');
  	}

    isEmptyObject(obj) {
      for(var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            return false;
         }
      }
      return true;
    }

  	onClickOkOptionsLov(){
  		this.holdCover.optionId = this.rowRecOpt.optionId;
  		if(this.holdCover.optionId == '' || this.holdCover.optionId == undefined){
  		}else{
  			$('.warn').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
  			$('.warn').addClass('ng-dirty');
  			this.modalService.dismissAll();
  		}
  	}

  	onCancelModifLov(){
  		this.clearAll();
  		this.newHc(true);
  		this.disableApproval = true;
  		this.modalService.dismissAll();
  		this.getQuoteList();
  	}

  	onRowClickOpt(event){
  		this.rowRecOpt = event;
  	}

  	searchQuoteId(){
  		(this.passDataOptionsLOV.tableData.some(i => i.optionId == this.holdCover.optionId) == true)?'':this.holdCover.optionId='';
  		this.holdCover.optionId == ''?this.showOptionsLov():'';
  	}

	search(key,ev) {
		console.log(this.searchArr.join('-'));
		this.quoteInfo.quotationNo[2] =  (this.quoteInfo.quotationNo[2] == undefined || this.quoteInfo.quotationNo[2] == '')?'':this.quoteInfo.quotationNo[2].padStart(5,'0');
		this.quoteInfo.quotationNo[3] =  (this.quoteInfo.quotationNo[3] == undefined || this.quoteInfo.quotationNo[3] == '')?'':this.quoteInfo.quotationNo[3].padStart(2,'0');
		this.quoteInfo.quotationNo[4] =  (this.quoteInfo.quotationNo[4] == undefined || this.quoteInfo.quotationNo[4] == '')?'':this.quoteInfo.quotationNo[4].padStart(3,'0');
		console.log(this.searchArr.join('-'));
		var a = ev.target.value;
		if(key == 'lineCd') {
			this.searchArr[0] = a === '' ? '%%' : a.toUpperCase() + '%';
		} else if(key == 'year') {
			this.searchArr[1] = '%' + a + '%';
		} else if(key == 'seqNo') {
			this.searchArr[2] = '%' + a + '%';
		} else if(key == 'revNo') {
			this.searchArr[3] = '%' + a + '%';
		} else if(key == 'cedingId') {
			this.searchArr[4] = a === '' ? '%%' : '%' + a.padStart(3, '0');
		}else{
			console.log(' else , nothing found');
		}

		if(this.searchArr.includes('')) {
			console.log('entered here includes');
			this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
		}else{
			console.log('other else');
		}
		this.getQuoteList([{ key: 'quotationNo', search: this.searchArr.join('-') }]);

	}

	onTabChange($event: NgbTabChangeEvent) {
		if ($event.nextId === 'Exit') {
			$event.preventDefault();
			this.router.navigate(['/hold-cover-monitoring']);
		}else{
			if($('.ng-dirty').length != 0 ){
			    $event.preventDefault();
			    const subject = new Subject<boolean>();
			    const modal = this.modalService.open(ConfirmLeaveComponent,{
				        centered: true, 
			            backdrop: 'static', 
			            windowClass : 'modal-size'
			    });
		        modal.componentInstance.subject = subject;

		        subject.subscribe(a=>{
		        	if(a){
			            $('.ng-dirty').removeClass('ng-dirty');
			            this.tabset.select($event.nextId)
			        }
			    })
      		}
		}
	}

	clearHc(){
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
		this.periodFromArr				 = [];
		this.periodToArr				 = [];
		this.disableCancelHc 			 = true;
		this.disableApproval			 = true;
		$('.warn').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
		$('.warn').find('input').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
	}

	clearAll(){
		this.quoteInfo.cedingName		 = '';
		this.quoteInfo.insuredDesc		 = '';
		this.quoteInfo.riskName			 = '';
		this.clearHc();
	}

	setPeriodTo(){
		var d = new Date(this.periodFromArr[0]);
		var s = d.setDate(d.getDate()+30);
		this.periodToArr[0] = (isNaN(s) == true)?'':this.ns.toDateTimeString(s).split('T')[0];
		this.addDirty();
		$('#periodTo').find('input').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
	}

	addDirty(){
		$('.r-only').find('input').addClass('ng-dirty');
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

	searchQuery(searchParams){
		console.log(searchParams);
		this.searchParams = searchParams;
		this.passDataQuoteLOV.tableData = [];
		this.getQuoteList();
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
		this.getQuoteOptions();
	}

	showModifLov(){
		$('#modifMdl > #modalBtn').trigger('click');
	}

	showCancelHcMdl(){
  		$('#cancelHcMdl > #modalBtn').trigger('click');
  	}

  	showApprovalMdl(){
  		this.validateUser();
  		$('#approvalMdl > #modalBtn').trigger('click');
  	}

	splitQuoteNo(quotationNo){
		return quotationNo.split('-');
	}

}
