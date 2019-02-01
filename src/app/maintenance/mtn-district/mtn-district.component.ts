import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-district',
  templateUrl: './mtn-district.component.html',
  styleUrls: ['./mtn-district.component.css']
})
export class MtnDistrictComponent implements OnInit {
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbModal, private mtnService : MaintenanceService) { }
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passData: any = {
        tableData: [],
        tHeader: ['Region Code', 'Region Description', 'Province Code', 'Province Description', 'City Code', 'City Description', 'District Code', 'District Description', ],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text'],
        resizable: [false, true, false, true, true, false, false],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 2,
        keys:[
        	'regionCd',
        	'regionDesc',
        	'provinceCd',
        	'provinceDesc',
        	'cityCd',
        	'cityDesc',
        	'districtCd',
        	'districtDesc']

    }

    selected: any;

  ngOnInit() {
  	this.mtnService.getMtnDistrict().subscribe((data: any) => {
  		console.log(data);
  		for (var a = data.region.length - 1; a >= 0; a--) {
  			for (var b = data.region[a].provinceList.length - 1; b >= 0; b--) {
  				for (var c = data.region[a].provinceList[b].cityList.length - 1; c >= 0; c--) {
  					for (var d= data.region[a].provinceList[b].cityList[c].districtList.length - 1; d >= 0; d--) {
  						this.passData.tableData.push(
  								new Row(data.region[a].regionCd,
  										data.region[a].regionDesc, 
	  									data.region[a].provinceList[b].provinceCd, 
	  									data.region[a].provinceList[b].provinceDesc,
	  									data.region[a].provinceList[b].cityList[c].cityCd,
	  									data.region[a].provinceList[b].cityList[c].cityDesc,
	  									data.region[a].provinceList[b].cityList[c].districtList[d].districtCd,
	  									data.region[a].provinceList[b].cityList[c].districtList[d].districtDesc )
  							);
  					}
  				}
  			}
  		}
  		this.table.refreshTable();
  		console.log(this.passData.tableData);
  	});
  }

  showDistrictModal(content) {
      this.modalService.open(content, { centered: true, backdrop: 'static', windowClass: "modal-size" });
  }

  select(data){
  	  this.selected = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.selected);
  }

}

class Row{
	
    regionCd: number;
    regionDesc:string;
    provinceCd :number;
    provinceDesc:string;
    cityCd:number;
    cityDesc:string;
    districtCd:string;
    districtDesc:string;

	constructor(
		regionCd: number,
		regionDesc:string,
		provinceCd :number,
		provinceDesc:string,
		cityCd:number,
		cityDesc:string,
		districtCd:string,
		districtDesc:string
		) {
		this.regionCd = regionCd ;
		this.regionDesc = regionDesc ;
		this.provinceCd = provinceCd ;
		this.provinceDesc = provinceDesc ;
		this.cityCd = cityCd ;
		this.cityDesc = cityDesc ;
		this.districtCd = districtCd ;
		this.districtDesc = districtDesc ;
	}



}


