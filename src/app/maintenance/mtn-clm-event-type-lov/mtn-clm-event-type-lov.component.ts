import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustEditableNonDatatableComponent } from '@app/_components/common/cust-editable-non-datatable/cust-editable-non-datatable.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-mtn-clm-event-type-lov',
  templateUrl: './mtn-clm-event-type-lov.component.html',
  styleUrls: ['./mtn-clm-event-type-lov.component.css']
})
export class MtnClmEventTypeLovComponent implements OnInit {

	@Output() selectedData: EventEmitter<any> = new EventEmitter();
  	@ViewChild(CustEditableNonDatatableComponent) table : CustEditableNonDatatableComponent;
  	@ViewChild('mdl') modal : ModalComponent;
  	@Input() lovCheckBox: boolean = false;

  	selects		: any[] = [];
  	selected	: any = null;

	passData : any = {
		tableData		: [],
	    tHeader			: ['Event Type', 'Description'],
	    dataTypes		: ['text', 'text'],
	    pageLength		: 10,
	    searchFlag		: true,
	    infoFlag		: true,
	    paginateFlag	: true,
	    pageID			: 11,
	    keys			: ['eventTypeCd','eventTypeDesc'],
	    widths			: [1,'auto'],
	    uneditable		: [true,true]
	};

  	constructor(private mtnService: MaintenanceService, private mdlService: NgbModal) { }

  	ngOnInit() {
  		if(this.lovCheckBox){
	      this.passData.checkFlag = true;
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
	    }else{
	      for(var i = 0; i < this.passData.tableData.length; i++){
	        if(this.passData.tableData[i].checked){
	          this.selects.push(this.passData.tableData[i]);
	        }
	      }
	      this.selectedData.emit(this.selects);
	      this.selects = [];
	    }
  	}

  	openModal(){
  		this.table.overlayLoader = true;
	    this.passData.tableData = [];
	    this.mtnService.getMtnClmEventType('')
	  	.subscribe(data => {
	  		var rec = data['eventTypeList'];
	  		this.passData.tableData = rec;
	  		this.table.refreshTable();
	  	});
  	}

  	checkCode(code, ev) {
  		this.table.overlayLoader = true;
	    if(code == ''){
	      this.selectedData.emit({eventTypeCd: '',eventTypeDesc: '',ev: ev});
	    }else {
		    this.mtnService.getMtnClmEventType(code)
		    .subscribe(data =>{
		      	console.log(data);
		      	var rec = data['eventTypeList'];
		      	if(rec.length == 1){
		      		rec[0]['ev'] = ev;
		      		this.selectedData.emit(rec[0]);
		      	}else{
		      		rec = rec.filter(a => { return ev.filter.indexOf(a.eventTypeCd)==-1});
		      		this.selectedData.emit({eventTypeCd: '',eventTypeDesc: '',ev: ev});
		      		this.modal.openNoClose();
		      	}
		    }); 
	    }
	}
}
