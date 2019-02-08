import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';


@Component({
  selector: 'app-mtn-line',
  templateUrl: './mtn-line.component.html',
  styleUrls: ['./mtn-line.component.css']
})
export class MtnLineComponent implements OnInit {

selected: any ;
lineListing: any = {
    tableData: [],
    tHeader: ['Line Code', 'Description', 'Remarks'],
    dataTypes: ['text', 'text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
    	'lineCd',
    	'description',
    	'remarks']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.maintenanceService.getLineLOV().subscribe((data: any) =>{
  		for(var lineCount = 0; lineCount < data.line.length; lineCount++){
  			this.lineListing.tableData.push(
  				new Row(data.line[lineCount].lineCd, 
  						data.line[lineCount].description,
  						data.line[lineCount].remarks)
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
	lineCd: string;
	description: string;
	remarks: string;

	constructor(lineCd: string,
		description: string,
		remarks: string) {

	this.lineCd = lineCd;
	this.description = description;
	this.remarks = remarks;
	}
}
