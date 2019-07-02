import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-clm-event',
  templateUrl: './mtn-clm-event.component.html',
  styleUrls: ['./mtn-clm-event.component.css']
})
export class MtnClmEventComponent implements OnInit {
	@ViewChild('mdl') modal : ModalComponent;
	selected: any = null;

	clmEvent: any = {
		tableData: [],
	    tHeader: ['Event Code','Description'],
	    dataTypes: ['sequence-3','text'],
	    pageLength: 10,
	    searchFlag: true,
	    pageStatus: true,
	    pagination: true,
	    fixedCol: false,
	    pageID: 'clmEvent'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
	    keys:[
	    	'eventCd',
	    	'eventDesc'
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
	    	this.clmEvent.checkFlag = true;
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
	    	for(var i = 0; i < this.clmEvent.tableData.length; i++){
	        	if(this.clmEvent.tableData[i].checked){
	        		this.selects.push(this.clmEvent.tableData[i]);
	        	}
	      }
	      this.selectedData.emit(this.selects);
	      this.selects = [];
	    }
    }

    openModal(){
    	this.clmEvent.tableData = [];
    	this.table.overlayLoader = true;
    	this.maintenanceService.getMtnClmEvent('').subscribe(data =>{
        	var records = data['eventList'];
        	if(this.filters != null) {
        		records = records.filter(this.filters);
        	}
        	
            this.clmEvent.tableData = records;
        	this.table.refreshTable();
      	});
 	}

 	cancel() {
		this.cancelBtn.next();
	}
}
