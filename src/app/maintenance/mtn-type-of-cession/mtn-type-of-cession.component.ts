import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-type-of-cession',
  templateUrl: './mtn-type-of-cession.component.html',
  styleUrls: ['./mtn-type-of-cession.component.css']
})
export class MtnTypeOfCessionComponent implements OnInit {
	selected: any = null;

  cessionListing: any = {
    tableData: [],
    tHeader: ['Cession ID','Description'],
    dataTypes: ['sequence-3', 'text',],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 14,
    keys:[
    	'cessionId',
    	'description'
    	]
  };

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	/*this.maintenanceService.getMtnTypeOfCession('').subscribe(data =>{
  		var records = data['cession'];

            for(let rec of records){
            	this.cessionListing.tableData.push({
                    cessionId: rec.cessionId,
                    cessionAbbr: rec.cessionAbbr,
                    description: rec.description,
                    remarks: rec.remarks                    
                });
            }

  		this.table.refreshTable();
  	});*/
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
    this.selected['fromLOV'] = true;
  	this.selectedData.emit(this.selected);
    this.selected = null;
  }

  openModal(){
    this.cessionListing.tableData = [];
    
     this.maintenanceService.getMtnTypeOfCession('').subscribe(data => {
       var records = data['cession'];

             for(let rec of records){
               this.cessionListing.tableData.push({
                     cessionId: rec.cessionId,
                     cessionAbbr: rec.cessionAbbr,
                     description: rec.description,
                     remarks: rec.remarks                    
                 });
             }

       this.table.refreshTable();
     });
  }

  checkCode(code, ev) {
    if(code.trim() === ''){
      this.selectedData.emit({
        cessionId: '',
        description: '',
        ev: ev
      });
    }  else if(isNaN(code/1)) {
      this.selectedData.emit({
        cessionId: '',
        description: '',
        ev: ev
      });

      $('#typeOfCessionMdl > #modalBtn').trigger('click');
    } else {
      this.maintenanceService.getMtnTypeOfCession(code).subscribe(data => {
        if(data['cession'].length > 0) {
          data['cession'][0]['ev'] = ev;
          this.selectedData.emit(data['cession'][0]);
        } else {
          this.selectedData.emit({
            cessionId: '',
            description: '',
            ev: ev
          });

          $('#typeOfCessionMdl > #modalBtn').trigger('click');
        }
        
      });
  }
  }

}
