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
	selector: 'app-pol-mx-line',
	templateUrl: './pol-mx-line.component.html',
	styleUrls: ['./pol-mx-line.component.css']
})
export class PolMxLineComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;
	@ViewChild('tabset') tabset: any;

	passData: any = {
		tableData:[],
		tHeader				:["Line Code", "Description", "Cut-off Time","Active", "With CAT","Renewal",  "Open Cover", "ALOP", "Ref", "Sort Seq", "Remarks"],
		dataTypes			:["pk-cap", "text", "time", "checkbox", "checkbox", "checkbox", "checkbox", "checkbox", "number", "number", "text", "time-string"],
		nData:{ 
			newRec			: 1,
			lineCd          : '',
			description     : '',
			cutOffTime      : '',
			activeTag       : 'Y',
			catTag          : 'N',
			renewalTag      : 'N',
			openCoverTag    : 'N',	
			alopTag         : 'N',
			referenceNo     : '',
			sortSeq         : '',
			remarks         : '',
			isNew			: true,
			timeString		: ''
		},
		addFlag				: true,
		genericBtn			:'Delete',
		disableGeneric 		: true,
		searchFlag          : true,
		paginateFlag		: true,
		infoFlag			: true,
		pageLength			: 10,
		resizable			: [true, true, true, false, true, true, false,true, true,true,true],
		uneditable			: [false,false,false,false,false,false,false,false,false,false,false],
		widths				: ['auto','350',1,1,1,1,1,1,'auto','auto','auto'],
		pageID				: 'line-mtn-line',
		mask: {
	  		lineCd		: 'AAAAAAA',
	  	},
	  	limit: {
	  		description : 100,
	  		referenceNo : 4,
	  		sortSeq		: 3,
	  		remarks		: 100
	  	},
		keys				: ['lineCd','description','cutOffTime','activeTag','catTag','renewalTag','openCoverTag','alopTag','referenceNo','sortSeq','remarks','timeString'],
	};

	cancelFlag				: boolean;
	fromCancel				: boolean;
	dialogIcon				: string;
	dialogMessage			: string;
	arrLineCd     			: any     	= [];
	warnMsg					: string 	= '';

    params : any =	{
		saveLine 		: [],
		deleteLine 		: []
	};

	saveMtnLine:any = {
		activeTag		: false,
		alopTag			: false,
		catTag			: false,
		createDate		: "",
		createUser		: "",
		cutOffTime		: "",
		deleteMtnLine	: "",
		description		: "",
		lineCd			: "",
		openCoverTag	: false,
		referenceNo		: "",
		remarks			: "",
		renewalTag		: false,
		sortSeq			: "",
		updateDate		: "",
		updateUser		: "",
	};

	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal, private quotationService: QuotationService) { }

	ngOnInit() {
		this.titleService.setTitle('Mtn | Line');
		this.getMtnLine();

	}

	onSaveMtnLine(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.dialogIcon = '';
		this.dialogMessage = '';
		var isNotUnique : boolean ;
		var saveLine = this.params.saveLine;
		var isEmpty = 0;
		
		for(let record of this.passData.tableData){
			if(record.lineCd === '' || record.lineCd === null || record.description === '' || record.description === null || record.cutOffTime === '' || record.cutOffTime === null){
				if(!record.deleted){
					isEmpty = 1;
					this.fromCancel = false;
				}else{
					console.log('WOWW entered herereerrererere');
					this.params.deleteLine.push(record);
				}
			}else{
				this.fromCancel = true;
				if(record.edited && !record.deleted){
					record.createUser		= (record.createUser == '' || record.createUser == undefined)?this.ns.getCurrentUser():record.createUser;
					record.createDate		= (record.createDate == '' || record.createDate == undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(record.createDate);
					record.updateUser		= this.ns.getCurrentUser();
					record.updateDate		= this.ns.toDateTimeString(0);
					record.saveCutOffTime	= this.ns.toDateTimeString(0).split('T')[0]+'T'+record.cutOffTime;
					this.params.saveLine.push(record);
				}else if(record.edited && record.deleted){
					this.params.deleteLine.push(record);
				}
			}
		}

		this.passData.tableData.forEach(function(tblData){
			if(tblData.isNew != true){
				saveLine.forEach(function(slData){
					if(tblData.lineCd.toString().toUpperCase() == slData.lineCd.toString().toUpperCase()){
						if(slData.isNew === true){
							isNotUnique = true;	
						}
					}
				});
			}
		});

		if(isNotUnique == true){
			setTimeout(()=>{
                $('.globalLoading').css('display','none');
                this.warnMsg = 'Unable to save the record. Line Code must be unique.';
				this.showWarnLov();
				this.params.saveLine 	= [];
            },500);
		}else{
			if(isEmpty == 1){
				setTimeout(()=>{
                    $('.globalLoading').css('display','none');
                    this.dialogIcon = 'error';
                    $('app-sucess-dialog #modalBtn').trigger('click');
                    this.params.saveLine 	= [];
                },500);
			}else{
				if(this.params.saveLine.length == 0 && this.params.deleteLine.length == 0){
					setTimeout(()=>{
						$('.globalLoading').css('display','none');
						this.dialogIcon = 'info';
						this.dialogMessage = 'Nothing to save.';
						$('app-sucess-dialog #modalBtn').trigger('click');
						this.params.saveLine 	= [];
						this.passData.tableData = this.passData.tableData.filter(a => a.lineCd != '');
					},500);
				}else{
					this.mtnService.saveMtnLine(JSON.stringify(this.params))
					.subscribe(data => {
						console.log(data);
						this.getMtnLine();
						$('app-sucess-dialog #modalBtn').trigger('click');
						this.params.saveLine 	= [];
						this.passData.disableGeneric = true;
					});
				}	
			}
		}

	}

	getMtnLine(){
		this.passData.tableData = [];
		this.mtnService.getLineLOV('')
		.subscribe(data => {
			console.log(data);
			this.passData.tableData = [];
			var rec = data['line'].map(i => {
				i.createDate = this.ns.toDateTimeString(i.createDate);
				i.updateDate = this.ns.toDateTimeString(i.updateDate);
				var cutOffTimeString = i.cutOffTime.split(':');
				if(Number(cutOffTimeString[0] < 12)){
					cutOffTimeString[0] =Number(cutOffTimeString[0]) == 0 ?'12': cutOffTimeString[0];
					i.timeString = cutOffTimeString[0] + ':' + cutOffTimeString[1] + ' AM';
				}else if(Number(cutOffTimeString[0] >= 12)){
					cutOffTimeString[0] =Number(cutOffTimeString[0]) == 12 ? cutOffTimeString[0] : String(Number(cutOffTimeString[0])-12).padStart(2,'0');
					i.timeString = cutOffTimeString[0] + ':' + cutOffTimeString[1] + ' PM';
				}
				return i;
			});
			this.passData.tableData = rec;
			this.table.refreshTable();
			this.table.onRowClick(null, this.passData.tableData[0]);
		});
	}

	cancel(){
		this.cancelBtn.clickCancel();
	}

	onClickSave(){
		$('#confirm-save #modalBtn2').trigger('click');
	}

	onRowClick(event){
		if(event !== null){
			this.saveMtnLine.lineCd		 = event.lineCd;
			this.saveMtnLine.updateDate  = event.updateDate;
	        this.saveMtnLine.updateUser  = event.updateUser;
	        this.saveMtnLine.createDate  = event.createDate;
	        this.saveMtnLine.createUser  = event.createUser;
	       	this.passData.disableGeneric = false;
		}else{
			this.saveMtnLine.updateDate  = '';
	        this.saveMtnLine.updateUser  = '';
	        this.saveMtnLine.createDate  = '';
	        this.saveMtnLine.createUser  = '';
			this.passData.disableGeneric = true;
		}
	}

	showWarnLov(){
		$('#warnMdl > #modalBtn').trigger('click');
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

	onDeleteLine(){
		if(this.table.indvSelect.okDelete == 'N'){
	  		this.warnMsg = 'You are not allowed to delete a Line that is already used in quotation processing.';
			this.showWarnLov();
	  	}else{
	  		this.table.indvSelect.deleted = true; 
	  		this.table.selected  = [this.table.indvSelect]
	  		this.table.confirmDelete();
	  		console.log('from onDeleteLine else');
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
