import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  constructor(private maintenanceService: MaintenanceService, public modalService: NgbModal) { }

  ngOnInit() {
    if(this.lovCheckBox){
      this.crestaZoneListing.checkFlag = true;
    }
  	this.maintenanceService.getMtnCrestaZone().subscribe((data: any) =>{
  		for(var zoneCount = 0; zoneCount < data.crestaZone.length; zoneCount++){
        if(data.crestaZone[zoneCount].activeTag === 'Y'){
          this.crestaZoneListing.tableData.push(new Row(data.crestaZone[zoneCount].zoneCd, data.crestaZone[zoneCount].zoneDesc));  
        }
  		}
  		this.table.refreshTable();
  	});
  }

  onRowClick(data){
  	//console.log(data);
  	this.selected = data;
  }

  confirm(){
  	if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
    }
    else{
      for(var i = 0; i < this.crestaZoneListing.tableData.length; i++){
        if(this.crestaZoneListing.tableData[i].checked){
          this.selects.push(this.crestaZoneListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
      
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
