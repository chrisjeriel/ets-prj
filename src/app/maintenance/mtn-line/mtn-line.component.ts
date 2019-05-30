import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { ModalComponent }  from '@app/_components/common/modal/modal.component';

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
  @ViewChild('mdl') modal : ModalComponent;
  @Input() openCoverTag: boolean = false;

  @Input() lovCheckBox: boolean = false;
  @Input() hide:string[] = [];
  selects: any[] = [];

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
    if(this.lovCheckBox){
      this.lineListing.checkFlag = true;
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
      for(var i = 0; i < this.lineListing.tableData.length; i++){
        if(this.lineListing.tableData[i].checked){
          this.selects.push(this.lineListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }
  openModal(){
     this.lineListing.tableData = [];

     this.maintenanceService.getLineLOV('').subscribe((data: any) =>{
           for(var lineCount = 0; lineCount < data.line.length; lineCount++){
             if(this.openCoverTag){
               if(data.line[lineCount].openCoverTag === 'Y' && this.hide.indexOf(data.line[lineCount].lineCd)== -1){
                 this.lineListing.tableData.push(
                 new Row(data.line[lineCount].lineCd, 
                     data.line[lineCount].description,
                     data.line[lineCount].remarks)
                     ); 
               }
             }else{
               if(this.hide.indexOf(data.line[lineCount].lineCd)== -1){
                 this.lineListing.tableData.push(
                   new Row(data.line[lineCount].lineCd, 
                       data.line[lineCount].description,
                       data.line[lineCount].remarks)
                 ); 
               }
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
        ev: ev,
        singleSearchLov: true
      });
    } else {
      this.maintenanceService.getLineLOV(code).subscribe(data => {
        data['line'] = data['line'].filter(a=> this.hide.indexOf(a.lineCd)== -1)
        if(data['line'].length == 1) {
          data['line'][0]['ev'] = ev;
          data['line'][0]['singleSearchLov'] = true;
          this.selectedData.emit(data['line'][0]);
        } else {
          data['line'] = data['line'].filter((a)=>{return ev.filter.indexOf(a.lineCd)==-1});
          this.selectedData.emit({
            lineCd: '',
            description: '',
            ev: ev,
            singleSearchLov: true
          });
            
          // $('#lineMdl > #modalBtn').trigger('click');
          this.modal.openNoClose();
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
