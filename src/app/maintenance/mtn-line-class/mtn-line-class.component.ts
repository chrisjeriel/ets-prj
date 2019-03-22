


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

selected: any = null;

lineClassListing: any = {
    tableData: [],
    tHeader: ['Line Class Code', 'Description'],
    dataTypes: ['text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 5,
    keys:[
    	'lineClassCd',
    	'lineClassCdDesc']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @Input() line: string = "";
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];

  modalOpen:boolean = false;

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {

    if(this.lovCheckBox){
      this.lineClassListing.checkFlag = true;
    }
  	
  }

  onRowClick(data){
    if(Object.is(this.selected, data)){
      this.selected = null
    } else {
      this.selected = data;
    }
  }

  confirm(){
    if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
      this.selected = null;
    }
    else{
      for(var i = 0; i < this.lineClassListing.tableData.length; i++){
        if(this.lineClassListing.tableData[i].checked){
          this.selects.push(this.lineClassListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
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
