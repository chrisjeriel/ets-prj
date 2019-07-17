import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-jv-type-lov',
  templateUrl: './jv-type-lov.component.html',
  styleUrls: ['./jv-type-lov.component.css']
})
export class JvTypeLovComponent implements OnInit {

  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  passData: any = {
    tableData: [],
    tHeader: ['JV Type'],
    dataTypes: ['text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 1,
    colSize: ['460'],
    keys:['tranTypeName']
  };

  modalOpen: boolean = false;
  selected: any;

  constructor(private ns: NotesService, private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {

  }

  openModal(){
	  setTimeout(()=>{  
	       this.maintenanceService.getAcitTranType('JV','','','','','').subscribe((data: any) =>{
	            console.log(data)
	            for(var i = 0 ; i < data.tranTypeList.length; i++){
	            	this.passData.tableData.push(data.tranTypeList[i])
	            	this.table.refreshTable();
	            }
	           });
	            this.modalOpen = true;
	   }, 0);
  }

  onRowClick(data){
  	if(data!=null){
  		this.selected = data;
  	}else{
  		this.selected = null;
  	}
  }

  cancel(){
    this.passData.tableData = [];
    this.table.refreshTable();
  }

  confirm(){
  	this.selectedData.emit(this.selected);
  	this.passData.tableData = [];
  	this.table.refreshTable();
  }

}
