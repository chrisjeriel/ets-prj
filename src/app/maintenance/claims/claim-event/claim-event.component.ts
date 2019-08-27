import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService, QuotationService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { LovComponent } from '@app/_components/common/lov/lov.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnClmEventTypeLovComponent } from '@app/maintenance/mtn-clm-event-type-lov/mtn-clm-event-type-lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-claim-event',
  templateUrl: './claim-event.component.html',
  styleUrls: ['./claim-event.component.css']
})
export class ClaimEventComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table		: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn 			: CancelButtonComponent;
    @ViewChild(MtnLineComponent) lineLov 					: MtnLineComponent;
    @ViewChild(MtnClmEventTypeLovComponent) clmEventTypeLov : MtnLineComponent;
	@ViewChild(LovComponent) lov							: LovComponent;
	@ViewChild(ModalComponent) modal						: ModalComponent;
	@ViewChild(ConfirmSaveComponent) cs 					: ConfirmSaveComponent;
	@ViewChild(SucessDialogComponent) success   			: SucessDialogComponent;


    passData: any = {
        tableData            : [],
        tHeader              : ['Event Code', 'Description','Event Type','Event Date From','Event Date To','Active','Remarks'],
        dataTypes            : ['sequence-5','text','lovInput','datespan','datespan','checkbox','text'],
        datespan			 : [{ from: 'lossDateFrom', to: 'lossDateTo' }],
        magnifyingGlass	 	 : ['eventTypeCd'],
        nData:
        {
            eventCd		  : '',
            eventDesc 	  : '',
            lineCd		  : '',
            eventTypeCd   : '',
            lossDateFrom  : '',
            lossDateTo 	  : '',
            activeTag     : 'Y',
            remarks    	  : '',
            isNew		  : true,
            showMG 		  : 1
        },
        paginateFlag        : true,
        infoFlag            : true,
        searchFlag          : true,
        pageLength          : 10,
        addFlag             : true,
        genericBtn			: 'Delete',
		disableGeneric 		: true,
        keys                : ['eventCd','eventDesc','eventTypeCd','lossDateFrom','lossDateTo','activeTag','remarks'],
        uneditable          : [true,false,false,false,false,false,false],
        pageID              : 'mtn-clm-event',
        widths              : [1,'315',1,1,1,1,'315']
    };

    mtnClmEventData : any = {
    	updateDate : '',
        updateUser : '',
        createDate : '',
        createUser : '',
    }

    dialogIcon		: string = '';
    dialogMessage	: string = '';
    cancelFlag      : boolean;
    warnMsg			: string = '';
    rowData			: any;

    params : any =	{
		saveEvent 	: [],
		deleteEvent : []
	};

  	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns : NotesService, private quotationService: QuotationService, private modalService : NgbModal) { }

  	ngOnInit() {
		this.titleService.setTitle('Mtn | Claim Event');
		this.getMtnClmEvent();
	}

	getMtnClmEvent(){
		this.passData.tableData = [];
		this.mtnService.getMtnClmEvent('')
		.subscribe(data => {
			console.log(data);
			var rec = data['eventList'].map((i,idx) => { i.createDate = this.ns.toDateTimeString(i.createDate); i.updateDate = this.ns.toDateTimeString(i.updateDate); i.showMG = 1; i.index = idx; return i} );
			this.passData.tableData = rec;
			this.table.refreshTable();
			this.table.onRowClick(null, this.passData.tableData[0]);
		});
	}

	onSaveMtnClmEvent(){
	   	this.mtnService.saveMtnClmEvent(JSON.stringify(this.params))
		.subscribe(data => {
			console.log(data);
			this.getMtnClmEvent();
			this.success.open();
			this.params.saveEvent 	= [];
			this.params.deleteEvent = [];
			this.passData.disableGeneric = true;
		});
	}

	onClickSave(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.dialogIcon = '';
		this.dialogMessage = '';
		var isNotUnique : boolean ;
		var saveEvent = this.params.saveEvent;
		var isEmpty = 0;

		for(let record of this.passData.tableData){
			console.log(record);
			if(record.eventDesc == '' || record.eventTypeCd == '' || record.lossDateFrom == '' || record.lossDateFrom == null || record.lossDateTo == '' || record.lossDateTo == null){
				if(!record.deleted){
					isEmpty = 1;
					record.fromCancel = false;
				}else{
					this.params.deleteEvent.push(record);
				}
			}else{
				record.fromCancel = true;
				if(record.edited && !record.deleted){
					record.lossDateFrom		= (record.lossDateFrom == '' || record.lossDateFrom == null)? '' : this.ns.toDateTimeString(record.lossDateFrom);
					record.lossDateTo		= (record.lossDateTo == '' || record.lossDateTo == null)? '' : this.ns.toDateTimeString(record.lossDateTo);
					record.createUser		= (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
					record.createDate		= (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
					record.updateUser		= this.ns.getCurrentUser();
					record.updateDate		= this.ns.toDateTimeString(0);
					this.params.saveEvent.push(record);
				}else if(record.edited && record.deleted){ 
					this.params.deleteEvent.push(record);	
				}
			}
		}

		console.log(this.params);

		this.passData.tableData.forEach(function(tblData){
			if(tblData.isNew != true){
				saveEvent.forEach(function(sEData){
					if(tblData.eventDesc.toString().toUpperCase() == sEData.eventDesc.toString().toUpperCase()){
						if(sEData.isNew === true){
							isNotUnique = true;	
						}
					}
				});
			}
		});


		if(isEmpty == 1){
	        this.dialogIcon = 'error';
            this.success.open();
	        this.params.saveEvent 	= [];
		}else{
			if(isNotUnique == true){
                this.warnMsg = 'Unable to save the record. Claim Event must be unique.';
				this.showWarnLov();
				this.params.saveEvent 	= [];
			}else{
				if(this.params.saveEvent.length == 0 && this.params.deleteEvent.length == 0){
					$('.ng-dirty').removeClass('ng-dirty');
					this.cs.confirmModal();
					this.params.saveEvent 	= [];
					this.params.deleteEvent 	= [];
					this.passData.tableData = this.passData.tableData.filter(a => a.eventDesc != '');
				}else{
					if(this.cancelFlag == true){
                        this.cs.showLoading(true);
                        setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
                    }else{
                        this.cs.confirmModal();
                    }
				}	
			}
		}
	}

	onRowClick(event){
		if(event != null){
	       	this.passData.disableGeneric = false;
	       	this.rowData = event;
	       	this.mtnClmEventData.createUser = event.createUser;
	       	this.mtnClmEventData.createDate = event.createDate;
	       	this.mtnClmEventData.updateUser = event.updateUser;
	       	this.mtnClmEventData.updateDate = event.updateDate;
	    }else{
	       	this.passData.disableGeneric = true;
	       	this.mtnClmEventData.createUser = '';
	       	this.mtnClmEventData.createDate = '';
	       	this.mtnClmEventData.updateUser = '';
	       	this.mtnClmEventData.updateDate = '';
	    }
	}

	onDeleteMtnClmEvent(){
		if(this.table.indvSelect.okDelete == 'N'){
	  		this.warnMsg = 'You are not allowed to delete a Claim Event that is already used in claim processing.';
			this.showWarnLov();
	  	}else{
	  		this.table.indvSelect.deleted = true;
	  		this.table.selected  = [this.table.indvSelect]
	  		this.table.confirmDelete();
	  	}
	}

    setEventType(data){
    	this.table.onRowClick(null, this.passData.tableData[this.rowData.index]);
    	this.rowData.eventTypeCd = data.eventTypeCd;
    	this.ns.lovLoader(data.ev, 0);
        this.rowData.index == undefined?'':this.passData.tableData[this.rowData.index].edited = true;
        $('.lovInput').addClass('ng-dirty');
    }

    checkCode(event){
    	if(event.key != undefined){
    		this.ns.lovLoader(event.ev, 1);
	        if(event.key.toUpperCase() == 'EVENTTYPECD'){
	        	this.clmEventTypeLov.checkCode(this.rowData.eventTypeCd.toUpperCase(), event.ev);
	        }
    	}else{
    		
    	}
    }

    showLOV(event){
        if(event.key.toUpperCase() == 'EVENTTYPECD'){
        	$('#eventTypeLov #modalBtn').trigger('click');
        }
    }

    onClickNo(){
    	this.params.saveEvent = [];
    }

	cancel(){
  	  	this.cancelBtn.clickCancel();
	}

	showWarnLov(){
		$('#warnMdl > #modalBtn').trigger('click');
	}

	onClickAdd(){
		this.passData.tableData.map((d,i) => { d.index = i; return d;});
	}

	checkCancel(){
		if(this.cancelFlag == true){
			if(this.passData.tableData.some(i => i.fromCancel == false)){
                return;
            }else{
                this.cancelBtn.onNo();
            }
		}
	}
}
