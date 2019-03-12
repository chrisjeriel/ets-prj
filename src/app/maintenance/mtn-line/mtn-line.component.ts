import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';


@Component({
  selector: 'app-mtn-line',
  templateUrl: './mtn-line.component.html',
  styleUrls: ['./mtn-line.component.css']
})
export class MtnLineComponent implements OnInit {

selected: any = null;
lineListing: any = {
    tableData: [],
    tHeader: ['Line Code', 'Description'],
    dataTypes: ['text', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 11,
    keys:[
    	'lineCd',
    	'description']
  };

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Input() openCoverTag: boolean = false;

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
  	/*this.maintenanceService.getLineLOV().subscribe((data: any) =>{
  		for(var lineCount = 0; lineCount < data.line.length; lineCount++){
  			this.lineListing.tableData.push(
  				new Row(data.line[lineCount].lineCd, 
  						data.line[lineCount].description,
  						data.line[lineCount].remarks)
  			);  		
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
     this.lineListing.tableData = [];

     this.maintenanceService.getLineLOV('').subscribe((data: any) =>{
           for(var lineCount = 0; lineCount < data.line.length; lineCount++){
             if(this.openCoverTag){
               if(data.line[lineCount].openCoverTag === 'Y'){
                 this.lineListing.tableData.push(
                 new Row(data.line[lineCount].lineCd, 
                     data.line[lineCount].description,
                     data.line[lineCount].remarks)
                     ); 
               }
             }else{
               this.lineListing.tableData.push(
                 new Row(data.line[lineCount].lineCd, 
                     data.line[lineCount].description,
                     data.line[lineCount].remarks)
               ); 
             }   
           }
           this.table.refreshTable();
         });
  }

  checkCode(code, ev) {
    if(code === ''){
      this.selectedData.emit({
        lineCd: '',
        description: '',
        ev: ev
      });
    } else {
      this.maintenanceService.getLineLOV(code).subscribe(data => {
        if(data['line'].length > 0) {
          data['line'][0]['ev'] = ev;
          this.selectedData.emit(data['line'][0]);
        } else {
          this.selectedData.emit({
            lineCd: '',
            description: '',
            ev: ev
          });
            
          $('#lineMdl > #modalBtn').trigger('click');
        }
        
      });  
    }
  }

}

class Row {
	lineCd: string;
	description: string;
	remarks: string;

	constructor(lineCd: string,
		description: string,
		remarks: string) {

	this.lineCd = lineCd;
	this.description = description;
	this.remarks = remarks;
	}
}
