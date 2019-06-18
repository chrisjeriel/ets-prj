import { Component, OnInit, ViewChild } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { Router,ActivatedRoute } from '@angular/router';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { Title } from '@angular/platform-browser';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-intermediary',
  templateUrl: './intermediary.component.html',
  styleUrls: ['./intermediary.component.css']
})
export class IntermediaryComponent implements OnInit {
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild('tabset') tabset: any;

  	private sub		: any;
  	cancelFlag		: boolean;
  	dialogIcon		: string = '';
  	dialogMessage 	: string = '';
  	type			: string;
  	intmReq 		: any;
  	fromCancel		: boolean;

  	intmRecord : any = {
	  	intmId			: null,
		intmName		: null,
		firstName		: null,
		middleInitial	: null,
		lastName		: null,
		addrLine1		: null,
		addrLine2		: null,
		addrLine3		: null,
		zipCd			: null,
		address			: null,
		contactNo		: null,
		emailAdd		: null,
		activeTag		: null,
		corpTag			: null,
		vatTag			: null,
		oldIntmId		: null,
		remarks			: null,
		createUser		: null,
		createDate		: null,
		updateUser		: null,
		updateDate		: null
	}

	constructor(private mtnService:MaintenanceService, private ns: NotesService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private titleService: Title ) { }

	ngOnInit() {
		this.titleService.setTitle("Mtn | Intermediary");
		this.sub = this.activatedRoute.params
				   .subscribe(params => {
				   		this.intmRecord.intmId 	=	 params['intmId'];
				   });

		this.getIntmList();
	}

	getIntmList(){
  		console.log(this.intmRecord.intmId);
  		if(this.intmRecord.intmId === '' || this.intmRecord.intmId === null || this.intmRecord.intmId === undefined){
  			this.intmRecord.activeTag = true;
			this.intmRecord.corpTag = 'C';
			this.intmRecord.vatTag = '3';
			this.type = 'text';
  		}else{
  			this.type = 'datetime-local';
  			this.mtnService.getIntLOV(this.intmRecord.intmId)
	  		.subscribe(data => {
	  			console.log(data);
	  			var rec = data['intermediary'];

	  			this.intmRecord = rec[0];
	  			this.intmRecord.intmId		= (this.intmRecord.intmId === '' || this.intmRecord.intmId === null)?'':this.intmRecord.intmId.toString().padStart(7,'0');
	  			this.intmRecord.oldIntmId	= (this.intmRecord.oldIntmId === '' || this.intmRecord.oldIntmId === null)?'':this.intmRecord.oldIntmId.toString().padStart(7,'0');
	  			this.intmRecord.activeTag  	= this.cbFunc(this.intmRecord.activeTag);
				this.intmRecord.createDate 	= this.ns.toDateTimeString(this.intmRecord.createDate);
				this.intmRecord.updateDate 	= this.ns.toDateTimeString(this.intmRecord.updateDate);
				this.checkCorpTag();
	  		});
  		}
  		
  	}

