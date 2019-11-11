import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/_components/common/modal/modal.component';

@Component({
  selector: 'app-jv-type-lov',
  templateUrl: './jv-type-lov.component.html',
  styleUrls: ['./jv-type-lov.component.css']
})
export class JvTypeLovComponent implements OnInit {

  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @ViewChild('jvTypeMdl') modal: ModalComponent;
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
  fromInput: boolean = false;

  constructor(private ns: NotesService, private maintenanceService: MaintenanceService, public modalService: NgbModal) { }

  ngOnInit() {

  }

  openModal(){
	  setTimeout(()=>{  
      if(!this.fromInput) {
	       this.maintenanceService.getAcitTranType('JV','','','N','N','Y').subscribe((data: any) => {
	            console.log(data)
	            for(var i = 0 ; i < data.tranTypeList.length; i++){
	            	this.passData.tableData.push(data.tranTypeList[i])
	            }

              this.table.refreshTable();
	           });
      } else {
        this.fromInput = false;
      }

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

  checkCode(code, ev) {
    var obj = {
      tranTypeName: '',
      tranTypeCd: '',
      defaultParticulars: '',
      ev: ev
    }

    if(code.trim() === ''){
      this.selectedData.emit(obj);
    } else {
      this.maintenanceService.getMtnAcitTranTypeLov(code,'JV','','','N','N','Y').subscribe(data => {
        if(data['tranTypeList'].length == 1) {
          data['tranTypeList'][0]['ev'] = ev;
          this.selectedData.emit(data['tranTypeList'][0]);
        } else if(data['tranTypeList'].length > 1) {
          this.fromInput = true;
          this.selectedData.emit(obj);

          this.passData.tableData = data['tranTypeList'];
          this.modal.openNoClose();
        } else {
          this.selectedData.emit(obj);
          this.modal.openNoClose();
        }
        
      });
   }
  }

}
