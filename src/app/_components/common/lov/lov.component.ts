import { Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MaintenanceService, UnderwritingService } from '@app/_services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.css']
})
export class LovComponent implements OnInit {

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passTable: any = {
        tableData: [],
        pageLength: 10,
        searchFlag: true,
        pageStatus: true,
        pagination: true,
        fixedCol: false,
        pageID: 'LOV',
    }

  @Input()
  passData: any = {
  	selector:'',
  	data:{}
  }

  modalOpen: boolean = false;


  constructor(private modalService: NgbModal, private mtnService : MaintenanceService, private underwritingService: UnderwritingService) { }

  ngOnInit() {
  	  	
  }

  select(data){
  	  this.passData.data = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.passData);
  }

  openModal(){
    while(this.passTable.tableData.length>0){
      this.passTable.tableData.pop();
    }
  	if(this.passData.selector == 'insured'){
  		this.passTable.keys = ['insuredId', 'insuredName' ];
      this.passTable.tHeader =  ['Insured Id', 'Insured Name' ];
      this.passTable.dataTypes =  ['text', 'text', 'text', 'text', 'text', 'text', 'text'];
	    this.mtnService.getMtnInsured().subscribe((data: any) => {
	          for (var a =0 ; data.insured.length > a; a++) {
	            this.passTable.tableData.push(data.insured[a]);
	          }
	          this.table.refreshTable();
	        });
	  }else if(this.passData.selector == 'city'){
      this.passTable.tHeader =  ['Region Code', 'Region Description', 'Province Code', 'Province Description', 
                'City Code', 'City Description', 'Remarks', 'Zone Code', 'Zone Description' ];
      this.passTable.dataTypes =  ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'];
      this.passTable.keys = [
            'regionCd',
            'regionDesc',
            'provinceCd',
            'provinceDesc',
            'cityCd',
            'cityDesc',
            'remarks',
            'zoneCd',
            'zoneDesc'];
      this.mtnService.getMtnCity().subscribe((data: any) =>{
        //console.log(data);
        for(var regionCount = 0; regionCount < data.region.length; regionCount++){
          for(var provinceCount = 0; provinceCount < data.region[regionCount].provinceList.length; provinceCount++){
            for(var cityCount = 0; cityCount < data.region[regionCount].provinceList[provinceCount].cityList.length; cityCount++){
              let row :any = new Object();
              row.regionCd = data.region[regionCount].regionCd;
              row.regionDesc = data.region[regionCount].regionDesc;
              row.provinceCd = data.region[regionCount].provinceList[provinceCount].provinceCd;
              row.provinceDesc = data.region[regionCount].provinceList[provinceCount].provinceDesc;
              row.cityCd = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].cityCd;
              row.cityDesc = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].cityDesc;
              row.remarks = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].remarks;
              row.zoneCd = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].zoneCd;
              row.zoneCdDesc = data.region[regionCount].provinceList[provinceCount].cityList[cityCount].zoneCdDesc;
              this.passTable.tableData.push(row);
            }
          }
        }
        this.table.refreshTable();
        //console.log(this.cityListing.tableData);
      });

    }else if(this.passData.selector == 'district'){
      this.passTable.tHeader = ['Region Code', 'Region Description', 'Province Code', 'Province Description', 'City Code', 'City Description', 'District Code', 'District Description', ];
      this.passTable.dataTypes = ['text', 'text', 'text', 'text', 'text', 'text', 'text'];
      this.passTable.keys = [
                'regionCd',
                'regionDesc',
                'provinceCd',
                'provinceDesc',
                'cityCd',
                'cityDesc',
                'districtCd',
                'districtDesc'];
      this.mtnService.getMtnDistrict().subscribe((data: any) => {
        console.log(data);
        for (var a = data.region.length - 1; a >= 0; a--) {
          for (var b = data.region[a].provinceList.length - 1; b >= 0; b--) {
            for (var c = data.region[a].provinceList[b].cityList.length - 1; c >= 0; c--) {
              for (var d= data.region[a].provinceList[b].cityList[c].districtList.length - 1; d >= 0; d--) {
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
      });
    }else if(this.passData.selector == 'deductibles'){
      this.passTable.tHeader = [ 'Deductible', 'Title', 'Deductible Type', 'Rate', 'Deductible Amount'];
      this.passTable.dataTypes = [ 'text', 'text', 'text', 'percent', 'currency'];
      this.passTable.keys = ['deductibleCd','deductibleTitle','deductibleType','deductibleRate','deductibleAmt'];
      this.underwritingService.getMaintenanceDeductibles(this.passData.lineCd).subscribe((data: any) => {
          this.passTable.tableData = data.deductibles;
          this.table.refreshTable();
      });
    }

    this.modalOpen = true;
	}

}
