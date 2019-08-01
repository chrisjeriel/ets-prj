import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent } from '@app/_components/common/modal/modal.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mtn-acct-int-duration',
  templateUrl: './mtn-acct-int-duration.component.html',
  styleUrls: ['./mtn-acct-int-duration.component.css']
})
export class MtnAcctIntDurationComponent implements OnInit {
  @ViewChild('mdl') modal : ModalComponent;

  selected: any = null;

  durationListing: any = {
    tableData: [],
    tHeader: ['Duration'],
    dataTypes: ['text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
      'code']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];
  arrayCode : any[] = [];

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	if(this.lovCheckBox){
      this.durationListing.checkFlag = true;
    }
  }

  onRowClick(data){
    // if(Object.is(this.selected, data)){
    if(Object.entries(data).length === 0 && data.constructor === Object){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  confirm(){
    if(!this.lovCheckBox){
     this.selectedData.emit(this.selected);
     this.durationListing.tableData = [];
     this.table.refreshTable();
    }
    else{
      for(var i = 0; i < this.durationListing.tableData.length; i++){
        if(this.durationListing.tableData[i].checked){
          this.selects.push(this.durationListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }  
  }

  cancel(){
    this.durationListing.tableData = [];
    this.table.refreshTable();
  }

  openModal(){  
           this.maintenanceService.getRefCode('ACIT_INVESTMENTS.DURATION_UNIT').subscribe((data: any) =>{
                this.durationListing.tableData = data.refCodeList.map(i => {
				                                    return i;
				                                });

                 this.table.refreshTable();
               });
                 this.modalOpen = true;
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        code: '' ,
        ev: ev
      });
    } else {
    	this.arrayCode = [];
        this.maintenanceService.getRefCode('ACIT_INVESTMENTS.DURATION_UNIT').pipe(
           finalize(() => this.checkCodeFinal(code, ev) )
           ).subscribe(data => {
          if(data['refCodeList'].length > 0) {
          	for (var i = 0; i < data['refCodeList'].length; i++) {
			  		if( data['refCodeList'][i].code === code){
			  			this.arrayCode = data['refCodeList'][i];
			  		} 
			}
          } 
        });

/*
        if(this.dataAll.length > 0) {
            this.dataAll[0]['ev'] = ev;
            console.log(this.dataAll);
            this.selectedData.emit(this.dataAll[0]);
          } else {
            this.selectedData.emit({
              code: '' ,
        	  ev: ev
            });
            this.modal.openNoClose();
        }*/
   }

  }

  checkCodeFinal(code, ev){
	if(this.arrayCode.length === 0) {
		    this.selectedData.emit({
              code: '',
        	  ev: ev
            });
            this.modal.openNoClose();
          } else {
            this.arrayCode[0]['ev'] = ev;
            console.log(this.arrayCode[0].code);
            console.log(this.arrayCode[0].ev);
            this.selectedData.emit({
            	code : this.arrayCode[0].code,
            	ev   : this.arrayCode[0].ev});
          }
    }
  }
