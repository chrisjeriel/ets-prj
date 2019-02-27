import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { MtnSectionCovers } from '@app/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';

@Component({
  selector: 'app-mtn-section-covers',
  templateUrl: './mtn-section-covers.component.html',
  styleUrls: ['./mtn-section-covers.component.css']
})
export class MtnSectionCoversComponent implements OnInit {
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  selected: any;
  sectionCover: any = {
    tableData: [],
    tHeader: ['Cover Code','Short Name','Cover Description'],
    dataTypes: ['number', 'text','text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 1,
    keys:[
    	'coverCode',
    	'shortName',
    	'description'
    	]
  };
  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	this.maintenanceService.getMtnSectionCovers().subscribe((data: any) =>{
      for(var i=0; i< data.sectionCovers.length;i++){
             this.sectionCover.tableData.push(new MtnSectionCovers(data.sectionCovers[i].coverCd,data.sectionCovers[i].coverCdAbbr,data.sectionCovers[i].description));
         }
       this.table.refreshTable();
    });

  }

  select(data){
      this.selected = data;
  }

  okBtnClick(){
    this.selectedData.emit(this.selected);
  }
}
