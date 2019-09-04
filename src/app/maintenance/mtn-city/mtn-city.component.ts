import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-city',
  templateUrl: './mtn-city.component.html',
  styleUrls: ['./mtn-city.component.css']
})
export class MtnCityComponent implements OnInit {

  selected: any;

  cityListing: any = {
    tableData: [],
    tHeader: ['Region Code', 'Region Description', 'Province Code', 'Province Description', 
    		  'City Code', 'City Description', 'Remarks', 'Zone Code', 'Zone Description' ],
    dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 3,
    keys:[
    	'regionCd',
    	'regionDesc',
    	'provinceCd',
    	'provinceDesc',
    	'cityCd',
    	'cityDesc',
    	'remarks',
    	'zoneCd',
    	'zoneDesc']
  };

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];
  
  constructor(private maintenanceService: MaintenanceService, public modalService: NgbModal) { }

  ngOnInit() {
    if(this.lovCheckBox){
        this.cityListing.checkFlag = true;
      }
  	this.maintenanceService.getMtnCity().subscribe((data: any) =>{
  		//console.log(data);
  		for(var regionCount = 0; regionCount < data.region.length; regionCount++){
  			for(var provinceCount = 0; provinceCount < data.region[regionCount].provinceList.length; provinceCount++){
  				for(var cityCount = 0; cityCount < data.region[regionCount].provinceList[provinceCount].cityList.length; cityCount++){
  					this.cityListing.tableData.push(
  						new Row(data.region[regionCount].regionCd,
  								data.region[regionCount].regionDesc,
  								data.region[regionCount].provinceList[provinceCount].provinceCd,
  								data.region[regionCount].provinceList[provinceCount].provinceDesc,
  								data.region[regionCount].provinceList[provinceCount].cityList[cityCount].cityCd,
  								data.region[regionCount].provinceList[provinceCount].cityList[cityCount].cityDesc,
  								data.region[regionCount].provinceList[provinceCount].cityList[cityCount].remarks,
  								data.region[regionCount].provinceList[provinceCount].cityList[cityCount].zoneCd,
  								data.region[regionCount].provinceList[provinceCount].cityList[cityCount].zoneCdDesc,
  							)
  					);
  				}
  			}
  		}
  		this.table.refreshTable();
  		//console.log(this.cityListing.tableData);
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
      for(var i = 0; i < this.cityListing.tableData.length; i++){
        if(this.cityListing.tableData[i].checked){
          this.selects.push(this.cityListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

}

class Row{
	regionCd: number;
	regionDesc: string;
	provinceCd: number;
	provinceDesc: string;
	cityCd: number;
	cityDesc: string;
	remarks: string;
	zoneCd: number;
	zoneDesc: string;
	constructor(
		regionCd: number,
		regionDesc: string,
		provinceCd: number,
		provinceDesc: string,
		cityCd: number,
		cityDesc: string,
		remarks: string,
		zoneCd: number,
		zoneDesc: string
	){
		this.regionCd = regionCd
		this.regionDesc = regionDesc
		this.provinceCd = provinceCd
		this.provinceDesc = provinceDesc
		this.cityCd = cityCd
		this.cityDesc = cityDesc
		this.remarks = remarks
		this.zoneCd = zoneCd
		this.zoneDesc = zoneDesc
	}
}