  	onSaveMtnIntm(cancelFlag?){
  		this.cancelFlag = cancelFlag !== undefined;
  		this.intmRecord.intmName 	= (this.intmRecord.intmName === null || this.intmRecord.intmName === undefined)? '' : this.intmRecord.intmName.trim();
  		this.intmRecord.zipCd		= (this.intmRecord.zipCd === null || this.intmRecord.zipCd === undefined)?'':this.intmRecord.zipCd;
  		this.intmRecord.firstName 	= (this.intmRecord.firstName === null || this.intmRecord.firstName === undefined)?'':this.intmRecord.firstName;
  		this.intmRecord.lastName	= (this.intmRecord.lastName === null || this.intmRecord.lastName === undefined)?'':this.intmRecord.lastName;
  		this.intmRecord.addrLine1	= (this.intmRecord.addrLine1 === null || this.intmRecord.addrLine1 === undefined)?'':this.intmRecord.addrLine1;

  		if(this.intmRecord.intmName === ''  || this.intmRecord.zipCd === '' ||  this.intmRecord.corpTag === null || this.intmRecord.vatTag === null || 
  		   (this.intmRecord.corpTag === 'I' && (this.intmRecord.firstName === '' || this.intmRecord.lastName === '') || this.intmRecord.addrLine1 === '' )){
	  			setTimeout(()=>{
                    $('.globalLoading').css('display','none');
                    this.dialogIcon = 'error';
                    $('app-sucess-dialog #modalBtn').trigger('click');
                },500);

	  		    $('.warn').focus();
				$('.warn').blur();
				this.fromCancel = false;
  		}else{
  			this.fromCancel = true;
  			this.intmReq = {
						"activeTag"		: this.cbFuncSave(this.intmRecord.activeTag),
						"addrLine1"		: this.intmRecord.addrLine1,
						"addrLine2"		: this.intmRecord.addrLine2,
						"addrLine3"		: this.intmRecord.addrLine3,
						"contactNo"		: this.intmRecord.contactNo,
						"corpTag"		: this.intmRecord.corpTag,
						"createDate"	: (this.intmRecord.createDate === '' || this.intmRecord.createDate === null)?this.ns.toDateTimeString(0):this.intmRecord.createDate,
						"createUser"	: (this.intmRecord.createUser === '' || this.intmRecord.createUser === null)?this.ns.getCurrentUser():this.intmRecord.createUser,
						"emailAdd"		: this.intmRecord.emailAdd,
						"firstName"		: this.intmRecord.firstName,
						"intmId"		: this.intmRecord.intmId,
						"intmName"		: this.intmRecord.intmName,
						"lastName"		: this.intmRecord.lastName,
						"middleInitial"	: this.intmRecord.middleInitial,
						"oldIntmId"		: this.intmRecord.oldIntmId,
						"remarks"		: this.intmRecord.remarks,
						"updateDate"	: this.ns.toDateTimeString(0),
						"updateUser"	: this.ns.getCurrentUser(),
						"vatTag"		: this.intmRecord.vatTag,
						"zipCd"			: this.intmRecord.zipCd

		  	}
			
			this.mtnService.saveMtnIntermediary(JSON.stringify(this.intmReq))
		  	.subscribe(data => {
		  		console.log(data);
		  		this.dialogIcon = '';
		  		this.dialogMessage = '';
		  		$('app-sucess-dialog #modalBtn').trigger('click');
		  		this.intmRecord.intmId = data['intmIdOut'];
		  		this.getIntmList();
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
  			this.intmRecord.firstName = (this.intmRecord.firstName === null || this.intmRecord.firstName === '')? '' : this.intmRecord.firstName;
	  		this.intmRecord.middleInitial = (this.intmRecord.middleInitial === null || this.intmRecord.middleInitial === '')? '' : this.intmRecord.middleInitial;
	  		this.intmRecord.lastName = (this.intmRecord.lastName === null || this.intmRecord.lastName === '')? '' : this.intmRecord.lastName;

	  		this.intmRecord.intmName = this.intmRecord.firstName  + ' ' + this.intmRecord.middleInitial.toUpperCase() + ' ' + this.intmRecord.lastName;
  		}else{

  		}
  	}

  	checkCorpTag(){
  		if(this.intmRecord.corpTag === 'I'){
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
  			
			
  			this.intmRecord.firstName = '';
  			this.intmRecord.middleInitial = '';
  			this.intmRecord.lastName = '';
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
		this.intmRecord.oldIntmId = (this.intmRecord.oldIntmId === '' || this.intmRecord.oldIntmId === null)?'':this.intmRecord.oldIntmId.padStart(7,'0') ;
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

	checkCancel(){
		if(this.cancelFlag == true){
			if(this.fromCancel){
				this.cancelBtn.onNo();
			}else{
				return;
			}
		}
	}


}
