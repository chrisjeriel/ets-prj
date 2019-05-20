import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustNonDatatableComponent } from '@app/_components/common/cust-non-datatable/cust-non-datatable.component';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-mtn-region',
  templateUrl: './mtn-region.component.html',
  styleUrls: ['./mtn-region.component.css']
})
export class MtnRegionComponent implements OnInit {
  selected: any;

  regionListing: any = {
    tableData: [],
    tHeader: ['Region Code', 'Description','Active','Remarks'],
    dataTypes: ['number', 'text', 'checkbox', 'text'],
    pageLength: 10,
    searchFlag: true,
    pageStatus: true,
    pagination: true,
    fixedCol: false,
    pageID: 'mtn-region',
    keys: [	'regionCd',
    		'description',
    		'activeTag',
    		'remarks'],
  };

  @ViewChild(CustNonDatatableComponent) table : CustNonDatatableComponent;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();

  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];
  modalOpen = false;

  constructor(private maintenanceService: MaintenanceService, private modalService: NgbModal) { }

  ngOnInit() {
   if(this.lovCheckBox){
        this.regionListing.checkFlag = true;
    }
  	this.maintenanceService.getMtnRegion().pipe(
           finalize(() => this.table.refreshTable())
           ).subscribe((data: any) =>{
  		//console.log(data);
  		for(var regionCount = 0; regionCount < data.region.length; regionCount++){
  					this.regionListing.tableData.push(
  						new Row(data.region[regionCount].regionCd,
  								data.region[regionCount].regionDesc,
  								data.region[regionCount].activeTag,
  								data.region[regionCount].remarks
  							)
  					);
  		}
  	});
  }

  openModal(){
    this.regionListing.tableData = [];

    this.maintenanceService.getMtnRegion().subscribe((data: any) =>{
      //console.log(data);
      for(var regionCount = 0; regionCount < data.region.length; regionCount++){
            this.regionListing.tableData.push(
              new Row(data.region[regionCount].regionCd,
                  data.region[regionCount].regionDesc,
                  data.region[regionCount].activeTag,
                  data.region[regionCount].remarks
                )
            );
      }
      this.table.refreshTable();
    });
    this.modalOpen = true;
  }

  onRowClick(data){
  	this.selected = data;
  }

  confirm(){
  	if(!this.lovCheckBox){
      this.selectedData.emit(this.selected);
    }
    else{
      for(var i = 0; i < this.regionListing.tableData.length; i++){
        if(this.regionListing.tableData[i].checked){
          this.selects.push(this.regionListing.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  checkCode(code, ev) {
    if(String(code).trim() === ''){
      this.selectedData.emit({
        regionCd: '',
        regionDesc: '',
        ev: ev
      });
    } else {
      this.maintenanceService.getIntLOV(code).subscribe(data => {
        if(data['region'].length > 0) {
          data['region'][0]['ev'] = ev;
          this.selectedData.emit(data['region'][0]);
        } else {
          this.selectedData.emit({
            regionCd: '',
            regionDesc: '',
            ev: ev
          });

          $('#regionMdl > #modalBtn').trigger('click');
        }
        
      });
    }
  }

}

class Row{
	regionCd: number;
	description: string;
	activeTag: string;
	remarks: string;
	constructor(
		regionCd: number,
		description: string,
		activeTag: string,
		remarks: string
	){
		this.regionCd = regionCd
		this.description = description
		this.activeTag = activeTag
		this.remarks = remarks
	}
}

