import { Component, OnInit,ViewChild } from '@angular/core';
import { HoldCoverInfo } from '../../_models/HoldCover';
import { QuotationService, NotesService, UserService } from '../../_services';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { LoadingTableComponent } from '@app/_components/loading-table/loading-table.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { NgForm } from '@angular/forms';
//import { SucessDialogComponent } from '@app/_components/common';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-quotation-to-hold-cover',
  templateUrl: './quotation-to-hold-cover.component.html',
  styleUrls: ['./quotation-to-hold-cover.component.css']
})
export class QuotationToHoldCoverComponent implements OnInit {
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild(LoadingTableComponent) table: LoadingTableComponent;
	@ViewChild('opt') opt: CustNonDatatableComponent;
	@ViewChild('tabset') tabset: any;
	@ViewChild('approvalMdl') approvalMdl : ModalComponent;
	@ViewChild(NgForm) form: NgForm;
	@ViewChild(SucessDialogComponent) successDiag: SucessDialogComponent;
	@ViewChild('modifMdl') modifMdl: ModalComponent;

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
	searchParams: any = {
        statusArr:['3','6'],
        'paginationRequest.count':10,
        'paginationRequest.position':1,   
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
	//searchParams	: any[] = [];
	rowRec			: any;
	rowRecOpt		: any;
	fieldIconDsbl	: boolean = true;
	holdCoverNo		: string = '';
	periodFromDate	: string = '';
	periodFromTime	: string = '';
	periodToDate	: string = '';
	periodToTime	: string = '';
	dialogMessage	: string = '';
	dialogIcon		: string = '';
	cancelFlag		: boolean;
	disableCancelHc	: boolean = true;
	disableApproval	: boolean = true;
	disableSave		: boolean = true;
	isApproved	 	: boolean = false;
	loading			: boolean = false;
	aprrovalBtnTxt	: string = 'For Approval';
	reportName 		: string = 'QUOTER012';
	destination		: string = '';
	report			: string = '';
	isModifClicked	: boolean = false;
	passEvent		: any;
	tempHcNo		: string = '';
	private sub		: any;


  	constructor(private quotationService: QuotationService, public modalService: NgbModal, private titleService: Title,
		private ns : NotesService, private router: Router, private userService : UserService, private activatedRoute: ActivatedRoute) { 
	}

  	ngOnInit() {
  		this.titleService.setTitle('Quo | Quotation to Hold Cover');
  		this.userService.emitModuleId("QUOTE013");
  		this.sub = this.activatedRoute.params.subscribe(params => {
  			if(Object.keys(params).length != 0){
  				this.searchParams.quotationNo = this.splitQuoteNo(JSON.parse(params['tableInfo']).quotationNo).join('%-%');
  				this.passDataQuoteLOV.filters[0].search = this.searchParams.quotationNo;
    			this.passDataQuoteLOV.filters[0].enabled =true;
    			this.holdCoverNo = JSON.parse(params['tableInfo']).holdCoverNo;
  				this.getQuoteList('manual');
  				
  			}else{
  				
  				this.getQuoteList();
  			}
  		});
  	}

  	getQuoteList(param?){
  		this.table.loadingFlag = true;
  		this.form.control.markAsPristine();
  		this.ns.formGroup.markAsPristine();
  		
  // 		var parameter;
		// if(param !== undefined){
		// 	parameter = param;
		// }else{
		// 	parameter = this.searchParams;
		// }
		
		// if(param == undefined){
		// 	delete this.searchParams.quotationNo;
		// }

		if(param == 'manual'){
			delete this.searchParams.statusArr;
			this.searchParams['paginationRequest.position'] = 1;
			this.table.p = 1;
		}else{
			this.searchParams.statusArr = ['3','6'];
		}
		
		var parameter = this.searchParams;

  		const subRes =  forkJoin(this.quotationService.newGetQuoProcessingData(parameter),this.quotationService.getQuotationHoldCoverList([
  				{
  					key :'holdCoverNo',
  					search : this.holdCoverNo == undefined ? '' : this.holdCoverNo
  				} 
  			]))
  								.pipe(map(([quo, hc]) => { return { quo, hc };}));

  		this.subs = subRes.subscribe(data => {
  			
  			var quoList = data['quo']['quotationList'];
  			var hcList 	= data['hc']['quotationList'];
/*<<<<<<< HEAD
  			quoList = quoList.map(i => {i.riskName = i.project!=null ? i.project.riskName : null; return i;});
  			this.passDataQuoteLOV.count = data['quo']['length'];
  			this.table.placeData(quoList);
			//this.table.refreshTable();
=======*/
  			quoList = data['quo']['quotationList']
  					  .map(i => { i.riskName = (i.project == null || i.project == undefined)?'':i.project.riskName; return i;});
  			
  			//this.passDataQuoteLOV.tableData = quoList;
  			this.passDataQuoteLOV.count = data['quo']['length'];
  			
			this.table.placeData(quoList);
/*>>>>>>> f62aa0e0e32c1dbcd1a4f85d054353c21f70a58c*/
			
				if((quoList.length == 1 && this.completeSearch)|| param=='manual'){
					this.quoteInfo.quotationNo 	= this.splitQuoteNo(quoList[0].quotationNo);
					this.holdCover.quoteId		= quoList[0].quoteId;
					this.quoteInfo.cedingName	= quoList[0].cedingName;
					this.quoteInfo.insuredDesc	= quoList[0].insuredDesc;
					this.quoteInfo.riskName		= quoList[0].riskName;
					this.holdCover.lineCd		= quoList[0].lineCd;
					this.quoteInfo.status		= quoList[0].status;
					this.disableSave 			= false;
					this.isModifClicked 		= false;
					this.newHc(false);
					this.getQuoteOptions();

					var selectedRow = hcList.filter(i => i.quotationNo == quoList[0].quotationNo);
					if(selectedRow.length != 0 && (this.holdCoverNo != undefined ||  selectedRow[0].holdCover.status.toUpperCase() != 'REPLACED VIA HOLD COVER MODIFICATION')){
						this.holdCoverNo 		 		 = selectedRow[0].holdCover.holdCoverNo;
						this.tempHcNo					 = selectedRow[0].holdCover.holdCoverNo;
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
				  		this.periodFromDate				 = this.ns.toDateTimeString(selectedRow[0].holdCover.periodFrom).split('T')[0];
				  		this.periodFromTime				 = this.ns.toDateTimeString(selectedRow[0].holdCover.periodFrom).split('T')[1];
				  		this.periodToDate				 = this.ns.toDateTimeString(selectedRow[0].holdCover.periodTo).split('T')[0];
				  		this.periodToTime				 = this.ns.toDateTimeString(selectedRow[0].holdCover.periodTo).split('T')[1];
				  		this.holdCover.preparedBy		 = selectedRow[0].holdCover.preparedBy;
				  		this.holdCover.reqBy			 = selectedRow[0].holdCover.reqBy;
				  		this.holdCover.reqDate			 = (selectedRow[0].holdCover.reqDate == null)?'':this.ns.toDateTimeString(selectedRow[0].holdCover.reqDate).split('T')[0];
				  		this.holdCover.status			 = selectedRow[0].holdCover.status;
				  		this.quoteInfo.totalSi			 = selectedRow[0].holdCover.totalSi;
				  		$('.warn').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
				  		this.disableApproval = (this.holdCoverNo == '')?true:false;

						if(this.holdCover.status.toUpperCase() == 'EXPIRED' || this.holdCover.status.toUpperCase() == 'CONVERTED' || this.holdCover.status.toUpperCase() == 'REPLACED VIA HOLD COVER MODIFICATION'|| this.holdCover.status.toUpperCase() == 'CANCELLED'){
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

				}else if( this.completeSearch){
					console.log('dito?')
					this.newHc(true);
					this.clearAll();
					if(quoList.length == 0 && param != undefined){
						this.showQuoteLov();
						this.getQuoteList();
					}
				}			
  		});

  	}

  	onSaveHoldCover(cancelFlag?){
  		this.dialogIcon = '';
		this.dialogMessage = '';
		this.cancelFlag = cancelFlag !== undefined;
		this.periodFromDate	= (this.periodFromDate == '' || this.periodFromDate == null || this.periodFromDate == undefined)? '' : this.periodFromDate;
		this.periodFromTime	= (this.periodFromTime == '' || this.periodFromTime == null || this.periodFromTime == undefined)? '' : this.periodFromTime;
		this.periodToDate	 	= (this.periodToDate == '' || this.periodToDate == null || this.periodToDate == undefined)? '' : this.periodToDate;
		this.periodToTime	 	= (this.periodToTime == '' || this.periodToTime == null || this.periodToTime == undefined)? '' : this.periodToTime;

		var periodFromArr = [this.periodFromDate,this.periodFromTime];
		var periodToArr	  = [this.periodToDate,this.periodToTime];

		if(this.quoteInfo.quotationNo.some(i => i == '') == true || this.holdCover.optionId == '' ||
			periodFromArr.some(pf => pf == '') == true ||  periodFromArr.length == 0 ||
			periodToArr.some(pt => pt == '') == true ||  periodToArr.length == 0){
			setTimeout(()=>{
				this.dialogIcon = 'error';
				$('.globalLoading').css('display','none');
				$('app-sucess-dialog #modalBtn').trigger('click');
				$('.warn').focus();
				$('.warn').blur();
				this.periodFromDate == '' ? $('.pf0').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
				this.periodFromTime == '' ? $('.pf1').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
				this.periodToDate == '' ? $('.pt0').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
				this.periodToTime == '' ? $('.pt1').find('input').css('box-shadow','rgb(255, 15, 15) 0px 0px 5px') : '';
			},500);
		}else{
			this.holdCover.holdCoverYear	= (this.holdCover.holdCoverYear == '')?String(new Date().getFullYear()):this.holdCover.holdCoverYear;
	  		this.holdCover.periodFrom		= periodFromArr.join('T');
	  		this.holdCover.periodTo			= periodToArr.join('T');
	  		this.holdCover.createDate		= (this.holdCover.createDate == '')?this.ns.toDateTimeString(0):this.holdCover.createDate;
			this.holdCover.createUser		= (this.holdCover.createUser == '')?this.ns.getCurrentUser():this.holdCover.createUser;
			this.holdCover.preparedBy		= (this.holdCover.preparedBy == '')?'':this.holdCover.createUser;
	  		this.holdCover.updateDate		= this.ns.toDateTimeString(0);
			this.holdCover.updateUser		= this.ns.getCurrentUser();

			if(this.isModifClicked == true){
				this.holdCover.status = 'Released';
			}else{
				this.holdCover.status		= (this.holdCover.status == '' || this.holdCover.status.toUpperCase() == 'APPROVED' || this.holdCover.status.toUpperCase() == 'REJECTED')?'In Force':this.holdCover.status;
			}

	  		this.quotationService.saveQuoteHoldCover(JSON.stringify(this.holdCover))
	  		.subscribe(data => {
	  			
	  			this.holdCoverNo 	= data['holdCoverNo'];
	  			this.dialogIcon 	= '';
				this.dialogMessage 	= '';
				$('app-sucess-dialog #modalBtn').trigger('click');
				// var qNo = this.quoteInfo.quotationNo.map((a,i) => (isNaN(a) == false && i!=4)? parseInt(a):(i==4)?a.padStart(3,'0'):a);;
				
				this.searchParams.quotationNo = this.quoteInfo.quotationNo.join('-');
				this.passDataQuoteLOV.filters[0].search = this.searchParams.quotationNo;
    			this.passDataQuoteLOV.filters[0].enabled =true;
				this.getQuoteList('manual');
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
	  		this.searchParams.quotationNo = this.table.indvSelect.quotationNo;
	  		this.passDataQuoteLOV.filters[0].search = this.searchParams.quotationNo;
    		this.passDataQuoteLOV.filters[0].enabled =true;
	  		this.getQuoteList('manual');
	  		this.modalService.dismissAll();
  		}
  	}

  	getQuoteOptions(){
  		
  		this.opt.loadingFlag = true;
  		this.quotationService.getQuoteOptions(this.holdCover.quoteId,'')
  		.subscribe(data => {
  			this.ns.lovLoader(this.passEvent,0);
  			this.passDataOptionsLOV.tableData = [];
  			
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
  			
  			this.dialogIcon = 'success-message';
  			this.dialogMessage = 'Cancelled Successfully';
  			$('app-sucess-dialog #modalBtn').trigger('click');
  			// this.clearHc();
  			// this.newHc(false);
  			// this.disableApproval = true;
  			this.newHc(true);
	  		this.disableSave = true;
	  		this.disableApproval = true;
	  		this.holdCoverNo = this.tempHcNo;
	  		this.holdCover.status = 'Cancelled';
	  		this.disableCancelHc = true;
  		});
  		//this.modalService.dismissAll();
  	}

  	onClickView(){
  		this.newHc(true);
  		this.disableSave = true;
  		this.disableApproval = false;
  		this.modifMdl.closeModal();
  		//this.modalService.dismissAll();
  	}

  	validateUser(){
  		//(this.aprrovalBtnTxt == '')?this.loading = true:'';
  		const subRes =  forkJoin(this.userService.retMtnUsers(this.ns.getCurrentUser()),this.userService.retMtnUserAmtLmt('',''))
  								.pipe(map(([usr, usrAmtLmt]) => { return { usr, usrAmtLmt };}));
	  	subRes.subscribe(data => {
	  		
	  		var usrGrp 		  = data['usr']['usersList'][0].userGrp;
	  		var curRow		  = data['usrAmtLmt']['userAmtLmtList'].filter(a => a.userGrp == usrGrp && a.lineCd.toUpperCase() == this.holdCover.lineCd.toUpperCase());
	  		var rec			  = curRow[0];
	  		//this.loading      = false;
			this.destination  = 'SCREEN';
			this.report		  = 'Hold Cover Letter';
  			if(rec.allAmtSw == 'Y' || this.quoteInfo.totalSi <= rec.amtLimit){
  				this.aprrovalBtnTxt = 'Approved';
  				this.isApproved = true;
  			}else{
  				this.aprrovalBtnTxt = 'For Approval';
  				this.isApproved = false;
  			}
  		});
  	}

  	onClickPrint(){
  		
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

		this.loading 		= true;
		this.dialogIcon 	= 'success-message';
  		this.dialogMessage 	= 'Status Updated';

  		if(from.toUpperCase() == 'APPROVED'){
  			ids.hcStatus = 'A';
  			this.holdCover.status = 'Approved';
  			this.holdCover.approvedBy = this.ns.getCurrentUser(); 
  		}else if(from.toUpperCase() == 'FOR APPROVAL'){
  			ids.hcStatus	= 'P';
  			this.holdCover.status 	= 'Pending Approval'; 
  			this.dialogIcon = 'success-message';
  			this.dialogMessage = 'Pending for Approval';
  		}else if(from.toUpperCase() == 'REJECTED'){
  			ids.hcStatus = 'R';
  			this.holdCover.status = 'Rejected';
  		}else{
  			ids.hcStatus = this.holdCover.status;
  			if(this.holdCover.status.toUpperCase() == 'APPROVED'){
	  			ids.hcStatus = '2';
	  			this.holdCover.status = 'Released';
	  			
  			}
  		}
		
  		this.quotationService.updateHoldCoverStatus(JSON.stringify(ids))
	  	.subscribe(data => {
  			//$('app-sucess-dialog #modalBtn2').trigger('click');
  			this.successDiag.modal.openNoClose();
  			this.loading = false;
  			(this.holdCover.status.toUpperCase() == 'RELEASED')?this.onClickView():'';
  			this.getQuoteList('manual')
	  	});
  	}

  	printPDFHC(param){
  		var fileName = this.holdCoverNo;
  		this.quotationService.downloadPDFHC(this.reportName,this.holdCover.quoteId,this.holdCover.holdCoverId)
	  	.subscribe(data => {
	  		
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
        if(this.holdCover.status != 'Released'){
  			this.updateHcStatus('print-btn');
        }
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
			this.addDirty();  			
			this.modalService.dismissAll();
  		}
  	}

  	onClickModif(){
  		this.holdCoverNo 	  = '';
  		this.holdCover.status = '';
  		this.isModifClicked   = true;
  		this.disableSave	  = false;
  		this.disableApproval  = true;
  		this.disableCancelHc  = true;
  		this.modalService.dismissAll();
  	}

  	onCancelModifLov(){
  		this.clearAll();
  		this.newHc(true);
  		this.disableSave = true;
  		this.disableApproval = true;
  		this.quoteInfo.quotationNo = [];
  		this.modalService.dismissAll();
  		this.getQuoteList();
  	}

  	onRowClickOpt(event){
  		this.rowRecOpt = event;
  	}

  	searchQuoteId(event){
  		this.passEvent = event;
  		this.ns.lovLoader(this.passEvent,1);
  		(this.passDataOptionsLOV.tableData.some(i => i.optionId == this.holdCover.optionId) == true)?setTimeout(()=>{this.ns.lovLoader(this.passEvent,0)},500):this.holdCover.optionId='';
  		this.holdCover.optionId == ''?this.showOptionsLov():'';
  	}
  	completeSearch:boolean = false;
	search(key,ev) {
		
		this.holdCoverNo = undefined;
		this.quoteInfo.quotationNo[2] =  (this.quoteInfo.quotationNo[2] == undefined || this.quoteInfo.quotationNo[2] == '')?'':this.quoteInfo.quotationNo[2].padStart(5,'0');
		this.quoteInfo.quotationNo[3] =  (this.quoteInfo.quotationNo[3] == undefined || this.quoteInfo.quotationNo[3] == '')?'':this.quoteInfo.quotationNo[3].padStart(2,'0');
		this.quoteInfo.quotationNo[4] =  (this.quoteInfo.quotationNo[4] == undefined || this.quoteInfo.quotationNo[4] == '')?'':this.quoteInfo.quotationNo[4].padStart(3,'0');
		
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
			
		}
		
		if(this.quoteInfo.quotationNo.includes('')) {
			
			this.searchArr = this.searchArr.map(a => { a = a === '' ? '%%' : a; return a; });
			this.completeSearch = false;
			this.quoteInfo  = {
				quotationNo 	: this.quoteInfo.quotationNo,
				cedingName		: '',
				insuredDesc		: '',
				riskName		: '',
				totalSi			: '',
				status			: ''
			};
			this.clearHc();
			this.disableFieldsHc(true);
			this.disableSave				 = true;
			console.log('pasok')
		}else{
			
			this.completeSearch = true;
		}


		this.searchParams.quotationNo = this.quoteInfo.quotationNo.join('%-%');
		this.passDataQuoteLOV.filters[0].search = this.searchParams.quotationNo;
    	this.passDataQuoteLOV.filters[0].enabled =true;
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
		this.holdCoverNo 		 		 = undefined;
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
		this.periodFromDate				 = '';
		this.periodFromTime				 = ''; 
		this.periodToDate				 = '';
		this.periodToTime				 = '';
		this.disableCancelHc 			 = true;
		this.disableApproval			 = true;
		this.searchParams = {
	        statusArr:['3','6'],
	        'paginationRequest.count':10,
	        'paginationRequest.position':1,   
	    };
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
		var d = new Date(this.periodFromDate);
		var s = d.setDate(d.getDate()+30);
		this.periodToDate = (isNaN(s) == true)?'':this.ns.toDateTimeString(s).split('T')[0];
		
		this.addDirty();
		$('#periodTo').find('input').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
	}

	addDirty(){
		//$('.r-only').find('input').addClass('ng-dirty ng-touched');
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
		for(let key of Object.keys(searchParams)){
            this.searchParams[key] = searchParams[key]
        }
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

	showSampleMdl(){
		$('app-modal #modalBtn').trigger('click');
	}

}
