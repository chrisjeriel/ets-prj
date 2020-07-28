import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService, QuotationService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { MtnClmEventTypeLovComponent } from '@app/maintenance/mtn-clm-event-type-lov/mtn-clm-event-type-lov.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';

@Component({
  selector: 'app-adjuster-rate',
  templateUrl: './adjuster-rate.component.html',
  styleUrls: ['./adjuster-rate.component.css']
})
export class AdjusterRateComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table		: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn 			: CancelButtonComponent;
	@ViewChild(ModalComponent) modal						: ModalComponent;
	@ViewChild(ConfirmSaveComponent) cs 					: ConfirmSaveComponent;
	@ViewChild(SucessDialogComponent) success   			: SucessDialogComponent;

	passData: any = {
        tableData            : [],
        tHeader              : ['Adj Rate ID', 'Rate (%)','Effective From','Active','Remarks'],
        dataTypes            : ['sequence-5','percent','date','checkbox','text'],
        nData:
        {
            adjRateId: 		'',
			adjRate: 		'',
			effDateFrom: 	'',
			activeTag: 		'N',
			remarks: 		'',
            isNew		  	: true
        },
        paginateFlag        : true,
        infoFlag            : true,
        searchFlag          : true,
        pageLength          : 10,
        addFlag             : true,
        genericBtn			: 'Delete',
		disableGeneric 		: true,
        keys                : ['adjRateId','adjRate','effDateFrom','activeTag','remarks'],
        uneditable          : [true,false,false,false,false],
        pageID              : 'mtn-adj-rate',
        widths				: [100,'auto','auto',70,400]
    };

    mtnAdjRateData : any = {
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
		saveAdjusterRate 	: [],
		deleteAdjusterRate  : []
	};

	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns : NotesService, private quotationService: QuotationService, public modalService : NgbModal) { }

	ngOnInit() {
		this.titleService.setTitle('Mtn | Claim Adjuster Rate');
		this.getMtnAdjRate();
  	}

  	getMtnAdjRate(){
		this.passData.tableData = [];
		this.mtnService.getMtnAdjRate('')
		.subscribe(data => {
			console.log(data);
			var rec = data['adjusterRateList'].map((i,idx) => { i.createDate = this.ns.toDateTimeString(i.createDate); i.updateDate = this.ns.toDateTimeString(i.updateDate); i.index = idx; return i} );
			this.passData.tableData = rec;
			this.table.refreshTable();
			this.table.onRowClick(null, this.passData.tableData[0]);
		});
	}

	onSaveMtnAdjRate(){
	   	this.mtnService.saveMtnAdjusterRate(JSON.stringify(this.params))
		.subscribe(data => {
			console.log(data);
			this.getMtnAdjRate();
			this.success.open();
			this.params.saveAdjusterRate 	= [];
			this.params.deleteAdjusterRate  = [];
			this.passData.disableGeneric = true;
		});
	}

	onClickSave(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.dialogIcon = '';
		this.dialogMessage = '';
		//var isNotUnique : boolean ;
		//var saveEvent = this.params.saveEvent;
		var isEmpty = 0;

		for(let record of this.passData.tableData){
			console.log(record);
			if(record.adjRate == '' || record.adjRate == null || record.effDateFrom == '' || record.effDateFrom == null){
				if(!record.deleted){
					isEmpty = 1;
					record.fromCancel = false;
				}else{
					this.params.deleteAdjusterRate.push(record);
				}
			}else{
				record.fromCancel = true;
				if(record.edited && !record.deleted){
					record.effDateFrom		= (record.effDateFrom == '' || record.effDateFrom == null)? '' : this.ns.toDateTimeString(record.effDateFrom);
					record.createUser		= (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
					record.createDate		= (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
					record.updateUser		= this.ns.getCurrentUser();
					record.updateDate		= this.ns.toDateTimeString(0);
					this.params.saveAdjusterRate.push(record);
				}else if(record.edited && record.deleted){ 
					this.params.deleteAdjusterRate.push(record);	
				}
			}
		}

		console.log(this.params);

		// this.passData.tableData.forEach(function(tblData){
		// 	if(tblData.isNew != true){
		// 		saveEvent.forEach(function(sEData){
		// 			if(tblData.eventDesc.toString().toUpperCase() == sEData.eventDesc.toString().toUpperCase()){
		// 				if(sEData.isNew === true){
		// 					isNotUnique = true;	
		// 				}
		// 			}
		// 		});
		// 	}
		// });


		if(isEmpty == 1){
	        this.dialogIcon = 'error';
            this.success.open();
	        this.params.saveAdjusterRate 	= [];
		}else{
			// if(isNotUnique == true){
   //              this.warnMsg = 'Unable to save the record. Claim Event must be unique.';
			// 	this.showWarnLov();
			// 	this.params.saveAdjusterRate 	= [];
			// }else{
				if(this.params.saveAdjusterRate.length == 0 && this.params.deleteAdjusterRate.length == 0){
					$('.ng-dirty').removeClass('ng-dirty');
					this.cs.confirmModal();
					this.params.saveAdjusterRate 	= [];
					this.params.deleteAdjusterRate 	= [];
					//this.passData.tableData = this.passData.tableData.filter(a => a.eventDesc != '');
				}else{
					if(this.cancelFlag == true){
                        this.cs.showLoading(true);
                        setTimeout(() => { try{this.cs.onClickYes();}catch(e){}},500);
                    }else{
                        this.cs.confirmModal();
                    }
				}	
		//	}
		}
	}


	onRowClick(event){
		console.log(event);
		
		if(event != null){
	       	//this.passData.disableGeneric = false;
	       	this.rowData = event;
	       	this.mtnAdjRateData.createUser = event.createUser;
	       	this.mtnAdjRateData.createDate = event.createDate;
	       	this.mtnAdjRateData.updateUser = event.updateUser;
	       	this.mtnAdjRateData.updateDate = event.updateDate;
	       	
	       	this.passData.disableGeneric = (event.okDelete == 'N')? true:false;
			
	    }else{
	       	this.passData.disableGeneric = true;
	       	this.mtnAdjRateData.createUser = '';
	       	this.mtnAdjRateData.createDate = '';
	       	this.mtnAdjRateData.updateUser = '';
	       	this.mtnAdjRateData.updateDate = '';
	    }
	}

	onDeleteMtnAdjRate(){
		if(this.table.indvSelect.okDelete == 'N'){
	  		//this.warnMsg = 'You are not allowed to delete an Adjuster\'s Rate that is already used in claim processing.';
			//this.showWarnLov();
	  	}else{
	  		this.table.indvSelect.deleted = true;
	  		this.table.selected  = [this.table.indvSelect]
	  		this.table.confirmDelete();
	  	}
	}

	onClickNo(){
    	this.params.saveAdjusterRate = [];
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
