import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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
    dataTypes: ['sequence-3', 'text','text','text','text','text','text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 'risk'+(Math.floor(Math.random() * (999999 - 100000)) + 100000).toString(),
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

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

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
    if(this.lovCheckBox){
      this.riskListing.checkFlag = true;
    }
  }

  onRowClick(data){ 
  	// if(Object.is(this.selected, data)){
    if(Object.entries(data).length === 0 && data.constructor === Object){  
      this.selected = null;
    } else {
      this.selected = data;
    }
  }

  confirm(){
    if(!this.lovCheckBox){
      this.selected['fromLOV'] = true;
      this.selectedData.emit(this.selected);
      this.selected = null;
    }
    else{
      for(var i = 0; i < this.riskListing.tableData.length; i++){
        if(this.riskListing.tableData[i].checked){
          this.selects.push(this.riskListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
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

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        riskId: '',
        riskName: '',
        ev: ev
      });
    } else if(isNaN(code/1)) {
      this.selectedData.emit({
        riskId: '',
        riskName: '',
        ev: ev
      });

      $('#riskMdl > #modalBtn').trigger('click');
    } else {
      this.maintenanceService.getMtnRisk(code).subscribe(data => {
        if(data['risk'] != null) {
          data['risk']['ev'] = ev;
          this.selectedData.emit(data['risk']);
        } else {
          this.selectedData.emit({
            riskId: '',
            riskName: '',
            ev: ev
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