import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';


@Component({
  selector: 'app-mtn-intermediary',
  templateUrl: './mtn-intermediary.component.html',
  styleUrls: ['./mtn-intermediary.component.css']
})
export class MtnIntermediaryComponent implements OnInit {
  selected: any = null;

intermediaryListing: any = {
    tableData: [],
    tHeader: ['IntId', 'Intermediary Name', 'Address'],
    dataTypes: ['sequence-3', 'text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
    	'intmId',
    	'intmName',
      'address'],
    width:[40,250]
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  modalOpen: boolean = false;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {

   //  this.maintenanceService.getIntLOV().subscribe((data: any) =>{
  	// 	for(var lineCount = 0; lineCount < data.intermediary.length; lineCount++){
  	// 		this.intermediaryListing.tableData.push(
  	// 			new Row(data.intermediary[lineCount].intmId, 
  	// 					data.intermediary[lineCount].intmName)
  	// 		);  		
  	// 	}
  	// 	this.table.refreshTable();
  	// });
    if(this.lovCheckBox){
      this.intermediaryListing.checkFlag = true;
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
    }
    else{
      for(var i = 0; i < this.intermediaryListing.tableData.length; i++){
        if(this.intermediaryListing.tableData[i].checked){
          this.selects.push(this.intermediaryListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  openModal(){
    this.intermediaryListing.tableData = [];

    this.maintenanceService.getIntLOV('').subscribe((data: any) =>{
      for(var lineCount = 0; lineCount < data.intermediary.length; lineCount++){
        this.intermediaryListing.tableData.push(
          new Row(data.intermediary[lineCount].intmId, 
              data.intermediary[lineCount].intmName,
              data.intermediary[lineCount].address)
        );      
      }
      this.table.refreshTable();
    });
    this.modalOpen = true;
  }

  checkCode(code, ev) {
    if(String(code).trim() === ''){
      this.selectedData.emit({
        intmId: '',
        intmName: '',
        ev: ev
      });
    } else {
      this.maintenanceService.getIntLOV(code).subscribe(data => {
        if(data['intermediary'].length > 0) {
          data['intermediary'][0]['ev'] = ev;
          this.selectedData.emit(data['intermediary'][0]);
        } else {
          this.selectedData.emit({
            intmId: '',
            intmName: '',
            ev: ev
          });

          $('#intermediaryMdl > #modalBtn').trigger('click');
        }
        
      });
    }
  }

}

class Row {

	intmId: number;
	intmName: string;
  address: string;

	constructor(intmId: number,
		intmName: string, address: string) {

	this.intmId = intmId;
	this.intmName = intmName;
  this.address = address;
	}
}
