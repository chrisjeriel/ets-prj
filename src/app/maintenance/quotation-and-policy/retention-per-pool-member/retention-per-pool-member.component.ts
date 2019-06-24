import { Component, OnInit, ViewChild } from '@angular/core';
import { NotesService, MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { SucessDialogComponent } from '@app/_components/common/sucess-dialog/sucess-dialog.component';
import { ConfirmSaveComponent } from '@app/_components/common/confirm-save/confirm-save.component';
import { CancelButtonComponent } from '@app/_components/common/cancel-button/cancel-button.component';
import { MtnLineComponent } from '@app/maintenance/mtn-line/mtn-line.component';
import { CedingCompanyComponent } from '@app/underwriting/policy-maintenance/pol-mx-ceding-co/ceding-company/ceding-company.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-retention-per-pool-member',
  templateUrl: './retention-per-pool-member.component.html',
  styleUrls: ['./retention-per-pool-member.component.css']
})
export class RetentionPerPoolMemberComponent implements OnInit {
	@ViewChild('historyTable') historyTable: CustEditableNonDatatableComponent;
	@ViewChild('poolMemberTable') poolMemberTable: CustEditableNonDatatableComponent;
	@ViewChild(SucessDialogComponent) successDialog: SucessDialogComponent;
  	@ViewChild(ConfirmSaveComponent) confirmSave: ConfirmSaveComponent;
  	@ViewChild(CancelButtonComponent) cancelBtn: CancelButtonComponent;
  	@ViewChild('cedingCoLOV') cedingCoLOV: CedingCompanyComponent;

