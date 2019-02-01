import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mtn-city',
  templateUrl: './mtn-city.component.html',
  styleUrls: ['./mtn-city.component.css']
})
export class MtnCityComponent implements OnInit {

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.maintenanceService.getMtnCity().subscribe((data) =>{
  		console.log(data);
  	});
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