import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-loss-cd',
  templateUrl: './mtn-loss-cd.component.html',
  styleUrls: ['./mtn-loss-cd.component.css']
})
export class MtnLossCdComponent implements OnInit {
	@ViewChild('mdl') modal : ModalComponent;
	selected: any = null;

	lossCd: any = {
		tableData: [],
	    tHeader: ['Loss Code','Abbreviation','Description'],
	    dataTypes: ['sequence-3', 'text','text'],
	    pageLength: 10,
	    searchFlag: true,
	    pageStatus: true,
	    pagination: true,
	    fixedCol: false,
	    pageID: 'lossCd'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
	    keys:[
	    	'lossCd',
	    	'lossAbbr',
	    	'lossDesc'
	    	]
	};

	@ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
	@Output() cancelBtn: EventEmitter<any> = new EventEmitter();
	@Output() selectedData: EventEmitter<any> = new EventEmitter();

	@Input() filters: any = null;
	@Input() lovCheckBox: boolean = false;
	selects: any[] = [];
	fromInput: boolean = false;

	constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		setTimeout(() => { this.table.refreshTable(); }, 0);

		if(this.lovCheckBox){
	    	this.lossCd.checkFlag = true;
	    }
	}

	onRowClick(data){ 
	    if(Object.entries(data).length === 0 && data.constructor === Object){  
		    this.selected = null;
	    } else {
	    	this.selected = data;
		}
    }

    confirm(){
	    if(!this.lovCheckBox){
	    	this.selected['fromLOV'] = true;
	    	this.selectedData.emit(this.selected);
	    	this.selected = null;
	    }
	    else{
	    	for(var i = 0; i < this.lossCd.tableData.length; i++){
	        	if(this.lossCd.tableData[i].checked){
	        		this.selects.push(this.lossCd.tableData[i]);
	        	}
	      }
	      this.selectedData.emit(this.selects);
	      this.selects = [];
	    }
    }

    openModal() {
    	if(!this.fromInput) {
    		this.lossCd.tableData = [];
	    	this.table.overlayLoader = true;
	    	this.maintenanceService.getMtnLossCode([]).subscribe(data =>{
	        	var records = data['lossCd'];
	        	if(this.filters != null) {
	        		records = records.filter(this.filters);
	        	}
	        	
	            this.lossCd.tableData = records;
	        	this.table.refreshTable();
	      	});
    	} else {
    		this.fromInput = false;
    	}
    	
 	}

 	cancel() {
		this.cancelBtn.next();
	}

	checkCode(lossCd, str, ev, code?) {
		var obj = {
			lossCd: '',
		  	lossAbbr: '',
		  	lossDesc: ''
		}

		if(str === '') {
			obj['lossCdType'] = lossCd;
			obj['ev'] = ev;
			obj['singleSearchLov'] = true;

			this.selectedData.emit(obj);
		} else if(code != undefined) {
			this.maintenanceService.getMtnLossCode(str).subscribe(data => {
				if(data['lossCd'].length == 1) {
					obj = data['lossCd'][0];
					obj['lossCdType'] = lossCd;
					obj['ev'] = ev;
					obj['singleSearchLov'] = true;

					this.selectedData.emit(obj);
				} else {
					obj['lossCdType'] = lossCd;
					obj['ev'] = ev;
					obj['singleSearchLov'] = true;

					this.selectedData.emit(obj);
					this.modal.openNoClose();
				}
			});
		} else {
			this.maintenanceService.getMtnLossCodeLov(lossCd, str).subscribe(data => {
				if(data['lossCdList'].length == 1) {
					obj = data['lossCdList'][0];
					obj['lossCdType'] = lossCd;
					obj['ev'] = ev;
					obj['singleSearchLov'] = true;

					this.selectedData.emit(obj);
				} else if(data['lossCdList'].length > 1) {
					this.fromInput = true;

					obj['lossCdType'] = lossCd;
					obj['ev'] = ev;
					obj['singleSearchLov'] = true;

					this.selectedData.emit(obj);

					this.lossCd.tableData = data['lossCdList'].filter(a => a.activeTag == 'Y');
					this.table.refreshTable();

					this.modal.openNoClose();
				} else {
					obj['lossCdType'] = lossCd;
					obj['ev'] = ev;
					obj['singleSearchLov'] = true;

					this.selectedData.emit(obj);
					this.modal.openNoClose();
				}
			});
		}
	}
}
