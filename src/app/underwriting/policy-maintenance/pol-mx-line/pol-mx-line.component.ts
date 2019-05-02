import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { environment } from '@environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-pol-mx-line',
	templateUrl: './pol-mx-line.component.html',
	styleUrls: ['./pol-mx-line.component.css']
})
export class PolMxLineComponent implements OnInit {
	@ViewChild(CustEditableNonDatatableComponent) table: CustEditableNonDatatableComponent;
	@ViewChild(CancelButtonComponent) cancelBtn : CancelButtonComponent;

	passData: any = {
		tableData:[],
		tHeader				:["Line Code", "Description", "Cut-off Time","Active", "With CAT","Renewal",  "Open Cover", "ALOP", "Ref", "Sort Seq", "Remarks"],
		dataTypes			:["text", "text", "time", "checkbox", "checkbox", "checkbox", "checkbox", "checkbox", "text", "text", "text"],
		nData:{
			lineCd          : null,
			description     : null,
			cutOffTime      : null,
			activeTag       : null,
			catTag          : null,
			renewalTag      : null,
			openCoverTag    : null,
			alopTag         : null,
			referenceNo     : null,
			sortSeq         : null,
			remarks         : null,
		},
		checkFlag			: true,
		addFlag				: true,
		deleteFlag			: true,
		paginateFlag		: true,
		infoFlag			: true,
		pageLength			: 10,
		resizable			: [true, true, true, false, true, true, false,true],
		uneditable			: [false,false,false,false,false,false,false,false],
		pageID				: 'line-mtn-line',
		keys				: ['lineCd','description','cutOffTime','activeTag','catTag','renewalTag','openCoverTag','alopTag','referenceNo','sortSeq','remarks'],
	};

