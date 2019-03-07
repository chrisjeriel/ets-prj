


import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';


@Component({
  selector: 'app-mtn-line-class',
  templateUrl: './mtn-line-class.component.html',
  styleUrls: ['./mtn-line-class.component.css']
})
export class MtnLineClassComponent implements OnInit {

selected: any ;

lineClassListing: any = {
    tableData: [],
    tHeader: ['Line Code', 'Line Class Code', 'Description'],
    dataTypes: ['text', 'text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
    	'lineCd',
    	'lineClassCd',
    	'lineClassCdDesc']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @Input() line: string = "";
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  modalOpen:boolean = false;

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {

  	
  }

  onRowClick(data){
  	//console.log(data);
  	this.selected = data;
     
  }

  confirm(){
    this.selectedData.emit(this.selected);
  }

  openModal(){
    this.lineClassListing.tableData = [];
    this.maintenanceService.getLineClassLOV(this.line).subscribe((data: any) =>{
      for(var lineCount = 0; lineCount < data.lineClass.length; lineCount++){
        this.lineClassListing.tableData.push(
          new Row(data.lineClass[lineCount].lineCd, 
              data.lineClass[lineCount].lineClassCd,
              data.lineClass[lineCount].lineClassCdDesc)
        );      
      }
      this.table.refreshTable();
    });
    this.modalOpen = true;

  }


}

class Row {
	lineCd: string;
	lineClassCd: string;
	lineClassCdDesc: string;

	constructor(lineCd: string,
		lineClassCd: string,
		lineClassCdDesc: string) {

	this.lineCd = lineCd;
	this.lineClassCd = lineClassCd;
	this.lineClassCdDesc = lineClassCdDesc;
	}
}
