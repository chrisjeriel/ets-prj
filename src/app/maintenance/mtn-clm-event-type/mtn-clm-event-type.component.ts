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
 	}

 	cancel() {
		this.cancelBtn.next();
	}
}
