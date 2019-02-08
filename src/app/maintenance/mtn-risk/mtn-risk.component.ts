import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-risk',
  templateUrl: './mtn-risk.component.html',
  styleUrls: ['./mtn-risk.component.css']
})
export class MtnRiskComponent implements OnInit {
	selected: any;

  riskListing: any = {
    tableData: [],
    tHeader: ['Risk ID', 'Risk Name', 'Risk Abbr', 'Region','Province','City','District','Block','Latitude','Longitude'],
    dataTypes: ['number', 'text', 'text','text','text','text','text','text','text','text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 4,
    keys:[
    	'riskId',
    	'riskName',
    	'riskAbbr',
    	'regionDesc',
    	'provinceDesc',
    	'cityDesc',
    	'districtDesc',
    	'blockDesc',
    	'latitude',
    	'longitude']
  };

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.maintenanceService.getMtnRiskListing().subscribe(data =>{
  		var records = data['risk'];

            for(let rec of records){
            	this.riskListing.tableData.push({
                    riskId: rec.riskId,
                    riskName: rec.riskName,
                    riskAbbr: rec.riskAbbr,
                    regionDesc: rec.regionDesc,
                    provinceDesc: rec.provinceDesc,
                    cityDesc: rec.cityDesc,
                    districtDesc: rec.districtDesc,
                    blockDesc: rec.blockDesc,
                    latitude: rec.latitude,
                    longitude: rec.longitude
                });
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