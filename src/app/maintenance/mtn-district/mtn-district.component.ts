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
  }

  openModal(){
      while(this.passData.tableData.length>0){
        this.passData.tableData.pop();
      }
      this.mtnService.getMtnDistrict().subscribe((data: any) => {
        console.log(data);
        for (var a = 0; a < data.region.length; a++) {
          for (var b = 0; b < data.region[a].provinceList.length; b++) {
            for (var c = 0; c < data.region[a].provinceList[b].cityList.length; c++) {
              for (var d= 0; d < data.region[a].provinceList[b].cityList[c].districtList.length; d++) {
                let row : any = new Object();
                row.regionCd = data.region[a].regionCd;
                row.regionDesc = data.region[a].regionDesc;
                row.provinceCd = data.region[a].provinceList[b].provinceCd;
                row.provinceDesc = data.region[a].provinceList[b].provinceDesc;
                row.cityCd = data.region[a].provinceList[b].cityList[c].cityCd;
                row.cityDesc = data.region[a].provinceList[b].cityList[c].cityDesc;
                row.districtCd = data.region[a].provinceList[b].cityList[c].districtList[d].districtCd;
                row.districtDesc = data.region[a].provinceList[b].cityList[c].districtList[d].districtDesc;
                this.passData.tableData.push(row);
              }
            }
          }
        }
        this.table.refreshTable();
        console.log(this.passData.tableData);
      });
    }
  select(data){
      console.log("SELECT triggered");
  	  this.selected = data;
  }

  okBtnClick(){
    while(this.passData.tableData.length>0){
      this.passData.tableData.pop();
    }
    console.log("SELECTED : " + JSON.stringify(this.selected));

  	this.selectedData.emit(this.selected);
  }

  checkCode(regionCd?, provinceCd?, cityCd?, districtCd?, ev?) {
    if(districtCd === ''){
      this.selectedData.emit({
        data: null,
        ev: ev
      });
    } else {
      this.mtnService.getMtnDistrict(regionCd, provinceCd, cityCd, districtCd).subscribe(data => {
        console.log("Data from LOV: " + JSON.stringify(data['region'][0]));
        if(data['region'].length > 0) {
          data['region'][0]['ev'] = ev;
          this.selectedData.emit(data['region'][0]);
        } else {
          this.selectedData.emit({
            districtCd: '',
            description: '',
            ev: ev
          });
            
          $('#districtMdl > #modalBtn').trigger('click');
        }
        
      });  
    }
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