  	historyData: any = {
	  	tableData: [],
	  	tHeader: ['History No', '1st Ret Line', '2nd Ret Line', 'Total Ret Line', 'Effective From', 'Active', 'Remarks'],
	  	dataTypes: ['sequence-3', 'number', 'number', 'number', 'date', 'checkbox', 'text'],
	  	keys: ['retHistId', 'retLine1', 'retLine2', 'totalRetLine', 'effDateFrom', 'activeTag', 'remarks'],
	  	uneditable: [true,true,true,true,false,false,false],
	  	uneditableKeys: ['effDateFrom'],
	  	widths: ['1','1','1','1','140','1','auto'],
	  	nData: {
	  		newRec: 1,
	  		retHistId: '',
	  		retLine1: '',
	  		retLine2: '',
	  		totalRetLine: '',
	  		effDateFrom: '',
	  		activeTag: 'Y',
	  		remarks: '',
	  		poolMemberList: [],
	  		createUser: '',
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: false,
	  	pageLength: 5,
	  	pageID: 'historyTab'
  	}

  	poolMemberData: any = {
	  	tableData: [],
	  	tHeader: ['Company No', 'Company Name', '1st Ret Line', '2nd Ret Line'],
	  	dataTypes: ['lovInput-r', 'text', 'number', 'number'],
	  	keys: ['cedingId','cedingName','retLine1','retLine2'],
	  	uneditable: [false,true,false,false],
	  	widths: ['1','auto','1','1'],
	  	nData: {
	  		showMG: 1,
	  		cedingId: '',
	  		cedingName: '',
	  		retLine1: '',
	  		retLine2: '',
	  		createUser: '',
	  		createDate: '',
	  		updateUser: '',
	  		updateDate: ''
  		},
  		paginateFlag: true,
  		infoFlag: true,
  		addFlag: true,
  		searchFlag: true,
    	genericBtn: 'Delete',
    	disableGeneric: true,
	  	disableAdd: true,
	  	pageLength: 20,
	  	magnifyingGlass: ['cedingId'],
	  	pageID: 'poolMemberTab'
  	}

  	params: any = {
  		savePoolRetHist: [],
  		deletePoolRetHist: [],
  		deletePoolMember: []
  	}

  	selected: any = null;
  	historySelected: any = null;
  	poolMemberSelected: any = null;
  	disableCopySetup: boolean = true;
  	cedingCoLOVRow: number;
  	hiddenCedingCo: any[] = [];
  	errorMsg: number = 0;
  	dialogIcon:string = '';
 	dialogMessage: string = '';
 	cancel: boolean = false;

 	copyToEffDate: string = '';

	constructor(private ns: NotesService, private ms: MaintenanceService, private modalService: NgbModal, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle("Mtn | Retention per Pool Member");
		setTimeout(() => {
			this.historyTable.refreshTable();
			this.poolMemberTable.refreshTable();
			
			this.getMtnPoolRetHist();
		}, 0);
	}

	getMtnPoolRetHist() {
		this.historyTable.overlayLoader = true;
		this.ms.getMtnPoolRetHist('').subscribe(data => {
			this.historyData.tableData = data['poolRetHistList'].sort((a, b) => b.effDateFrom - a.effDateFrom)
																.map(i => {
																	i.effDateFrom = this.ns.toDateTimeString(i.effDateFrom);
																	i.createDate = this.ns.toDateTimeString(i.createDate);
																	i.updateDate = this.ns.toDateTimeString(i.updateDate);
																	i.retHistId = String(i.retHistId).padStart(3, '0');
																	return i;
																});
			this.historyTable.refreshTable();
			this.historyTable.onRowClick(null, this.historyData.tableData[0]);
		});
	}

	onHistoryRowClick(data) {
		this.selected = data;
		this.historySelected = data;
		this.historyData.disableGeneric = this.historySelected == null || this.historySelected == '';
		this.disableCopySetup = this.historySelected == null || this.historySelected == '';

		if(data != '' && data != null) {
			this.poolMemberData.uneditable[2] = data.okDelete == 'N';
			this.poolMemberData.uneditable[3] = data.okDelete == 'N';

			this.poolMemberData.tableData = data.poolMemberList.sort((a, b) => a.cedingId - b.cedingId)
															   .map(i => {
															   		i.createDate = this.ns.toDateTimeString(i.createDate);
															   		i.updateDate = this.ns.toDateTimeString(i.updateDate);
															   		return i;
															   });
			this.poolMemberTable.refreshTable();
			this.poolMemberTable.onRowClick(null, this.poolMemberData.tableData[0]);
		} else {
			this.poolMemberData.tableData = [];
			this.poolMemberTable.refreshTable();
			this.poolMemberData.disableAdd = true;
			this.poolMemberData.disableGeneric = true;
		}
	}

	onHistoryClickDelete(ev) {
		if(this.historyTable.indvSelect.okDelete == 'N') {
			this.errorMsg = 1;
			$('#retPerPoolMemberWarningModal > #modalBtn').trigger('click');
		} else {
			if(ev != undefined) {
				this.historyTable.confirmDelete();
			} else {
				this.historyTable.indvSelect.edited = true;
				this.historyTable.indvSelect.deleted = true;
				this.historyTable.refreshTable();

				this.poolMemberData.tableData = [];
				this.poolMemberData.disableAdd = true;
				this.poolMemberData.disableGeneric = true;
				this.poolMemberTable.refreshTable();
			}
		}
		
	}

	onPoolMemberRowClick(data) {
		this.selected = data;
		this.poolMemberSelected = data;
		this.poolMemberData.disableGeneric = this.poolMemberSelected == null || this.poolMemberSelected == '' 
											|| this.historySelected.okDelete == 'N' || this.historySelected == null || this.historySelected == '';
		this.poolMemberData.disableAdd = this.historySelected.okDelete == 'N' || this.historySelected == null || this.historySelected == '';
	}

	onPoolMemberClickDelete(ev) {
		if(ev != undefined) {
			this.poolMemberTable.confirmDelete();
		} else {
			this.poolMemberTable.indvSelect.edited = true;
			this.poolMemberTable.indvSelect.deleted = true;
			this.updateNumbers();
			this.poolMemberTable.refreshTable();
		}
	}

	openCedingCoLOV(ev) {
		this.hiddenCedingCo = this.poolMemberData.tableData.filter(a => a.cedingId !== undefined && !a.deleted && a.showMG != 1).map(a => a.cedingId);
		this.cedingCoLOV.modal.openNoClose();
		this.cedingCoLOVRow = ev.index;
	}

	poolMemberTDataChange(data) {
		this.historyTable.indvSelect.edited = true;
		this.historyTable.markAsDirty();
		this.updateNumbers();

		if(data.hasOwnProperty('lovInput')) {
	    	this.hiddenCedingCo = this.poolMemberData.tableData.filter(a => a.cedingId !== undefined && !a.deleted && a.showMG != 1).map(a => a.cedingId);

	    	data.ev['index'] = data.index;
	    	this.cedingCoLOV.checkCode(data.ev.target.value, data.ev);
	    }
	}

	setSelectedCedingCo(data) {
		if(data.hasOwnProperty('singleSearchLov') && data.singleSearchLov) {
	    	this.cedingCoLOVRow = data.ev.index;
	    	this.ns.lovLoader(data.ev, 0);

	    	if(data.cedingId != '' && data.cedingId != null && data.cedingId != undefined) {
	    		this.poolMemberData.tableData[this.cedingCoLOVRow].showMG = 0;
	    		this.poolMemberData.tableData[this.cedingCoLOVRow].cedingId = data.cedingId;
	    		this.poolMemberData.tableData[this.cedingCoLOVRow].cedingName = data.cedingName;
	    		this.poolMemberData.tableData[this.cedingCoLOVRow].edited = true;
	    	} else {
	    		this.poolMemberData.tableData[this.cedingCoLOVRow].cedingId = '';
	    		this.poolMemberData.tableData[this.cedingCoLOVRow].cedingName = '';
	    		this.poolMemberData.tableData[this.cedingCoLOVRow].edited = true;
	    	}
	    } else {
	    	this.poolMemberData.tableData = this.poolMemberData.tableData.filter(a => a.showMG != 1);
	    	for(let i of data) {
	    		this.poolMemberData.tableData.push(JSON.parse(JSON.stringify(this.poolMemberData.nData)));
	    		this.poolMemberData.tableData[this.poolMemberData.tableData.length - 1].showMG = 0;
	    		this.poolMemberData.tableData[this.poolMemberData.tableData.length - 1].cedingId = i.cedingId;
	    		this.poolMemberData.tableData[this.poolMemberData.tableData.length - 1].cedingName = i.cedingName;
	    		this.poolMemberData.tableData[this.poolMemberData.tableData.length - 1].edited = true;
	    	}
	    }

    	$('#cust-table-container').addClass('ng-dirty');

    	this.poolMemberTable.refreshTable();
	}

	updateNumbers() {
		var rl1 = 0;
		var rl2 = 0;

		this.poolMemberData.tableData.filter(a => !a.deleted && (!isNaN(a.retLine1) || !isNaN(a.retLine2))).forEach(b => {
			rl1 += isNaN(b.retLine1) ? 0 : Number(b.retLine1);
			rl2 += isNaN(b.retLine2) ? 0 : Number(b.retLine2);
		});

		this.historySelected.retLine1 = rl1;
		this.historySelected.retLine2 = rl2;
		this.historySelected.totalRetLine = rl1 + rl2;
	}

	onClickSave() {
		var td = this.historyData.tableData;

		for(let d of td) {
			if(d.edited && !d.deleted && d.effDateFrom == '') {
				this.dialogIcon = 'error';
				this.successDialog.open();

				this.cancel = false;
				return;
			} else if(d.edited && !d.deleted && d.effDateFrom != '' && d.poolMemberList.filter(a => !a.deleted).length == 0) {
				this.errorMsg = 3;
				$('#retPerPoolMemberWarningModal > #modalBtn').trigger('click');

				this.cancel = false;
				return;
			}

			for(let e of d.poolMemberList) {
				if(e.edited && !e.deleted &&
					(e.cedingId == '' || e.retLine1 == '' || e.retLine1 == null || isNaN(e.retLine1) || e.retLine2 == '' || e.retLine2 == null || isNaN(e.retLine2))) {
					this.dialogIcon = 'error';
					this.successDialog.open();

					this.cancel = false;
					return;
				}
			}

			if(d.edited && !d.deleted && d.activeTag == 'Y' && d.retHistId == '') {
				if(td.length > 1) {
					if(td.filter(c => c.activeTag == 'Y' && c.retHistId != '').length > 0) {
						var dEDF = new Date(d.effDateFrom);
						var max = td.filter(c => c.activeTag == 'Y' && c.retHistId != '' && !c.deleted)
									.sort((a, b) => Number(new Date(b.effDateFrom)) - Number(new Date(a.effDateFrom)))[0];

						if(max != d && dEDF <= new Date(max.effDateFrom)) {
							this.errorMsg = 2;
							$('#retPerPoolMemberWarningModal > #modalBtn').trigger('click');
							this.cancel = false;
							return;
						}
					}	
				}

				if(td.filter(c => c.activeTag == 'Y' && c.retHistId == '').length > 1) {
					var newList = td.filter(c => c.activeTag == 'Y' && c.retHistId == '');

					for(var x = 1; x < newList.length; x++) {
						if(new Date(newList[x].effDateFrom) <= new Date(newList[x-1].effDateFrom)) {
							this.errorMsg = 2;
							$('#retPerPoolMemberWarningModal > #modalBtn').trigger('click');
							this.cancel = false;
							return;
						}
					}
				}
			}
		}

		if(!this.cancel) {
			this.confirmSave.confirmModal();	
		} else {
			this.save(false);
		}
	}

	save(cancel?) {
		this.cancel = cancel !== undefined;

		if(this.cancel && cancel) {
			this.onClickSave();
			return;
		}

		this.params.savePoolRetHist = [];
  		this.params.deletePoolRetHist = [];
  		this.params.deletePoolMember = [];

  		var td = this.historyData.tableData;

  		td.forEach(hist => {
  			if(hist.edited && !hist.deleted) {
  				var h1 = false;
  				var h2 = false;
  				var rl1 = 0;
  				var rl2 = 0;

  				hist['createUser'] = this.ns.getCurrentUser();
  				hist['createDate'] = this.ns.toDateTimeString(0);
  				hist['updateUser'] = this.ns.getCurrentUser();
  				hist['updateDate'] = this.ns.toDateTimeString(0);

  				if(hist.edited && !hist.deleted) {
  					h1 = true;
  				} else if(hist.deleted) {
  					this.params.deletePoolRetHist.push(hist);
  				}

  				hist.poolMemberList.forEach(pm => {
  					pm['retHistId'] = hist.retHistId;
  					pm['createUser'] = this.ns.getCurrentUser();
	  				pm['createDate'] = this.ns.toDateTimeString(0);
	  				pm['updateUser'] = this.ns.getCurrentUser();
	  				pm['updateDate'] = this.ns.toDateTimeString(0);

	  				if(pm.edited && !pm.deleted) {
	  					h2 = true;
	  				} else if(pm.deleted) {
	  					this.params.deletePoolMember.push(pm);
	  				}
  				});

  				if(h1 || h2) {
  					hist.poolMemberList.filter(a => !a.deleted).forEach(p => {
  						rl1 += Number(p.retLine1);
  						rl2 += Number(p.retLine2);
  					});

  					hist['retLine1'] = rl1;
  					hist['retLine2'] = rl2;
  					hist['totalRetLine'] = rl1 + rl2;
  					hist.poolMemberList = hist.poolMemberList.filter(x => x.edited && !x.deleted);

  					this.params.savePoolRetHist.push(hist);
  				}

  			} else if(hist.deleted) {
  				this.params.deletePoolRetHist.push(hist);
  			}
  		});

  		this.ms.saveMtnPoolRetHist(this.params).subscribe(data => {
			if(data['returnCode'] == -1) {
				this.dialogIcon = "success";
				this.successDialog.open();
				this.getMtnPoolRetHist();
			} else {
				this.dialogIcon = "error";
				this.successDialog.open();
			}
		});
	}

	onCopySetupClick() {
		$('#mtnPoolRetHistCopyModal > #modalBtn').trigger('click');
	}

	onClickModalCopy() {
		if(this.copyToEffDate == '') {
			this.dialogIcon = "error";
			this.successDialog.open();
			return;
		}

		$('.globalLoading').css('display','block');
		var params = {
			copyFromRetHistId: this.historySelected.retHistId,
			copyToEffDateFrom: this.copyToEffDate,
			createDate: this.ns.toDateTimeString(0),
			createUser: this.ns.getCurrentUser(),
			updateDate: this.ns.toDateTimeString(0),
			updateUser: this.ns.getCurrentUser()
		}

		this.ms.copyPoolRetHist(JSON.stringify(params)).subscribe(data => {
			$('.globalLoading').css('display','none');
			if(data['returnCode'] == -1) {
				$('#mtnPoolRetHistSuccessModal > #modalBtn').trigger('click');
				this.getMtnPoolRetHist();
				this.copyToEffDate = '';
			} else if(data['returnCode'] == 2) {
				this.modalService.dismissAll();
				this.errorMsg = 4;
				this.copyToEffDate = '';
				$('#retPerPoolMemberWarningModal > #modalBtn').trigger('click');
			}
		});
	}
}
