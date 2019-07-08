import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-clm-event-type',
  templateUrl: './mtn-clm-event-type.component.html',
  styleUrls: ['./mtn-clm-event-type.component.css']
})
export class MtnClmEventTypeComponent implements OnInit {

	@ViewChild('mdl') modal : ModalComponent;
	selected: any = null;

	clmEventType: any = {
		tableData: [],
	    tHeader: ['Event Type Code','Description'],
	    dataTypes: ['text','text'],
	    colSize: ['40px', '100px'],
	    pageLength: 10,
	    searchFlag: true,
	    pageStatus: true,
	    pagination: true,
	    fixedCol: false,
	    pageID: 'clmEventType'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
	    keys:[
	    	'eventTypeCd',
	    	'eventTypeDesc'
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
	    	this.clmEventType.checkFlag = true;
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
	    	for(var i = 0; i < this.clmEventType.tableData.length; i++){
	        	if(this.clmEventType.tableData[i].checked){
	        		this.selects.push(this.clmEventType.tableData[i]);
	        	}
	      }
	      this.selectedData.emit(this.selects);
	      this.selects = [];
	    }
    }

    openModal(){
    	if(!this.fromInput) {
	    	this.clmEventType.tableData = [];
	    	this.table.overlayLoader = true;
	    	this.maintenanceService.getMtnClmEventType('').subscribe(data =>{
	        	var records = data['eventTypeList'];
	        	if(this.filters != null) {
	        		records = records.filter(this.filters);
	        	}
	        	
	            this.clmEventType.tableData = records;
	        	this.table.refreshTable();
	      	});
    	} else {
    		this.fromInput = false;
    	}
 	}

 	cancel() {
		this.cancelBtn.next();
	}

	checkCode(str, ev) {
		var obj = {
			eventTypeCd: '',
		  	eventTypeDesc: ''
		}

		if(str === ''){
			obj['ev'] = ev;
			obj['singleSearchLov'] = true;

			this.selectedData.emit(obj);
		} else {
			this.maintenanceService.getMtnClmEventTypeLov(str).subscribe(data => {
				if(data['clmEventTypeList'].length == 1) {
					obj = data['clmEventTypeList'][0];
					obj['ev'] = ev;
					obj['singleSearchLov'] = true;

					this.selectedData.emit(obj);
				} else if(data['clmEventTypeList'].length > 1) {
					this.fromInput = true;

					obj['ev'] = ev;
					obj['singleSearchLov'] = true;

					this.selectedData.emit(obj);

					this.clmEventType.tableData = data['clmEventTypeList'];
					this.table.refreshTable();

					this.modal.openNoClose();
				} else {
					obj['ev'] = ev;
					obj['singleSearchLov'] = true;

					this.selectedData.emit(obj);
					this.modal.openNoClose();
				}
			});
		}
	}
}
