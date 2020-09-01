import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MaintenanceService, NotesService } from '@app/_services';
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

  regionList: any = {
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
    		    'regionDesc',
    		    'activeTag',
    		    'remarks'],
  };
  modalOpen : boolean = false;

  @Output() selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild(CustNonDatatableComponent) table: CustNonDatatableComponent;
  @Input() lovCheckBox: boolean = false;
  selects: any[] = [];
  
  constructor(private maintenanceService: MaintenanceService, public modalService: NgbModal,  private ns: NotesService) { }

  ngOnInit() {
   if(this.lovCheckBox){
        this.regionList.checkFlag = true;
    }
  }

  openModal(){
    this.regionList.tableData = [];
    this.maintenanceService.getMtnRegion().subscribe((data: any) =>{
      console.log(data);
        for(var regionCount = 0; regionCount < data.region.length; regionCount++){
              this.regionList.tableData.push(
                    new Row(data.region[regionCount].regionCd, 
                            data.region[regionCount].regionDesc,
                            data.region[regionCount].activeTag,
                            data.region[regionCount].remarks)
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
      this.selected = null;
    }
    else{
      for(var i = 0; i < this.regionList.tableData.length; i++){
        if(this.regionList.tableData[i].checked){
          this.selects.push(this.regionList.tableData[i]);
        }
      }
      this.selectedData.emit(this.selects);
      this.selects = [];
    }
  }

  checkCode(code, ev) {
    if(String(code).trim() === ''){
      this.selectedData.emit({
        regionCd: null,
        regionDesc: '',
        ev: ev
      });
    } else {
      this.maintenanceService.getMtnRegion(code) .pipe(
           finalize(() => this.ns.lovLoader(ev,0))
           ).subscribe(data => {
        if(data['region'].length > 0) {
          data['region'][0]['ev'] = ev;
          this.selectedData.emit(data['region'][0]);
        } else {
          this.selectedData.emit({
            regionCd: null,
            regionDesc: '',
            ev: ev
          })
          $('#regionMdl > #modalBtn').trigger('click');
        }
      });
    }
  }
  
}

class Row{
	regionCd: number;
	regionDesc: string;
	activeTag: string;
	remarks: string;
	constructor(
		regionCd: number,
		regionDesc: string,
		activeTag: string,
		remarks: string
	){
		this.regionCd = regionCd
		this.regionDesc = regionDesc
		this.activeTag = activeTag
		this.remarks = remarks
	}
}

