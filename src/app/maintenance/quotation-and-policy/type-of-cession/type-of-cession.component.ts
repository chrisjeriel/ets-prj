import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService, QuotationService } from '@app/_services';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-type-of-cession',
  templateUrl: './type-of-cession.component.html',
  styleUrls: ['./type-of-cession.component.css']
})
export class TypeOfCessionComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
    @ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

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
			var rec = data['cession'];
			this.passData.tableData = rec;
			this.table.refreshTable();
			this.table.onRowClick(null, this.passData.tableData[0]);
		});
	}

	onSaveTypeOfCession(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.dialogIcon = '';
		this.dialogMessage = '';
		var isNotUnique : boolean ;
		var saveTypeOfCession = this.params.saveTypeOfCession;
		var isEmpty = 0;

		for(let record of this.passData.tableData){
			console.log(record);
			if(record.cessionAbbr === null || record.description === null){
				if(!record.deleted){
					isEmpty = 1;
				}
			}else{
				if(record.edited && !record.deleted){
					record.createUser		= (record.createUser === '' || record.createUser === undefined)?this.ns.getCurrentUser():record.createUser;
					record.createDate		= (record.createDate === '' || record.createDate === undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
					record.updateUser		= this.ns.getCurrentUser();
					record.updateDate		= this.ns.toDateTimeString(0);
					
					this.params.saveTypeOfCession.push(record);
				}else if(record.edited && record.deleted){
					this.params.deleteTypeOfCession.push(record);
				}
			}
		}

		if(isEmpty == 1){
			setTimeout(()=>{
                $('.globalLoading').css('display','none');
                this.dialogIcon = 'error';
                $('app-sucess-dialog #modalBtn').trigger('click');
                this.params.saveTypeOfCession 	= [];
            },500);
		}else{
			if(this.params.saveTypeOfCession.length == 0 && this.params.deleteTypeOfCession.length == 0){
				setTimeout(()=>{
					$('.globalLoading').css('display','none');
					this.dialogIcon = 'info';
					this.dialogMessage = 'Nothing to save.';
					$('app-sucess-dialog #modalBtn').trigger('click');
					this.params.saveTypeOfCession 	= [];
					this.passData.tableData = this.passData.tableData.filter(a => a.cessionAbbr != '');
				},500);
			}else{
				this.mtnService.saveMtnTypeOfCession(JSON.stringify(this.params))
				.subscribe(data => {
					console.log(data);
					this.getTypeofCession();
					$('app-sucess-dialog #modalBtn').trigger('click');
					this.params.saveTypeOfCession 	= [];
					this.passData.disableGeneric = true;
				});
			}	
		}
	}

	onRowClick(event){
		if(event !== null){
			this.cessionData.updateDate  = this.ns.toDateTimeString(event.updateDate);
	        this.cessionData.updateUser  = event.updateUser;
	        this.cessionData.createDate  = this.ns.toDateTimeString(event.createDate);
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

	onClickSave(){
	    $('#confirm-save #modalBtn2').trigger('click');
	}

	showWarnLov(){
		$('#warnMdl > #modalBtn').trigger('click');
	}

}
