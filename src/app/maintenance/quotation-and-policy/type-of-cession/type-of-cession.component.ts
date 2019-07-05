import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService, QuotationService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-type-of-cession',
  templateUrl: './type-of-cession.component.html',
  styleUrls: ['./type-of-cession.component.css']
})
export class TypeOfCessionComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
    @ViewChild(ConfirmSaveComponent) cs 		: ConfirmSaveComponent;
	@ViewChild(SucessDialogComponent) success   : SucessDialogComponent;

	passData: any = {
        tableData            : [],
        tHeader              : ['Cession No', 'Type of Cession', 'Description','Active','Remarks'],
        dataTypes            : ['number','text','text','checkbox','text'],
        nData:
        {
            cessionId	: null,
            cessionAbbr : null,
            description : null,
            activeTag   : 'N',
            remarks    	: null
        },
        limit: {
	  		cessionAbbr : 10,
	  		description : 50,
	  		remarks		: 100
	  	},
        paginateFlag        : true,
        infoFlag            : true,
        searchFlag          : true,
        pageLength          : 10,
        addFlag             : true,
        genericBtn			:'Delete',
		disableGeneric 		: true,
        keys                : ['cessionId','cessionAbbr','description','activeTag','remarks'],
        uneditable          : [true,false,false,false,false],
        pageID              : 'mtn-cession',
        widths              : [1,'auto','auto',1,'550']

    };

    cessionData : any = {
    	updateDate : null,
        updateUser : null,
        createDate : null,
        createUser : null,
    }

    dialogIcon		: string = '';
    dialogMessage	: string = '';
    cancelFlag      : boolean;
    warnMsg			: string = '';
    type			: string = '';

    params : any =	{
		saveTypeOfCession 	: [],
		deleteTypeOfCession : []
	};

  	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns : NotesService, private quotationService: QuotationService, private modalService : NgbModal) { }

	ngOnInit() {
		this.titleService.setTitle('Mtn | Type of Cession'); 
		this.getTypeofCession();
	}

	getTypeofCession(){
		this.mtnService.getMtnTypeOfCession('')
		.subscribe(data => {
			console.log(data);
			var rec = data['cession'].map(i => { i.createDate = this.ns.toDateTimeString(i.createDate); i.updateDate = this.ns.toDateTimeString(i.updateDate); return i} );
			this.passData.tableData = rec;
			this.table.refreshTable();
			this.table.onRowClick(null, this.passData.tableData[0]);
		});
	}

	onSaveTypeOfCession(){
	    //$('#confirm-save #modalBtn2').trigger('click');
	    this.mtnService.saveMtnTypeOfCession(JSON.stringify(this.params))
		.subscribe(data => {
			console.log(data);
			this.getTypeofCession();
			//$('app-sucess-dialog #modalBtn').trigger('click');
			this.success.open();
			this.params.saveTypeOfCession 	= [];
			this.passData.disableGeneric = true;
		});
	}

	onClickSave(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.dialogIcon = '';
		this.dialogMessage = '';
		var isNotUnique : boolean ;
		var saveTypeOfCession = this.params.saveTypeOfCession;
		var isEmpty = 0;

		for(let record of this.passData.tableData){
			console.log(record);
			if(record.cessionAbbr == '' || record.cessionAbbr == null || record.description == '' || record.description == null){
				if(!record.deleted){
					isEmpty = 1;
					record.fromCancel = false;
				}else{
					this.params.deleteTypeOfCession.push(record);
				}
			}else{
				record.fromCancel = true;
				if(record.edited && !record.deleted){
					record.createUser		= (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
					record.createDate		= (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
					record.updateUser		= this.ns.getCurrentUser();
					record.updateDate		= this.ns.toDateTimeString(0);
					this.params.saveTypeOfCession.push(record);
				}else if(record.edited && record.deleted){
					this.params.deleteTypeOfCession.push(record);
				}
			}
		}

		if(isEmpty == 1){
            this.dialogIcon = 'error';
            this.success.open();
            this.params.saveTypeOfCession 	= [];
		}else{
			if(this.params.saveTypeOfCession.length == 0 && this.params.deleteTypeOfCession.length == 0){
				$('.ng-dirty').removeClass('ng-dirty');
				this.cs.confirmModal();
				this.params.saveTypeOfCession 	= [];
				this.passData.tableData = this.passData.tableData.filter(a => a.cessionAbbr != '');
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

	onRowClick(event){
		if(event !== null){
			this.cessionData.updateDate  = event.updateDate;
	        this.cessionData.updateUser  = event.updateUser;
	        this.cessionData.createDate  = event.createDate;
	        this.cessionData.createUser  = event.createUser;
	        this.passData.disableGeneric = false;
		}else{
			this.cessionData.updateDate  = '';
	        this.cessionData.updateUser  = '';
	        this.cessionData.createDate  = '';
	        this.cessionData.createUser  = '';
			this.passData.disableGeneric = true;
		}
	}

	onDeleteTypeOfCession(){
		if(this.table.indvSelect.okDelete == 'N'){
	  		this.warnMsg = 'You are not allowed to delete a Type of Cession that is already used in quotation processing.';
			this.showWarnLov();
	  	}else{
	  		this.table.indvSelect.deleted = true;
	  		this.table.selected  = [this.table.indvSelect]
	  		this.table.confirmDelete();
	  	}
	}

	cancel(){
  	  	this.cancelBtn.clickCancel();
	}

	showWarnLov(){
		$('#warnMdl > #modalBtn').trigger('click');
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
