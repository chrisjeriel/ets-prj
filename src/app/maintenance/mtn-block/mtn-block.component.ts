import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { MtnBlock } from '@app/_models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component'

@Component({
  selector: 'app-mtn-block',
  templateUrl: './mtn-block.component.html',
  styleUrls: ['./mtn-block.component.css']
})
export class MtnBlockComponent implements OnInit {
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbModal, private maintenanceService : MaintenanceService) { }

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  passDataBlock: any = {
        tableData: [],
        tHeader: ['Region Code', 'Region Description', 'Province Code', 'Province Description', 'City Code', 'City Description', 'District Code', 'District Description', 'Block Code', 'Block Description' ],
        dataTypes: ['text', 'text', 'text', 'text', 'text', 'text', 'text','text','text','text'],
        resizable: [false, true, false, true, true, false, false,true,true,true],
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
        	'districtDesc',
        	'blockCd',
        	'blockDesc']

    }

    selected: any;


  ngOnInit() {
  	this.maintenanceService.getMtnBlock().subscribe((data: any) => {
  		for (var a = 0; a < data.region.length; a++) {
  			this.passDataBlock.tableData.push(
				new MtnBlock(data.region[a].regionCd,
							 data.region[a].regionDesc, 
							 data.region[a].province.provinceCd, 
							 data.region[a].province.provinceDesc,
							 data.region[a].province.city.cityCd,
							 data.region[a].province.city.cityDesc,
							 data.region[a].province.city.district.districtCd,
							 data.region[a].province.city.district.districtDesc,
							 data.region[a].province.city.district.block.blockCd,
							 data.region[a].province.city.district.block.blockDesc )
			);
		}
  				
  		this.table.refreshTable();
  		console.log(this.passDataBlock.tableData);
  	});
  }

  select(data){
  	  this.selected = data;
  }

  okBtnClick(){
  	this.selectedData.emit(this.selected);
  }

}

