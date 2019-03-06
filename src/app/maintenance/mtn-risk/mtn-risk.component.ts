import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mtn-risk',
  templateUrl: './mtn-risk.component.html',
  styleUrls: ['./mtn-risk.component.css']
})
export class MtnRiskComponent implements OnInit {
	selected: any = null;

  riskListing: any = {
    tableData: [],
    tHeader: ['Risk No','Risk','Region','Province','Town/City','District','Block'],
    dataTypes: ['number', 'text','text','text','text','text','text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 10,
    keys:[
    	'riskId',
    	'riskName',
    	'regionDesc',
    	'provinceDesc',
    	'cityDesc',
    	'districtDesc',
    	'blockDesc',
    	]
  };

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
  	/*this.maintenanceService.getMtnRiskListing('','','','','','','','','','','').subscribe(data =>{
  		var records = data['risk'];

            for(let rec of records){
            	this.riskListing.tableData.push({
                    riskId: rec.riskId,
                    riskName: rec.riskName,
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
  	});*/
  }

  onRowClick(data){
  	if(Object.is(this.selected, data)){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  confirm(){
  	this.selectedData.emit(this.selected);
  }

  openModal(){
      this.riskListing.tableData = [];

      this.maintenanceService.getMtnRiskListing('','','','','','','','','','','').subscribe(data =>{
        var records = data['risk'];

              for(let rec of records){
                this.riskListing.tableData.push({
                      riskId: rec.riskId,
                      riskName: rec.riskName,
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

  checkCode(code) {
    if(code.trim() === ''){
      this.selectedData.emit({
        riskId: '',
        riskName: ''
      });
    } else {
      this.maintenanceService.getMtnRisk(code).subscribe(data => {
        if(data['risk'] != null) {
          this.selectedData.emit(data['risk']);
        } else {
          this.selectedData.emit({
            riskId: '',
            riskName: ''
          });

          $('#riskMdl > #modalBtn').trigger('click');
        }
        
      });
   }
  }

  maintainRisk(){
    this.router.navigate(['/maintenance-risk', { info: 'new'}], {skipLocationChange: false});
    this.modalService.dismissAll();
  }

}