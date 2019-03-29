import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MaintenanceService, NotesService } from '@app/_services';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';


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
		tHeader:["Line Code", "Description", "Cut-off Time","Active", "With CAT","Renewal",  "Open Cover", "ALOP", "Ref", "Sort Seq", "Remarks"],
		dataTypes:["text", "text", "time", "checkbox", "checkbox", "checkbox", "checkbox", "checkbox", "text", "text", "text"],
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
		checkFlag: true,
		addFlag:true,
		deleteFlag:true,
		paginateFlag: true,
		infoFlag: true,
		pageLength:10,
		resizable: [true, true, true, false, true, true, false,true],
		pageID:125,
		keys: ['lineCd','description','cutOffTime','activeTag','catTag','renewalTag','openCoverTag','alopTag','referenceNo','sortSeq','remarks'],
		filters: [
			{
				key: 'lineCd',
				title:'Line Code',
				dataType: 'text'
			},
			{
				key: 'description',
				title:'description',
				dataType: 'text'
			},
			{
				key: 'referenceNo',
				title:'Ref',
				dataType: 'text'
			},
			{
				key: 'sortSeq',
				title:'Sort Seq',
				dataType: 'text'
			}
		]
	};

	cancelFlag:boolean;
  	loading:boolean;

	constructor(private titleService: Title, private mtnService: MaintenanceService, private ns: NotesService) { }

	ngOnInit() {
		this.titleService.setTitle('Mtn | Line');
		this.getMtnLine();
	}

	mtnLineReq :any;

	saveMtnLine:any = {
		activeTag: false,
		alopTag: false,
		catTag: false,
		createDate: "",
		createUser: "",
		cutOffTime: "",
		deleteMtnLine: "",
		description: "",
		lineCd: "",
		openCoverTag: false,
		referenceNo: "",
		remarks: "",
		renewalTag: false,
		sortSeq: "",
		updateDate: "",
		updateUser: "",
	};



	onClickSaveLine(cancelFlag?){
		this.cancelFlag = cancelFlag !== undefined;
		this.loading = true;
		for(var i = 0; this.passData.tableData.length > i; i++){
			var rec = this.passData.tableData[i];
			if(this.passData.tableData[i].edited && !this.passData.tableData[i].deleted){			
				this.mtnLineReq = { 
					"deleteLine": [],
					"saveLine": [
					    {
					      	"activeTag":        this.cbFunc(rec.activeTag),
							"alopTag":      	this.cbFunc(rec.alopTag),
							"catTag":           this.cbFunc(rec.catTag),
							"createDate":       this.ns.toDateTimeString(0),
							"createUser":       JSON.parse(window.localStorage.currentUser).username,
							"cutOffTime":   	this.ns.toDateTimeString(0).split('T')[0] + 'T' + rec.cutOffTime,
							"description":  	rec.description,
							"lineCd":           rec.lineCd,
							"openCoverTag": 	this.cbFunc(rec.openCoverTag),
							"referenceNo":  	rec.referenceNo,
							"remarks":      	rec.remarks,
							"renewalTag":       this.cbFunc(rec.renewalTag),
							"sortSeq":      	rec.sortSeq,
							"updateDate":       this.ns.toDateTimeString(0),
							"updateUser":       JSON.parse(window.localStorage.currentUser).username
					    }
					]
				}

				this.mtnService.saveMtnLine(JSON.stringify(this.mtnLineReq))
				.subscribe(data => {
					this.getMtnLine();
					console.log('ilang beses');
					$('app-sucess-dialog #modalBtn').trigger('click');
					this.loading = false;

				});
			}else if(this.passData.tableData[i].edited && this.passData.tableData[i].deleted){
				this.mtnLineReq = { 
					"deleteLine": [
						 {
					      	"activeTag":        this.cbFunc(rec.activeTag),
							"alopTag":      	this.cbFunc(rec.alopTag),
							"catTag":           this.cbFunc(rec.catTag),
							"createDate":       this.ns.toDateTimeString(0),
							"createUser":       JSON.parse(window.localStorage.currentUser).username,
							"cutOffTime":   	this.ns.toDateTimeString(0).split('T')[0] + 'T' + rec.cutOffTime,
							"description":  	rec.description,
							"lineCd":           rec.lineCd,
							"openCoverTag": 	this.cbFunc(rec.openCoverTag),
							"referenceNo":  	rec.referenceNo,
							"remarks":      	rec.remarks,
							"renewalTag":       this.cbFunc(rec.renewalTag),
							"sortSeq":      	rec.sortSeq,
							"updateDate":       this.ns.toDateTimeString(0),
							"updateUser":       JSON.parse(window.localStorage.currentUser).username
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
			}
		}
	}

	cbFunc(chxbox:boolean){
		return (chxbox === null  || chxbox === false )? 'N' : 'Y';
	}

	getMtnLine(){
		
		this.mtnService.getLineLOV('')
		.subscribe(data => {
			this.passData.tableData = [];
			var rec = data['line'];
			for(let i of rec){
				// this.saveMtnLine.lineCd			= i.lineCd,
				// this.saveMtnLine.description	= i.description,
				// this.saveMtnLine.cutOffTime		= i.cutOffTime,
				// this.saveMtnLine.activeTag		= i.activeTag,
				// this.saveMtnLine.catTag			= i.catTag,
				// this.saveMtnLine.renewalTag		= i.renewalTag,
				// this.saveMtnLine.openCoverTag	= i.openCoverTag,
				// this.saveMtnLine.alopTag		= i.alopTag,
				// this.saveMtnLine.refereneceNo	= i.refereneceNo,
				// this.saveMtnLine.sortSeq		= i.sortSeq,
				// this.saveMtnLine.remarks		= i.remarks,

				this.passData.tableData.push({
					lineCd          : i.lineCd,
					description     : i.description,
					cutOffTime      : i.cutOffTime,
					activeTag       : i.activeTag,
					catTag          : i.catTag,
					renewalTag      : i.renewalTag,
					openCoverTag    : i.openCoverTag,
					alopTag         : i.alopTag,
					referenceNo     : i.refereneceNo,
					sortSeq         : i.sortSeq,
					remarks         : i.remarks
				});
				
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

}
