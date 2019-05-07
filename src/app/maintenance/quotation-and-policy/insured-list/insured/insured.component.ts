import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { Router,ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Title } from '@angular/platform-browser';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-insured',
  templateUrl: './insured.component.html',
  styleUrls: ['./insured.component.css']
})
export class InsuredComponent implements OnInit {
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild('tabset') tabset: any;

  	private sub		: any;
  	cancelFlag		: boolean;
  	dialogIcon		: string = '';
  	dialogMessage 	: string = '';
  	type			: string;
  	insuredReq 		: any;

  	insuredRecord : any = {
	  	insuredId		: null,
		insuredName		: null,
		insuredAbbr		: null,
		insuredType		: null,
		firstName		: null,
		middleInitial	: null,
		lastName		: null,
		addrLine1		: null,
		addrLine2		: null,
		addrLine3		: null,
		zipCd			: null,
		contactNo		: null,
		emailAdd		: null,
		activeTag		: null,
		corpTag			: null,
		vatTag			: null,
		oldInsId		: null,
		remarks			: null,
		createUser		: null,
		createDate		: null,
		updateUser		: null,
		updateDate		: null
	}

  	constructor(private mtnService:MaintenanceService, private ns: NotesService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private titleService: Title ) { }

  	ngOnInit() {
  		this.titleService.setTitle("Mtn | Insured");
		this.sub = this.activatedRoute.params
				   .subscribe(params => {
				   		this.insuredRecord.insuredId 	=	 params['insuredId'];
				   });

		this.getInsuredList();
  		
  	}

  	getInsuredList(){
  		console.log(this.insuredRecord.insuredId);
  		if(this.insuredRecord.insuredId === '' || this.insuredRecord.insuredId === null || this.insuredRecord.insuredId === undefined){
  			this.insuredRecord.activeTag = true;
			this.insuredRecord.corpTag = 'C';
			this.insuredRecord.vatTag = '3';
			this.insuredRecord.insuredType = 'P';
			this.type = 'text';
  		}else{
  			this.type = 'datetime-local';
  			this.mtnService.getMtnInsured(this.insuredRecord.insuredId)
	  		.subscribe(data => {
	  			console.log(data);
	  			var rec = data['insured'];

	  			this.insuredRecord = rec[0];
	  			this.insuredRecord.insuredId	= (this.insuredRecord.insuredId === '' || this.insuredRecord.insuredId === null)?'':this.insuredRecord.insuredId.toString().padStart(7,'0');
	  			this.insuredRecord.oldInsId		= (this.insuredRecord.oldInsId === '' || this.insuredRecord.oldInsId === null)?'':this.insuredRecord.oldInsId.toString().padStart(7,'0');
	  			this.insuredRecord.activeTag  	= this.cbFunc(this.insuredRecord.activeTag);
				this.insuredRecord.createDate 	= this.ns.toDateTimeString(this.insuredRecord.createDate).substring(0,16);
				this.insuredRecord.updateDate 	= this.ns.toDateTimeString(this.insuredRecord.updateDate).substring(0,16);
				this.checkCorpTag();
	  		});
  		}
  		
  	}