	cancelFlag				: boolean;
	loading					: boolean;
	dialogIcon				: string;
	dialogMessage			: string;
	@Input() inquiryFlag	: boolean 	= false;
	successMessage			: string 	= environment.successMessage;
	arrLineCd     			: any     	= [];
	counter					: number;
	mtnLineReq 				: any;

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

	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService,private modalService: NgbModal) { }

	ngOnInit() {
		this.titleService.setTitle('Mtn | Line');
		this.getMtnLine();

		if(this.inquiryFlag){
			this.passData.tHeader.pop();
			this.passData.opts = [];
			this.passData.uneditable = [];
			this.passData.magnifyingGlass = [];
			this.passData.addFlag = false;
			this.passData.deleteFlag = false;
			for(var count = 0; count < this.passData.tHeader.length; count++){
				this.passData.uneditable.push(true);
			}
		}
	}

	onClickSaveLine(cancelFlag?){
		this.counter = 0;
		this.dialogIcon = '';
		this.dialogMessage = '';
		//this.loading = true;
		this.cancelFlag = cancelFlag !== undefined;
		for(var i = 0; this.passData.tableData.length > i; i++){
			var rec = this.passData.tableData[i];
			if(rec.lineCd === '' || rec.lineCd === null || rec.description === '' || rec.description === null){
				setTimeout(()=>{
                    $('.globalLoading').css('display','none');
                    this.dialogIcon = 'error';
                    $('app-sucess-dialog #modalBtn').trigger('click');
                },500);
			}else{
				if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){
					for(var k = 0; k < this.arrLineCd.length; k++){
						if(rec.lineCd === this.arrLineCd[k]){
							rec = this.passData.tableData[k];
							break;
						}else{
							rec = this.passData.tableData[i];
						}
					}
					this.mtnLineReq = { 
						"deleteLine": [],
						"saveLine": [
						{
							"activeTag"		: (rec.activeTag === '' || rec.activeTag === null || rec.activeTag === undefined)?this.cbFunc(rec.activeTag):rec.activeTag,
							"alopTag"		: (rec.alopTag === '' || rec.alopTag === null || rec.alopTag === undefined)?this.cbFunc(rec.alopTag):rec.alopTag,
							"catTag"		: (rec.catTag === '' || rec.catTag === null || rec.catTag === undefined)?this.cbFunc(rec.catTag):rec.catTag,
							"createDate"	: (rec.createDate === '' || rec.createDate === null || rec.createDate === undefined)?this.ns.toDateTimeString(0):this.ns.toDateTimeString(rec.createDate),
							"createUser"	: (rec.createUser === '' || rec.createUser === null || rec.createUser === undefined)?JSON.parse(window.localStorage.currentUser).username:rec.createUser,
							"cutOffTime"	: this.cutOffTimeFunc(rec.cutOffTime),
							"description"	: rec.description,
							"lineCd"		: rec.lineCd,
							"openCoverTag"	: (rec.openCoverTag === '' || rec.openCoverTag === null || rec.openCoverTag === undefined)?this.cbFunc(rec.openCoverTag):rec.openCoverTag,
							"referenceNo"	: rec.referenceNo,
							"remarks"		: rec.remarks,
							"renewalTag"	: (rec.renewalTag === '' || rec.renewalTag === null || rec.renewalTag === undefined)?this.cbFunc(rec.renewalTag):rec.renewalTag,
							"sortSeq"		: rec.sortSeq,
							"updateDate"	: this.ns.toDateTimeString(0),
							"updateUser"	: JSON.parse(window.localStorage.currentUser).username
						}
						]
					}

					this.mtnService.saveMtnLine(JSON.stringify(this.mtnLineReq))
					.subscribe(data => {
						this.getMtnLine();
						$('app-sucess-dialog #modalBtn').trigger('click');
						this.loading = false;
					});	

				}else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
					console.log('delete');
					this.mtnLineReq = { 
						"deleteLine": [
						{
							"activeTag"		: this.cbFunc(rec.activeTag),
							"alopTag"		: this.cbFunc(rec.alopTag),
							"catTag"		: this.cbFunc(rec.catTag),
							"createDate"	: this.ns.toDateTimeString(0),
							"createUser"	: JSON.parse(window.localStorage.currentUser).username,
							"cutOffTime"	: this.ns.toDateTimeString(0).split('T')[0] + 'T' + rec.cutOffTime,
							"description"	: rec.description,
							"lineCd"		: rec.lineCd,
							"openCoverTag"	: this.cbFunc(rec.openCoverTag),
							"referenceNo"	: rec.referenceNo,
							"remarks"		: rec.remarks,
							"renewalTag"	: this.cbFunc(rec.renewalTag),
							"sortSeq"		: rec.sortSeq,
							"updateDate"	: this.ns.toDateTimeString(0),
							"updateUser"	: JSON.parse(window.localStorage.currentUser).username
						}
						],
						"saveLine": []
					}

					this.mtnService.saveMtnLine(JSON.stringify(this.mtnLineReq))
					.subscribe(data => {
						this.getMtnLine();
						$('app-sucess-dialog #modalBtn').trigger('click');
						this.loading = false;
					});
				}else{
					this.counter++;
				}
			}

		}
		if(this.passData.tableData.length === this.counter){
			setTimeout(()=>{
				$('.globalLoading').css('display','none');
				this.dialogIcon = 'info';
				this.dialogMessage = 'Nothing to save.';
				$('app-sucess-dialog #modalBtn').trigger('click');
			},500);
		}
	}

	cbFunc(chxbox:boolean){
		return (chxbox === null  || chxbox === false )? 'N' : 'Y';
	}

	getMtnLine(){
		this.passData.tableData = [];
		this.arrLineCd = [];
		this.mtnService.getLineLOV('')
		.subscribe(data => {
			this.passData.tableData = [];
			this.arrLineCd = [];
			var rec = data['line'];
			this.passData.tableData = rec;
			for(let i of rec){
				this.arrLineCd.push(i.lineCd);
			}
			this.table.refreshTable();
		});
	}

	cancel(){
		this.cancelBtn.clickCancel();
	}

	onClickSave(){
		$('#confirm-save #modalBtn2').trigger('click');
	}

	cutOffTimeFunc(cutOffTime){
		if(cutOffTime === null){
			return this.ns.toDateTimeString(0).split('T')[0] + 'T' + '00:00:00';
		}else {
			if((String(cutOffTime)).includes(':')){
				return this.ns.toDateTimeString(0).split('T')[0] + 'T' + cutOffTime;
			}else{
				return this.ns.toDateTimeString(cutOffTime);
			}
		}
	}

}
