import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-treaty',
  templateUrl: './mtn-treaty.component.html',
  styleUrls: ['./mtn-treaty.component.css']
})
export class MtnTreatyComponent implements OnInit {
	selected: any = null;
	treatyListing: any = {
		tableData: [],
	    tHeader: ['Treaty No', 'Treaty Name'],
	    dataTypes: ['sequence-2', 'text'],
	    pageLength: 10,
	    searchFlag: true,
	    pageStatus: true,
	    pagination: true,
	    fixedCol: false,
	    pageID: 'mtnTreatyLOV',
	    keys:['treatyId','treatyName'],
	};

	@Output() selectedData: EventEmitter<any> = new EventEmitter();
	@ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
	@ViewChild('mdl') modal : ModalComponent;

	@Input() lovCheckBox: boolean = false;
	@Input() hide: string[] = [];
	selects: any[] = [];

	constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		if(this.lovCheckBox){
	    	this.treatyListing.checkFlag = true;
	    }
	}

	onRowClick(data){  	
    	// if(Object.is(this.selected, data)){
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
	    } else {
	    	for(var i = 0; i < this.treatyListing.tableData.length; i++){
	    		if(this.treatyListing.tableData[i].checked){
	        		this.selects.push(this.treatyListing.tableData[i]);
	        	}
	      	}

	    	this.selectedData.emit(this.selects);
	    	this.selects = [];
	    }
	}

	openModal() {
    	this.treatyListing.tableData = [];
    	this.table.overlayLoader = true;
    	this.maintenanceService.getMtnTreaty('').subscribe(data => {
    		this.treatyListing.tableData = data['treatyList'].filter(a => !this.hide.includes(a.treatyId) && a.activeTag == 'Y');
    		this.table.refreshTable();
    	});
	}

	checkCode(code, ev) {
		if(code === ''){
      		this.selectedData.emit({
        		treatyId: '',
        		treatyName: '',
        		ev: ev,
        		singleSearchLov: true
      		});
    	} else {
    		this.maintenanceService.getMtnTreaty(code).subscribe(data => {
    			var td = data['treatyList'].filter(a => !this.hide.includes(a.treatyId) && a.activeTag == 'Y');

    			if(td.length == 1) {
    				data['treatyList'][0]['ev'] = ev;
    				data['treatyList'][0]['singleSearchLov'] = true;
    				this.selectedData.emit(data['treatyList'][0]);
    			} else {
    				this.selectedData.emit({
		        		treatyId: '',
		        		treatyName: '',
		        		ev: ev,
		        		singleSearchLov: true
	      			});

	      			this.modal.openNoClose();
    			}
    		});
    	}
	}
}