  	onSaveMtnInsured(cancelFlag?){
  		this.cancelFlag = cancelFlag !== undefined;
  		this.insuredRecord.insuredName 	= (this.insuredRecord.insuredName === null || this.insuredRecord.insuredName === undefined)? '' : this.insuredRecord.insuredName.trim();
  		this.insuredRecord.insuredAbbr 	= (this.insuredRecord.insuredAbbr === null || this.insuredRecord.insuredAbbr === undefined)?'':this.insuredRecord.insuredAbbr;
  		this.insuredRecord.zipCd		= (this.insuredRecord.zipCd === null || this.insuredRecord.zipCd === undefined)?'':this.insuredRecord.zipCd;
  		this.insuredRecord.insuredType	= (this.insuredRecord.insuredType === null || this.insuredRecord.insuredType === undefined)?'':this.insuredRecord.insuredType;
  		this.insuredRecord.firstName 	= (this.insuredRecord.firstName === null || this.insuredRecord.firstName === undefined)?'':this.insuredRecord.firstName;
  		this.insuredRecord.lastName		= (this.insuredRecord.lastName === null || this.insuredRecord.lastName === undefined)?'':this.insuredRecord.lastName;
		this.insuredRecord.addrLine1	= (this.insuredRecord.addrLine1 === null || this.insuredRecord.addrLine1 === undefined)?'':this.insuredRecord.addrLine1;

  		if(this.insuredRecord.insuredName === '' || this.insuredRecord.insuredAbbr === '' || this.insuredRecord.zipCd === '' || this.insuredRecord.insuredType === '' ||
  		   this.insuredRecord.corpTag === null || this.insuredRecord.vatTag === null ||  this.insuredRecord.addrLine1 === '' ||
  		   (this.insuredRecord.corpTag === 'I' && (this.insuredRecord.firstName === '' || this.insuredRecord.lastName === '') )){
	  			setTimeout(()=>{
                    $('.globalLoading').css('display','none');
                    this.dialogIcon = 'error';
                    $('app-sucess-dialog #modalBtn').trigger('click');
                },500);

	  		    $('.warn').focus();
				$('.warn').blur();
  		}else{
  			this.insuredReq = {
						"activeTag"		: this.cbFuncSave(this.insuredRecord.activeTag),
						"addrLine1"		: this.insuredRecord.addrLine1,
						"addrLine2"		: this.insuredRecord.addrLine2,
						"addrLine3"		: this.insuredRecord.addrLine3,
						"contactNo"		: this.insuredRecord.contactNo,
						"corpTag"		: this.insuredRecord.corpTag,
						"createDate"	: (this.insuredRecord.createDate === '' || this.insuredRecord.createDate === null)?this.ns.toDateTimeString(0):this.insuredRecord.createDate,
						"createUser"	: (this.insuredRecord.createUser === '' || this.insuredRecord.createUser === null)?this.ns.getCurrentUser():this.insuredRecord.createUser,
						"emailAdd"		: this.insuredRecord.emailAdd,
						"firstName"		: this.insuredRecord.firstName,
						"insuredAbbr"	: this.insuredRecord.insuredAbbr,
						"insuredId"		: this.insuredRecord.insuredId,
						"insuredName"	: this.insuredRecord.insuredName,
						"insuredType"	: this.insuredRecord.insuredType,
						"lastName"		: this.insuredRecord.lastName,
						"middleInitial"	: this.insuredRecord.middleInitial,
						"oldInsId"		: this.insuredRecord.oldInsId,
						"remarks"		: this.insuredRecord.remarks,
						"updateDate"	: this.ns.toDateTimeString(0),
						"updateUser"	: this.ns.getCurrentUser(),
						"vatTag"		: this.insuredRecord.vatTag,
						"zipCd"			: this.insuredRecord.zipCd

		  	}
			
			this.mtnService.saveMtnInsured(JSON.stringify(this.insuredReq))
		  	.subscribe(data => {
		  		console.log(data);
		  		this.dialogIcon = '';
		  		this.dialogMessage = '';
		  		$('app-sucess-dialog #modalBtn').trigger('click');
		  		this.insuredRecord.insuredId = data['insuredIdOut'];
		  		this.getInsuredList();
		  	});	
  		}
	  
  	}

  	cbFunc(data){
  		return data === 'Y' ? true : false;
  	}

  	cbFuncSave(data){
  		return data === true? 'Y' : 'N';
  	}

  	concatName(){
  		if($('.name').hasClass('indiv')){
  			this.insuredRecord.firstName = (this.insuredRecord.firstName === null || this.insuredRecord.firstName === '')? '' : this.insuredRecord.firstName;
	  		this.insuredRecord.middleInitial = (this.insuredRecord.middleInitial === null || this.insuredRecord.middleInitial === '')? '' : this.insuredRecord.middleInitial;
	  		this.insuredRecord.lastName = (this.insuredRecord.lastName === null || this.insuredRecord.lastName === '')? '' : this.insuredRecord.lastName;

	  		this.insuredRecord.insuredName = this.insuredRecord.firstName  + ' ' + this.insuredRecord.middleInitial.toUpperCase() + ' ' + this.insuredRecord.lastName;
  		}else{

  		}
  	}

  	checkCorpTag(){
  		if(this.insuredRecord.corpTag === 'I'){
  			$('.name').prop('readonly',true);
  			$('.name').addClass('indiv');
  			$('.name').removeClass('warn');
  			$('.name').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
  			$('.ind-name').prop('readonly',false);
  			$('.ind-name').addClass('warn');
  			$('.midInit').removeClass('warn');
  			
  		}else{
  			$('.name').prop('readonly',false);
  			$('.name').removeClass('indiv');
  			$('.name').addClass('warn');
  			$('.ind-name').prop('readonly',true);
  			$('.ind-name').removeClass('warn');
  			$('.ind-name').css('box-shadow','rgb(255, 255, 255) 0px 0px 5px');
  			
			
  			this.insuredRecord.firstName = '';
  			this.insuredRecord.middleInitial = '';
  			this.insuredRecord.lastName = '';
  		}
  		this.addDirty();
  	}

  	onClickSave(){
   		$('#confirm-save #modalBtn2').trigger('click');
	}

	cancel(){
    	this.cancelBtn.clickCancel();
	}

	addDirty(){
		$('.cus-dirty').addClass('ng-dirty');
	}

	fmtOnBlur(){
		this.insuredRecord.oldInsId = (this.insuredRecord.oldInsId === '' || this.insuredRecord.oldInsId === null)?'':this.insuredRecord.oldInsId.padStart(7,'0') ;
	}

	onTabChange($event: NgbTabChangeEvent) {
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
