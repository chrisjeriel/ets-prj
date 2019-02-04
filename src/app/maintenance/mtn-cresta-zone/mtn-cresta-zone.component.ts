import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-cresta-zone',
  templateUrl: './mtn-cresta-zone.component.html',
  styleUrls: ['./mtn-cresta-zone.component.css']
})
export class MtnCrestaZoneComponent implements OnInit {

  selected: any;

  crestaZoneListing: any = {
    tableData: [],
    tHeader: ['Zone Code', 'Zone Description',],
    dataTypes: ['text', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 4,
    keys:[
    	'zoneCd',
    	'zoneDesc',]
  };

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.maintenanceService.getMtnCrestaZone().subscribe((data: any) =>{
  		for(var zoneCount = 0; zoneCount < data.crestaZone.length; zoneCount++){
  			this.crestaZoneListing.tableData.push(
  				new Row(data.crestaZone[zoneCount].zoneCd, data.crestaZone[zoneCount].zoneDesc)
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

class Row{
	zoneCd: string;
	zoneDesc: string;

	constructor(zoneCd: string, zoneDesc: string){
		this.zoneCd = zoneCd;
		this.zoneDesc = zoneDesc;
	}
}
