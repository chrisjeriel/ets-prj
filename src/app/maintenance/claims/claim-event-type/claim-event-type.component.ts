import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService, QuotationService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal,NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmLeaveComponent } from '@app/_components/common/confirm-leave/confirm-leave.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-claim-event-type',
  templateUrl: './claim-event-type.component.html',
  styleUrls: ['./claim-event-type.component.css']
})
export class ClaimEventTypeComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild('tabset') tabset: any;

	passData: any = {
		tableData:[],
		tHeader				:["Event Type", "Description", "Active", "Remarks"],
		dataTypes			:["pk-cap", "text", "checkbox", "text"],
		nData:{ 
			newRec			: 1,
			eventTypeCd     : '',
			eventTypeDesc   : '',
			activeTag       : 'Y',
			remarks         : '',
			isNew			: true,
			createUser		: '',
			createDate		: '',
			updateUser		: '',
			updateDate		: ''
		},
		addFlag				: true,
		genericBtn			:'Delete',
		disableGeneric 		: true,
		searchFlag          : true,
		paginateFlag		: true,
		infoFlag			: true,
		pageLength			: 10,
		resizable			: [true, true, false, true],
		uneditable			: [false,false,false,false],
		widths				: [1,'350',1,'auto'],
		pageID				: 'clm-event-type',
		mask: {
	  		eventTypeCd: 'AAAAAAA'
	  	},
		keys				: ['eventTypeCd','eventTypeDesc','activeTag','remarks'],
	};

	cancelFlag				: boolean;
	dialogIcon				: string;
	dialogMessage			: string;
	warnMsg					: string;

    params : any =	{
		saveEventType 		: [],
		deleteEventType 	: []
	};

	saveMtnClmEventType : any = {
		activeTag		: "Y",
	    createDate		: "",
	    createUser		: "",
	    eventTypeCd		: "",
	    eventTypeDesc	: "",
	    remarks			: "",
	    updateDate		: "",
	    updateUser		: ""
	};

  	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal, private quotationService: QuotationService) { }

	ngOnInit() {
		this.titleService.setTitle('Mtn | Claim Event Type');
		this.getMtnClmEventType();
	}

	getMtnClmEventType(){
		this.mtnService.getMtnClmEventType()
		.subscribe(data => {
			console.log(data);
			this.passData.tableData = [];
			var rec = data['eventTypeList'].map(i => { i.createDate = this.ns.toDateTimeString(i.createDate); i.updateDate = this.ns.toDateTimeString(i.updateDate); return i} );
			this.passData.tableData = rec;
			this.table.refreshTable();
			this.table.onRowClick(null, this.passData.tableData[0]);
		});
	}

	onSaveMtnClmEventType(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.dialogIcon = '';
		this.dialogMessage = '';
		var isNotUnique : boolean ;
		var saveEventType = this.params.saveEventType;
		var isEmpty = 0;
		
		for(let record of this.passData.tableData){
			if(record.eventTypeCd === '' || record.eventTypeCd === null || record.eventTypeDesc === '' || record.eventTypeDesc === null){
				if(!record.deleted){
					isEmpty = 1;
				}
			}else{
				if(record.edited && !record.deleted){
					record.createUser		= (record.createUser === '' || record.createUser === undefined)?this.ns.getCurrentUser():record.createUser;
					record.createDate		= (record.createDate === '' || record.createDate === undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
					record.updateUser		= this.ns.getCurrentUser();
					record.updateDate		= this.ns.toDateTimeString(0);
					this.params.saveEventType.push(record);
				}else if(record.edited && record.deleted){
					this.params.deleteEventType.push(record);
				}
			}
		}

		console.log(this.params);

		this.passData.tableData.forEach(function(tblData){
			if(tblData.isNew != true){
				saveEventType.forEach(function(sETData){
					if(tblData.eventTypeCd.toString().toUpperCase() == sETData.eventTypeCd.toString().toUpperCase()){
						if(sETData.isNew === true){
							isNotUnique = true;	
						}
					}
				});
			}
		});

		if(isNotUnique == true){
			setTimeout(()=>{
                $('.globalLoading').css('display','none');
                this.warnMsg = 'Unable to save the record. Claim Event Type must be unique.';
				this.showWarnLov();
				this.params.saveEventType 	= [];
            },500);
		}else{
			if(isEmpty == 1){
				setTimeout(()=>{
                    $('.globalLoading').css('display','none');
                    this.dialogIcon = 'error';
                    $('app-sucess-dialog #modalBtn').trigger('click');
                    this.params.saveEventType 	= [];
                },500);
			}else{
				if(this.params.saveEventType.length == 0 && this.params.deleteEventType.length == 0){
					setTimeout(()=>{
						$('.globalLoading').css('display','none');
						this.dialogIcon = 'info';
						this.dialogMessage = 'Nothing to save.';
						$('app-sucess-dialog #modalBtn').trigger('click');
						this.params.saveEventType 	= [];
						this.passData.tableData = this.passData.tableData.filter(a => a.eventTypeCd != '');
					},500);
				}else{
					this.mtnService.saveMtnClmEventType(JSON.stringify(this.params))
					.subscribe(data => {
						console.log(data);
						this.getMtnClmEventType();
						$('app-sucess-dialog #modalBtn').trigger('click');
						this.params.saveEventType 	= [];
						this.passData.disableGeneric = true;
					});
				}	
			}
		}

	}

	onRowClick(event){
		this.saveMtnClmEventType = event;
	    if(event != null){
	       	this.passData.disableGeneric = false;	
	    }else{
	       	this.passData.disableGeneric = true;	
	    }
	}

	onDeleteEventType(){
		if(this.table.indvSelect.okDelete == 'N'){
	  		this.warnMsg = 'You are not allowed to delete a Event Type that is already used in claim processing.';
			this.showWarnLov();
	  	}else{
	  		this.table.indvSelect.deleted = true;
	  		this.table.selected  = [this.table.indvSelect]
	  		this.table.confirmDelete();
	  	}
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

	showWarnLov(){
		$('#warnMdl > #modalBtn').trigger('click');
	}

	cancel(){
		this.cancelBtn.clickCancel();
	}

	onClickSave(){
		$('#confirm-save #modalBtn2').trigger('click');
	}

}
