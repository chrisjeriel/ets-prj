import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-adjuster',
  templateUrl: './mtn-adjuster.component.html',
  styleUrls: ['./mtn-adjuster.component.css']
})
export class MtnAdjusterComponent implements OnInit {
	@ViewChild('mdl') modal : ModalComponent;
	selected: any = null;

	adjuster: any = {
		tableData: [],
	    tHeader: ['Adjuster No','Adjuster Name'],
	    dataTypes: ['sequence-3','text'],
	    pageLength: 10,
	    searchFlag: true,
	    pageStatus: true,
	    pagination: true,
	    fixedCol: false,
	    pageID: 'adjuster'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
	    keys:[
	    	'adjId',
	    	'adjName'
	    	]
	};

	@ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
	@Output() cancelBtn: EventEmitter<any> = new EventEmitter();
	@Output() selectedData: EventEmitter<any> = new EventEmitter();

	@Input() exclude: any[] = [];
	@Input() filters: any = null;
	@Input() lovCheckBox: boolean = false;
	selects: any[] = [];

	constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

	ngOnInit() {
		setTimeout(() => { this.table.refreshTable(); }, 0);

		if(this.lovCheckBox){
	    	this.adjuster.checkFlag = true;
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
	    	for(var i = 0; i < this.adjuster.tableData.length; i++){
	        	if(this.adjuster.tableData[i].checked){
	        		this.selects.push(this.adjuster.tableData[i]);
	        	}
	      }
	      this.selectedData.emit(this.selects);
	      this.selects = [];
	    }
    }

    openModal(){
    	this.adjuster.tableData = [];
    	this.table.overlayLoader = true;
    	this.maintenanceService.getMtnAdjusterList([]).subscribe(data =>{
        	var records = data['adjusterList'].filter(a => !this.exclude.includes(a.adjId) && a.activeTag == 'Y');

        	if(this.filters != null) {
        		records = records.filter(this.filters);
        	}
        	
            this.adjuster.tableData = records;
        	this.table.refreshTable();
      	});
 	}

 	cancel() {
		this.cancelBtn.next();
	}

	checkCode(code, ev) {
		if(String(code).trim() === ''){
			this.selectedData.emit({
				adjId: '',
				adjName: '',
		    	ev: ev,
		    	singleSearchLov: true
		  	});
		} else if(isNaN(code/1)) {
			this.selectedData.emit({
			    adjId: '',
			    adjName: '',
			    ev: ev,
			    singleSearchLov: true
		  	});
		  
		    this.modal.openNoClose();    
		} else {
			this.maintenanceService.getMtnAdjusterList([{ key: 'adjId', search: code }]).subscribe(data => {
				data['adjusterList'] = data['adjusterList'].filter(a => a.adjId == code && a.activeTag == 'Y');

				if(data['adjusterList'].length == 1 && !this.exclude.includes(data['adjusterList'][0].adjId)) {
					data['adjusterList'][0]['ev'] = ev;
					data['adjusterList'][0]['singleSearchLov'] = true;
					this.selectedData.emit(data['adjusterList'][0]);
				} else {
					this.selectedData.emit({
					    adjId: '',
					    adjName: '',
					    ev: ev,
					    singleSearchLov: true
					});
					  
					this.modal.openNoClose();    
				}
			});
		}
	}
}
