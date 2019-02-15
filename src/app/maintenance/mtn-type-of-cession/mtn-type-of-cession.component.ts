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
	selected: any;

  cessionListing: any = {
    tableData: [],
    tHeader: ['Cession ID', 'Cession Abbr', 'Description', 'Remarks'],
    dataTypes: ['number', 'text', 'text','text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 1,
    keys:[
    	'cessionId',
    	'cessionAbbr',
    	'description',
    	'remarks'
    	]
  };

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.maintenanceService.getMtnTypeOfCession('').subscribe(data =>{
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

  onRowClick(data){
  	//console.log(data);
  	this.selected = data;
  }

  confirm(){
  	this.selectedData.emit(this.selected);
  }

}
