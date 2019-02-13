import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';


@Component({
  selector: 'app-mtn-intermediary',
  templateUrl: './mtn-intermediary.component.html',
  styleUrls: ['./mtn-intermediary.component.css']
})
export class MtnIntermediaryComponent implements OnInit {
  selected: any ;

intermediaryListing: any = {
    tableData: [],
    tHeader: ['IntId', 'Intermediary Name'],
    dataTypes: ['text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
    	'intmId',
    	'intmName'],
    width:[40,250]
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {

    this.maintenanceService.getIntLOV().subscribe((data: any) =>{
  		for(var lineCount = 0; lineCount < data.intermediary.length; lineCount++){
  			this.intermediaryListing.tableData.push(
  				new Row(data.intermediary[lineCount].intmId, 
  						data.intermediary[lineCount].intmName)
  			);  		
  		}
  		this.table.refreshTable();
  	});

  }

  onRowClick(data){
  	//console.log(data);
  	this.selected = data;
     
  }

  confirm(){
    this.selectedData.emit(this.selected);
  }


}

class Row {

	intmId: number;
	intmName: string;

	constructor(intmId: number,
		intmName: string) {

	this.intmId = intmId;
	this.intmName = intmName;
	}
}
